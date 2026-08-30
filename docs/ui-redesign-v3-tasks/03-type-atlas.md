# V3 Type Atlas Tasks

Owner: Atlas Agent
Dependencies: `V3-NAV-006`, `V3-TYPE-003`, `V3-TYPE-005`
Status: `DONE`

## V3-ATLAS-001 Remove Page Locale Toggle

- remove import/render from `pages/types.tsx`
- consume provider locale only
- verify Navbar menu remains available

## V3-ATLAS-002 Remove Disclosure State

- remove `expandedTypeCode`
- remove disclosure button/region/chevron
- simplify `TypeCard` props

## V3-ATLAS-003 Route Every Card

- link to lowercase `/types/{code}`
- explicit View profile label
- preserve semantic `article`/heading structure
- avoid nested interactive controls

## V3-ATLAS-004 Card Scan Hierarchy

- image, code, archetype, House/animal, summary
- summary maximum 2-3 lines
- fixed media ratio and stable card height per breakpoint
- route arrow remains >=44px target

## V3-ATLAS-005 House URL State

- optional validated `?house=` query
- update filter with shallow routing if adopted
- detail back link includes originating House
- invalid value falls back safely

## V3-ATLAS-006 House Tabs

- keep one House tab set only
- no sticky overlap with Navbar
- keyboard arrows/home/end follow Tabs primitive
- active color not sole state indicator

## V3-ATLAS-007 Mobile Layout

- one card per row at 320/390
- no horizontal card rail
- image remains recognizable
- text and CTA do not overlap

## V3-ATLAS-008 Desktop Density

- test 2 vs 4 columns at 1024/1440
- use 4 only when each item retains readable width
- no paragraph-heavy listing

## V3-ATLAS-009 Navigation Regression

- all 16 links unique
- back returns to expected House context
- TH/EN label updates without route loss
- opening in new tab works

## V3-ATLAS-010 Evidence

Matrix:

- 4 Houses x 390 and 1440
- representative 320/768/1024/1600
- longest TH/EN archetype/summary
- keyboard House navigation and card activation

Acceptance:

- zero inline dropdowns
- 16/16 canonical detail links
- one locale control per viewport
- no truncation that removes type meaning
- no overflow or sticky collision

Files likely to change:

- `pages/types.tsx`
- `components/mbti-z/type-card.tsx`
- Atlas copy via Lead handoff

Required checks:

- type-detail data validator
- `npm run typecheck`
- `npm run lint`
- targeted browser matrix
