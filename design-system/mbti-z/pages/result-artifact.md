# MBTI Z Result Artifact Page Override

Route: `/result/[id]`

Purpose:

- reveal type, house, animal, and movie profile in a hierarchy that reads fast
- make the artifact feel collectible and shareable
- expose the PNG export without turning the page into a tool dashboard

## Layout

- hero band: type + archetype + house + animal + key actions
- interpretation band: signature, movie profile, summary
- metrics band: dimension scores and supporting evidence
- export band: share card preview + download action

Rules:

1. first screen should answer "what type am I and what does it mean?" immediately
2. the fantasy animal must support identity, not overpower the interpretation
3. export preview should feel like a finished deliverable, not a debug frame
4. score bars should remain readable without a chart library

## Interaction

- download CTA should stay near the result, not buried
- alternate actions such as retake or dashboard remain secondary
- reduced-motion mode must still preserve the reveal order

## Avoid

- long text before the result identity is clear
- oversized empty bands between hero and metrics
- export surface relying on unsupported CSS tricks
