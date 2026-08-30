# UI V2 Page Tasks: Home `/`

Primary files:

- `pages/index.tsx`
- `components/marketing/premium-home.tsx`
- `components/Navbar.tsx`
- `lib/mbti-z-copy.ts`
- `styles/globals.css`

Current status: identity-first `Signal & Story` implementation and all selected hardening tasks are complete

## Completed Implementation

### HOME-001: Identity-First First Viewport

- Status: `DONE`
- Evidence: `output/ui-skills-router/2026-07-15/v2-02-home/after/`
- Result: product name, value proposition, CTA และ actual product visual อยู่ใน first viewport

### HOME-002: Replace Card Feed With Content Bands

- Status: `DONE`
- Result: ลด nested cards และทำ Type/House/Animal/Movie Profile เป็น narrative bands

### HOME-003: Responsive Shared Navigation

- Status: `DONE`
- Result: mobile menu, locale, active state และ touch target ผ่าน initial browser matrix

## Remaining Tasks

### HOME-HARD-001: Longest TH/EN Copy Stress Test

- Status: `DONE`
- Priority: `P1`
- Parallel group: `P1-HOME`
- Dependencies: `SYS-004`, `SYS-005`

Tasks:

- render Thai and English at every viewport
- inspect longest heading, house description, CTA and navigation labels
- verify no word clipping, unintended single-word line, button overflow
- keep heading sizes breakpoint-based, not viewport-scaled

Acceptance:

- no text overflow/truncation that changes meaning
- CTA remains at least 44px high
- next-section hint remains visible in first viewport at 390 and 1440

### HOME-HARD-002: Asset Framing And Broken-Image Gate

- Status: `DONE`
- Priority: `P1`
- Dependencies: `SYS-004`, `SYS-005`

Tasks:

- validate product/animal/house images have stable aspect ratio
- inspect focal point at mobile and desktop
- verify `alt`, intrinsic dimensions and no zero-size media
- keep actual product imagery as first-viewport signal

Acceptance:

- no broken image or layout shift
- image shows identifiable subject rather than atmospheric crop

### HOME-HARD-003: Keyboard, Menu And 200% Zoom

- Status: `DONE`
- Priority: `P1`
- Dependencies: `SYS-003`, `SYS-005`

Tasks:

- tab through nav, locale, menu and CTA
- verify mobile menu focus order and close behavior
- inspect at browser zoom 200%
- verify reduced motion removes non-essential transitions

Acceptance:

- no focus trap or offscreen focused element
- no horizontal overflow at 200% zoom
- primary CTA remains reachable without pointer

### HOME-HARD-004: Final Visual Distill Pass

- Status: `DONE`
- Priority: `P2`
- Dependencies: `HOME-HARD-001..003`

Tasks:

- count remaining decorative borders/surfaces
- remove repeated copy or metadata not supporting discovery
- confirm one primary CTA per decision point
- run squint test for brand, CTA, product artifact, next section

Acceptance:

- no nested card and no section styled as floating card
- no multicolor accent competition in one section

## Validation

- `npm run data:validate`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- screenshots: all 6 global viewports, both locales

## Batch B Evidence (2026-07-15)

- TH/EN screenshots ครบ `320x700`, `390x844`, `768x1024`, `1024x768`, `1440x1000`, `1600x1000`
- no horizontal overflow, article/section overlap, broken image, console error หรือ visible control ต่ำกว่า `44px`
- next-section top: `682px` ที่ `390x844`, `601px` ที่ `1440x1000`
- Navbar trigger ผ่านที่ `320/768`; desktop nav ผ่านที่ `1024`; `Escape` ปิดและคืน focus
- native Chrome 200% ผ่านที่ effective viewport `600x450`; `scrollWidth=clientWidth=600`, mobile navigation reflow และ CTA ยังใช้งานได้
- zoom evidence: `output/ui-skills-router/2026-07-16/native-zoom-current/home-200.png`
- evidence: `output/ui-skills-router/2026-07-15/v2-03-home/`
- Batch E route sweep: 6/6 current production-build viewports ผ่านโดยไม่มี overflow, broken image, landmark หรือ runtime failure
- Batch E evidence: `output/ui-skills-router/2026-07-15/v2-08-full-quality/`

## Non-Scope

- scoring, auth, dashboard history, cloud save, new image generation without approval
