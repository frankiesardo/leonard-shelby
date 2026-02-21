---
title: "Latent Demand"
aliases:
  - product misuse as signal
  - observe the abuse
  - demand you didn't design for
sources:
  - after-coding-is-solved-boris-cherny
domains:
  - product
  - systems-thinking
related:
  - painkillers-not-vitamins
  - lateral-thinking-with-withered-technology
  - the-bitter-lesson
  - the-whole-customer-journey
  - protect-the-new
  - beginners-mind
  - weird-wins
---

# Latent Demand

When people misuse your product to do something it wasn't designed for, that's the strongest possible signal for what to build next. Not surveys, not roadmaps, not competitor analysis — watching people jump through hoops to bend your tool to their actual need.

Boris Cherny calls this the "single most important principle in product." His examples: 40% of posts in Facebook Groups were people buying and selling things — nobody designed Groups for commerce, but people figured it out because the need was that strong. Facebook Marketplace was the obvious next step. 60% of Facebook profile views were non-friends of opposite gender checking each other out — Facebook Dating. People were using Claude Code (a terminal-based coding agent) to analyze genomes, recover corrupted wedding photos, and grow tomatoes — Cowork, the non-technical agent product, was the obvious response.

The modern twist is applying latent demand to the *model* itself, not just the user. Instead of asking "what is the user trying to do?", ask "what is the model trying to do?" In research, they call it being "on distribution." Claude Code was designed with minimal scaffolding — the product *is* the model, with the thinnest possible wrapper. This lets you observe the model's natural tendencies and build affordances for them, rather than boxing the model into a predetermined workflow.

## Why it matters

Most product development works forward from the builder's vision: here's what we think you need, here's the solution we designed. Latent demand works backward from observed behavior: here's what you're *already doing despite us*, let's make that easier. The second approach has a dramatically higher hit rate because the demand is pre-validated — people are already paying the cost (in friction, workarounds, creative misuse) to get what they want.

This is why Boris recommends shipping early and rough. You can't discover latent demand in a planning document. You discover it by putting something in the world and watching what happens. Claude Code wasn't immediately a hit when it launched — it took months for people to figure out what it was for. But the data scientists opening terminals, the non-engineers installing Node.js — those signals told the team where to go next.

## Connections

- Produces [Painkillers Not Vitamins](painkillers-not-vitamins.md) — latent demand is the discovery mechanism for painkillers. If people are abusing your product to solve a problem, that problem is a painkiller, not a vitamin
- Related to [Lateral Thinking with Withered Technology](lateral-thinking-with-withered-technology.md) — Yokoi found novel applications for commodity tech; latent demand finds novel applications that users discovered for you
- Informed by [The Bitter Lesson](the-bitter-lesson.md) — if you stop boxing the model in, you discover its latent capabilities, which reveals latent user demand
- Connects to [Protect the New](protect-the-new.md) — latent demand often surfaces as something that looks wrong ("people are abusing groups!") and requires the organizational willingness to see signal rather than violation
- [Beginner's Mind](beginners-mind.md) — you can only see latent demand if you're open to uses you didn't intend
- Discussed in [What Happens After Coding Is Solved](../sources/transcripts/after-coding-is-solved-boris-cherny/summary.md)
