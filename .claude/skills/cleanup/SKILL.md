---
name: cleanup
description: Use when scanning the garden for broken markdown links, orphaned flashcards, and frontmatter inconsistencies. Triggered by "/cleanup", "fix broken links", "clean up the garden".
---

# Cleanup

Scans the garden for broken markdown links, orphaned flashcards, and inconsistencies, then fixes them.

## When to Use

Use this skill when the user says `/cleanup`, "fix broken links", "clean up the garden", or after deleting or renaming source/idea files manually.

## Steps

### 1. Scan for Broken Links

Read all `.md` files in these directories:
- `sources/` (all summary.md files)
- `ideas/`
- `flashcards/`
- `notes/`
- `maps/`

For each file:
1. Extract all markdown links `[text](path.md)` from the body
2. Resolve the relative path from the file's directory
3. Check if the target file exists

### 2. Fix Broken Links

For each broken link:
- If the link points to a deleted source, idea, or note: remove the link syntax but keep the display text (e.g., `[Concept](broken.md)` becomes `Concept`)
- If an idea's `sources` frontmatter references a slug with no matching source folder, remove that slug from the list
- If an idea's `related` frontmatter references a non-existent idea, remove that slug

### 3. Fix Frontmatter Inconsistencies

Check for common issues:
- Source summaries with `ideas:` listing slugs that don't exist in `ideas/` — remove the orphaned slugs
- Ideas with `sources:` listing slugs that don't match any source folder — remove the orphaned slugs
- Ideas with `related:` listing slugs that don't match any idea file — remove the orphaned slugs

### 4. Remove Orphaned Flashcards

Check each flashcard file in `flashcards/`:
- If its `source` frontmatter references a concept that no longer exists in `ideas/`, delete the flashcard

### 5. Report

Print a summary of:
- How many broken links were found and fixed
- How many orphaned flashcards were removed
- How many frontmatter inconsistencies were fixed
- Which files were modified

## Important

- **Source files are never modified or deleted** — `source.md` and chapter files are immutable
- **Always verify before deleting** — print what will be removed and confirm with the user
- **Ideas shared across multiple sources** should only be removed if genuinely orphaned
- **Back up first** — if making large-scale changes, suggest the user commit first
