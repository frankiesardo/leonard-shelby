---
title: "Bottleneck"
aliases:
  - bottleneck resource
  - constraint resource
  - system bottleneck
sources:
  - the-goal
domains:
  - systems-thinking
  - management
  - product
related:
  - theory-of-constraints
  - the-five-focusing-steps
  - throughput-accounting
  - non-bottleneck-utilization
  - drum-buffer-rope
  - concentration-of-wealth
  - dependent-events-and-statistical-fluctuations
---

# Bottleneck

Any resource whose capacity is equal to or less than the demand placed upon it. The bottleneck determines the throughput of the entire system, regardless of how much excess capacity exists everywhere else.

Goldratt's most famous formulation: **an hour lost on a bottleneck is an hour lost for the entire system.** If a bottleneck machine sits idle during a lunch break, the entire plant's output drops by whatever that machine would have produced. Conversely, an hour saved on a non-bottleneck is a mirage — it creates no additional throughput, only additional inventory.

This has radical implications for management. The bottleneck should never be idle. Quality inspection should happen *before* the bottleneck, not after — processing a defective part through the bottleneck wastes irreplaceable capacity. Setup times on the bottleneck should be minimized ruthlessly, even if it means larger setups elsewhere. Workers at the bottleneck should be covered during breaks. Every minute of bottleneck time should produce something the system actually needs.

## Why it matters

Managers instinctively treat all resources as equally important. They spread improvement efforts evenly, celebrate when any department hits its targets, and use local efficiency as the universal metric. But in a system with dependent events, only the bottleneck's efficiency matters for throughput. Everything else is either feeding the bottleneck or consuming its output.

In Alex Rogo's plant, the NCX-10 machine and the heat-treat oven were the bottlenecks. Mountains of inventory piled up in front of them while the rest of the plant reported high efficiency numbers. The plant was "efficient" everywhere except where it mattered.

The concept extends far beyond manufacturing. In software development, the bottleneck might be code review, or deployment, or a single architect who must approve all designs. In hospitals, it's the resource (OR time, specialist availability, bed capacity) that limits patient throughput. Finding and managing the bottleneck is the first step of improvement in any system.

## Connections

- Central concept of the [Theory of Constraints](theory-of-constraints.md)
- The [Five Focusing Steps](the-five-focusing-steps.md) begin with identifying the bottleneck
- [Non-Bottleneck Utilization](non-bottleneck-utilization.md) must be subordinated to the bottleneck's pace
- [Drum-Buffer-Rope](drum-buffer-rope.md) synchronizes the system around the bottleneck
- Discussed in [The Goal](../sources/books/the-goal/summary.md)
