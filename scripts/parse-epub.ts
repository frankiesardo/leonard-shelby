/**
 * Parse an EPUB file into the garden's folder-per-book structure.
 *
 * Usage:
 *   npx tsx scripts/parse-epub.ts <epub-path> [--slug "book-slug"]
 *
 * Creates:
 *   sources/books/<slug>/source.md                    (full text, all chapters concatenated)
 *   sources/books/<slug>/ch<NN>-<chapter-slug>.md     (individual chapter files)
 *
 * The agent is responsible for creating summary.md with frontmatter and synthesis.
 *
 * Prints JSON metadata on success for the agent to consume.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";
import JSZip from "jszip";
import * as cheerio from "cheerio";
import { writeGardenFile } from "./content-writer.js";
import { slugify, escapeYaml } from "./types.js";

const PROJECT_ROOT = resolve(import.meta.dirname, "..");

/** Titles that indicate boilerplate epub sections, not real content. */
const BOILERPLATE_TITLE_PATTERNS = [
  /^copyright$/i,
  /^cover$/i,
  /^title\s*page$/i,
  /^dedication$/i,
  /^epigraph$/i,
  /^acknowledgm?ents?$/i,
  /^(a\s+)?note\s+(about|from|on)\s+the\s+author$/i,
  /^about\s+the\s+author$/i,
  /^other\s+books?\s+by\s+(this|the)\s+author$/i,
  /^also\s+by\s+/i,
  /^(table\s+of\s+)?contents$/i,
  /^colophon$/i,
  /^index$/i,
  /^bibliography$/i,
  /^(further|suggested)\s+reading$/i,
  /^praise\s+for\s+/i,
  /^newsletter$/i,
  /^(front|back)\s*matter$/i,
];

function isBoilerplateTitle(title: string): boolean {
  const cleaned = title.replace(/[*_]/g, "").trim();
  return BOILERPLATE_TITLE_PATTERNS.some((p) => p.test(cleaned));
}

/**
 * Content-based boilerplate detection for when titles are generic ("Chapter N").
 * Returns a reason string if boilerplate, or null if it looks like real content.
 */
function detectBoilerplateContent(content: string, bookAuthor: string): string | null {
  const text = content.replace(/[#*_>\-|`]/g, "").trim();
  const len = text.length;

  // Only check the first 1500 chars: a real copyright page leads with the notice,
  // whereas a chapter that merely cites a figure source buries it deep in the text.
  if (/Copyright\s+©|All rights reserved/i.test(text.slice(0, 1500))) return "copyright";
  if (/downloading this|enjoyed reading this|mailing list[\s\S]{0,200}sign up|sign up[\s\S]{0,200}mailing list/i.test(text)) return "ebook-promo";
  if (/^praise\s+for\b/im.test(text)) return "praise";

  // Short sections that look like dedication, epigraph, or colophon
  if (len < 300) {
    const lineCount = text.split(/\n/).filter((l) => l.trim()).length;
    if (lineCount <= 5) return "short-frontmatter";
  }

  // Acknowledgments: short + contains gratitude language
  if (len < 2000 && /\b(thank|grateful|gratitude|indebt)\b/i.test(text.slice(0, 500))) {
    return "acknowledgments";
  }

  // About the author: starts with author's last name or full name and reads as a bio
  if (len < 2000 && bookAuthor) {
    const lastName = bookAuthor.split(/\s+/).pop() || "";
    const firstLine = text.split(/\n/).find((l) => l.trim()) || "";
    if (lastName && new RegExp(`\\b${lastName}\\b`, "i").test(firstLine)) {
      if (/\b(is a|was born|lives in|author of|member of|professor|writer)\b/i.test(text)) {
        return "about-author";
      }
    }
  }

  // "Also by" / bibliography of the same author
  if (len < 1500 && bookAuthor) {
    const lastName = bookAuthor.split(/\s+/).pop() || "";
    const firstLine = text.split(/\n/).find((l) => l.trim()) || "";
    if (lastName && /\b(also by|other books)\b/i.test(firstLine)) return "also-by";
  }

  return null;
}

interface Chapter {
  title: string;
  slug: string;
  content: string;
  order: number;
  isBoilerplate: boolean;
}

async function main() {
  const args = process.argv.slice(2);

  const epubPath = args.find((a) => !a.startsWith("--"));
  if (!epubPath) {
    console.error(
      'Usage: npx tsx scripts/parse-epub.ts <epub-path> [--slug "book-slug"]',
    );
    process.exit(1);
  }

  const slugIdx = args.indexOf("--slug");
  const slugOverride = slugIdx !== -1 ? args[slugIdx + 1] : undefined;

  const fullPath = resolve(PROJECT_ROOT, epubPath);
  if (!existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    process.exit(1);
  }

  console.log(`Parsing: ${fullPath}`);

  const data = readFileSync(fullPath);
  const zip = await JSZip.loadAsync(data);

  // Find the rootfile from container.xml
  const containerXml = await zip
    .file("META-INF/container.xml")
    ?.async("text");
  if (!containerXml) throw new Error("No META-INF/container.xml found");

  const rootfileMatch = containerXml.match(/full-path="([^"]+)"/);
  if (!rootfileMatch) throw new Error("No rootfile in container.xml");
  const rootfilePath = rootfileMatch[1];
  const rootDir = rootfilePath.includes("/")
    ? rootfilePath.substring(0, rootfilePath.lastIndexOf("/") + 1)
    : "";

  // Parse the OPF file
  const opfContent = await zip.file(rootfilePath)?.async("text");
  if (!opfContent) throw new Error(`Cannot read ${rootfilePath}`);

  // Extract metadata
  const titleMatch = opfContent.match(
    /<dc:title[^>]*>([\s\S]*?)<\/dc:title>/,
  );
  const authorMatch = opfContent.match(
    /<dc:creator[^>]*>([\s\S]*?)<\/dc:creator>/,
  );
  const bookTitle = titleMatch?.[1]?.trim() || basename(epubPath, ".epub");
  const bookAuthor = authorMatch?.[1]?.trim() || "Unknown";
  const bookSlug = slugOverride || slugify(bookTitle);

  console.log(`  title: ${bookTitle}`);
  console.log(`  author: ${bookAuthor}`);
  console.log(`  slug: ${bookSlug}`);

  // Extract manifest and spine
  const manifest = parseManifest(opfContent);
  const spineIds = parseSpine(opfContent);

  // Parse TOC for chapter titles
  const tocTitles = await parseToc(zip, opfContent, rootDir);
  console.log(`  toc entries: ${tocTitles.size}`);

  // Extract and convert chapters
  const chapters: Chapter[] = [];
  let chapterNum = 0;

  for (const id of spineIds) {
    const href = manifest.get(id);
    if (!href) continue;

    const filePath = rootDir + href;
    const html = await zip.file(filePath)?.async("text");
    if (!html) continue;

    const $ = cheerio.load(html, { xml: false });
    const body = $("body");
    if (!body.length) continue;

    const markdown = htmlToMarkdown($, body);
    if (!markdown.trim() || markdown.trim().length < 50) continue;

    chapterNum++;

    const tocTitle =
      tocTitles.get(href) || tocTitles.get(href.split("/").pop() || "");
    const headingTitle = extractFirstHeading($);
    const chapterTitle =
      tocTitle || headingTitle || `Chapter ${chapterNum}`;

    let boilerplate = isBoilerplateTitle(chapterTitle);
    let boilerplateReason = boilerplate ? "title" : null;

    if (!boilerplate) {
      const contentReason = detectBoilerplateContent(markdown, bookAuthor);
      if (contentReason) {
        boilerplate = true;
        boilerplateReason = contentReason;
      }
    }

    chapters.push({
      title: chapterTitle,
      slug: slugify(chapterTitle),
      content: markdown,
      order: chapterNum,
      isBoilerplate: boilerplate,
    });

    if (boilerplate) {
      console.log(`    skip: "${chapterTitle}" (${boilerplateReason})`);
    }
  }

  const contentChapters = chapters.filter((ch) => !ch.isBoilerplate);
  const boilerplateChapters = chapters.filter((ch) => ch.isBoilerplate);
  console.log(`  chapters: ${chapters.length} total, ${contentChapters.length} content, ${boilerplateChapters.length} boilerplate`);

  if (chapters.length === 0) {
    console.error("No chapters found in EPUB");
    process.exit(1);
  }

  const bookFolder = `sources/books/${bookSlug}`;

  // Write chapter files (content chapters only, renumbered sequentially)
  const chapterFiles: { file: string; title: string; order: number }[] = [];

  let contentNum = 0;
  for (const ch of contentChapters) {
    contentNum++;
    const paddedNum = String(contentNum).padStart(2, "0");
    const fileName = `ch${paddedNum}-${ch.slug}`;
    chapterFiles.push({ file: fileName, title: ch.title, order: contentNum });

    const contentBody = cleanupMarkdown(stripLeadingHeading(ch.content, ch.title));
    const fileContent = `# ${ch.title}\n\n${contentBody}\n`;

    const destPath = `${bookFolder}/${fileName}.md`;
    if (existsSync(resolve(PROJECT_ROOT, destPath))) {
      console.log(`  skip (exists): ${destPath}`);
    } else {
      await writeGardenFile(PROJECT_ROOT, destPath, fileContent);
    }
  }

  // Write source.md (full text, content chapters only)
  const sourcePath = `${bookFolder}/source.md`;
  if (!existsSync(resolve(PROJECT_ROOT, sourcePath))) {
    const fullText = contentChapters
      .map((ch) => {
        const body = cleanupMarkdown(stripLeadingHeading(ch.content, ch.title));
        return `# ${ch.title}\n\n${body}`;
      })
      .join("\n\n---\n\n");

    const sourceContent = [
      `# ${bookTitle}`,
      "",
      `*${bookAuthor}*`,
      "",
      "---",
      "",
      fullText,
    ].join("\n");

    await writeGardenFile(PROJECT_ROOT, sourcePath, sourceContent);
  }

  // Print structured output for the agent
  console.log("\n--- parsed ---");
  console.log(JSON.stringify({
    slug: bookSlug,
    title: bookTitle,
    author: bookAuthor,
    type: "book",
    folder: bookFolder,
    source_path: sourcePath,
    summary_path: `${bookFolder}/summary.md`,
    chapters: chapterFiles.map((ch) => ({
      order: ch.order,
      file: `${bookFolder}/${ch.file}.md`,
      title: ch.title,
    })),
  }, null, 2));
}

// ── OPF parsing ──

function parseManifest(opf: string): Map<string, string> {
  const manifest = new Map<string, string>();
  const regex = /<item\s+([^>]+)>/g;
  let match;
  while ((match = regex.exec(opf)) !== null) {
    const attrs = match[1];
    const id = attrs.match(/id="([^"]+)"/)?.[1];
    const href = attrs.match(/href="([^"]+)"/)?.[1];
    if (id && href) manifest.set(id, decodeURIComponent(href));
  }
  return manifest;
}

function parseSpine(opf: string): string[] {
  const ids: string[] = [];
  const regex = /<itemref\s+[^>]*idref="([^"]+)"[^>]*>/g;
  let match;
  while ((match = regex.exec(opf)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

// ── TOC parsing ──

/** Find a manifest <item> by matching one attribute value (attribute-order-independent). */
function findManifestItemHref(opf: string, attrName: string, attrValuePattern: RegExp): string | null {
  const itemRegex = /<item\s+([^>]+)>/g;
  let match;
  while ((match = itemRegex.exec(opf)) !== null) {
    const attrs = match[1];
    const attrMatch = attrs.match(new RegExp(`${attrName}="([^"]+)"`));
    if (attrMatch && attrValuePattern.test(attrMatch[1])) {
      const hrefMatch = attrs.match(/href="([^"]+)"/);
      if (hrefMatch) return decodeURIComponent(hrefMatch[1]);
    }
  }
  return null;
}

async function parseToc(
  zip: JSZip,
  opfContent: string,
  rootDir: string,
): Promise<Map<string, string>> {
  const titles = new Map<string, string>();

  // EPUB3: find item with properties containing "nav"
  const navHref = findManifestItemHref(opfContent, "properties", /\bnav\b/);
  if (navHref) {
    const navPath = rootDir + navHref;
    const navHtml = await zip.file(navPath)?.async("text");
    if (navHtml) {
      const $ = cheerio.load(navHtml, { xml: false });
      $("nav a").each((_, el) => {
        const href = $(el).attr("href")?.split("#")[0];
        const text = $(el).text().trim();
        if (href && text) {
          titles.set(decodeURIComponent(href), text);
          const base = href.split("/").pop();
          if (base) titles.set(decodeURIComponent(base), text);
        }
      });
      if (titles.size > 0) return titles;
    }
  }

  // EPUB2: find NCX item by media-type
  const ncxHref = findManifestItemHref(opfContent, "media-type", /^application\/x-dtbncx\+xml$/);
  if (ncxHref) {
    const tocPath = rootDir + ncxHref;
    const tocXml = await zip.file(tocPath)?.async("text");
    if (tocXml) {
      const navPointRegex =
        /<navPoint[^>]*>[\s\S]*?<text>([^<]+)<\/text>[\s\S]*?<content\s+src="([^"]+)"[\s\S]*?<\/navPoint>/g;
      let m;
      while ((m = navPointRegex.exec(tocXml)) !== null) {
        const text = m[1].trim();
        const href = m[2].split("#")[0];
        titles.set(decodeURIComponent(href), text);
        const base = href.split("/").pop();
        if (base) titles.set(decodeURIComponent(base), text);
      }
    }
  }

  return titles;
}

// ── HTML → Markdown conversion ──

function extractFirstHeading($: cheerio.CheerioAPI): string | null {
  for (const tag of ["h1", "h2", "h3"]) {
    const el = $(tag).first();
    if (el.length) return el.text().trim();
  }
  return null;
}

function htmlToMarkdown(
  $: cheerio.CheerioAPI,
  root: cheerio.Cheerio<cheerio.Element>,
): string {
  function processNode(node: cheerio.AnyNode): string {
    if (node.type === "text") {
      return (node as unknown as { data: string }).data || "";
    }
    if (node.type !== "tag" || !("tagName" in node)) return "";

    const el = node as cheerio.Element;
    const tag = el.tagName.toLowerCase();
    const children = (el.childNodes || []).map(processNode).join("");

    switch (tag) {
      case "h1": return `\n# ${children.trim()}\n`;
      case "h2": return `\n## ${children.trim()}\n`;
      case "h3": return `\n### ${children.trim()}\n`;
      case "h4": return `\n#### ${children.trim()}\n`;
      case "h5": return `\n##### ${children.trim()}\n`;
      case "h6": return `\n###### ${children.trim()}\n`;
      case "p": return `\n${children.trim()}\n`;
      case "br": return "\n";
      case "strong":
      case "b": return children.trim() ? `**${children.trim()}**` : "";
      case "em":
      case "i": return children.trim() ? `*${children.trim()}*` : "";
      case "blockquote": return `\n> ${children.trim().replace(/\n/g, "\n> ")}\n`;
      case "ul":
      case "ol": return `\n${children}`;
      case "li": {
        const parent = el.parentNode as cheerio.Element | null;
        const isOrdered = parent?.tagName?.toLowerCase() === "ol";
        if (isOrdered) {
          const siblings = (parent?.childNodes || []).filter(
            (n) => (n as cheerio.Element).tagName?.toLowerCase() === "li",
          );
          const index = siblings.indexOf(el) + 1;
          return `${index}. ${children.trim()}\n`;
        }
        return `- ${children.trim()}\n`;
      }
      case "a": {
        const href = $(el).attr("href");
        if (href && !href.startsWith("#") && !isInternalEpubLink(href))
          return `[${children.trim()}](${href})`;
        return children;
      }
      case "img": {
        const alt = $(el).attr("alt") || "";
        if (!alt || alt.toLowerCase() === "image") return "";
        return `[Image: ${alt}]`;
      }
      case "hr": return "\n---\n";
      case "code": return `\`${children}\``;
      case "pre": return `\n\`\`\`\n${children.trim()}\n\`\`\`\n`;
      case "sup": return `^${children}`;
      case "sub": return `~${children}`;
      case "table": return processTable($, $(el));
      default: return children;
    }
  }

  const result = root
    .contents()
    .map((_, node) => processNode(node))
    .get()
    .join("");

  return result.replace(/\n{3,}/g, "\n\n").trim();
}

function processTable(
  $: cheerio.CheerioAPI,
  table: cheerio.Cheerio<cheerio.Element>,
): string {
  const rows: string[][] = [];
  table.find("tr").each((_, tr) => {
    const cells: string[] = [];
    $(tr)
      .find("td, th")
      .each((__, cell) => {
        cells.push($(cell).text().trim());
      });
    if (cells.length) rows.push(cells);
  });
  if (!rows.length) return "";

  const colCount = Math.max(...rows.map((r) => r.length));
  const lines = rows.map(
    (r) =>
      "| " +
      Array.from({ length: colCount }, (_, i) => r[i] || "").join(" | ") +
      " |",
  );
  if (lines.length > 1) {
    const sep =
      "| " +
      Array.from({ length: colCount }, () => "---").join(" | ") +
      " |";
    lines.splice(1, 0, sep);
  }
  return "\n" + lines.join("\n") + "\n";
}

/** Detect links that point within the epub (cross-references, not real URLs). */
function isInternalEpubLink(href: string): boolean {
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
    return false;
  }
  // Typical epub internal refs: part0001.html#rchapter07, chapter3.xhtml, etc.
  if (/^[^/]*\.(html|xhtml|htm)(#.*)?$/.test(href)) return true;
  // Relative paths inside the epub like ../text/chapter1.html
  if (/\.(html|xhtml|htm)(#.*)?$/.test(href)) return true;
  return false;
}

/**
 * Clean up common epub artifacts in generated markdown.
 * Belt-and-suspenders: the HTML→markdown conversion handles most of these,
 * but complex epubs sometimes produce artifacts that slip through.
 */
function cleanupMarkdown(md: string): string {
  return md
    // Remove [Image: Image] placeholders (meaningless alt text)
    .replace(/\[Image:\s*Image\]/gi, "")
    // Remove empty headings (# with no text after it)
    .replace(/^#{1,6}\s*$/gm, "")
    // Remove internal epub link syntax, keep display text
    // e.g. [Title](part0001.html#rchapter07) → Title
    .replace(/\[([^\]]+)\]\([^)]*\.(?:html|xhtml|htm)(?:#[^)]*)?\)/g, "$1")
    // Collapse triple+ blank lines left behind by removals
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripLeadingHeading(content: string, title: string): string {
  const lines = content.split("\n");
  let firstContentIdx = 0;
  while (firstContentIdx < lines.length && !lines[firstContentIdx].trim()) {
    firstContentIdx++;
  }
  if (firstContentIdx >= lines.length) return content;

  const firstLine = lines[firstContentIdx].trim();
  const headingMatch = firstLine.match(/^#{1,6}\s+(.+)$/);
  if (headingMatch) {
    const headingText = headingMatch[1].trim();
    if (headingText.toLowerCase() === title.toLowerCase()) {
      lines.splice(firstContentIdx, 1);
      return lines.join("\n").replace(/^\n+/, "");
    }
  }
  return content;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
