# Garden Structure

This document describes the conventions, file formats, and organization of the garden. It is intended to be read by both humans and AI agents.

## Directory layout

```
garden/
├── README.md                          ← Vision and philosophy
├── STRUCTURE.md                       ← This file. Conventions and formats.
├── sources/                           ← Books, essays, transcripts
│   ├── books/
│   │   └── {book-slug}/              ← One folder per book
│   │       ├── summary.md            ← Entry point. Metadata + synthesis.
│   │       ├── source.md             ← Full text / reading notes (optional)
│   │       ├── ch01-{slug}.md        ← Chapter-level notes (for books)
│   │       ├── ch02-{slug}.md
│   │       └── ...
│   ├── essays/
│   │   └── {essay-slug}/
│   │       ├── summary.md
│   │       └── source.md
│   └── transcripts/
│       └── {transcript-slug}/
│           ├── summary.md
│           └── source.md
├── ideas/                             ← Evergreen notes. Atomic concept handles.
├── flashcards/                        ← Spaced repetition cards.
├── notes/                             ← Personal journal, reflections, quick captures.
└── maps/                              ← Maps of Content. Thematic entry points.
```

## Naming conventions

- All files and folders use **kebab-case**: `nonfiction-writing-advice`, `the-goal`, `ch03-bottlenecks`.
- Source folders are named for the source, not the author: `sapiens/` not `harari-sapiens/`.
- Chapter files are prefixed with `ch{NN}-`: `ch01-cognitive-revolution.md`.

## Note types

### Sources (`sources/`)

A source is a thing I consumed: a book, an essay, a transcript (talk, podcast, video). Each source lives in its own folder under the appropriate category.

**Categories:**
- `books/` — Books and long-form non-fiction.
- `essays/` — Articles, blog posts, short written pieces.
- `transcripts/` — Talks, podcasts, YouTube videos, interviews.

**Folder structure:**

Every source folder contains at least a `summary.md`. Richer sources also contain:
- `source.md` — The full text, transcript, or detailed reading notes.
- `ch{NN}-{slug}.md` — Chapter-level notes (primarily for books).

**`summary.md` is the entry point.** It contains all metadata and a synthesis of the source. An agent or human should be able to read just the summary and understand what the source contributes to the garden.

**Summary frontmatter:**

```yaml
---
title: "Nonfiction Writing Advice"
author: "Scott Alexander"
type: essay                    # book | essay | transcript
tier: evergreen                # perennial | evergreen | seasonal
domains:                       # which intellectual domains this touches
  - writing
  - communication
status: read                   # read | reading | to-read | partially-read
date_consumed: 2024            # approximate, YYYY or YYYY-MM
url: "https://..."             # original URL (for essays and transcripts)
ideas:                         # concept handles extracted from this source
  - concept-handles
  - microhumor
---
```

**Summary body:** A concise synthesis in your own words. Key ideas as bullet points. Key quotes. Connections to other sources and ideas. This is not a book report — it's a distillation of what matters and why.

### Ideas (`ideas/`)

An idea is an atomic, reusable concept — what Scott Alexander calls a "concept handle" and Andy Matuschak calls an "evergreen note." Ideas are the *connective tissue* of the garden.

**Key properties of a good idea note:**
- **Atomic:** One idea per note. If you need "and" to describe it, split it.
- **Concept-oriented:** Named for the concept, not the source. "Antifragility" not "Chapter 3 of Antifragile."
- **Titled as a phrase you can use in a sentence.** "Antifragility" or "Systems that gain from disorder" — something you can slot into conversation or writing.
- **Densely linked:** To other ideas, to sources, to notes.

**Filename convention:** `kebab-case-concept.md`
Example: `ideas/antifragility.md`

**Frontmatter:**

```yaml
---
title: "Antifragility"
aliases:                       # other ways to refer to this concept
  - antifragile
  - gains from disorder
sources:                       # where this idea comes from or is discussed
  - antifragile
  - the-new-normal-cognitect
domains:
  - systems-thinking
  - management
  - philosophy
related:                       # other idea notes that connect
  - resilience
  - hormesis
  - via-negativa
  - optionality
---
```

**Body:** A concise explanation of the concept in your own words. Why it matters. How it connects. Should be written for *your future self* — not for publication, not for an audience.

### Notes (`notes/`)

Personal notes. Quick captures, journal entries, thinking out loud. This is the primary inbox for anything that doesn't yet have a home, as well as the place for deeper reflections.

**Daily journal entries:** Append to `notes/YYYY-MM-DD.md`. A running log for a given day — quick thoughts, quotes, reactions to what you're reading.

**Standalone reflections:** `notes/on-{topic}.md` for longer, undated personal essays.

**Frontmatter (optional for quick captures):**

```yaml
---
title: "On the relationship between stoicism and antifragility"
date: 2026-02-16
sources:
  - antifragile
  - meditations
---
```

### Flashcards (`flashcards/`)

Spaced repetition cards extracted from sources and ideas. Format TBD — will be generated by the `/connect` skill.

### Maps of Content (`maps/`)

A Map of Content (MOC) is a curated entry point into a cluster of related ideas and sources. Think of it as a table of contents for a theme — handwritten, opinionated, and narrative.

Maps answer the question: "If someone (or an agent) wanted to understand how I think about X, where should they start?"

**Filename convention:** `kebab-case-theme.md`

**Frontmatter:**

```yaml
---
title: "Stoicism & Eastern Philosophy"
description: "The quest to become a true person."
domains:
  - philosophy
  - martial-arts
  - personal-development
---
```

**Body:** A narrative guide. Not just a list of links, but an opinionated walkthrough.

## Domains

Domains are cross-cutting tags that identify intellectual territory. They're used in frontmatter across all note types. The current domain vocabulary:

| Domain | What it covers |
|--------|---------------|
| `philosophy` | Stoicism, ethics, meaning, existentialism, Taoism |
| `cognitive-science` | How minds work, perception, embodied cognition, neuroscience |
| `systems-thinking` | Complex systems, emergence, feedback loops, antifragility |
| `management` | Leadership, teams, org design, candor, culture |
| `product` | Startups, product thinking, lean methodology, building things |
| `history` | Long arcs, civilizations, what explains the present |
| `personal-development` | Habits, motivation, self-improvement, the inner game |
| `writing` | Craft of writing, communication, rhetoric, storytelling |
| `communication` | Persuasion, public speaking, tribal signals |
| `fiction` | Novels, dystopias, myths, narrative as a way of knowing |
| `martial-arts` | Tai chi, internal arts, embodied practice, discipline |
| `science` | Physics, biology, evolution, mathematics, computation |
| `knowledge-management` | Note-taking, evergreen notes, zettelkasten, thinking tools |

This list will grow. Domains are a controlled vocabulary, not free-form tags — keep them stable and meaningful.

## Tier definitions

| Tier | Criteria | Typical sources |
|------|----------|----------------|
| `perennial` | Identity-level. Frameworks I think *through*. Revisited for years. Would recommend to anyone. Shapes how I see the world. | Core philosophy books, foundational CS/neuroscience texts, life-shaping biographies |
| `evergreen` | Well-integrated. Connects to many ideas. Has proven its value over time. I can recall key ideas without re-reading. | Strong non-fiction, influential essays, talks that changed my thinking |
| `seasonal` | Interesting and timely. Useful now. May become evergreen, or may naturally compost. No pressure either way. | Podcast episodes, articles, conference talks, books that were good but not transformative |

**Promotion is natural, not forced.** A seasonal source becomes evergreen when you find yourself returning to it, quoting it, connecting its ideas to other things. Don't overthink the initial classification — you can always change it.

**New sources start without a tier.** A source only receives a tier once it has been processed with at least a `summary.md`. Unprocessed captures live in `notes/`.

## Linking conventions

- **Source → Idea:** A source's `summary.md` frontmatter `ideas` field lists the concept handles extracted from it. Body text links to idea files.
- **Idea → Source:** An idea's frontmatter `sources` field lists where it comes from.
- **Idea → Idea:** An idea's `related` field links to connected concepts. Also use inline links in the body.
- **Source → Source:** Use inline relative links between source summaries.
- **Note → Anything:** Notes can link freely to ideas, sources, and other notes using `@source-slug` references or inline markdown links.
- **Map → Everything:** Maps link narratively to ideas, sources, and notes.
- **Inline links:** Use relative markdown links: `[Antifragility](../ideas/antifragility.md)`.

## For AI agents

If you are an AI agent working with this garden:

1. **Start with `maps/`** to understand thematic structure and the owner's intellectual priorities.
2. **Use `ideas/`** as the primary knowledge graph. These are the atomic units of the owner's thinking.
3. **Use `summary.md`** as the entry point for any source. Read the summary before diving into chapter notes or source text.
4. **Respect tiers.** When connecting new content to the garden, weight connections to `perennial` and `evergreen` sources more heavily. A new article that echoes a perennial idea is more notable than one that echoes a seasonal source.
5. **Extract concept handles** from new content. If the content introduces a genuinely new idea (not already in `ideas/`), propose it as a new evergreen note. If it reinforces or challenges an existing idea, note that.
6. **Preserve voice.** Notes and idea files are written in the owner's voice. When drafting, match the tone: concise, direct, bullet-point-friendly, with occasional dry humor. Avoid corporate speak. Avoid fluff.
7. **When in doubt, capture to `notes/`.** Append to today's journal entry. It's better to capture too much than to lose a thought.
