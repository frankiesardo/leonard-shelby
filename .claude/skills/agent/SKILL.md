---
name: agent
description: Use when you want to do the full flow: download a source, connect it to the garden, and commit + push. Triggered by "/agent {source}", "add to garden", "save and connect".
---

# Agent

Downloads a source, connects it to the garden, and commits + pushes to git. This is a convenience skill that runs the full pipeline in one go.

## When to Use

Use this skill when the user says `/agent {source}`, "add to garden", "save and connect", "save, connect, and push", or wants to add a complete source to the garden in one flow.

## Input

The user provides:
- A source to add (URL, EPUB path, or description)
- Optional: hints about what to focus on in the summary
- Optional: commit message (defaults to auto-generated)

## Steps

### 1. Save the Source

Determine the source type and use the appropriate skill:

**For URLs (articles, blog posts, YouTube videos):**
Run the save-url script:
```bash
npx tsx scripts/save-url.ts <url> [--title "override title"] [--slug "short-slug"] [--author "Author Name"]
```

**For EPUB files:**
Run the parse-epub script:
```bash
npx tsx scripts/parse-epub.ts <epub-path> [--slug "book-slug"]
```

This will create the source folder with `source.md` and `summary.md`.

### 2. Connect the Source

Run the connect workflow:

1. Read the newly created `summary.md`
2. Identify concept handles (2-5 for essays/transcripts, 5-10 for books)
3. Create or update idea notes in `ideas/`
4. Update the source's `summary.md` with idea links
5. Generate flashcards in `flashcards/`
6. Cross-link to existing ideas and sources

### 3. Commit and Push

After the source is saved and connected:

1. Check git status to see all changes:
```bash
git status
```

2. Review what will be committed:
```bash
git diff --stat
```

3. Create a commit with a descriptive message:
```bash
git add -A
git commit -m "Add {source-title} by {author}"
```

4. Push to remote:
```bash
git push
```

**Commit message format:**
- `Add {title} by {author}` for new sources
- `Connect {title} to the garden` for pure connection runs

## Variations

### /agent URL [options]
Save a URL (article or YouTube), connect it, commit and push.

### /agent /path/to/book.epub [options]
Save an EPUB, connect it, commit and push.

### /agent --skip-connect URL
Save and commit only, skip the connect step.

### /agent --no-push URL
Save and connect, but don't push to remote (commits locally only).

## Verify

- Source folder exists at `sources/{type}/{slug}/`
- `summary.md` has valid YAML frontmatter with ideas populated
- New idea files created or updated in `ideas/`
- Flashcards created in `flashcards/`
- Git commit created and pushed
- No broken markdown links

## Important

- This skill assumes you have push access to the remote
- If git push fails (e.g., remote has new changes), inform the user and ask how to proceed
- The connect step is optional via `--skip-connect` flag for very quick captures
