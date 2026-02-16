/**
 * Save a URL to the garden as a source folder.
 *
 * Usage:
 *   npx tsx scripts/save-url.ts <url> [--title "override title"] [--slug "short-slug"] [--author "Author Name"]
 *
 * Creates:
 *   sources/essays/<slug>/source.md       (for articles/blog posts)
 *   sources/transcripts/<slug>/source.md  (for YouTube videos)
 *
 * The source.md contains clean content with a simple header.
 * The agent is responsible for creating summary.md with frontmatter.
 *
 * Prints JSON metadata on success for the agent to consume.
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { downloadYouTubeTranscript, fetchYouTubeTitle } from "./download-youtube.js";
import { downloadArticle } from "./download-article.js";
import { writeGardenFile } from "./content-writer.js";
import { isYouTubeUrl, slugify } from "./types.js";

const PROJECT_ROOT = resolve(import.meta.dirname, "..");

async function main() {
  const args = process.argv.slice(2);

  const url = args.find((a) => !a.startsWith("--"));
  if (!url) {
    console.error("Usage: npx tsx scripts/save-url.ts <url> [--title \"title\"] [--slug \"slug\"] [--author \"author\"]");
    process.exit(1);
  }

  const titleIdx = args.indexOf("--title");
  const titleOverride = titleIdx !== -1 ? args[titleIdx + 1] : undefined;

  const slugIdx = args.indexOf("--slug");
  const slugOverride = slugIdx !== -1 ? args[slugIdx + 1] : undefined;

  const authorIdx = args.indexOf("--author");
  const authorOverride = authorIdx !== -1 ? args[authorIdx + 1] : undefined;

  console.log(`Saving: ${url}`);

  let title: string;
  let author: string | null = authorOverride || null;
  let sourceContent: string;
  let sourceType: "essay" | "transcript";

  if (isYouTubeUrl(url)) {
    sourceType = "transcript";
    title = titleOverride || (await fetchYouTubeTitle(url));
    console.log(`  title: ${title}`);

    const result = await downloadYouTubeTranscript(url, title);
    author = author || null;

    sourceContent = [
      `# ${result.title}`,
      "",
      `*Source: ${url}*`,
      `*Captions: ${result.captions}*`,
      "",
      result.transcript,
    ].join("\n");
  } else {
    sourceType = "essay";
    console.log(`  downloading article...`);

    const result = await downloadArticle(url, titleOverride);
    title = result.title;
    author = author || result.author;

    console.log(`  title: ${title}`);
    if (author) console.log(`  author: ${author}`);

    const headerParts = [`# ${title}`];
    if (author) headerParts.push(`\n*${author}*`);
    headerParts.push(`\n*Source: ${url}*`);

    sourceContent = [
      ...headerParts,
      "",
      result.markdown,
    ].join("\n");
  }

  const slug = slugOverride || slugify(title);
  const folder = `sources/${sourceType === "transcript" ? "transcripts" : "essays"}/${slug}`;
  const sourcePath = `${folder}/source.md`;
  const fullDest = resolve(PROJECT_ROOT, sourcePath);

  if (existsSync(fullDest)) {
    console.log(`  source already exists: ${sourcePath}`);
  } else {
    await writeGardenFile(PROJECT_ROOT, sourcePath, sourceContent);
  }

  // Print structured output for the agent
  console.log("\n--- saved ---");
  console.log(JSON.stringify({
    slug,
    title,
    author,
    type: sourceType,
    url,
    folder,
    source_path: sourcePath,
    summary_path: `${folder}/summary.md`,
  }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
