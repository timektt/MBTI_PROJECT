# UI V2 Page Tasks: Result `/result/[id]`

Primary files:

- `pages/result/[id].tsx`
- `components/mbti-z/result-share-card.tsx`
- `components/mbti-z/download-result-button.tsx`
- `components/mbti-z/animal-portrait.tsx`
- `components/mbti-z/house-badge.tsx`
- `pages/api/result-share-image.tsx`
- `lib/result-share-image.ts`
- `lib/mbti-z-copy.ts`

Page objective: ผู้ใช้ต้องรู้ `type + archetype + house + animal` และเข้าถึง artifact/export ภายใน 1-2 viewport แรก

Shared ownership: Result เป็น owner แรกของ `ResultShareCard`, `AnimalPortrait`, download/export visual contract ก่อน Dashboard/Types reuse

## RESULT-001: Four-House Fixture Set

- Status: `DONE`
- Priority: `P0`
- Parallel group: `P1-RESULT`
- Dependencies: `SYS-004`

Tasks:

- create deterministic representative type for purple, green, yellow, blue
- include longest Thai/English summary
- include balanced and highly skewed dimensions
- include valid and missing result id

Acceptance: every fixture loads without answering quiz manually and preserves result shape

## RESULT-002: Baseline Evidence And Hierarchy Audit

- Status: `DONE`
- Priority: `P0`
- Dependencies: `RESULT-001`, `SYS-005`

Tasks:

- capture 6 viewports for 4 fixtures
- record first-viewport visible content and action positions
- inventory nested surfaces, badges, gradients and repeated metadata
- capture export target separately

Output: before screenshots + issue list with severity and file evidence

## RESULT-003: Identity-First Hero

- Status: `DONE`
- Priority: `P0`
- Dependencies: `RESULT-002`, `SYS-002`, `SYS-003`

Tasks:

- type code as primary identity
- archetype and one-sentence identity as supporting hierarchy
- house accent limited to one family
- animal/artifact visible at mobile and desktop
- remove runtime and technical metadata from hero

Acceptance:

- type, archetype, house, animal and export action identifiable in 1-2 viewports
- no hero content placed inside nested card

## RESULT-004: Artifact And Animal Media Contract

- Status: `DONE`
- Priority: `P0`
- Dependencies: `RESULT-003`

Tasks:

- stable artifact aspect ratio
- object focal point by breakpoint
- visible loading/fallback state
- alt text and no duplicate spoken labels
- verify 4 house and 16 animal assets

Acceptance: no broken media, zero-size image or subject-obscuring crop

## RESULT-005: Export Action And Share Artifact

- Status: `DONE`
- Priority: `P0`
- Dependencies: `RESULT-003`, `RESULT-004`

Tasks:

- primary download action near artifact
- loading/success/error feedback without layout shift
- hidden export target remains exactly `1080x1350`
- verify server PNG and html2canvas fallback
- prevent export-only styles leaking into page UI

Acceptance:

- Chrome and WebKit-compatible PNG `1080x1350`
- keyboard activation works
- error restores retryable state

## RESULT-006: Dimension Summary

- Status: `DONE`
- Priority: `P1`
- Dependencies: `RESULT-003`

Tasks:

- replace four heavy panels with compact readable visualization
- show pair, winner and balance without relying on color alone
- labels fit Thai/English and 200% zoom
- motion is optional and reduced-motion safe

Acceptance: all four dimensions scan within one section without horizontal scrolling

## RESULT-007: Narrative Reading Flow

- Status: `DONE`
- Priority: `P1`
- Dependencies: `RESULT-003`

Tasks:

- order: identity, dimensions, narrative, movie profile, supporting details
- constrain narrative reading column
- use headings and spacing instead of cards
- desktop local navigation only if it reduces scroll cost
- no sticky navigation on mobile

Acceptance: heading order is semantic and each section has one purpose

## RESULT-008: Movie Profile Section

- Status: `DONE`
- Priority: `P1`
- Dependencies: `RESULT-007`

Tasks:

- make profile title, summary and tags scannable
- remove chip overload
- distinguish supporting movie identity from primary MBTI identity

Acceptance: Movie Profile is discoverable but does not compete with type hero

## RESULT-009: Answer Summary Disclosure

- Status: `DONE`
- Priority: `P1`
- Dependencies: `RESULT-007`

Tasks:

- move 60-answer detail behind accessible disclosure
- summarize answered count and modules before expansion
- support keyboard and 200% zoom
- avoid rendering a card for every answer by default

Acceptance: default result length drops materially while full answers remain accessible

## RESULT-010: Missing, Loading And Corrupt Result States

- Status: `DONE`
- Priority: `P0`
- Dependencies: `SYS-007`, `RESULT-001`

States:

- hydration/loading
- unknown id
- cleared local storage
- malformed result

Acceptance:

- one clear action to dashboard or quiz
- no raw id/runtime error shown as primary copy

Batch A evidence (2026-07-15):

- production build: `npm run build`
- browser matrix: `320x700`, `390x844`, `768x1024`, `1024x768`, `1440x1000`
- DOM audit: no horizontal overflow, section overlap, broken image, console error or visible control below `44px`
- keyboard disclosure: `open`, 60 answer rows rendered
- export target: `1080x1350`
- corrupt result: no raw result id, CTA points to `/quiz`
- screenshots: `output/ui-skills-router/2026-07-15/v2-04-result/after/`
- no permanent loading state

## RESULT-011: Locale And Content Stress

- Status: `DONE`
- Priority: `P1`
- Dependencies: `RESULT-003..010`

Tasks: 4 fixtures x 2 locales, long words, tags, dimension labels and export copy

Acceptance: no semantic truncation, overlap or button text clipping

## RESULT-012: Result Completion Gate

- Status: `DONE`
- Priority: `P0`
- Dependencies: `RESULT-001..011`

Validation:

- `npm run data:validate`
- `npm run assets:verify`
- `npm run reconnect:verify`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- PNG server/fallback verification
- all 6 viewports, 4 houses, 2 locales
- keyboard, reduced motion, 200% zoom, console/network audit

Evidence path: `output/ui-skills-router/YYYY-MM-DD/v2-04-result/`

Batch E evidence (2026-07-15):

- 4 houses x 2 locales x 6 viewports = 48 current production-build samples, failures `0`
- balanced fixture: `INFJ`, `T/F = 58%`, scores `20/28`; decisive dimensions remain `100%`
- image failure injection shows an accessible fallback without broken layout
- locale toggle persists `en -> th -> en` in the route query
- server PNG exports: 4/4 `200 image/png`, each `1080x1350`; Thai Purple/Yellow text visually inspected without cross-column clipping
- server download success feedback is visible and stable; browser fallback proof remains available from the earlier Batch E run
- current WebKit `26.5` export passes both server-success and forced-fallback paths at `1080x1350`
- native Chrome 200% passes at effective viewport `600x450` with no horizontal overflow
- evidence: `output/ui-skills-router/2026-07-16/webkit-export-current/`
- zoom evidence: `output/ui-skills-router/2026-07-16/native-zoom-current/result-blue-page-200.png`
- evidence: `output/ui-skills-router/2026-07-15/v2-08-full-quality/`

## Non-Scope

- premium payment/unlock, cloud persistence, changing MBTI scores, public share route activation
