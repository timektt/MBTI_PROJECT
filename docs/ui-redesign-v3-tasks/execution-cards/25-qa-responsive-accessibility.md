# Card 25 - Responsive, Accessibility, Asset, And Performance Audit

Task IDs: `V3-QA-008`, `V3-QA-009`, `V3-QA-010`
Owner: `QA Integration Agent`
Status: `DONE`
Depends on: Card 24

## Deliverable

รัน browser matrix ที่จับ overlap จริงทั้ง mobile/tablet/desktop พร้อม accessibility และ visual-asset checks

## Checklist

- Test 320x800, 390x844, 768x1024, 1024x768, and 1440x1000.
- Full-test Home, Quiz, Atlas, four representative type pages, My Results, Login/Account, and result routes.
- Smoke-test remaining type routes.
- Test both locales on high-risk routes.
- Detect page overflow, clipping, card/image/text collision, off-canvas content, and sticky/fixed overlap.
- Test keyboard, focus order, landmarks, headings, alt text, labels, touch targets, and 200 percent zoom.
- Test reduced motion and non-color state indicators.
- Verify visual assets, image dimensions, console warnings, hydration, and route bundle regressions.

## Acceptance

- Zero incoherent overlap and unintended horizontal overflow.
- No keyboard trap or unreachable action.
- Primary visuals load and frame correctly.
- No severe V3 performance regression remains.

## Evidence

- Route/locale/viewport screenshot matrix.
- Accessibility and zoom report.
- Console, asset, and performance summary.
