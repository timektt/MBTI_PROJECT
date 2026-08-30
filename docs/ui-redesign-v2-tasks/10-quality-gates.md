# UI V2 Full Quality Gates

เอกสารนี้ปิด project-wide UI batch หลัง page/family tasks ผ่านแล้ว ไม่ใช้แทน page-level QA

## QA-001: Route Inventory Gate

- Status: `DONE`
- Priority: `P0`
- Dependencies: `SYS-001`

Acceptance:

- source route count = manifest route count = audited route count
- dynamic route ทุก route มี sample path
- route ใหม่ที่ไม่มี evidence ทำให้ gate fail

## QA-002: Responsive Matrix

- Status: `DONE`
- Priority: `P0`
- Dependencies: page completion gates

Required:

- active routes: all 6 global viewports
- held routes: 390 and 1440; add 320/768/1024 when shared scenario changes topology
- no overflow, clipping, fixed overlap, broken media or zero-size controls

Current evidence:

- `output/ui-skills-router/2026-07-16/v2-10-completion-audit/project-matrix-report.json`
- `30/30` routes and `88/88` manifest-derived viewport samples pass against the current production build

## QA-003: Touch And Pointer Controls

- Status: `DONE`
- Priority: `P0`

Acceptance:

- primary targets at least 44x44px
- familiar icon buttons have accessible name and tooltip/title
- hover never moves layout
- disabled/loading does not resize control

## QA-004: Keyboard And Focus

- Status: `DONE`
- Priority: `P0`

Checks:

- logical tab order
- visible focus
- radio/tabs/disclosures work by keyboard
- no focus trap or offscreen focus
- focus outcome after route/state transition is predictable

## QA-005: Accessibility Semantics

- Status: `DONE`
- Priority: `P0`

Checks:

- one primary h1
- landmarks and heading order
- labels, aria state, alt text
- status/error announcements
- no color-only meaning
- contrast review for token pairs

## QA-006: 200% Zoom And Text Stress

- Status: `DONE`
- Priority: `P0`

Acceptance:

- active workflows remain usable at browser zoom 200%
- TH/EN longest copy does not clip or overlap
- no required horizontal two-dimensional scroll

## QA-007: Reduced Motion

- Status: `DONE`
- Priority: `P1`

Acceptance:

- content visible without waiting for reveal animation
- no infinite decorative motion after settle
- interaction feedback remains understandable

## QA-008: Performance And Asset Gate

- Status: `DONE`
- Priority: `P1`

Checks:

- `npm run assets:optimize` when source animal portraits are replaced
- `npm run assets:verify`
- broken/oversized image audit
- no duplicated hidden export artifact in repeated rows
- no expensive blur/shadow/animation proliferation
- compare route JS/CSS build output for material regression

## QA-009: Runtime Contract Regression

- Status: `DONE`
- Priority: `P0`

Commands:

- `npm run data:validate`
- `npm run reconnect:verify`
- `npm run runtime:guards`
- `npm run auth:surface`

Acceptance: default remains `guest-local`; no active guest route starts auth/cloud requests unexpectedly

## QA-010: Static And Production Build

- Status: `DONE`
- Priority: `P0`

Commands:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `git diff --check`

## QA-011: Evidence And Completion Guard Refresh

- Status: `DONE`
- Priority: `P0`

Tasks:

- store screenshots and audit JSON under dated V2 paths
- update `scripts/verify-ui-route-sweep.mjs` evidence path only after new sweep passes
- update `scripts/verify-ui-completion.mjs` without weakening existing assertions
- keep previous evidence as history

Acceptance:

- `npm run ui:route-sweep:verify`
- `npm run ui:completion`
- `npm run ui:v2:quality`
- render-affecting source newer than the current browser report makes `npm run ui:v2:quality` fail until the 30-route matrix is rerun

## QA-012: Figma Responsive QA Sync

- Status: `DEFERRED OPTIONAL`
- Priority: `P2`
- Required for completion: `No`
- Decision: browser evidence is the final UI source of truth; Figma is not required

Optional follow-up:

- place before/after frames in `07 Responsive QA`
- label route, state, viewport, task id and date
- include Result four-house fixtures, Types all-house summary, Dashboard empty/many
- run only when an editable design archive or designer handoff is needed

## Release Readiness Result

Status: `DONE`

Batch E automated/browser gate:

- strict verifier: 30/30 routes, 88/88 viewport samples, 17/17 active states, 8/8 dynamic samples
- required command gates: 12/12 passed
- no DOM, accessibility, network or runtime failures in the report
- `QA-006` passes native Chrome 200% across 9 representative active/held routes; accepted run resets a stale `1600px` viewport override to the real `1200px` window before zooming to effective `600px`
- `QA-008` passes: all 16 animal assets are unique `1080x1350` files and pass desktop/mobile recognizability, crop, contrast, broken-image, overflow and overlap checks
- optimized animal payload is `13,659,551` bytes (`64.5%` below the generated source set), with enforced `1.1 MB` per-file and `14 MB` total budgets
- `QA-012` is deferred optional and does not affect completion
- evidence: `output/ui-skills-router/2026-07-15/v2-08-full-quality/audit-report.json`
- native zoom evidence: `output/ui-skills-router/2026-07-16/native-zoom-current/native-zoom-report.json`
- current WebKit export evidence: `output/ui-skills-router/2026-07-16/webkit-export-current/webkit-export-report.json`
- animal asset evidence: `output/ui-skills-router/2026-07-16/animal-recognizability-after/render-audit.json`
- asset optimization evidence: `output/ui-skills-router/2026-07-16/animal-recognizability-after/asset-optimization.json`

UI scope is complete when:

- all selected page completion gates pass
- `QA-001..011` pass
- current browser evidence passes and is newer than render-affecting UI source
- no production deploy is implied
