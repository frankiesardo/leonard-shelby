# `/reflect` — Socratic Review Skill

## Problem

The garden captures what sources say (summaries) but not what the owner thinks about them. The most valuable knowledge for an AI agent — positions, tensions, disagreements, open questions — is never recorded. Flashcards test recall; nothing tests understanding or pushes the owner to articulate their actual beliefs.

## Design

### What it does

`/reflect` is a Socratic dialogue skill for periodic review. The agent reads the garden, identifies interesting threads, and asks probing questions to surface the owner's thinking. The conversation is saved as a first-class artifact.

### Trigger

User runs `/reflect`. This is a periodic review activity — not tied to saving new sources.

### Flow

1. **Read the garden.** Agent scans maps, ideas, summaries, and existing conversations to understand the current state.

2. **Propose 2-3 threads.** The agent suggests threads to pull on, based on:
   - Tensions between sources the owner values (e.g., Taleb vs. Covey on planning)
   - Ideas that are well-linked but have no recorded owner position
   - High-tier sources whose summaries are mostly restating the author (no personal take)
   - Gaps — domains with few ideas or sources
   - Follow-ups from previous conversations (open questions left unresolved)
   - Or the owner brings their own topic.

3. **Socratic dialogue.** One question at a time. Questions are:
   - **Position-seeking:** "What do you actually believe about X?"
   - **Prioritizing:** "Is X more important to you than Y? Why?"
   - **Tension-finding:** "You value both A and B, but they seem to disagree on Z. How do you reconcile that?"
   - **Grounding:** "Why does this matter to you specifically? What decision or situation makes this relevant?"
   - **Challenging:** "What would change your mind about this?"
   - **Synthesizing:** "If you had to explain this to someone in 30 seconds, what would you say?"

4. **Save the conversation.** When it reaches a natural stopping point, save to `conversations/YYYY-MM-DD-on-{topic}.md`.

5. **Propose garden updates.** At the end, the agent suggests updates to other garden files — new ideas that crystallized, positions to add to existing idea files, new connections between sources. These are proposed, not applied. The owner approves or dismisses each one.

### What the agent does NOT do

- Summarize books back at the owner (they already did that)
- Give "right answers" or lecture
- Validate ("great point!") — it pushes, not praises
- Ask recall questions (that's what flashcards are for)
- Apply changes without approval

### Output: Conversation files

New directory: `conversations/`

```
garden/
├── conversations/
│   ├── 2026-02-16-on-planning.md
│   ├── 2026-02-20-on-meaning-and-suffering.md
│   └── ...
```

File format:

```markdown
---
title: "On planning vs. antifragility"
date: 2026-02-16
sources:
  - the-goal
  - the-7-habits-of-highly-effective-people
ideas:
  - antifragility
  - theory-of-constraints
---

## Thread

How do you reconcile Covey's "begin with the end in mind"
with Taleb's argument that planning is fragile?

## Dialogue

**Q:** You have both 7 Habits and Antifragile as high-tier
sources. Covey says plan rigorously. Taleb says plans are
fragile. What do you actually do?

**A:** ...

**Q:** ...

**A:** ...

## Positions

- Planning is useful for values and direction, harmful for
  tactics and timelines.
- ...

## Open questions

- Where does this break down for large organizations?
- ...

## Proposed garden updates

- [ ] Add position to `ideas/antifragility.md`: "Planning direction is antifragile; planning tactics is fragile"
- [ ] New idea: `ideas/directional-planning.md` — planning the what, not the how
- [ ] Add connection: `the-goal` <-> `the-7-habits` on constraint-based prioritization
```

### Selecting threads

The agent should prioritize threads that are:

1. **High-tension** — two perennial/evergreen sources that disagree on something
2. **Under-explored** — ideas with many source links but no conversation history
3. **Building on previous conversations** — open questions from past `/reflect` sessions
4. **Cross-domain** — connections between different intellectual domains (e.g., martial arts + management)

### Conversation style

- Direct, concise questions. No preamble.
- One question per turn. Wait for the answer.
- Build on what the owner says — don't cycle through a pre-made list.
- Push back when the answer is vague ("Can you be more specific?")
- Notice contradictions with things said earlier in the same conversation or in past conversations.
- 5-10 exchanges is a good length. Don't drag it out.

## Changes to CLAUDE.md

Add `conversations/` to the directory layout and document the format. Add to the "For AI agents" section.

## Changes to garden structure

- New directory: `conversations/`
- No changes to existing files or formats

## Implementation

1. Create `conversations/` directory
2. Create `skills/reflect/SKILL.md`
3. Update `CLAUDE.md` with conversations/ documentation
