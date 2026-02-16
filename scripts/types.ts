export interface SourceMeta {
  url: string;
  title: string;
  author?: string;
  og_image: string | null;
  type: "essay" | "transcript" | "book";
  downloaded_at: string;
}

export function isYouTubeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === "www.youtube.com" ||
      u.hostname === "youtube.com" ||
      u.hostname === "youtu.be" ||
      u.hostname === "m.youtube.com"
    );
  } catch {
    return false;
  }
}

export function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:v=|\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  return match?.[1] ?? null;
}

const FILLER_WORDS = new Set([
  "the", "a", "an", "on", "of", "and", "in", "for", "to", "with",
  "is", "it", "its", "this", "that", "by", "at", "or", "but", "not",
  "from", "as", "be", "was", "are", "were", "been", "has", "have",
  "had", "do", "does", "did", "will", "would", "could", "should",
  "may", "might", "shall", "can", "about", "how", "what", "when",
  "where", "why", "who", "which", "your", "you", "we", "our",
  "their", "my", "his", "her", "all", "just", "than", "then",
  "also", "into", "over", "such", "no", "so", "up", "out", "if",
  "each", "some", "most", "other", "very", "s", "t", "re", "ve",
]);

const MAX_SLUG_LENGTH = 50;

export function slugify(text: string): string {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/[\s-]+/)
    .filter((w) => w && !FILLER_WORDS.has(w));

  let slug = "";
  for (const word of words) {
    const next = slug ? `${slug}-${word}` : word;
    if (next.length > MAX_SLUG_LENGTH) break;
    slug = next;
  }

  return slug || text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, MAX_SLUG_LENGTH);
}

export function escapeYaml(s: string): string {
  return s.replace(/'/g, "''");
}
