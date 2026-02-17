---
name: save-url
description: Use when downloading a URL (article, blog post, YouTube video) and creating a source folder with raw content and summary. Triggered by "/save {url}", "save this URL", "download this".
---

# Save URL

Downloads a URL (article, blog post, or YouTube video) and creates a source folder with raw content and a summary.

## When to Use

Use this skill when the user says `/save {url}`, "save this URL", "save {url}", "download {url}", or provides a URL to add to the garden.

## Input

The user provides:
- A URL (article, blog post, or YouTube video)
- Optional title override
- Optional slug override
- Optional hints about what to focus on in the summary

## Steps

### 1. Download the Source

Run the save-url script:

```bash
npx tsx scripts/save-url.ts <url> [--title "override title"] [--slug "short-slug"] [--author "Author Name"]
```

This will:
- Detect whether the URL is a YouTube video or web article
- Download the YouTube transcript (with timestamps) or convert the article to markdown
- Write `sources/essays/<slug>/source.md` or `sources/transcripts/<slug>/source.md`
- Print JSON metadata including the slug, title, author, and paths

**Slug override**: If the auto-generated slug is long or ugly, pass `--slug` with a short, readable kebab-case slug (max ~50 chars).

Capture the JSON output — you'll need it for the summary.

### 2. Generate the Summary

Read the newly created `source.md` and create `summary.md` in the same folder.

**Summary structure:**

```markdown
---
title: "Source Title"
author: "Author Name"
type: essay                    # essay | transcript
domains:
  - domain-1
  - domain-2
status: read
date_consumed: YYYY
url: "https://..."
ideas: []
---

# Source Title — Author Name

One paragraph synthesis. What is this about? What's the most important insight? Why does it matter? This should be opinionated — not a book report, but a distillation of what matters to *you*.

## Key ideas

- **Idea one.** A paragraph, not a sentence. What is the idea? Why does it matter? How does it connect?

- **Idea two.** ...

(3-8 key ideas depending on source length)

## Key quotes

> "Notable quote from the source"

> "Another quote"

(2-5 quotes that are memorable and standalone)
```

### Summary Quality Rules

- **Synthesis paragraph**: 2-4 sentences. Opinionated. What's the single most important takeaway?
- **Key ideas**: 3-5 for short sources, 5-8 for long ones. Each is a full paragraph with bold headline.
- **Key quotes**: Pick quotes that are memorable and standalone. Include timestamps for transcripts.
- **Cross-links are the highest-value part of the summary — not an afterthought.** Before writing, scan `ideas/` and `sources/` and actively map the new source's concepts against what's already in the garden. The most valuable connections are often not explicitly named in the source (e.g. an interview about parenting and leadership may never mention Adler but map perfectly onto Adlerian ideas already in the garden). Add a `## Connections` section linking to related ideas and sources with a sentence explaining *why* they connect. Don't just link to what the source explicitly cites — link to what it *rhymes with*.
- **Domains**: Use from the controlled vocabulary in AGENTS.md. 1-3 domains per source.
- **`ideas: []`**: Always start empty. Ideas are extracted later by the `/connect` skill.

### 3. Verify

- Source folder exists at `sources/{type}/{slug}/`
- `source.md` contains the raw content with attribution header
- `summary.md` has valid YAML frontmatter with all required fields
- All markdown links resolve to real files (no broken links)

## Link Format

Use relative markdown links. Link text must be human-readable titles, never slugs.

| From | To | Format |
|------|-----|--------|
| summary → other source | `[Title](../other-slug/summary.md)` |
| summary → idea | `[Concept](../../ideas/concept.md)` |

## Important

- **Source files are immutable** — never modify `source.md` after creation
- **Summary is the entry point** — it's the only file with frontmatter
- **No wikilinks** — always use standard markdown `[text](path.md)` links
- **Kebab-case everything** — folder names, file names, slugs
- **Human-readable link text** — always use the title, never the slug
