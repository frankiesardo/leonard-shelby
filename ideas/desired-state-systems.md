---
title: "Desired-State Systems"
aliases:
  - Shopify OS
  - desired state reconciliation
  - modeling the company as code
sources:
  - tobi-lutke-21-years-building-shopify
domains:
  - management
  - systems-thinking
related:
  - companies-as-technology
  - systems-over-goals
  - theory-of-constraints
  - throughput-accounting
  - the-five-focusing-steps
  - environment-over-policy
  - goodharts-law-in-product
---

# Desired-State Systems

A desired-state system is a pattern borrowed from engineering (specifically, declarative UI frameworks like React): you define what *should be*, compare it to what *is*, and compute the minimum steps to reconcile the two. Tobi Lütke applied this to Shopify's entire organizational structure.

Shopify OS is a GitHub repository containing config files with every organizational principle (team sizes, reporting ratios, title levels, compensation data), Python code that computes the model, and a SAT solver that, given all constraints and inputs, answers: "What should Shopify look like?" HR's job becomes reconciliation -- finding the minimum steps to get from current state to desired state.

The power is in making organizational decisions legible and computable. When the head of sales asks for 50 new people, the system shows the counterfactual: you'd need to cut engineers here, change these reporting lines there, shift this budget. It's no longer a political negotiation -- it's a simulation. You made the decision to hire salespeople, but you didn't make the decision to stop innovating. Now you can see both decisions at once.

## Why it matters

The first version of Shopify OS immediately surfaced chaos: 8,000 people with 5,500 different titles. Senior staff was lower than director in some groups and above in others. None of this was visible until someone tried to make it software-addressable.

This is the deepest application of "environment over policy." Instead of posting rules about org structure, you make the desired state explicit and computable, then let the system tell you where reality diverges. It removes politics from resource allocation and replaces it with shared constraints.

Think about how much policy you don't have to post if the environment just makes you do the obvious thing. Tobi applies this everywhere: pods that physically fit five people uncomfortably fit seven (no policy about team size needed), meeting rooms in interior spaces (no policy about reducing meetings needed). Desired-state systems are the organizational equivalent.

## Connections

- Implementation of [Companies as Technology](companies-as-technology.md) -- the literal engineering of the company
- [Systems over Goals](systems-over-goals.md) at scale -- you define the system constraints and let outcomes emerge
- [Theory of Constraints](theory-of-constraints.md) -- the system can identify where organizational bottlenecks are
- [Throughput Accounting](throughput-accounting.md) -- both replace political decision-making with system-level legibility
- Discussed in [Tobi Lütke: 21 Years of Building Shopify](../sources/transcripts/tobi-lutke-21-years-building-shopify/summary.md)
