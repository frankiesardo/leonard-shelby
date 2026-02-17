# Save Book

Parses a local EPUB file and creates a source folder with the full text and a book-level summary. Decides how to structure the book based on its table of contents.

## When to Use

Use this skill when the user says `/save {book}`, "save this book", "add book", "process this epub", or provides an EPUB file to add to the garden.

## Input

The user provides:
- A path to an EPUB file (e.g., `books/sapiens.epub`)
- Optional slug override
- Optional hints about what to focus on

## Steps

### 1. Parse the EPUB

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

The raw `ch<NN>-*.md` files are **scaffolding**, not the final structure. They mirror how the epub was split (by HTML file, not by logical chapter) and will be reorganized or deleted in step 3.

### 2. Decide Structure

Read the table of contents in `source.md`. Assess the book's structure and richness. The deciding factor is whether splitting adds useful resolution for navigating the ideas later.

**Default: no splits.** Most books need only `summary.md` + `source.md`. The summary's key ideas section and chapter map already provide per-chapter resolution without creating file noise. Delete all raw `ch<NN>-*.md` files.

**Per-part: when the book has clear thematic sections.** If a book has 3-5 parts that each group chapters into a distinct theme, create one file per part: `part01-name.md`, `part02-name.md`, etc. Each part file gets summary, key ideas, key quotes, and Q&A — treating the part as a standalone essay. Examples:
- On Writing Well (4 parts: Principles, Methods, Forms, Attitudes)
- The Art of Learning (3 parts: The Foundation, My Second Art, Bringing It All Together)

**Per-chapter: almost never.** Only if the owner explicitly asks. The chapter map in `summary.md` already provides per-chapter context. Creating 15-20 chapter files is noise, not resolution.

Use judgment. Don't ask the owner how to split every book. When in doubt, fewer files is better.

### 3. Create the Structure

#### If no splits (default)

1. Delete all raw `ch<NN>-*.md` files
2. Create `summary.md` (see step 4)
3. Done — the book is `summary.md` + `source.md`

#### If per-part splits

1. Read the raw chapter files that belong to each part
2. Create `part<NN>-<slug>.md` for each part with this template:

```markdown
# Part N: Title

## Summary

Concise synthesis of the part in your own words. What's the argument? What's the arc? This treats the part as a standalone essay.

## Chapters

- **Ch N: Title** — One-line description of what this chapter covers
- **Ch N+1: Title** — ...

## Key ideas

- **Idea one.** A paragraph, not a sentence. What is the idea? Why does it matter?
- **Idea two.** ...

## Key quotes

> "The most memorable quote from this part"

> "Another essential quote"

## Q&A

**Q:** Question that tests understanding, not recall
**A:** Answer that explains the reasoning

**Q:** Application question — "You're in situation X. What principle applies?"
**A:** Answer connecting the principle to the scenario
```

3. Delete all raw `ch<NN>-*.md` files
4. Create `summary.md` with links to part files (see step 4)

### 4. Create the Book-Level Summary

Create `sources/books/<slug>/summary.md` — the entry point for the entire book.

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

One paragraph synthesis. What's the core thesis? What's the most important insight? Why does this book matter to you? This is opinionated — not a book report.

## Structure

(Only if the book has part files. Links to each part with a one-line summary.)

- [Part I: Title](part01-slug.md) — What this part covers and why it matters
- [Part II: Title](part02-slug.md) — ...

## Chapter map

(For all books. A quick reference to the book's structure.)

1. **Chapter Title** — One-line description
2. **Chapter Title** — ...

## Key ideas

- **Idea one.** A paragraph distilled from across all chapters. What is the idea? Why does it matter?

- **Idea two.** ...

(5-8 key ideas distilled from the entire book)

## Key quotes

> "The single most memorable quote from the book"

> "Another essential quote"

(3-5 quotes from across the whole book)
```

**Important**: The book-level summary should be synthesized AFTER reading all chapters. Surface the ideas that define the book, not just chapter 1's ideas.

### 5. Clean Up Epub Artifacts

If you find leftover epub artifacts in any files:

- Remove `[Image: Image]` — meaningless alt-text placeholders
- Remove internal epub links like `[Title](part0001.html#rchapter07)` — keep the text
- Remove empty headings (`# ` with no text)
- Remove duplicate chapter-number headings (e.g., `# 7` followed by `### [Usage](...)`)
- Remove `# PART I` / `## [PART I](...)` headers when folded into part file structure
- Keep external URLs (http/https links)
- Keep `---` horizontal rules as section separators

The parser handles most of these automatically, but some slip through in complex epubs.

### 6. Verify

- Book folder exists at `sources/books/<slug>/`
- `summary.md` has valid YAML frontmatter with all required fields
- `source.md` contains the full concatenated text
- If per-part: `part<NN>-<slug>.md` files exist and have all four sections (summary, key ideas, key quotes, Q&A)
- No leftover `ch<NN>-*.md` scaffolding files remain
- All markdown links resolve to real files
- No epub artifacts remain in any files

## Naming Conventions

- Book folder: `sources/books/<book-slug>/`
- Part files: `part01-<slug>.md`, `part02-<slug>.md`, ...
- The `part<NN>` prefix ensures proper sort order
- All names are kebab-case

## Progressive Processing

Books are large. You don't have to process everything at once:

1. **First run**: Parse EPUB → source.md + summary. Decide structure and create part files if splitting.
2. **Second run**: `/connect` on the most important parts or chapters (user picks)
3. **Third run**: `/connect` on remaining material
4. **Later runs**: Revisit to add cross-book connections

## Link Format

Use relative markdown links. Link text must be human-readable titles, never slugs.

| From | To | Format |
|------|-----|--------|
| summary → part | `[Part Title](part01-slug.md)` |
| summary → idea | `[Concept](../../ideas/concept.md)` |
| summary → other source | `[Title](../../essays/slug/summary.md)` |

## Don't

- Don't map epub structure 1:1 — epubs split content in arbitrary ways (by HTML file, not by logical chapter)
- Don't include boilerplate epub sections (copyright, publisher info, etc.) — `parse-epub.ts` filters these by title and content heuristics
- Don't create files for the index, "about the author," or acknowledgments
- Don't default to per-chapter splitting — it creates noise. Start from "no splits" and only add files when the resolution is genuinely useful

## Important

- **Source files are immutable** — never modify `source.md` after creation
- **Summary is the entry point** — it's the only file with frontmatter and synthesis
- **Raw chapter files are scaffolding** — always delete `ch<NN>-*.md` files once the clean structure is in place
- **`ideas: []`** — always start empty, filled by `/connect`
- **No wikilinks** — always use standard markdown `[text](path.md)` links
- **Check for existing concepts** — books often revisit ideas from other sources
- **Additive only** — never remove existing content, only enrich
