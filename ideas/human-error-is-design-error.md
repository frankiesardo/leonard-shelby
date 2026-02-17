---
title: "Human Error Is Design Error"
aliases:
  - system error not human error
  - slips and mistakes
  - blame the design not the user
  - Swiss cheese model
  - root cause analysis
sources:
  - the-design-of-everyday-things
domains:
  - systems-thinking
  - management
  - product
related:
  - failure-as-investment
  - the-gulf-of-execution-and-evaluation
  - forcing-functions
  - conceptual-models
  - the-hidden-and-the-unseen
  - theory-of-constraints
---

# Human Error Is Design Error

When 75-95% of industrial accidents are attributed to "human error," the term is doing the work of hiding the real cause. If a machine malfunctioned at that rate, we would redesign the machine. We don't stop the root cause analysis when we find a broken part; we ask why the part broke. Yet when a human fails, the investigation stops. "Pilot error." "Operator error." "User error." Case closed.

Norman's taxonomy makes the problem precise. Slips are correct intentions with wrong execution: you meant to hit "Save" but hit "Delete" because the buttons are adjacent and identical (a description-similarity slip). You drove to work on autopilot instead of to the grocery store (a capture error). You set the alarm for 7 PM instead of 7 AM (a mode error). Slips happen more to experts than novices, because experts operate on autopilot. Mistakes are wrong intentions executed correctly: you cranked the thermostat to maximum because your conceptual model was wrong (a knowledge-based mistake). You followed the wrong procedure because the situation resembled a familiar one (a rule-based mistake).

Each error type has different design solutions. Slips require dissimilar controls, clear feedback, and undo capability. Mistakes require better conceptual models, clearer system state, and root cause analysis. Memory lapses require forcing functions, checklists, and interruption-resilient design. But the underlying principle is the same: the system should assume that humans will err (because they will), and design so that errors are either impossible, easily detected, or easily reversed.

James Reason's Swiss cheese model captures the structural truth: accidents require multiple failures to align, like holes in successive slices of cheese. No single human error should ever be able to cause catastrophe. When it can, the system has too few slices, too many holes, or holes that line up too easily. The fix is always structural: more redundancy, better feedback, fewer modes, clearer mappings -- not more training, not stricter discipline, not blame.

## Why it matters

"Blame and punish; blame and train" is the default response to human error everywhere -- factories, hospitals, aviation, software, daily life. It feels right because someone clearly did something wrong. But it doesn't fix anything. The same error will recur because the conditions that produced it haven't changed. Norman's framework shifts the question from "who screwed up?" to "what about this system made the screw-up likely?" That question leads to redesign. The other question leads to a replacement human who will make the same error.

The F-22 crash example is definitive. The Air Force blamed the pilot for "failure to recognize and initiate a timely dive recovery." The Inspector General asked: why didn't the investigation consider that the pilot was probably unconscious? The Air Force had found its human error and stopped digging. The real root cause -- possible oxygen deprivation -- was never addressed.

## Connections

- [Failure as Investment](failure-as-investment.md) -- Catmull's principle that the cost of preventing errors exceeds the cost of fixing them; Norman extends this: the real cost is in blaming people instead of redesigning systems
- [Theory of Constraints](theory-of-constraints.md) -- Goldratt's Five Whys parallel Norman's root cause analysis; both insist on finding the system constraint, not the person
- [Forcing Functions](forcing-functions.md) -- the strongest design response to human error: make the error physically impossible
- [The Hidden and the Unseen](the-hidden-and-the-unseen.md) -- leaders' blind spots create the conditions for errors they then blame on workers
- [Conceptual Models](conceptual-models.md) -- many mistakes stem from wrong conceptual models projected by bad design
- Discussed in [The Design of Everyday Things](../sources/books/the-design-of-everyday-things/summary.md)
