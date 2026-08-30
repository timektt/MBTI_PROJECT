# UI V2 Page Tasks: Community, Share And Card Hold

Routes remain `RelaunchState` until social/share authorization and persistence are verified

## Route Manifest

| Task | Route | Scenario | Sample | Status |
| --- | --- | --- | --- | --- |
| `COMM-101` | `/explore` | `community` | `/explore` | `DONE` |
| `COMM-102` | `/leaderboard` | `community` | `/leaderboard` | `DONE` |
| `COMM-103` | `/card/[id]` | `community` | `/card/demo-card` | `DONE` |
| `COMM-104` | `/card/me` | `community` | `/card/me` | `DONE` |
| `COMM-105` | `/profile/[username]/cards` | `community` | `/profile/demo/cards` | `DONE` |
| `COMM-106` | `/share/[slug]` | `share` | `/share/demo` | `DONE` |

## COMM-001: Community Hold Scenario

- Status: `DONE`
- Priority: `P1`
- Parallel group: `P2-COMMUNITY`
- Dependencies: `PROFILE-001`, `SYS-007`

Tasks:

- explain community surfaces are paused without exposing internal API details
- primary action routes to active guest experience
- distinguish community browse from public share intent
- no fake feeds, counts, leaderboard rows or card actions

Acceptance: held UI does not imply likes/comments/follows are persisted

## COMM-002: Share Hold Scenario

- Status: `DONE`
- Priority: `P1`
- Dependencies: `COMM-001`

Tasks:

- share slug route has specific not-active message
- offer result/dashboard recovery only when meaningful
- no fake public result content

Acceptance: invalid/demo slug never leaks internal error or legacy content

## COMM-003: Dynamic Route Safety

- Status: `DONE`
- Priority: `P1`
- Dependencies: `COMM-001`, `COMM-002`

Checks:

- encoded/special id and slug
- long username path
- missing parameter sample behavior
- no user-provided string rendered unsafely in hold copy

## COMM-101..106: Route-Level QA Tasks

For every manifest task:

- HTTP/status and correct scenario
- mobile and desktop screenshots
- TH/EN copy
- h1/title/CTA destination
- no legacy social controls
- no overflow, console errors, broken media or unnamed interactive

## COMM-110: Community/Share Completion Gate

- Status: `DONE`
- Priority: `P0`
- Dependencies: `COMM-001..003`, `COMM-101..106`

Validation:

- `npm run auth:surface`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- route sweep: 6 routes x required viewports

Evidence path: `output/ui-skills-router/YYYY-MM-DD/v2-07-community-share-hold/`

## Evidence: 2026-07-15

- community, card and public-share intents now have route-truthful TH/EN title, h1, summary and CTA labels
- all 6 routes pass `390x844` and `1440x1000`; representative share route also passes `320x700` and landscape stress checks
- encoded card id and share slug return 200, are not reflected into hold copy and do not create overflow
- no feed, leaderboard rows, social controls, public result content, API requests, forms or tables render
- evidence: `output/ui-skills-router/2026-07-15/v2-07-community-share-hold/after/`
- report: `output/ui-skills-router/2026-07-15/v2-07-held-routes/audit-report.json`

Native zoom closure:

- representative `/share/demo` route passes native Chrome 200% at effective viewport `600x450` without overflow or framework overlay
- evidence: `output/ui-skills-router/2026-07-16/native-zoom-current/share-demo-200.png`

## Non-Scope

- social feed, likes, comments, follows, public card rendering, public result sharing
