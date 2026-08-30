# UI V2 Page Tasks: Account Hold Routes

Routes:

- `/login`
- `/register`
- `/forgot-password`

Primary files:

- `components/cyber/account-hold.tsx`
- `components/cyber/reconnect-bundle-actions.tsx`
- `pages/login.tsx`
- `pages/register.tsx`
- `pages/forgot-password.tsx`
- `lib/mbti-z-copy.ts`

Runtime rule: account/auth flow remains unavailable. UI must not look like a working login form

## ACCOUNT-001: Shared Account Hold Hierarchy

- Status: `DONE`
- Priority: `P1`
- Parallel group: `P2-ACCOUNT`
- Dependencies: `SYS-002`, `SYS-003`

Tasks:

- literal status title and concise reason
- primary action returns to available guest flow
- secondary action to dashboard only when useful
- technical runtime details behind disclosure
- no fake form fields or disabled OAuth buttons
- one unframed main state; no nested cards

Acceptance:

- user understands what is unavailable and what works now within first viewport
- primary guest action visible at 320x700 and 390x844

## ACCOUNT-002: Reconnect Recovery Placement

- Status: `DONE`
- Priority: `P1`
- Dependencies: `DASH-007`, `ACCOUNT-001`

Tasks:

- reconnect status compact by default
- recovery console only after explicit toggle
- no textarea in default state
- import error/success accessible feedback

Acceptance: account hold remains primary; reconnect controls do not dominate page

## ACCOUNT-003: `/login` Route QA

- Status: `DONE`
- Priority: `P1`
- Dependencies: `ACCOUNT-001`, `ACCOUNT-002`

Checks: title/meta, guest CTA, dashboard link, reconnect default/open, TH/EN, 6 viewports, keyboard, 200% zoom

## ACCOUNT-004: `/register` Route QA

- Status: `DONE`
- Priority: `P1`
- Dependencies: `ACCOUNT-001`

Checks: registration-specific title does not imply registration works; guest CTA; TH/EN; 320/390/768/1440

## ACCOUNT-005: `/forgot-password` Route QA

- Status: `DONE`
- Priority: `P1`
- Dependencies: `ACCOUNT-001`

Checks: recovery-specific title, no fake reset form, clear available-now action, TH/EN, 320/390/768/1440

## ACCOUNT-006: Account Hold Completion Gate

- Status: `DONE`
- Priority: `P0`
- Dependencies: `ACCOUNT-001..005`

Validation:

- `npm run auth:surface`
- `npm run reconnect:verify`
- `npm run runtime:guards`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- route sweep for all 3 routes

Evidence path: `output/ui-skills-router/YYYY-MM-DD/v2-07-account-hold/`

## Evidence: 2026-07-15

- route-specific `mode`, title, meta, h1 and concise unavailable copy implemented for all 3 routes
- account hierarchy, compact reconnect disclosure and Guest recovery actions visually reviewed
- browser matrix passed at `320x700`, `390x844`, `768x1024`, `1024x768`, `1440x1000`, landscape `844x390` and `1600x1000`
- TH/EN, keyboard disclosure, touch targets, overflow, header overlap, console, network and broken-media checks passed
- production build, `npm run lint`, `npm run typecheck`, `npm run auth:surface`, `npm run reconnect:verify`, `npm run runtime:guards` and `npm run ui:held-routes:verify` passed
- evidence: `output/ui-skills-router/2026-07-15/v2-07-account-hold/after/`
- report: `output/ui-skills-router/2026-07-15/v2-07-held-routes/audit-report.json`

Native zoom closure:

- `/login` passes native Chrome 200% at effective viewport `600x450`; `scrollWidth=clientWidth=600`
- evidence: `output/ui-skills-router/2026-07-16/native-zoom-current/login-200.png`

## Non-Scope

- NextAuth provider activation, credential forms, email sending, account persistence
