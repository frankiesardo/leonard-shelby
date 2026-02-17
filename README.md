# The Garden

A digital garden for deep thinking. Not a blog. Not a wiki. A living structure where ideas take root, connect, and grow over time.

## Why this exists

I read widely — philosophy, cognitive science, management, history, fiction — and I've noticed that the most powerful moments in my intellectual life happen when ideas from different domains collide. Antifragility meets stoicism. Lakoff's embodied cognition meets tai chi. The hero's journey meets startup building. These collisions don't happen by accident; they happen when you give ideas a place to live and bump into each other.

Most note-taking systems fail me in one of two ways: either everything is flat (and a foundational book drowns alongside an article of the week), or the system demands so much structure that I stop using it. This garden is designed to solve both problems.

## Core principles

**1. Not all knowledge is equally load-bearing.**
Marcus Aurelius' Meditations is not the same kind of object as a podcast episode, even if they share an insight about resilience. The directory structure encodes this: books are deeply processed, essays and transcripts are lighter, bookmarks are captures. Foundational ideas maintain their gravitational pull without excluding fresh thinking.

**2. Sources and ideas are separate layers.**
A book is a *source*. "Antifragility" is an *idea*. Sources are deeply processed in their own folders — summaries, chapter notes, mind maps. Ideas are atomic, free-floating, and connect to each other as peers regardless of origin. The ideas form the web; the sources form the root system.

**3. The garden is readable by both humans and machines.**
Every note uses plain Markdown with YAML frontmatter. No proprietary format. No lock-in. This is deliberate: I want to be able to converse with an AI agent that is *grounded* in this garden — that knows my foundations, understands my vocabulary, and can help me think from a shared vantage point. Feed it a new article, and it should be able to say: "This connects to your thinking on X, and it challenges what you took from Y."

**4. Two passes: deep extraction, then cross-pollination.**
First pass: process a source deeply. Extract everything interesting into its own folder — summary, chapter notes, key quotes, mind maps. This is about understanding *one thing* thoroughly. Second pass: extract atomic concept handles into `/ideas/` and connect them across sources. This is where the magic happens — where ideas from different books and talks meet for the first time.

**5. Simplicity is a feature.**
Plain markdown. Git. A directory structure you can hold in your head. Complexity can be layered on top (build steps, viewers, SRS) but the foundation must remain something you can edit with any text editor and navigate with `ls` and `grep`.

## What's in the garden

See [AGENTS.md](AGENTS.md) for the full layout. The short version:

```
sources/       → Books, essays, transcripts, bookmarks. Each in its own folder with summary, source text, and optional part-level notes.
ideas/         → Evergreen notes. Atomic concept handles. The connective tissue.
notes/         → Personal journal and reflections. Quick captures and deeper thinking.
flashcards/    → Spaced repetition cards extracted from sources and ideas.
maps/          → Thematic indexes. Curated entry points into clusters of ideas.
```

## My intellectual roots

This garden didn't start from nothing. These are the domains that form my foundation — where I think most naturally and where new ideas tend to get anchored:

- **Stoicism & Eastern philosophy** — The quest to become a true person. Cutting through noise. I studied tai chi and martial arts for years; the parallels between stoicism, Taoism, and the Jungian journey are central to how I see the world.
- **Cognitive science & how minds work** — Minsky's Society of Mind, Lakoff's embodied cognition, Dawkins' selfish gene. How thinking actually works, not how we wish it worked.
- **Building things & leading people** — Engineering management, startups, product thinking. How small teams create outsized impact. Why candor matters. Why systems beat goals.
- **History & the long arc** — Sapiens, Guns Germs and Steel, Lessons of History. Where we came from, why things are the way they are, where we might be going.
- **Writing & communication** — I think in bullet points and aspire to write in short, incisive prose. The craft of making ideas transmissible.
- **Fiction that reframes reality** — Dystopias, myths, stories that make you see the world differently.

## The long-term vision

Today this is a GitHub repo of markdown files. Tomorrow it might power:

- **Conversational exploration** — An AI agent grounded in this garden that can discuss new ideas from my existing vantage point, find novel connections, and challenge my thinking.
- **Spaced repetition** — Flashcards generated from concept handles and key ideas, so foundational knowledge stays accessible.
- **Content creation** — The garden as a launchpad for writing, speaking, and sharing — including letting an agent draft posts grounded in ideas I actually hold.
- **Visual exploration** — A graph view or map view to see clusters, gaps, and unexpected bridges between domains.

But those are layers on top. The foundation is just markdown, links, and clear structure.

## How to use this garden

**As a human:** Browse `maps/` for thematic entry points. Open any source's `summary.md` for a quick overview. Explore `ideas/` for atomic concepts. Follow the links.

**As an agent:** Read `AGENTS.md` for conventions. Parse YAML frontmatter for metadata. Use `maps/` as high-level context. Use `ideas/` as the primary knowledge graph. Weight connections by source type (books > essays/transcripts > bookmarks). Start with `summary.md` inside any source folder for the entry point.

---

*"The impediment to action advances action. What stands in the way becomes the way." — Marcus Aurelius*
