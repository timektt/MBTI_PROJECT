# V3 Home Experience Tasks

Owner: Home Experience Agent
Dependencies: `V3-SYS-004`, `V3-SYS-006`
Status: `DONE`

## V3-HOME-001 Remove Single-Type Hardcode

- remove ESTJ lookup from hero
- read four representative profiles by code through data contract
- fail safely if one profile is missing without collapsing hero

Acceptance: no `find(...ESTJ)` or equivalent single hero profile remains.

## V3-HOME-002 Constellation Geometry

- build fixed-aspect four-tile media mosaic
- subject crop tuned per breakpoint
- no negative margin or card overlap
- stable dimensions before image load

## V3-HOME-003 Pointer Interaction

- hover tile emphasis with transform-only scale
- local light sweep/accent reveal
- non-active dimming remains readable
- no hover-induced reflow

## V3-HOME-004 Keyboard And Touch Interaction

- every tile focusable with meaningful label
- focus-visible mirrors hover
- mobile tap selects tile and updates fixed detail region
- essential copy visible without hover

## V3-HOME-005 Reduced Motion

- disable scale/sweep/parallax under reduced motion
- selected/focus state still distinguishable
- screenshots never miss delayed content

## V3-HOME-006 Result Anatomy Band

- Type, House, Animal, Movie Profile and PNG
- use one unframed band rather than nested cards
- include one concrete user benefit per item

## V3-HOME-007 How It Works

- answer -> reveal -> save/share
- explain guest-first behavior without runtime jargon
- CTA hierarchy has one primary action per decision point

## V3-HOME-008 Four Houses Interaction

- preserve four House selector
- upgrade image/description transition
- show all four type codes for selected House
- selector keyboard and touch targets >=44px

## V3-HOME-009 My Results Explanation

- explain local result/history in user language
- link to `/dashboard` using My Results label
- avoid account/cloud queue copy

## V3-HOME-010 Copy Consolidation

- choose one authoritative Home copy export
- remove or retire duplicate component-local/lib copy
- send shared copy changes to Lead

## V3-HOME-011 Evidence

States:

- default four-House hero
- each selected tile desktop hover/focus
- mobile tap selection
- reduced motion
- TH/EN
- 320/390/768/1024/1440/1600

Acceptance:

- no single-type hero bias
- four animal subjects visible and recognizable
- no layout shift/overflow/overlap
- hover/focus is visually stronger than current implementation
- mobile behavior does not depend on hover
- CTA and next section hint visible in first viewport

Files likely to change:

- `components/marketing/premium-home.tsx`
- optional Home-scoped components under `components/marketing/`
- Home copy through Lead handoff

Required checks:

- `npm run assets:verify`
- `npm run typecheck`
- `npm run lint`
- `npm run build` when final integration lands
