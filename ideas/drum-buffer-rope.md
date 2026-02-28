---
title: "Drum-Buffer-Rope"
aliases:
  - DBR
  - drum buffer rope
  - bottleneck scheduling
sources:
  - the-goal
domains:
  - systems-thinking
  - management
  - product
related:
  - theory-of-constraints
  - bottleneck
  - the-five-focusing-steps
  - non-bottleneck-utilization
  - dependent-events-and-statistical-fluctuations
  - single-threaded-ownership
---

# Drum-Buffer-Rope

A production scheduling method that synchronizes an entire system around its constraint. Three components:

**Drum**: the bottleneck sets the pace for the entire system, like a drummer in a parade. Nothing in the system should produce faster than the constraint can consume. The constraint's schedule *is* the master schedule.

**Buffer**: a time buffer of work-in-process sits in front of the constraint to protect it from starvation. Not a large buffer — in Rogo's plant, about three days' worth. Enough to absorb the normal accumulation of statistical fluctuations from upstream operations. The buffer is measured in time, not quantity, because the goal is to ensure the bottleneck always has something to work on.

**Rope**: material is released into the system only at the rate the constraint can process it — tied, as if by a rope, to the constraint's consumption. This prevents excess inventory from flooding the floor. In the Boy Scout analogy, the rope ties the front of the line to Herbie, preventing the kids up front from getting too far ahead.

The innovation in Rogo's plant: Ralph Nakamura realized he could predict when the bottleneck would need each batch by tracking queue lengths and average processing times. By adding the two-week transit time from raw material release to bottleneck arrival, he could schedule material releases precisely. The same logic, extended, let him schedule non-bottleneck material releases too — timed so parts from both bottleneck and non-bottleneck routes would arrive at assembly simultaneously.

## Why it matters

Without DBR, material is released whenever it's available and workers produce whenever they can. This feels efficient but creates chaos: mountains of inventory at the bottleneck, shortages at assembly (because non-bottleneck parts were consumed making things nobody ordered yet), and constant expediting.

With DBR, the system self-regulates. Non-bottlenecks sometimes sit idle — and that's correct. Inventory stays low and predictable. Parts arrive at assembly when they're needed, not months before. Lead times become reliable enough to quote to customers, which is how Rogo's plant went from 58 days overdue on its worst order to shipping everything on time.

The concept generalizes. In software, this is the principle behind limiting work-in-progress: don't start new work until the constraint (testing, deployment, code review) can absorb it. In project management, it's the reason resource-loaded schedules fail — they ignore the constraint and let statistical fluctuations compound.

## Connections

- Implements step 3 (subordination) of the [Five Focusing Steps](the-five-focusing-steps.md)
- Requires identifying the [Bottleneck](bottleneck.md) first
- Measured through [Throughput Accounting](throughput-accounting.md)
- Prevents the damage from [Dependent Events and Statistical Fluctuations](dependent-events-and-statistical-fluctuations.md)
- Enforces correct [Non-Bottleneck Utilization](non-bottleneck-utilization.md)
- Discussed in [The Goal](../sources/books/the-goal/summary.md)
