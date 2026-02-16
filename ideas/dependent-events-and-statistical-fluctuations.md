---
title: "Dependent Events and Statistical Fluctuations"
aliases:
  - dependent events
  - statistical fluctuations
  - fluctuations in a chain
  - the Boy Scout hike
sources:
  - the-goal
domains:
  - systems-thinking
  - science
related:
  - theory-of-constraints
  - bottleneck
  - non-bottleneck-utilization
  - drum-buffer-rope
---

# Dependent Events and Statistical Fluctuations

Two phenomena that, in combination, explain why balanced systems don't work and why inventory accumulates while throughput falls. Individually mundane. Together, devastating.

**Dependent events**: one operation must complete before the next can begin. Parts flow through a sequence of steps. The second step can't start until the first finishes. Nothing controversial here.

**Statistical fluctuations**: actual performance varies around an average. A worker averages 25 parts per hour but might produce 22 one hour and 28 the next. Also unremarkable on its own — fluctuations average out over time.

The insight: when these two phenomena combine, the fluctuations do *not* average out. Slower-than-average performance accumulates downstream through the chain of dependent events. Faster-than-average performance cannot propagate forward, because each step is limited by the output of the step before it. The result: inventory grows between steps, and the throughput of the whole system falls below the average capacity of its components.

## The Boy Scout hike

Goldratt's most memorable illustration. Alex Rogo leads a troop of scouts on a single-file hike. Each boy walks at roughly the same average speed, but their actual pace fluctuates. The line should stay compact — the fluctuations should average out.

Instead, the line stretches relentlessly. A boy near the front slows briefly to adjust his pack — a gap of twenty feet opens. The boys behind him can't make up the gap by going faster, because they're limited by whoever is in front of them. But they can fall further behind at any time. The slowdowns accumulate. The speedups are capped. After an hour, Ron at the front is half a mile ahead of Alex at the back, and fat Herbie is killing himself trying to keep up.

Alex realizes: the length of the line is inventory. His own walking speed (the last in the chain) is throughput. And both are getting worse, despite everyone walking at roughly the same average pace.

The solution: put Herbie at the front of the line. Now the slowest element sets the pace for everything downstream. The line stays compact. Then lighten Herbie's load (unpack his heavy items and distribute them) — the whole system speeds up.

## Why it matters

This is the fundamental reason a "balanced plant" — one where every resource has exactly the capacity to meet demand — will fail. In a balanced system, every resource is a potential bottleneck, and the statistical fluctuations at each stage compound through the chain. Inventory explodes, throughput collapses, and operating expense climbs as everyone hurries to catch up.

The counterintuitive conclusion: you *want* excess capacity at most resources. The only resource that should be fully utilized is the bottleneck. Everything else should have slack — not because slack is wasteful, but because slack is what prevents the accumulation of fluctuations from destroying throughput.

## Connections

- The foundational mechanism behind the [Theory of Constraints](theory-of-constraints.md)
- Explains why [Bottleneck](bottleneck.md) identification is the first step of improvement
- Demonstrates why [Non-Bottleneck Utilization](non-bottleneck-utilization.md) at 100% is destructive
- [Drum-Buffer-Rope](drum-buffer-rope.md) is the practical solution to managing these effects
- Discussed in [The Goal](../sources/books/the-goal/summary.md)
