# Card 08 - Navbar Responsive And Evidence Pass

Task IDs: `V3-NAV-007`, `V3-NAV-008`, `V3-NAV-009`
Owner: `Shell Agent`
Status: `DONE`
Depends on: Cards 05, 06, and 07

## Deliverable

ปิดงาน Navbar ด้วย responsive density, stable motion และหลักฐานปัจจุบัน

## Checklist

- Test 320, 390, 768, 1024, 1440, and 1600px.
- Test longest Thai and English labels.
- Test 200 percent zoom and browser text enlargement.
- Keep icon buttons and commands at least 44x44px.
- Use transform/opacity menu motion without changing header geometry.
- Respect reduced motion.
- Capture active, menu-open, menu-closed, and type-detail states.
- Check header overlap while scrolling long pages.

## Acceptance

- No clipped label, horizontal overflow, or header collision.
- Motion never blocks input or shifts surrounding layout.
- Evidence metadata matches current source revision.

## Evidence

- Screenshot matrix for both locales.
- Focus and reduced-motion assertions.
- Navbar audit summary and residual-risk list.
