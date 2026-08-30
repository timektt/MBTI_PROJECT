# Card 15 - Type Atlas Responsive And Evidence Pass

Task IDs: `V3-ATLAS-007`, `V3-ATLAS-008`, `V3-ATLAS-009`, `V3-ATLAS-010`
Owner: `Atlas Agent`
Status: `DONE`
Depends on: Cards 13 and 14

## Deliverable

ปิด Type Atlas ด้วย density ที่เหมาะกับ mobile/desktop และ route regression proof ครบ 16 type

## Checklist

- Define mobile single/two-column behavior from content width, not arbitrary card shrink.
- Define desktop grid tracks with stable min/max widths.
- Test 320, 390, 768, 1024, 1440, and 1600px.
- Test both locales and longest type names/summaries.
- Verify all 16 routes and return navigation.
- Check selected House state after Back.
- Capture default, filtered, focus, and no-results states.

## Acceptance

- Zero card, image, tab, or text overlap.
- All 16 links resolve and return predictably.
- No unintended page-level horizontal overflow.
- Evidence is current-source and reproducible.

## Evidence

- Responsive screenshot matrix.
- 16-link route report.
- Atlas completion handoff.
