# UI V2 Page Tasks: Admin Operations Hold

Routes:

- `/admin`
- `/admin/cards`
- `/admin/comments`
- `/admin/settings`
- `/admin/users`

Runtime rule: admin pages remain `RelaunchState scenario="operations"`. Never render admin data or legacy managers before server-side authorization is verified

## ADMIN-001: Operations Hold Scenario

- Status: `DONE`
- Priority: `P0`
- Parallel group: `P2-ADMIN`
- Dependencies: `PROFILE-001`, `SYS-007`

Tasks:

- concise unavailable state
- active guest-product recovery path
- no admin navigation shell that implies access
- no counts, tables, search or mutation controls
- no role/account detail in client-visible copy

Acceptance: direct navigation exposes no operational data or fake controls

## ADMIN-002: Authorization Boundary Audit

- Status: `DONE`
- Priority: `P0`
- Dependencies: none
- Scope: read-only audit only

Tasks:

- confirm page routes render hold state directly
- verify no client fetch to admin APIs
- verify reopening checklist requires server-side authorization
- do not activate middleware/auth in this task

Acceptance: current held surface is truthful and no admin data request occurs

## Route QA Tasks

| Task | Route | Status |
| --- | --- | --- |
| `ADMIN-101` | `/admin` | `DONE` |
| `ADMIN-102` | `/admin/cards` | `DONE` |
| `ADMIN-103` | `/admin/comments` | `DONE` |
| `ADMIN-104` | `/admin/settings` | `DONE` |
| `ADMIN-105` | `/admin/users` | `DONE` |

Checks per route:

- status 200 with operations hold
- no admin layout/sidebar/table
- no requests to `/api/admin/*`
- title/h1 and guest recovery action
- 390 and 1440 screenshots
- keyboard, zoom, console and overflow

## ADMIN-110: Admin Hold Completion Gate

- Status: `DONE`
- Priority: `P0`
- Dependencies: `ADMIN-001`, `ADMIN-002`, `ADMIN-101..105`

Validation:

- `npm run auth:surface`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- network audit for all 5 routes

Evidence path: `output/ui-skills-router/YYYY-MM-DD/v2-07-admin-hold/`

## Evidence: 2026-07-15

- all 5 admin routes render the operations hold template with route-specific title and h1
- direct navigation returns 200 and exposes no admin shell, user data, counts, tables, search or mutation controls
- network audit found no `/api/admin/*` or other API requests from held pages
- mobile, desktop, `320x700` and landscape checks pass without overflow, overlap, console errors or small targets
- `npm run auth:surface` passes `25/25` held surfaces and `18/18` guarded high-risk API contracts
- evidence: `output/ui-skills-router/2026-07-15/v2-07-admin-hold/after/`
- report: `output/ui-skills-router/2026-07-15/v2-07-held-routes/audit-report.json`

Native zoom closure:

- representative `/admin` route passes native Chrome 200% at effective viewport `600x450` without overflow or framework overlay
- evidence: `output/ui-skills-router/2026-07-16/native-zoom-current/admin-200.png`

## Non-Scope

- admin authentication, authorization implementation, operational data, mutation APIs
