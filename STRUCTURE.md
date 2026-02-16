# Garden Structure

This document describes the conventions, file formats, and organization of the garden. It is intended to be read by both humans and AI agents.

## Directory layout

```
garden/
├── README.md              ← Vision and philosophy
├── STRUCTURE.md           ← This file. Conventions and formats.
├── sources/               ← Books, talks, articles, podcasts, essays
│   ├── books/
│   ├── talks/
│   ├── articles/
│   ├── podcasts/
│   └── essays/
├── ideas/                 ← Evergreen notes. Atomic concepts.
├── reflections/           ← Personal notes. Thinking out loud.
├── maps/                  ← Maps of Content. Thematic entry points.
└── inbox/                 ← Unprocessed captures.
```

## Note types

### Sources (`sources/`)

A source is a thing I consumed: a book, a talk, an article, a podcast episode. Sources are the *evidence base* — the raw material from which ideas are extracted.

**Filename convention:** `kebab-case-title.md`
Example: `sources/books/antifragile.md`

**Frontmatter:**

```yaml
---
title: "Antifragile: Things That Gain from Disorder"
author: "Nassim Nicholas Taleb"
type: book                    # book | talk | article | podcast | essay
tier: evergreen               # perennial | evergreen | seasonal | seedling
domains:                      # which intellectual domains this touches
  - systems-thinking
  - management
  - philosophy
status: read                  # read | reading | to-read | partially-read
date_consumed: 2023-06        # approximate, YYYY or YYYY-MM
ideas:                        # concept handles extracted from this source
  - antifragility
  - via-negativa
  - skin-in-the-game
  - barbell-strategy
  - lindy-effect
related_sources:              # other sources that pair well
  - the-new-normal-cognitect
  - the-black-swan
---
```

**Body:** Free-form. Can include a summary, key quotes, chapter notes, personal reactions. The frontmatter `ideas` list is the most important part — it's the bridge to the idea layer.

### Ideas (`ideas/`)

An idea is an atomic, reusable concept — what Scott Alexander calls a "concept handle" and Andy Matuschak calls an "evergreen note." Ideas are the *connective tissue* of the garden.

**Key properties of a good idea note:**
- **Atomic:** One idea per note. If you need "and" to describe it, split it.
- **Concept-oriented:** Named for the concept, not the source. "Antifragility" not "Chapter 3 of Antifragile."
- **Titled as a phrase you can use in a sentence.** "Antifragility" or "Systems that gain from disorder" — something you can slot into conversation or writing.
- **Densely linked:** To other ideas, to sources, to reflections.

**Filename convention:** `kebab-case-concept.md`
Example: `ideas/antifragility.md`

**Frontmatter:**

```yaml
---
title: "Antifragility"
aliases:                      # other ways to refer to this concept
  - antifragile
  - gains from disorder
sources:                      # where this idea comes from or is discussed
  - antifragile
  - the-new-normal-cognitect
domains:
  - systems-thinking
  - management
  - philosophy
related:                      # other idea notes that connect
  - resilience
  - hormesis
  - via-negativa
  - optionality
---
```

**Body:** A concise explanation of the concept in your own words. Why it matters. How it connects. Can be as short as two sentences or as long as needed. Should be written for *your future self* — not for publication, not for an audience.

### Reflections (`reflections/`)

Personal notes. Thinking out loud. Dated journal-like entries, essays-in-progress, or meditations on a theme. These are *your voice*, not summaries of other people's ideas.

**Filename convention:** `YYYY-MM-DD-slug.md` or `slug.md` for undated reflections.

**Frontmatter:**

```yaml
---
title: "On the relationship between stoicism and antifragility"
type: reflection
date: 2025-11-15
ideas:                        # ideas this reflection engages with
  - antifragility
  - stoicism
  - amor-fati
sources:                      # sources that prompted this reflection
  - antifragile
  - meditations
---
```

### Maps of Content (`maps/`)

A Map of Content (MOC) is a curated entry point into a cluster of related ideas and sources. Think of it as a table of contents for a theme — handwritten, opinionated, and narrative.

Maps answer the question: "If someone (or an agent) wanted to understand how I think about X, where should they start?"

**Filename convention:** `kebab-case-theme.md`
Example: `maps/stoicism-and-eastern-philosophy.md`

**Frontmatter:**

```yaml
---
title: "Stoicism & Eastern Philosophy"
description: "The quest to become a true person. How I connect Marcus Aurelius, Taoism, tai chi, and the Jungian journey."
domains:
  - philosophy
  - martial-arts
  - personal-development
---
```

**Body:** A narrative guide. Not just a list of links, but an opinionated walkthrough: "Start here, then read this, and notice how X connects to Y."

### Inbox (`inbox/`)

Unprocessed captures. URLs, rough notes, half-formed thoughts. The only rule: get it out of your head and into a file. Processing happens later.

**Filename convention:** Anything. `YYYY-MM-DD-whatever.md` is fine.

**Minimal frontmatter:**

```yaml
---
title: "Interesting article on embodied cognition"
source_url: "https://example.com/article"
captured: 2025-11-20
---
```

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
| `fiction` | Novels, dystopias, myths, narrative as a way of knowing |
| `martial-arts` | Tai chi, internal arts, embodied practice, discipline |
| `science` | Physics, biology, evolution, mathematics, computation |

This list will grow. Domains are a controlled vocabulary, not free-form tags — keep them stable and meaningful.

## Linking conventions

- **Source → Idea:** A source's frontmatter `ideas` field lists the concept handles extracted from it.
- **Idea → Source:** An idea's frontmatter `sources` field lists where it comes from.
- **Idea → Idea:** An idea's `related` field links to connected concepts. Also use inline `[links](../ideas/concept.md)` in the body.
- **Reflection → Idea/Source:** A reflection's frontmatter links to the ideas and sources it engages with.
- **Map → Everything:** Maps link narratively to ideas, sources, and reflections.
- **Inline links:** Use relative markdown links: `[Antifragility](../ideas/antifragility.md)`.

## Tier definitions

| Tier | Criteria | Typical sources |
|------|----------|----------------|
| `perennial` | Identity-level. Frameworks I think *through*. Revisited for years. Would recommend to anyone. Shapes how I see the world. | Core philosophy books, foundational CS/neuroscience texts, life-shaping biographies |
| `evergreen` | Well-integrated. Connects to many ideas. Has proven its value over time. I can recall key ideas without re-reading. | Strong non-fiction, influential essays, talks that changed my thinking |
| `seasonal` | Interesting and timely. Useful now. May become evergreen, or may naturally compost. No pressure either way. | Podcast episodes, articles, conference talks, books that were good but not transformative |
| `seedling` | Captured but unprocessed. Haven't read it yet, or read it but haven't extracted ideas. | Items in the inbox, to-read list, half-finished books |

**Promotion is natural, not forced.** A seasonal source becomes evergreen when you find yourself returning to it, quoting it, connecting its ideas to other things. Don't overthink the initial classification — you can always change it.

## For AI agents

If you are an AI agent working with this garden:

1. **Start with `maps/`** to understand thematic structure and the owner's intellectual priorities.
2. **Use `ideas/`** as the primary knowledge graph. These are the atomic units of the owner's thinking.
3. **Respect tiers.** When connecting new content to the garden, weight connections to `perennial` and `evergreen` sources more heavily. A new article that echoes a perennial idea is more notable than one that echoes a seasonal source.
4. **Extract concept handles** from new content. If the content introduces a genuinely new idea (not already in `ideas/`), propose it as a new evergreen note. If it reinforces or challenges an existing idea, note that.
5. **Preserve voice.** Reflections and idea notes are written in the owner's voice. When drafting, match the tone: concise, direct, bullet-point-friendly, with occasional dry humor. Avoid corporate speak. Avoid fluff.
6. **The inbox is sacred.** When in doubt, capture to `inbox/`. It's better to capture too much than to lose a thought.
