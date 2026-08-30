# Card 13 - Type Atlas Route Conversion

Task IDs: `V3-ATLAS-001`, `V3-ATLAS-002`, `V3-ATLAS-003`
Owner: `Atlas Agent`
Status: `DONE`
Depends on: Cards 03, 07, and Type read contract from Card 16

## Deliverable

เปลี่ยน `/types` จาก card disclosure เป็น route directory ที่ทุก type เปิดหน้า `/types/[code]`

## Checklist

- Remove the page-level locale toggle after Navbar ownership lands.
- Remove expanded-card state, disclosure controls, and hidden detail panels.
- Make all 16 cards semantic links to lowercase type routes.
- Preserve accessible card names and visible focus.
- Ensure nested decorative content does not create nested interactive controls.
- Preserve browser navigation and route prefetch behavior where appropriate.
- Add one invalid-code test outside the Atlas card set.

## Acceptance

- Exactly 16 unique valid links exist.
- No inline profile dropdown remains.
- One visible locale control exists on the route.
- Keyboard activation opens the same page as pointer activation.

## Evidence

- DOM/link inventory.
- Keyboard route test.
- Before/after Types screenshots.
