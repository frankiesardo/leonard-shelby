import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";
import TurndownService from "turndown";

export interface ArticleResult {
  title: string;
  author: string | null;
  og_image: string | null;
  markdown: string;
}

/**
 * Downloads an article URL, extracts content using Readability,
 * and converts to clean markdown (no frontmatter).
 */
export async function downloadArticle(
  url: string,
  titleOverride?: string
): Promise<ArticleResult> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();
  const { document } = parseHTML(html);

  const ogImageEl = document.querySelector('meta[property="og:image"]');
  const ogImage = ogImageEl?.getAttribute("content") || null;

  const authorEl = document.querySelector('meta[name="author"]');
  const author = authorEl?.getAttribute("content") || null;

  const reader = new Readability(document as unknown as Document);
  const article = reader.parse();

  if (!article) {
    throw new Error(`Readability could not parse content from ${url}`);
  }

  const title = titleOverride || article.title;

  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });
  const markdown = turndown.turndown(article.content);

  return {
    title,
    author,
    og_image: ogImage,
    markdown,
  };
}
