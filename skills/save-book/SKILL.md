# Save Book

Parses a local EPUB file and creates a source folder with the full text, chapter files, and a book-level summary.

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
- Convert each chapter to markdown
- Write chapter files at `sources/books/<slug>/ch<NN>-<chapter-slug>.md`
- Write `sources/books/<slug>/source.md` with all chapters concatenated
- Print JSON metadata including the slug, title, author, folder, and chapter list

Capture the JSON output — you'll need it for the summary.

### 2. Create Chapter Summaries (Optional — Progressive Processing)

For each chapter, you can optionally create a chapter-level summary. This is most useful for dense books. Append a `## Summary` section to the top of each chapter file, or process this in a later run with `/connect`.

For quick processing, skip to step 3 (book-level summary).

### 3. Create the Book-Level Summary

Create `sources/books/<slug>/summary.md` — the entry point for the entire book.

```markdown
---
title: "Book Title"
author: "Author Name"
type: book
tier: evergreen                # perennial | evergreen | seasonal
domains:
  - domain-1
  - domain-2
status: read
date_consumed: YYYY
ideas: []
---

# Book Title — Author Name

One paragraph synthesis. What's the core thesis? What's the most important insight? Why does this book matter to you? This is opinionated — not a book report.

## Chapter map

1. [Chapter Title](ch01-slug.md) — One-line description of what this chapter covers
2. [Chapter Title](ch02-slug.md) — ...
3. ...

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

### 4. Verify

- Book folder exists at `sources/books/<slug>/`
- `summary.md` has valid YAML frontmatter with all required fields
- `source.md` contains the full concatenated text
- Chapter files exist as `ch<NN>-<slug>.md`
- Chapter Map links in `summary.md` point to existing chapter files
- All markdown links resolve to real files

## Naming Conventions

- Book folder: `sources/books/<book-slug>/`
- Chapter files: `ch01-<chapter-slug>.md`, `ch02-<chapter-slug>.md`, ...
- The `ch<NN>` prefix ensures proper sort order
- All names are kebab-case

## Progressive Processing

Books are large. You don't have to process everything at once:

1. **First run**: Parse EPUB → source.md + chapter files + book-level summary
2. **Second run**: `/connect` on the most important chapters (user picks)
3. **Third run**: `/connect` on remaining chapters
4. **Later runs**: Revisit to add cross-book connections

## Link Format

Use relative markdown links. Link text must be human-readable titles, never slugs.

| From | To | Format |
|------|-----|--------|
| summary → chapter | `[Chapter Title](ch01-slug.md)` |
| summary → idea | `[Concept](../../ideas/concept.md)` |
| summary → other source | `[Title](../../essays/slug/summary.md)` |

## Important

- **Source files are immutable** — never modify `source.md` or chapter files after creation
- **Summary is the entry point** — it's the only file with frontmatter and synthesis
- **`ideas: []`** — always start empty, filled by `/connect`
- **No wikilinks** — always use standard markdown `[text](path.md)` links
- **Check for existing concepts** — books often revisit ideas from other sources
- **Additive only** — never remove existing content, only enrich
