# UI V2 Tasks: Shared Foundation

Owner scope: shared tokens, shell contracts, fixture strategy และ QA harness

ห้าม task ในไฟล์นี้เปลี่ยน business logic หรือเปิด cloud/auth runtime

## SYS-001: Route And State Manifest

- Status: `DONE`
- Priority: `P0`
- Parallel group: `P0-A`
- Dependencies: none
- Files: `pages/**/*.tsx`, `scripts/verify-ui-route-sweep.mjs`, new manifest under `data/ui/` only if needed

Tasks:

- map user-facing route ทั้ง 30 route ไปยัง `active`, `account-hold`, `relaunch-profile`, `relaunch-community`, `relaunch-admin`
- ระบุ sample path ของ dynamic routes
- ระบุ required states ต่อ route: loading, empty, populated, not-found, selected, expanded
- ระบุ minimum viewport set ต่อ route
- ระบุ route owner component เพื่อลด duplicate implementation

Acceptance:

- route count ตรงกับ source files
- dynamic route ทุก route มี deterministic sample
- held routes ไม่ถูกจัดเป็น active feature โดยผิดพลาด
- manifest อ่านได้จาก QA script โดยไม่ parse Markdown

Evidence (2026-07-15):

- `data/ui/route-state-manifest.mjs` ครบ 30 routes
- `npm run ui:manifest:verify` ผ่าน exact coverage และ dynamic sample validation

## SYS-002: Signal Token Coverage

- Status: `DONE`
- Priority: `P0`
- Parallel group: `P0-B`
- Dependencies: none
- Files: `styles/globals.css`, `design-system/mbti-z/MASTER.md`

Tasks:

- inventory `cyber-*` classes และ hard-coded colors ใน active pages
- map token ของ canvas, surface, text, border, accent, focus และ disabled
- กำหนด migration rule: additive ก่อน, remove legacy หลัง full route gate
- กำหนด radius scale `6/10/16/20 media only`
- กำหนด spacing scale `4/8/12/16/24/32/48/64/96`
- กำหนด typography roles โดยไม่ใช้ viewport-width font scaling

Acceptance:

- active page ใหม่ไม่ต้องเพิ่ม color literal ที่ซ้ำ token
- focus ring และ disabled state มี token ชัด
- ไม่มี global token rewrite ที่ทำให้ held route แตก

## SYS-003: Responsive Shell Contract

- Status: `DONE`
- Priority: `P0`
- Parallel group: `P0-B`
- Dependencies: `SYS-002`
- Files: `components/Navbar.tsx`, `styles/globals.css`, shared layout components

Tasks:

- lock gutters: 16-20 mobile, 32 tablet, 40-64 desktop
- lock max content width `1200-1280px`
- define reading column `640-760px`
- define touch targets `44x44px` minimum
- define safe-area padding for bottom actions
- prohibit negative-margin card overlap
- prohibit fixed action bars unless intersection proof exists
- define 200% zoom behavior

Acceptance:

- shell ไม่สร้าง horizontal overflow ที่ 320-1600
- controls ไม่ shift เมื่อ hover/selected/loading
- page-specific layout ไม่ต้อง override shell ด้วย arbitrary z-index

Evidence (2026-07-15, Batch B navigation slice):

- `components/Navbar.tsx` ใช้ topology contract เดียวที่ `lg`: mobile/tablet trigger ต่ำกว่า `1024px`, desktop nav ตั้งแต่ `1024px`
- menu รองรับ `Escape`, คืน focus, route-change close และ control ขั้นต่ำ `44px`
- browser proof ผ่านที่ `320`, `768`, `1024`; native Chrome 200% ผ่านเพิ่มเมื่อ 2026-07-16 ที่ effective viewport `600x450` โดยไม่มี horizontal overflow

## SYS-004: Deterministic UI Fixtures

- Status: `DONE`
- Priority: `P0`
- Parallel group: `P0-C`
- Dependencies: `SYS-001`
- Files: existing runtime helpers, optional `scripts/ui-fixtures/*.mjs`, no production database

Tasks:

- Result fixtures: representative types จาก 4 houses
- Dashboard fixtures: empty, one result, many results, pending quiz
- Quiz fixtures: first core, middle core, first movie, final question
- invalid result id fixture
- locale fixtures: longest Thai and English strings
- reconnect fixtures: default, bundle available, recovery expanded, invalid import

Acceptance:

- fixture reset/reseed ทำซ้ำได้
- fixture ไม่แตะ production database
- fixture ไม่เปลี่ยน scoring output contract
- screenshots ไม่ขึ้นกับ stale browser storage ที่ไม่รู้ที่มา

Evidence (2026-07-15):

- `scripts/ui-fixtures/generate.ts` สร้าง deterministic fixtures 14 scenarios
- Result fixture ครบ 4 houses; Quiz ครบ first/middle/movie/final; Dashboard ครบ empty/one/many/pending
- `npm run ui:fixtures:check` ผ่าน และ generated browser scripts ถูก ignore จาก Git

## SYS-005: Screenshot And DOM Audit Harness

- Status: `DONE`
- Priority: `P0`
- Parallel group: `P0-D`
- Dependencies: `SYS-001`, `SYS-004`
- Files: existing QA scripts or focused script under `scripts/`

Viewport matrix:

- `320x700`
- `390x844`
- `768x1024`
- `1024x768`
- `1440x1000`
- `1600x1000`

Metrics:

- status code and console/page errors
- document/client width
- horizontal overflow
- unnamed interactive and unlabeled inputs
- target size below 44px
- fixed/sticky element count and intersections
- broken images and zero-size media
- footer/action overlap
- heading count and landmark presence

Acceptance:

- output แยก route/state/viewport ชัด
- failures คืน non-zero exit code
- before/after ใช้ viewport และ fixture เดียวกัน

Evidence (2026-07-15):

- `scripts/verify-ui-v2-quality.mjs` and route/state sweep produce dated screenshots plus DOM/a11y/network/runtime failures with non-zero gate behavior
- strict report covers 30 routes, 88 viewport samples, 17 active states and 8 dynamic samples
- evidence: `output/ui-skills-router/2026-07-15/v2-08-full-quality/audit-report.json`

## SYS-006: Shared Interaction States

- Status: `DONE`
- Priority: `P1`
- Parallel group: `P0-E`
- Dependencies: `SYS-002`, `SYS-003`
- Files: `components/ui/*`, `styles/globals.css`

Tasks:

- audit button, icon button, tabs, radio, accordion, disclosure
- focus-visible, hover, pressed, selected, disabled, loading
- use Lucide icons and accessible names
- ensure state changes do not resize controls
- avoid adding primitives without route use case

Acceptance:

- every active route interaction maps to an existing primitive or documented local component
- keyboard and reduced-motion behavior documented per primitive

Evidence (2026-07-15):

- keyboard evidence covers Navbar, Quiz radios/actions, Types tabs/disclosure, Result answer disclosure and Dashboard reconnect disclosure
- active state matrix covers loading, disabled, selected, expanded, success, error and failed-media states without control resize failures
- strict accessibility gate reports no unnamed interactive, missing label, target-size or focus contract failure

## SYS-007: Shared Loading/Error/Empty Pattern

- Status: `DONE`
- Priority: `P1`
- Parallel group: `P0-E`
- Dependencies: `SYS-003`
- Files: page-specific state components or one minimal shared primitive

Tasks:

- define loading shell matching final geometry
- define empty state with one recovery action
- define not-found/error state without internal runtime jargon
- avoid card-inside-card state screens

Acceptance:

- no CLS caused by loading-to-content transition
- each state has clear accessible status and recovery path

Evidence (2026-07-15):

- Home, Quiz, Result, Types and Dashboard state evidence covers loading, empty, error/not-found, populated and retryable recovery surfaces
- held account/profile/community/admin routes share route-truthful hold states with one active-product recovery action
- strict state evidence count is 17 with no landmark, overflow or runtime failure

## Shared Validation

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run ui:route-sweep:verify` after evidence refresh
- browser matrix from `SYS-005`
