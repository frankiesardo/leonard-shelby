---
title: "Conceptual Models"
aliases:
  - mental model
  - folk theory
  - the thermostat model
sources:
  - the-design-of-everyday-things
domains:
  - cognitive-science
  - product
  - communication
related:
  - the-brain-as-model-maker
  - affordances-and-signifiers
  - the-gulf-of-execution-and-evaluation
  - knowledge-in-the-world
  - mental-models-for-uncertainty
  - the-hidden-and-the-unseen
---

# Conceptual Models

A conceptual model is the story a person constructs to explain how something works. It is always simplified, often wrong, and absolutely unavoidable -- people cannot interact with anything without forming one. Norman's thermostat example is definitive: most people believe a thermostat is a valve (turn it up and more heat flows out), when it is actually a switch (it's either fully on or fully off, and cranking it to maximum just means it stays on longer, overshooting the desired temperature). The design gives no information to correct the wrong model, so people waste energy and freeze or roast.

Three conceptual models are always in play: the design model (how the designer intended it to work), the user's model (how the user thinks it works), and the system image (what the product actually communicates through its appearance, behavior, feedback, and documentation). The designer's job is to make the system image project the correct model. The designer never communicates directly with the user -- the product is the only channel. If the system image is ambiguous or misleading, the user's model will be wrong, no matter how elegant the underlying design.

This is not a flaw in human cognition. It is the same model-building instinct that lets us navigate the world without understanding physics. We form models from fragmentary evidence, we fill gaps with assumptions, and we hold our models with more confidence than they deserve. Good design leverages this tendency by projecting coherent, accurate models. Bad design lets people construct whatever story their experience and imagination supply.

## Why it matters

Every product, every interface, every process is teaching its users a conceptual model whether it intends to or not. The question is never "should we give users a model?" -- they'll build one regardless. The question is "does our design project the right model?" The thermostat that shows its current temperature, target temperature, and whether it's heating or cooling (Norman cites the Nest thermostat) gives users the information to construct an accurate model. The old thermostat with a single unlabeled dial gives them nothing, so they invent the valve theory.

This principle extends beyond products. Any system that is opaque to its users -- an organization, a codebase, a tax code -- will generate folk theories. Some of those folk theories will be dangerously wrong. The fix is the same: make the system image legible.

## Connections

- [The Brain as Model-Maker](the-brain-as-model-maker.md) -- the underlying cognitive architecture; we model everything, always, from fragmentary evidence
- [The Hidden and the Unseen](the-hidden-and-the-unseen.md) -- Catmull's warning that leaders' models of their organizations are always incomplete; conceptual models applied to management
- [Mental Models for Uncertainty](mental-models-for-uncertainty.md) -- Pixar directors deliberately build models (tunnels, mazes, sailing) to navigate uncertainty; the constructive side of model-making
- [Affordances and Signifiers](affordances-and-signifiers.md) -- signifiers are one mechanism for projecting the correct conceptual model
- [Knowledge in the World](knowledge-in-the-world.md) -- external information that corrects or supports the user's model
- Discussed in [The Design of Everyday Things](../sources/books/the-design-of-everyday-things/summary.md)
