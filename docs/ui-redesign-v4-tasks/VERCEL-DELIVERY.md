# MBTI Z Vercel Delivery Evidence

Updated: 2026-08-31
Branch: `codex/dependency-remediation`
Runtime: `guest-local`
Status: `ROUTE-SCOPED RATE LIMIT LOCAL VERIFIED - PREVIEW PENDING`

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
| `npm run verify` | PASS locally and in GitHub CI for runtime SHA `4e50113` |
| Production dependency audit | PASS LOCALLY: 0 findings |

The guest-local profile requires the three active environment names and verifies
repository hygiene, assets, held auth surfaces, UI evidence, Vercel binding,
cloud manifest guards and guest fallback behavior. It does not authorize any
held service to become active.

## Dependency Remediation Preview

| Field | Accepted evidence |
| --- | --- |
| PR | `#9` - `fix: remediate production dependency chain` |
| Deployment id | `dpl_9GTnTGZ2yaNxbuzEVA2vjheYkFin` |
| Runtime source SHA | `4e5011364515089608eeacc313b64a8df73803e3` |
| Source branch | `codex/dependency-remediation` |
| State | `READY` |
| Generated URL | `https://mbti-project-8jwln0q2p-superbears-projects-c668412a.vercel.app` |
| Branch alias | `https://mbti-project-git-codex-depe-526e90-superbears-projects-c668412a.vercel.app` |
| GitHub CI | `verify` passed for the same runtime SHA |
| Preview route smoke | Home, Quiz, Types, INTJ Detail, Dashboard and Login returned `200` |
| Account API boundary | session/register/recovery routes remained held or fail-closed; `/api/me/results` returned `401` rather than loading Auth.js in guest-local |
| Result image API | valid payload returned `200 image/png`, 602,954 bytes and a valid PNG signature |
| Result image SSRF guard | absolute metadata URL payload returned `400` |
| Current-source browser matrix | local production server passed 31 patterns, 16 Type routes and 130 samples with 0 failures |

Vercel Deployment Protection prevented the isolated browser runner from entering
the latest Preview without a bypass secret. Acceptance therefore combines the
current-source local browser matrix with direct protected Preview route and API
requests through the authenticated Vercel CLI. This limitation remains explicit;
the latest Preview was not represented as a new CDN performance or visual run.

### Route-Scoped Rate-Limit Follow-Up

The shared-IP residual is fixed locally. Rate-limit cache keys now combine the
normalized request pathname with the client IP, while query strings and trailing
slashes resolve to the same route bucket. The focused contract proves route
isolation and query-bypass protection. A local HTTP burst exhausted `/api/register`
at `429`, then `/api/auth/verify-email` returned its independent held-runtime
`503` for the same IP. Full verification and the refreshed 130-sample browser
matrix pass at source fingerprint
`5a418fc348a10eb35fb34f0e66ab1b92d6164cd9f903bf4896593ee34917823c`.
The new PR/Vercel Preview acceptance remains pending until this source is pushed.

## Previous Visual Preview Baseline

| Field | Accepted evidence |
| --- | --- |
| Deployment id | `dpl_6PD1JaArssfsGLhQAXQEcbj7MNb6` |
| Source SHA | `4895b2e9ea89b44bb13732661fd40a5069d96bca` |
| Source branch | `codex/vercel-delivery` |
| State | `READY` |
| Generated URL | `https://mbti-project-mogpbevy2-superbears-projects-c668412a.vercel.app` |
| Branch alias | `https://mbti-project-git-codex-verc-0c128d-superbears-projects-c668412a.vercel.app` |
| HTTP route smoke | 46/46 direct requests returned `200` |
| Browser acceptance | 31 patterns, 16 Type routes, 130 samples, 0 failures |
| Result image API | valid payload returned `200 image/png` and 604,010 bytes |
| Result image SSRF guard | absolute metadata URL payload returned `400` |

The browser run covered TH/EN and assigned 320, 390, 768, 1024 and 1440
viewports. It asserted the final deployment origin, one `main`, one route H1,
horizontal overflow, clipped controls, framework overlays, broken images,
visible asset fallbacks, console errors and page errors. Protected Preview was
accessed with an automation bypass; the Vercel Toolbar was excluded from test
requests with `x-vercel-skip-toolbar`.

Accepted screenshots include Home, Type Atlas and INTJ Type Detail at 390 and
1440 pixels under `output/ui-redesign-v3/screenshots/`. Visual inspection found
no card, locale-control, image or content overlap in those target surfaces.

### Deployment Findings Resolved Before Acceptance

| Deployment | Result | Decision |
| --- | --- | --- |
| `dpl_Dsw2r1GFKmyvSyMotEcktakg8N4A` | first Git artifact was misclassified as Production | canceled; no alias assigned |
| `dpl_GNTyhu6kBAcV9pDVTnGXk6avMR4g` | manual upload context reached 826.5 MB | canceled; `.vercelignore` added |
| `dpl_SP2DeMs5RYjnn2RseeYnECtzPU74` | Vercel rejected vulnerable Next.js 15.3.1 | Next.js patched to 15.5.24 |
| `dpl_BNDP32PyP9nZDXQETRAeYnXMiBXj` | `@vercel/og@1` failed at runtime on dynamic `fs` require | renderer reverted to compatible 0.11.1 |
| `dpl_DanZk9i2P3CmX2bStGD52fayUHBt` | protected self-fetch returned HTML instead of the animal image | bounded same-origin fetch and data URL render added |
| `dpl_BfpbfnhCmWJXAnoFQZ9sxbRPSyD9` | Vercel install completed without a generated Prisma client | `postinstall` now runs `prisma generate` |
| `dpl_4uaEsLKinVZyEH33J5QQaZMo2WG4` | build was READY, but guest `/api/me/results` eagerly loaded Auth.js and returned `500` | server auth import moved behind the configured-runtime guard |
| `dpl_9GTnTGZ2yaNxbuzEVA2vjheYkFin` | build, route/API smoke and result-image contracts passed | accepted dependency-remediation Preview |

## Production And Rollback

Production was not promoted. The local remediation branch now reports zero
production-tree findings from `npm audit --omit=dev`. It replaces direct
`@vercel/og` use with bundled `next/og`, migrates the session boundary to Auth.js
v5 beta, removes the inactive Nodemailer/account transport, moves `shadcn` CLI
ownership to development, removes unused server-only packages, and upgrades to
Next.js 16.3.3 with React 19.2.8. Account APIs remain explicitly held.

There is no previous healthy Production deployment for this new Vercel project,
so a real rollback rehearsal has no valid target. Card 28 remains blocked until:

- PR `#9` is reviewed and explicitly approved for merge/promotion;
- protected `main` contains the accepted runtime SHA;
- the first healthy Production deployment is recorded before a later rollback rehearsal can be truthful.
