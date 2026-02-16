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

interface Chapter {
  title: string;
  slug: string;
  content: string;
  order: number;
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

    chapters.push({
      title: chapterTitle,
      slug: slugify(chapterTitle),
      content: markdown,
      order: chapterNum,
    });
  }

  console.log(`  chapters: ${chapters.length}`);

  if (chapters.length === 0) {
    console.error("No chapters found in EPUB");
    process.exit(1);
  }

  const bookFolder = `sources/books/${bookSlug}`;

  // Write chapter files
  const chapterFiles: { file: string; title: string; order: number }[] = [];

  for (const ch of chapters) {
    const paddedNum = String(ch.order).padStart(2, "0");
    const fileName = `ch${paddedNum}-${ch.slug}`;
    chapterFiles.push({ file: fileName, title: ch.title, order: ch.order });

    const contentBody = stripLeadingHeading(ch.content, ch.title);
    const fileContent = `# ${ch.title}\n\n${contentBody}\n`;

    const destPath = `${bookFolder}/${fileName}.md`;
    if (existsSync(resolve(PROJECT_ROOT, destPath))) {
      console.log(`  skip (exists): ${destPath}`);
    } else {
      await writeGardenFile(PROJECT_ROOT, destPath, fileContent);
    }
  }

  // Write source.md (full text, all chapters concatenated)
  const sourcePath = `${bookFolder}/source.md`;
  if (!existsSync(resolve(PROJECT_ROOT, sourcePath))) {
    const fullText = chapters
      .map((ch) => {
        const body = stripLeadingHeading(ch.content, ch.title);
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

async function parseToc(
  zip: JSZip,
  opfContent: string,
  rootDir: string,
): Promise<Map<string, string>> {
  const titles = new Map<string, string>();

  const navMatch = opfContent.match(
    /<item[^>]*properties="[^"]*nav[^"]*"[^>]*href="([^"]+)"[^>]*>/,
  );
  if (navMatch) {
    const navPath = rootDir + decodeURIComponent(navMatch[1]);
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

  const ncxMatch = opfContent.match(
    /<item[^>]*media-type="application\/x-dtbncx\+xml"[^>]*href="([^"]+)"[^>]*>/,
  );
  if (ncxMatch) {
    const tocPath = rootDir + decodeURIComponent(ncxMatch[1]);
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
        if (href && !href.startsWith("#"))
          return `[${children.trim()}](${href})`;
        return children;
      }
      case "img": {
        const alt = $(el).attr("alt") || "";
        return alt ? `[Image: ${alt}]` : "";
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
