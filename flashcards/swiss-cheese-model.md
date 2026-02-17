---
source: human-error-is-design-error
---

<details>
<summary>What is James Reason's Swiss cheese model of accidents, and what two practical lessons does it teach about system design?</summary>

The model uses slices of Swiss cheese as a metaphor: each slice represents a layer of defense in a system, and each hole represents a potential failure. An accident can only occur when the holes in all slices line up simultaneously. No single failure -- including a single human error -- should be able to cause catastrophe. The two practical lessons: (1) Stop trying to find "the" cause of an accident; most accidents have multiple contributing causes, and any one of them not occurring would have prevented it. (2) Make systems more resilient by adding more slices (more layers of defense), reducing hole size (better design that minimizes error opportunities), and ensuring holes don't align (using different mechanisms in different layers). The fix is always structural redundancy, not blaming the person whose error happened to be the last hole.

See: [Human Error Is Design Error](../ideas/human-error-is-design-error.md)

</details>
