# UI V2 Page Tasks: Dashboard `/dashboard`

Primary files:

- `pages/dashboard.tsx`
- `components/cyber/reconnect-bundle-actions.tsx`
- `components/mbti-z/result-share-card.tsx`
- `components/mbti-z/download-result-button.tsx`
- `lib/assessment-runtime.ts`
- `lib/mbti-z-copy.ts`

Page objective: ตอบได้ทันทีว่า “ผลล่าสุดคืออะไร” และ “จะเปิดหรือดาวน์โหลดตรงไหน” โดย reconnect เป็น advanced utility

## DASH-001: Deterministic Dashboard Fixtures

- Status: `DONE`
- Priority: `P0`
- Parallel group: `P1-DASH`
- Dependencies: `SYS-004`

States:

- no result/no session
- pending quiz only
- one latest result
- many history results
- reconnect bundle available
- invalid recovery bundle

Acceptance: fixture reset/reseed does not use cloud/database

Evidence: deterministic empty, pending, one-result and many-result fixtures pass `npm run ui:fixtures:check`

## DASH-002: Baseline State Matrix

- Status: `DONE`
- Priority: `P0`
- Dependencies: `DASH-001`, `SYS-005`

Tasks: screenshots and metrics for empty, one, many, reconnect-open at 390/768/1024/1440

Evidence: `output/ui-skills-router/2026-07-15/v2-06-dashboard/after/`

## DASH-003: Latest Result First Viewport

- Status: `DONE`
- Priority: `P0`
- Dependencies: `DASH-002`, `RESULT-003`

Tasks:

- type/archetype/date and open/download actions first
- use compact artifact preview
- remove runtime counters from primary hierarchy
- mobile one-column, desktop main content plus narrow utility only when useful

Acceptance: latest type and primary action visible without scrolling at 390 and 1440

Evidence: latest artifact is the first content surface; desktop defaults to main content plus a collapsed `19rem` utility rail

## DASH-004: Empty And Resume State

- Status: `DONE`
- Priority: `P0`
- Dependencies: `DASH-001`, `SYS-007`

Tasks:

- empty: one `Start quiz` primary action
- pending session: `Continue quiz` primary, restart tertiary
- explain local-only storage concisely

Acceptance: empty page never looks broken and has one obvious next action

Evidence: empty and 24-answer pending fixtures pass at 390 and 1440 with no overflow or console errors

## DASH-005: History Archive List

- Status: `DONE`
- Priority: `P1`
- Dependencies: `DASH-003`

Tasks:

- use compact list/timeline, not large repeated cards
- show date, type, short identity and open action
- stable density for 1, 5, 20 items
- do not render hidden export artifact per row unless requested

Acceptance: 20 items remain scannable without severe DOM/media cost

Evidence: 20-row local stress produced 20 unique compact rows, one export target, 44x44 open actions and no horizontal overflow at 390px

## DASH-006: History Actions And Destructive Decision

- Status: `DONE`
- Priority: `P1`
- Dependencies: `DASH-005`

Tasks:

- define open/download as visible actions
- any delete/clear behavior stays deferred unless existing contract is safe
- icon buttons have accessible names and tooltips

Acceptance: no accidental destructive action

Evidence: history exposes only labeled open actions; destructive history mutation remains out of scope

## DASH-007: Reconnect Advanced Utility

- Status: `DONE`
- Priority: `P1`
- Dependencies: `DASH-003`

Tasks:

- keep reconnect collapsed by default
- concise status before disclosure
- recovery textarea only after explicit action
- import validation, error and success feedback
- keep technical bundle version inside details

Acceptance: latest artifact remains primary in default state; reconnect contract still verifies

Evidence:

- one native disclosure, closed by default, with no nested card/disclosure
- invalid JSON sets `aria-invalid`, announces status and moves focus to feedback
- desktop expansion changes the grid from `892px + 304px` to one `1216px` tool column
- `npm run reconnect:verify` passed

## DASH-008: Export Reuse Contract

- Status: `DONE`
- Priority: `P1`
- Dependencies: `RESULT-005`, `DASH-003`

Tasks: reuse result export without duplicating export target or conflicting action hierarchy

Acceptance: one visible download action per selected/latest result

Evidence: one visible latest download action and exactly one off-screen export target for result states; zero targets for empty/pending states

## DASH-009: Locale And Dense Content Stress

- Status: `DONE`
- Priority: `P1`
- Dependencies: `DASH-003..008`

Acceptance: TH/EN, 20 history items, recovery expanded and 200% zoom have no overlap/overflow

Evidence: TH/EN, 20 history items and expanded recovery passed; native Chrome 200% also passes at effective viewport `600x450` without horizontal overflow

## DASH-010: Keyboard And State Recovery

- Status: `DONE`
- Priority: `P1`
- Dependencies: `DASH-003..008`

Tasks: tabs/disclosures/actions keyboard path, focus after import error/success, reload persistence

Evidence: Enter toggles the native disclosure while preserving summary focus; invalid import focuses live feedback; reconnect import contract verifies success persistence

## DASH-011: Dashboard Completion Gate

- Status: `DONE`
- Priority: `P0`
- Dependencies: `DASH-001..010`

Validation:

- `npm run reconnect:verify`
- `npm run runtime:guards`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- empty/one/many/reconnect states, 2 locales, 6 viewports
- console, network, keyboard, zoom and DOM metrics

Evidence path: `output/ui-skills-router/YYYY-MM-DD/v2-06-dashboard/`

Native Chrome 200% is closed by `output/ui-skills-router/2026-07-16/native-zoom-current/dashboard-200.png`. All scripted runtime, fixture, keyboard, viewport, console, touch-target and production-build gates pass.

Batch E adds explicit loading-page identity (`h1`), 5/5 current states and 6/6 current production-build viewport samples with one `main`, one `h1`, no overflow and no runtime failures. Evidence: `output/ui-skills-router/2026-07-15/v2-08-full-quality/`.

## Non-Scope

- cloud save, authenticated user dashboard, destructive history mutation, premium billing
