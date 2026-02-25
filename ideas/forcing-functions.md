---
title: "Forcing Functions"
aliases:
  - interlock
  - lock-in
  - lockout
  - poka-yoke
  - error proofing
sources:
  - the-design-of-everyday-things
domains:
  - product
  - systems-thinking
  - management
related:
  - human-error-is-design-error
  - affordances-and-signifiers
  - knowledge-in-the-world
  - the-gulf-of-execution-and-evaluation
  - conceptual-models
  - ulysses-contracts
  - lowering-the-courage-threshold
---

# Forcing Functions

A forcing function is a physical constraint that prevents the next step from happening unless the current step is done correctly. It is the strongest form of error prevention because it doesn't rely on attention, memory, or training -- it makes the wrong action physically impossible.

Norman identifies three types. Interlocks force operations to occur in proper sequence: a microwave won't run with the door open; an automatic transmission won't leave Park unless the brake is depressed. Lock-ins keep an operation active until complete: the "save before closing?" dialog prevents you from losing work; a bathroom shelf blocks the stall door so you can't leave without your bag. Lockouts prevent entry to dangerous states: a fire stairway gate prevents panicked people from descending past the ground floor into the basement; child-proof caps prevent access to medications.

The Japanese manufacturing concept of poka-yoke (error proofing), developed by Shigeo Shingo for the Toyota Production System, extends this philosophy through simple physical devices -- jigs, guides, asymmetrical screw holes -- that make assembly errors impossible. The ATM that returns your card before dispensing cash is poka-yoke: it forces the high-risk step (remembering the card) before delivering the goal (getting the money). The principle is: if you can build the constraint into the object, you don't need to build the knowledge into the person.

## Why it matters

Every system that relies on human vigilance to prevent catastrophe is a system waiting to fail. Forcing functions are the mature response to this truth. They don't eliminate human error -- they make it irrelevant at the critical junction. The cost is sometimes inconvenience: forcing functions can feel heavy-handed, and people will try to disable them (tying down dead man's switches, propping open fire doors). The design challenge is to make the forcing function's benefit obvious enough that people tolerate the friction, or subtle enough that they don't notice it.

The ATM card-before-cash design is the archetype. Nobody experiences it as a constraint. Nobody tries to defeat it. It simply redirects the natural sequence so that the error (walking away without the card) becomes impossible. That's the gold standard: a forcing function so well integrated into the flow that it feels like the obvious way to do things.

## Connections

- [Human Error Is Design Error](human-error-is-design-error.md) -- forcing functions are the design response to the fact that humans will always err
- [Knowledge in the World](knowledge-in-the-world.md) -- forcing functions are the extreme case: not just putting knowledge in the world, but building the correct behavior into the physical structure
- [Affordances and Signifiers](affordances-and-signifiers.md) -- forcing functions use physical constraints to eliminate wrong affordances
- Toyota's *jidoka* philosophy -- "automation with a human touch" -- is the organizational-scale version: workers stop the entire assembly line (pull the *andon* cord) when they detect an error, treating the line stop as a forcing function against shipping defects
- [Ulysses Contracts](ulysses-contracts.md) are the self-imposed cousin: you design a forcing function for your own future self, binding a rational present to an irrational future
- Discussed in [The Design of Everyday Things](../sources/books/the-design-of-everyday-things/summary.md)
