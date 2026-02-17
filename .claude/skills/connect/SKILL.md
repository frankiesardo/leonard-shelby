---
name: connect
description: Use when extracting concept handles from a source, creating or updating idea notes, generating flashcards, and cross-linking content. Triggered by "/connect", "extract ideas from", "link this to the garden".
---

# Connect

Extracts concept handles from a source, creates or updates idea notes, generates flashcards, and cross-links everything. This is the second pass — the source must already have a `summary.md`.

## When to Use

Use this skill when the user says `/connect @source`, "connect this", "extract ideas from...", "link this to the garden", or wants to deepen the knowledge graph for a specific source.

## Input

The user provides:
- A source reference (folder name, path, or description)
- Optional hints about what to focus on (e.g., "focus on the concept handles idea")

## Steps

### 1. Read the Source Material

1. Find the source folder in `sources/` (check `books/`, `essays/`, `transcripts/`)
2. Read `summary.md` — this is the primary input
3. Optionally read `source.md` or chapter files for more depth
4. Read the user's hints if provided

### 2. Identify Concept Handles

Based on the source material, identify concepts worth extracting as standalone ideas. Each concept should be:

- **Atomic**: One idea per note. If you need "and" to describe it, split it.
- **Concept-oriented**: Named for the concept, not the source. "Concept Handles" not "Scott Alexander's writing advice rule #8."
- **Titled as a phrase you can use in a sentence**: "Concept Handles" or "Microhumor" — something portable.
- **Genuinely reusable**: Would this idea connect to other sources in the garden?

**Check for existing ideas**: Read the `ideas/` directory first. If a concept already exists, *update* it rather than creating a duplicate.

Typical extraction count:
- Short essay: 2-4 ideas
- Long essay or talk: 3-6 ideas
- Book chapter: 3-5 ideas
- Whole book: 5-10 ideas (the most important ones)

### 3. Create or Update Idea Notes

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

Lead with the idea itself — what it is, why it matters, the key insight. The opening paragraph should make sense without knowing which source it came from.

A concept handle is a catchy, memorable phrase that crystallizes a complex idea into something people can manipulate, discuss, and apply. The term comes from Scott Alexander: when you figure out something interesting and compress it into someone's head, give it a name so they can remember it and use it to solve other problems.

## Why it matters

The difference between a vague insight and a usable tool is often just a name. "Antifragility" lets you point at a whole class of phenomena in two syllables. Without the handle, you'd need a paragraph every time.

## Connections

- Related to [Evergreen Notes](evergreen-notes.md) — both are about turning vague thinking into durable objects
- See also [Microhumor](microhumor.md) — another concept from the same source
```

**Writing rules for ideas:**
- **Source-agnostic tone**: The idea stands on its own. Thinkers are attributed inside the body, not in the title.
- **Lead with the concept**: First paragraph defines the idea without assuming the reader knows the source.
- **Densely linked**: Link to related ideas, link to source summaries where relevant.
- **If updating an existing idea**: Add the new source slug to `sources` in frontmatter. Add a new subsection with the new source's perspective. Don't remove existing content.

### 4. Update the Source Summary

After creating ideas, update the source's `summary.md`:

1. Add the concept slugs to the `ideas:` list in frontmatter
2. Add inline links from the summary body to the new idea files where natural

Example frontmatter update:
```yaml
ideas:
  - concept-handles
  - microhumor
  - tribal-signaling
```

Example inline link:
```markdown
The most valuable thing a writer can produce: [concept handles](../../ideas/concept-handles.md)
```

### 5. Generate Flashcards

Create individual flashcard files in `flashcards/` — one card per file:

```markdown
---
source: concept-handles
---

<details>
<summary>What is a "concept handle" and why does it matter for writing?</summary>

A concept handle is a catchy, memorable phrase that crystallizes a complex idea into something people can manipulate and discuss. It matters because the difference between a vague insight and a usable tool is often just a name — "antifragility" lets you point at a whole class of phenomena in two syllables.

See: [Concept Handles](../ideas/concept-handles.md)

</details>
```

**File naming**: Kebab-case slug of the question content: `what-is-concept-handle.md`, `four-forms-of-leverage.md`.

**Card counts**: 3-5 cards per run. Prioritize understanding over trivia.

**Card types** (test understanding, not recall):
- **Framework cards**: "What are the N forms/steps of X?" + "Why does the order matter?"
- **Why cards**: "Why does X matter?" — tests reasoning, not definition
- **Application cards**: "You're in situation Y. What principle applies?"
- **Connection cards**: "How does X relate to Y?" — tests cross-concept understanding
- **Anti-pattern cards**: "What goes wrong when you do X without Y?"

### 6. Cross-Link Existing Content

After creating new files, look for connections:

1. **Scan `ideas/`** for files that discuss related topics — add to `related:` in both directions
2. **Scan other source summaries** for mentions of the new concepts — consider adding inline links
3. **Update `maps/`** if the new ideas fit a thematic cluster

### 7. Verify

- Every new idea file has valid frontmatter with `title`, `sources`, `domains`, `related`
- Every new flashcard file has `source` in frontmatter
- The source's `summary.md` `ideas:` list matches the ideas created
- All markdown links resolve to real files
- Cross-references are bidirectional (if A relates to B, B relates to A)

## Re-running

This skill is designed to be run multiple times on the same source:

- **First run**: Extract the most prominent concepts (3-5)
- **Second run with hints**: "Now focus on X and Y" — add more specific concepts
- **Third run**: "Connect this to Z from a different source" — build cross-source links

Each run adds depth. Never remove existing content, only enrich.

## Link Format

Use relative markdown links. Link text must be human-readable titles, never slugs.

| From | To | Format |
|------|-----|--------|
| idea → idea | `[Title](other-idea.md)` |
| idea → source summary | `[Title](../sources/essays/slug/summary.md)` |
| flashcard → idea | `[Title](../ideas/slug.md)` |
| source summary → idea | `[Title](../../ideas/slug.md)` |

## Important

- **Human-readable link text** — always use the title, never the slug
- **No wikilinks** — always use standard markdown `[text](path.md)` links
- **Source files are immutable** — never modify `source.md`
- **Additive only** — never remove existing content, only enrich
- **Check for duplicates** — always scan `ideas/` before creating new ones
- **Bidirectional links** — if A relates to B, update both files
