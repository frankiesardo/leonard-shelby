---
name: save
description: Use when adding a URL or EPUB file to the garden — downloads/parses the source, creates a summary, extracts ideas and flashcards, connects to existing ideas, then commits and pushes. Triggered by "/save {url}", "/save {epub-path}", "save this", "add to garden".
---

# Save

Full pipeline for adding a source to the garden. Handles URLs (articles, blog posts, YouTube videos) and EPUB files. Downloads or parses the source, creates a summary, extracts ideas, generates flashcards, cross-links to existing content, then commits and pushes.

## When to Use

Use when the user says `/save {url}`, `/save {epub-path}`, "save this", "add to garden", or provides a URL or EPUB path to add.

## Input

- A URL (article, blog post, YouTube video) or path to an EPUB file
- Optional: title override, slug override, author override
- Optional: hints about what to focus on

---

## Phase 1: Download or Parse the Source

### For URLs

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

### For EPUB files

Run the parse-epub script:

```bash
npx tsx scripts/parse-epub.ts <epub-path> [--slug "book-slug"]
```

This will:
- Extract metadata (title, author) from the EPUB
- Parse the table of contents for chapter titles
- Convert each chapter to markdown, cleaning up epub artifacts
- Write chapter files at `sources/books/<slug>/ch<NN>-<chapter-slug>.md`
- Write `sources/books/<slug>/source.md` with all chapters concatenated
- Print JSON metadata including the slug, title, author, folder, and chapter list

Capture the JSON output — you'll need it for the summary.

The raw `ch<NN>-*.md` files are **scaffolding**, not the final structure. They will be reorganized or deleted in Phase 2.

### Parse quality check (EPUB only)

After parsing, **always review the parser output for suspicious skips** before proceeding. The parser can falsely classify real chapter content as boilerplate — do not silently accept its output.

**Red flags — stop and investigate if you see any of these:**
- A chapter with a numbered or thematic title skipped: e.g. `skip: "2. Changing Your Mind" (copyright)`, `skip: "Chapter 1" (acknowledgments)`, `skip: "Introduction" (short-frontmatter)`
- More than 2 content chapters skipped (beyond standard boilerplate: cover, title page, copyright, index, acknowledgments, also-by)
- The chapter count in `source.md` is lower than expected for the book (cross-check against the TOC visible in source.md or the book's known structure)

**How to investigate a suspicious skip:**
1. Open the EPUB as a ZIP and find the file for the skipped chapter
2. Extract ~500 chars of text to see what it actually is
3. If it's real content: extract the full chapter and manually insert it into `source.md` at the correct position (use `---` separators to match the existing format)

**Then, for each suspicious skip:**
- If it's genuinely boilerplate (promo pages, photo credits, endnotes) → proceed
- If it's real content that was wrongly dropped → fix it before proceeding, and **note it in your response** so the user is aware
- If you're unsure → **ask the user** before proceeding: describe what was skipped and why it looks suspicious

**Also check for transcript errors (URL sources):**
- Garbled text, repeated phrases, or broken paragraphs may indicate a bad transcript
- Missing sections (e.g. a YouTube transcript that cuts off early)
- If the source quality is questionable, flag it to the user before writing the summary

---

## Phase 2: Decide Structure (books only)

Read the table of contents in `source.md`. Assess the book's structure. The deciding factor is whether splitting adds useful resolution for navigating the ideas later.

**Default: no splits.** Most books need only `summary.md` + `source.md`. Delete all raw `ch<NN>-*.md` files.

**Per-part: when the book has clear thematic sections.** If a book has 3-5 parts that each group chapters into a distinct theme, create one file per part: `part01-name.md`, `part02-name.md`, etc. Each part file gets summary, key ideas, key quotes, and Q&A — treating the part as a standalone essay.

**Per-chapter: almost never.** Only if the owner explicitly asks.

For each part file (if splitting):

```markdown
# Part N: Title

## Summary

Concise synthesis of the part. What's the argument? What's the arc?

## Chapters

- **Ch N: Title** — One-line description
- **Ch N+1: Title** — ...

## Key ideas

- **Idea one.** A paragraph. What is the idea? Why does it matter?

## Key quotes

> "The most memorable quote from this part"

## Q&A

**Q:** Question that tests understanding, not recall
**A:** Answer that explains the reasoning
```

After creating part files (if any), delete all raw `ch<NN>-*.md` files.

---

## Phase 3: Create the Summary

Create `summary.md` in the source folder. This is the entry point for the entire source.

### For essays and transcripts

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

One paragraph synthesis. What is this about? What's the most important insight? Why does it matter? Opinionated — not a book report.

## Key ideas

- **Idea one.** A paragraph, not a sentence. What is the idea? Why does it matter? How does it connect?

- **Idea two.** ...

(3-8 key ideas depending on source length)

## Key quotes

> "Notable quote from the source"

(2-5 quotes that are memorable and standalone)

## Connections

Links to related ideas and sources already in the garden. The most valuable connections are often not explicitly named in the source — look for what it *rhymes with*, not just what it cites.
```

### For books

```markdown
---
title: "Book Title"
author: "Author Name"
type: book
domains:
  - domain-1
  - domain-2
status: read
date_consumed: YYYY
ideas: []
---

# Book Title — Author Name

One paragraph synthesis. What's the core thesis? What's the most important insight? Why does this book matter?

## Structure

(Only if the book has part files)

- [Part I: Title](part01-slug.md) — What this part covers
- [Part II: Title](part02-slug.md) — ...

## Chapter map

1. **Chapter Title** — One-line description
2. **Chapter Title** — ...

## Key ideas

- **Idea one.** A paragraph distilled from across all chapters.

(5-8 key ideas)

## Key quotes

> "The single most memorable quote from the book"

(3-5 quotes from across the whole book)

## Connections

Links to related ideas and sources in the garden.
```

### Summary quality rules

- **Synthesis paragraph**: 2-4 sentences. Opinionated. What's the single most important takeaway?
- **Key ideas**: 3-5 for short sources, 5-8 for long ones. Each is a full paragraph with bold headline.
- **Key quotes**: Pick quotes that are memorable and standalone. Include timestamps for transcripts.
- **Connections**: Before writing, scan `ideas/` and `sources/` and map the new source's concepts against what's already in the garden. The most valuable connections are often not explicitly named in the source. Don't just link to what the source explicitly cites — link to what it *rhymes with*.
- **Domains**: Use the controlled vocabulary from AGENTS.md. 1-3 domains per source.
- **`ideas: []`**: Start empty — filled in Phase 4.

---

## Phase 4: Extract Ideas and Generate Flashcards

### Identify concept handles

Based on the source material, identify concepts worth extracting as standalone ideas. Each concept should be:

- **Atomic**: One idea per note. If you need "and" to describe it, split it.
- **Concept-oriented**: Named for the concept, not the source. "Concept Handles" not "Scott Alexander's rule #8."
- **Portable**: Titled as a phrase you can use in a sentence.
- **Genuinely reusable**: Would this idea connect to other sources in the garden?

**Check for existing ideas first.** Read the `ideas/` directory. If a concept already exists, *update* it rather than creating a duplicate.

Typical extraction count:
- Short essay: 2-4 ideas
- Long essay or talk: 3-6 ideas
- Book: 5-10 ideas (the most important ones)

### Create or update idea notes

For each concept, create or update `ideas/<concept-slug>.md`:

```markdown
---
title: "Concept Handles"
aliases:
  - concept handle
  - giving ideas names
sources:
  - nonfiction-writing-advice
domains:
  - writing
  - knowledge-management
related:
  - microhumor
  - evergreen-notes
---

# Concept Handles

Lead with the idea itself — what it is, why it matters, the key insight. Source-agnostic tone.

## Why it matters

The difference between a vague insight and a usable tool is often just a name.

## Connections

- Related to [Evergreen Notes](evergreen-notes.md) — both turn vague thinking into durable objects
```

**Writing rules:**
- **Source-agnostic tone**: The idea stands on its own. Thinkers are attributed inside the body, not in the title.
- **Lead with the concept**: First paragraph defines the idea without assuming the reader knows the source.
- **Densely linked**: Link to related ideas and source summaries where relevant.
- **If updating an existing idea**: Add the new source slug to `sources` in frontmatter. Add a new subsection with the new source's perspective. Never remove existing content.

### Update the source summary

After creating ideas:
1. Add the concept slugs to the `ideas:` list in frontmatter
2. Add inline links from the summary body to the new idea files where natural

### Generate flashcards

Create individual flashcard files in `flashcards/` — one card per file:

```markdown
---
source: concept-handles
---

<details>
<summary>What is a "concept handle" and why does it matter for writing?</summary>

A concept handle is a catchy, memorable phrase that crystallizes a complex idea into something people can manipulate and discuss. The difference between a vague insight and a usable tool is often just a name.

See: [Concept Handles](../ideas/concept-handles.md)

</details>
```

**File naming**: Kebab-case slug of the question content: `what-is-concept-handle.md`.

**Card counts**: 3-5 cards per source. Prioritize understanding over trivia.

**Card types** (test understanding, not recall):
- **Framework cards**: "What are the N forms/steps of X?"
- **Why cards**: "Why does X matter?" — tests reasoning, not definition
- **Application cards**: "You're in situation Y. What principle applies?"
- **Connection cards**: "How does X relate to Y?"
- **Anti-pattern cards**: "What goes wrong when you do X without Y?"

---

## Phase 5: Cross-Link Existing Content

After creating new files, look for connections:

1. **Scan `ideas/`** for files that discuss related topics — add to `related:` in both directions
2. **Scan other source summaries** for mentions of the new concepts — consider adding inline links
3. **Update `maps/`** if the new ideas fit a thematic cluster

Cross-references must be bidirectional: if A relates to B, update both files.

---

## Phase 6: Verify

- Source folder exists at `sources/{type}/{slug}/`
- `source.md` contains the raw content with attribution header (immutable after creation)
- `summary.md` has valid YAML frontmatter with all required fields
- `ideas:` list in summary frontmatter matches the idea files created
- For books with parts: `part<NN>-<slug>.md` files exist with all four sections
- No leftover `ch<NN>-*.md` scaffolding files remain
- Every new idea file has valid frontmatter with `title`, `sources`, `domains`, `related`
- Every new flashcard file has `source` in frontmatter
- All markdown links resolve to real files
- No broken links, no epub artifacts

---

## Phase 7: Commit and Push

```bash
git add -A
git commit -m "Add {title} by {author}"
git push
```

If git push fails (e.g., remote has new changes), inform the user and ask how to proceed.

---

## Link Format

Use relative markdown links. Link text must be human-readable titles, never slugs.

| From | To | Format |
|------|-----|--------|
| summary → other source | `[Title](../other-slug/summary.md)` |
| summary → idea | `[Concept](../../ideas/concept.md)` |
| summary → part | `[Part Title](part01-slug.md)` |
| idea → idea | `[Title](other-idea.md)` |
| idea → source summary | `[Title](../sources/essays/slug/summary.md)` |
| flashcard → idea | `[Title](../ideas/slug.md)` |

## Important

- **Source files are immutable** — never modify `source.md` after creation
- **Summary is the entry point** — it's the only file with frontmatter and synthesis
- **Raw chapter files are scaffolding** — always delete `ch<NN>-*.md` files once the structure is in place
- **`ideas: []`** — always start empty in the summary, filled in Phase 4
- **No wikilinks** — always use standard markdown `[text](path.md)` links
- **Human-readable link text** — always use the title, never the slug
- **Check for duplicates** — always scan `ideas/` before creating new idea notes
- **Additive only** — never remove existing content, only enrich
- **Bidirectional links** — if A relates to B, update both files
