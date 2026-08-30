# Card 14 - Type Card Hierarchy And House Filters

Task IDs: `V3-ATLAS-004`, `V3-ATLAS-005`, `V3-ATLAS-006`
Owner: `Atlas Agent`
Status: `DONE`
Depends on: Card 13

## Deliverable

ทำให้ 16 cards สแกนและเปรียบเทียบง่าย พร้อม House tabs ที่เก็บ state ใน URL อย่างคาดเดาได้

## Checklist

- Set card hierarchy: type code, localized name, short summary, house cue, route affordance.
- Remove content that belongs on detail pages.
- Define selected House query/hash behavior and default All state.
- Use tabs/segmented control semantics appropriate to URL filtering.
- Add a useful no-results state if search/filter remains.
- Keep card dimensions stable across longest Thai/English labels.
- Preserve House context when returning from a detail route where feasible.

## Acceptance

- Users can compare all cards without opening disclosures.
- URL state is shareable and Back/Forward-safe.
- Filter controls do not duplicate Navbar language controls.
- Cards do not resize on hover or focus.

## Evidence

- All and each-House screenshots.
- URL/Back/Forward interaction log.
- Longest-copy overflow check.
