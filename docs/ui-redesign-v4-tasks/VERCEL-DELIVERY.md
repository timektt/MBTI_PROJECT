# MBTI Z Vercel Delivery Evidence

Updated: 2026-08-30
Branch: `codex/vercel-delivery`
Runtime: `guest-local`
Status: `PREVIEW SOURCE PREPARED`

## Bound Target

| Field | Observed value |
| --- | --- |
| Vercel team | `SuperBear's projects` |
| Organization id | `team_B5Pm6p3bUokzVLTwf29XJO1q` |
| Project | `mbti-project` |
| Project id | `prj_y9MToCdY2J2QLiyr1lQdVyQBaE3y` |
| Git repository | `timektt/MBTI_PROJECT` |
| Production branch | `main` |
| Framework | Next.js |
| Node.js | `22.x` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Root directory | `.` |

The ignored local `.vercel/project.json` binding matches the approved project
and organization ids. `npm run vercel:target` passes for both deployment targets.

## Environment Boundary

Only these names are configured for Preview and Production:

- `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME`
- `NEXT_PUBLIC_SITE_URL`
- `NEXTAUTH_URL`

The runtime value remains `guest-local`. Auth, database, email, realtime, media
and cloud reconnect secrets are intentionally not provisioned. Their UI/API
surfaces remain held and the full-cloud preflight remains blocked.

## Pre-Deploy Evidence

| Gate | Result |
| --- | --- |
| Preview target binding | PASS |
| Production target binding | PASS |
| Guest-local Preview preflight | PASS |
| Guest-local Production preflight | PASS |
| Full-cloud Preview preflight | BLOCKED AS DESIGNED |
| Browser route sweep | 31 patterns, 16 concrete Type routes, 130 samples, 0 failures |
| UI quality verifier | PASS |

The guest-local profile requires the three active environment names and verifies
repository hygiene, assets, held auth surfaces, UI evidence, Vercel binding,
cloud manifest guards and guest fallback behavior. It does not authorize any
held service to become active.

## Preview Evidence

Pending connected-Git deployment. Record the deployment id, source commit,
generated URL, build state, route/API smoke and screenshots after Vercel reports
the Preview artifact as READY.

## Production And Rollback

Production promotion remains pending Preview acceptance and protected-main
alignment. Promote the accepted artifact; do not rebuild from an unrelated
working tree. Record the Production deployment id, canonical URL, smoke result,
previous healthy deployment and exact rollback target before closeout.
