# Note

Captures a quick thought, quote, or reflection into the notes directory.

## When to Use

Use this skill when the user says `/note`, "add a note", "jot this down", provides a quote to save, or shares a quick thought that doesn't belong to a specific source.

## Input

The user provides:
- A thought, quote, observation, or reflection
- Optional: whether this is a quick daily capture or a standalone reflection

## Steps

### 1. Determine Note Type

**Daily capture** (default): Append to `notes/YYYY-MM-DD.md` (today's date). This is for quick thoughts, quotes, reactions — things that happen in the flow of a day.

**Standalone reflection**: Create `notes/on-<topic>.md` for longer, undated personal essays that engage deeply with a theme. Use this when the user explicitly writes something substantial or asks for a standalone note.

### 2. Write the Note

**For daily captures:**

If `notes/YYYY-MM-DD.md` exists, append to it with a blank line separator. If it doesn't exist, create it:

```markdown
# YYYY-MM-DD

"Originality is merely skill in concealing origins." — C. E. M. Joad

A few sentences of personal reaction or context. Why does this resonate? What does it connect to?
```

Each new entry in the same day is separated by a blank line. No frontmatter needed for daily notes — the date is in the filename.

**For standalone reflections:**

```markdown
---
title: "On the relationship between stoicism and antifragility"
date: YYYY-MM-DD
sources:
  - antifragile
  - meditations
---

# On Stoicism and Antifragility

The reflection body. Personal voice. Thinking out loud. Can link to [ideas](../ideas/antifragility.md) and [sources](../sources/books/antifragile/summary.md) freely.
```

### 3. Add Links (if natural)

If the note references ideas or sources already in the garden, add inline links:
- To ideas: `[Concept Handles](../ideas/concept-handles.md)`
- To sources: `[Scott Alexander's writing advice](../sources/essays/nonfiction-writing-advice/summary.md)`

Don't force connections. If a note is just a quick capture with no obvious links, that's fine.

### 4. Verify

- The file exists and has valid markdown
- Any inline links resolve to real files
- Daily notes use `YYYY-MM-DD.md` format
- Standalone reflections use `on-<topic>.md` format

## Voice

Notes are in the owner's voice. Concise, direct, bullet-point-friendly, with occasional dry humor. Not polished prose — thinking out loud. No corporate speak. No fluff.

## Important

- **Daily notes are append-only** — never overwrite, only add to them
- **No frontmatter for daily notes** — the date is in the filename
- **Frontmatter for standalone reflections** — include title, date, and optionally sources
- **Don't over-connect** — if a note is just a thought, let it be a thought
- **Preserve the raw capture** — don't over-edit or polish the user's words
