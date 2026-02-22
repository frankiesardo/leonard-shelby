import path from "node:path";

export default function (eleventyConfig) {
  // --- Passthrough copy ---
  eleventyConfig.addPassthroughCopy("site/css");
  eleventyConfig.addPassthroughCopy("site/js");

  // --- Ignore non-content files ---
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("AGENTS.md");
  eleventyConfig.ignores.add("CLAUDE.md");
  eleventyConfig.ignores.add("scripts/**");
  eleventyConfig.ignores.add("**/*.epub");
  eleventyConfig.ignores.add("node_modules/**");
  eleventyConfig.ignores.add(".claude/**");
  eleventyConfig.ignores.add(".github/**");

  // --- Layout and permalink assignment via eleventyComputed ---
  eleventyConfig.addGlobalData("eleventyComputed", {
    layout(data) {
      // Skip pages that already have a layout (e.g. site/pages/ templates)
      if (data.layout) return data.layout;

      const p = data.page?.inputPath ?? "";

      if (p.startsWith("./ideas/")) return "idea.njk";
      if (p.startsWith("./maps/")) return "map.njk";
      if (p.startsWith("./notes/")) return "note.njk";
      if (p.startsWith("./conversations/")) return "conversation.njk";
      if (p.startsWith("./flashcards/")) return "flashcard.njk";

      // Sources: summary.md gets one layout, source.md/partNN- get another
      if (/\/sources\/.*\/summary\.md$/.test(p)) return "source-summary.njk";
      if (/\/sources\/.*\/(source\.md|part\d+-)/.test(p))
        return "source-text.njk";

      return undefined;
    },
    permalink(data) {
      if (data.permalink) return data.permalink;

      const p = data.page?.inputPath ?? "";

      // summary.md → parent directory (e.g. /sources/books/the-goal/)
      const summaryMatch = p.match(
        /^\.\/(sources\/(?:books|essays|transcripts|bookmarks)\/[^/]+)\/summary\.md$/
      );
      if (summaryMatch) {
        return `/${summaryMatch[1]}/`;
      }

      return undefined;
    },
  });

  // --- Collections ---
  eleventyConfig.addCollection("ideas", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("ideas/*.md")
      .sort((a, b) => (a.data.title ?? "").localeCompare(b.data.title ?? ""))
  );

  eleventyConfig.addCollection("flashcards", (collectionApi) =>
    collectionApi.getFilteredByGlob("flashcards/*.md")
  );

  eleventyConfig.addCollection("conversations", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("conversations/*.md")
      .sort((a, b) => {
        const da = a.data.date ?? "";
        const db = b.data.date ?? "";
        return da < db ? 1 : da > db ? -1 : 0;
      })
  );

  eleventyConfig.addCollection("notes", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("notes/*.md")
      .sort((a, b) => {
        const da = a.data.date ?? "";
        const db = b.data.date ?? "";
        return da < db ? 1 : da > db ? -1 : 0;
      })
  );

  eleventyConfig.addCollection("maps", (collectionApi) =>
    collectionApi.getFilteredByGlob("maps/*.md")
  );

  // Source summaries grouped by type
  eleventyConfig.addCollection("sourceSummaries", (collectionApi) =>
    collectionApi.getFilteredByGlob("sources/**/summary.md")
  );

  // --- Link rewriting transform ---
  // Converts relative .md links to absolute site URLs
  eleventyConfig.addTransform("rewrite-links", function (content) {
    if (!this.page.outputPath || !this.page.outputPath.endsWith(".html")) {
      return content;
    }

    const inputDir = path.dirname(this.page.inputPath);

    return content.replace(
      /href="([^"]*\.md)(#[^"]*)?"/g,
      (match, mdPath, anchor) => {
        // Skip absolute URLs
        if (mdPath.startsWith("http://") || mdPath.startsWith("https://")) {
          return match;
        }

        // Resolve the relative path from the source file's directory
        let resolved = path.resolve(inputDir, mdPath);

        // Make it relative to the project root (strip leading ./)
        resolved = path.relative(".", resolved);

        // Convert to URL path
        let urlPath = "/" + resolved;

        // Strip summary.md → just the directory
        urlPath = urlPath.replace(/\/summary\.md$/, "/");

        // Strip .md extension → trailing slash
        urlPath = urlPath.replace(/\.md$/, "/");

        return `href="${urlPath}${anchor || ""}"`;
      }
    );
  });

  // --- Config ---
  return {
    dir: {
      input: ".",
      includes: "site/_includes",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
