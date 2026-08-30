# MBTI Z Types Encyclopedia Page Override

Route: `/types`

Purpose:

- explain all 16 MBTI types through the house system
- make each type card feel premium and scannable
- connect type meaning with animal identity and movie tendency

## Layout

- intro band: what the atlas is and how to read it
- house overview band: four houses in one fast scan
- deep-dive band: per-house section with grouped type cards

Rules:

1. users should understand the four-house model before reading individual types
2. each house section should feel like a curated library, not a random card dump
3. mobile view must remain scannable without collapsing all context
4. type cards should stay consistent in height rhythm as much as content allows

## Interaction

- optional future enhancement: house tabs or segmented filter
- only add tabs/carousels if QA proves the current stacked layout is not enough
- cards do not need fancy flipping or hidden backs

## Content

Each type card should make these fields obvious:

- type code
- archetype label
- house
- animal
- short summary
- suitable contexts / fit

## Avoid

- making the page depend on hover to reveal meaning
- hiding house identity behind only a small chip
- introducing a swipe carousel before testing whether the current grid already works
