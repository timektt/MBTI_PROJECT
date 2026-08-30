# UI V2 Page Tasks: Profile, Settings And Verification Hold

Shared component: `components/cyber/relaunch-state.tsx`

Runtime rule: all routes remain hold states until authenticated server-side contracts are reactivated and verified

## Route Manifest

| Task | Route | Scenario | Status |
| --- | --- | --- | --- |
| `PROFILE-101` | `/profile` | `profile` | `DONE` |
| `PROFILE-102` | `/profile/[username]` | `profile` | `DONE` |
| `PROFILE-103` | `/profile/[username]/followers` | `profile` | `DONE` |
| `PROFILE-104` | `/profile/[username]/following` | `profile` | `DONE` |
| `PROFILE-105` | `/u/[username]` | `profile` | `DONE` |
| `PROFILE-106` | `/settings` | `settings` | `DONE` |
| `PROFILE-107` | `/settings/password` | `settings` | `DONE` |
| `PROFILE-108` | `/setup-profile` | `settings` | `DONE` |
| `PROFILE-109` | `/setup-username` | `settings` | `DONE` |
| `PROFILE-110` | `/reset-password` | `verification` | `DONE` |
| `PROFILE-111` | `/verify-email` | `verification` | `DONE` |

Dynamic samples:

- `/profile/demo`
- `/profile/demo/followers`
- `/profile/demo/following`
- `/u/demo`

## PROFILE-001: Shared Relaunch Layout

- Status: `DONE`
- Priority: `P1`
- Parallel group: `P2-PROFILE`
- Dependencies: `SYS-002`, `SYS-003`, `SYS-007`

Tasks:

- scenario title, concise status and available-now action
- no legacy sidebar, empty data table or fake form
- technical explanation behind disclosure
- compact mobile layout with one primary CTA
- consistent illustration/media only if it communicates route scenario

Acceptance: all scenarios share geometry while title/copy/action remain route truthful

## PROFILE-002: Scenario Copy Audit

- Status: `DONE`
- Priority: `P1`
- Dependencies: `PROFILE-001`

Tasks:

- `profile`: profile/community identity unavailable
- `settings`: account settings unavailable
- `verification`: email/password verification unavailable
- remove internal architecture and promises without timeline
- verify TH/EN longest copy

Acceptance: no route claims feature is working or data is saved

## PROFILE-003: Shared Interaction And Accessibility

- Status: `DONE`
- Priority: `P1`
- Dependencies: `PROFILE-001`, `PROFILE-002`

Checks: landmarks, one h1, focus order, icon labels, reduced motion, 200% zoom, no small targets

## PROFILE-101..111: Route-Level QA Tasks

แต่ละ task ใน manifest ต้องทำแยก:

- confirm HTTP 200 and expected scenario
- verify page title/meta and h1 match route intent
- capture mobile `390x844` and desktop `1440x1000`
- dynamic route uses deterministic sample
- verify guest CTA destination
- inspect console, network failures, overflow and target size
- record evidence path containing route slug

Acceptance per route:

- expected scenario copy appears
- no stale legacy UI or unavailable form appears
- one clear route back to active product

## PROFILE-120: Profile/Settings Completion Gate

- Status: `DONE`
- Priority: `P0`
- Dependencies: `PROFILE-001..003`, `PROFILE-101..111`

Validation:

- `npm run auth:surface`
- `npm run runtime:guards`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- route sweep: 11 routes x required viewports

Evidence path: `output/ui-skills-router/YYYY-MM-DD/v2-07-profile-settings-hold/`

## Evidence: 2026-07-15

- all 11 route contracts pass exact `intent` and expected scenario through the shared hold template
- route-specific TH/EN title and h1 are unique; primary copy removes internal architecture from the first viewport
- `390x844` mobile and `1440x1000` desktop screenshots passed for every route, with representative `320x700` and landscape stress checks
- encoded and long dynamic username paths return 200 without reflection or overflow
- no legacy sidebar, form, table, API request, console error, broken image, small target or header overlap detected
- evidence: `output/ui-skills-router/2026-07-15/v2-07-profile-settings-hold/after/`
- report: `output/ui-skills-router/2026-07-15/v2-07-held-routes/audit-report.json`

Native zoom closure:

- representative `/profile` hold route passes native Chrome 200% at effective viewport `600x450` without overflow or framework overlay
- evidence: `output/ui-skills-router/2026-07-16/native-zoom-current/profile-200.png`

## Non-Scope

- profile data, follow graph, password mutation, email verification, authenticated settings
