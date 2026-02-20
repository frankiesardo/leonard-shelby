---
title: "The Bitter Lesson"
aliases:
  - Sutton's bitter lesson
  - bet on the general model
  - generality over scaffolding
sources:
  - after-coding-is-solved-boris-cherny
domains:
  - systems-thinking
  - product
  - science
related:
  - good-explanations
  - static-vs-dynamic-societies
  - the-jump-to-universality
  - lateral-thinking-with-withered-technology
  - universal-explainers
  - latent-demand
---

# The Bitter Lesson

Rich Sutton's 2019 observation, drawn from 70 years of AI research: **the more general method, powered by computation, always eventually beats the more specific, human-engineered approach.** Every time researchers tried to hard-code human knowledge into AI systems — chess heuristics, hand-crafted features for speech recognition, grammar rules for language — the approach worked for a while, then got demolished by simpler methods that could scale with more compute. The "bitter" part is that researchers keep making the same mistake, investing years in clever domain-specific solutions that a brute-force general method renders obsolete.

Boris Cherny adopted this as the core product philosophy for Claude Code. The practical corollary: don't scaffold, don't fine-tune, don't orchestrate. Don't put the model in a box with strict step-1-step-2-step-3 workflows. Give it tools, give it a goal, and let it figure out the path. Scaffolding might improve performance 10-20%, but the next model generation wipes those gains out. The winning strategy is to bet on the more general model and build your product for the model six months from now, not the model of today.

## Why it matters

The bitter lesson is not just about AI. It's a meta-principle about the relationship between generality and power. Deutsch makes a parallel argument in physics: [good explanations](good-explanations.md) are distinguished by their *reach* — the most powerful theories are the most general ones, and attempts to limit their scope are always eventually wrong. Newton's laws weren't "the rules for planets" — they were universal laws that happened to be discovered through planetary observation.

The temptation to specialize, to add domain knowledge, to scaffold, is always strong because it produces faster short-term results. The bitter lesson says this is always a local maximum. The global maximum belongs to the general method with more resources. In product terms: don't build features that compensate for the model's current weaknesses. Those weaknesses are temporary. Build the product that assumes the model will be dramatically more capable soon, and you'll be ready when it arrives — even if the product feels underwhelming today.

## Connections

- The AI-specific expression of [Good Explanations](good-explanations.md) — reach and generality as the hallmarks of power
- [Static vs. Dynamic Societies](static-vs-dynamic-societies.md) — static societies bet on preserving specific knowledge; dynamic societies bet on general-purpose knowledge creation. The bitter lesson is the AI version of this distinction
- [Universal Explainers](universal-explainers.md) — humans (and increasingly models) are universal explainers; trying to constrain them to narrow domains always underperforms
- [The Jump to Universality](the-jump-to-universality.md) — the moment a system crosses the threshold to generality, all the specific competitors become irrelevant
- The inverse of [Lateral Thinking with Withered Technology](lateral-thinking-with-withered-technology.md) — Yokoi bet on creative application of old tech; the bitter lesson says the general new tech will eventually win regardless. Both are right at different timescales
- Informs [Latent Demand](latent-demand.md) — if you stop boxing the model in, you discover what it's *trying* to do
- Discussed in [What Happens After Coding Is Solved](../sources/transcripts/after-coding-is-solved-boris-cherny/summary.md)

