# API Surface

Current API surface must be read in two layers:

1. the active product path now runs primarily through guest local runtime on the client
2. the authenticated/database-backed APIs below remain as the next cloud phase to reconnect

## Active product runtime right now

- `/quiz`
  - uses local guest session state via `localStorage`
- `/result/[id]`
  - resolves guest result artifacts from local history
- `/dashboard`
  - resolves latest guest artifact and guest history locally

These routes currently do **not** depend on the APIs below to function for the main user path.

## Auth and account

- `GET|POST /api/auth/[...nextauth]`
  - returns `503 account_runtime_held` while neither `AUTH_SECRET` nor `NEXTAUTH_SECRET` is configured
- `POST /api/register`
- `POST /api/forgot-password`
- `POST /api/reset-password`
- `POST /api/auth/verify-email`
- `GET /api/check-username`
  - the five account endpoints above are rate-limited and return `503 account_runtime_held`; they do not touch Prisma or email transport in `guest-local`
- `POST /api/profile/updateBio`
- `POST /api/settings/update`
- `POST /api/settings/changePassword`
- `POST /api/user/set-username`

## MBTI assessment

- `POST /api/quiz/start`
  - legacy / next-phase cloud session start path
  - returns localized MBTI Z questions with `kind`, `module`, `poles`, option `metaLabel`, weighted trait scores, and movie score metadata
- `GET /api/quiz/questions?sessionId=...`
  - legacy / next-phase localized question fetch path
- `POST /api/quiz/answer`
  - legacy / next-phase answer persistence path
- `POST /api/quiz/submit`
  - legacy / next-phase result persistence and artifact creation path
  - returns result redirect metadata plus a MBTI Z artifact with house, animal, Movie Profile, share path, and premium preview metadata

Cloud readiness manifest:

- `data/runtime/cloud-runtime-readiness.json`
  - declares the required cloud assessment API routes and Prisma models before `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud` can be enabled
  - declares each required route's expected method, auth boundary, rate-limit requirement, request schema, user-scoped Prisma requirement, and response keys
  - current manifest status is `blocked` until the Supabase-backed adapter and deploy-ready env are verified

Cloud route contract audit:

- `npm run cloud:readiness -- --target=preview --file=.env.example`
  - statically verifies the required cloud routes have method guards, server-session auth where required, `401` responses for protected routes, rate limiting where required, request schema parsing, user-scoped Prisma access, and expected response keys
  - also verifies nested UI-facing API shape wiring for localized question metadata, Movie Profile artifact replay from `scoreDetail`, guest handoff bundle dry-run validation, and guarded persistence import
  - latest proof passes the static contract gate for all `6` required cloud routes

Cloud client contract audit:

- `npm run cloud:contracts`
  - verifies the client-side cloud API boundary with mock `fetch`
  - covers health, quiz start, answer save, quiz submit, result list, reconnect bundle dry-run validation, guarded reconnect persistence import, MBTI Z question metadata, Movie Profile artifact metadata, and sanitized non-2xx error handling
  - does not enable `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud`

Cloud server contract audit:

- `npm run cloud:server-contracts`
  - verifies the manifest-required cloud API route files expose the expected `200` JSON response keys using TypeScript AST inspection
  - verifies schema-backed `POST` cloud routes use safe JSON body parsing before Zod validation
  - verifies authenticated cloud routes keep server-session auth, `401` responses, rate limits, and user-scoped Prisma markers
  - verifies nested UI-facing shape wiring for localized question metadata, Movie Profile artifact replay from `scoreDetail`, dry-run reconnect summaries, conflict guard, and persistence import scaffolds
  - does not connect to the database or enable `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud`

Cloud adapter lifecycle audit:

- `npm run cloud:adapter`
  - verifies the gated async service adapter lifecycle with mock `fetch`
  - proves blocked manifest keeps the public runtime disabled and falls back to `guest-local`
  - proves an implemented manifest stub can create a cloud service adapter that calls the client contract
  - proves the service adapter can normalize cloud quiz start responses with MBTI Z question metadata into a session snapshot, cloud result lists with Movie Profile artifacts into a dashboard state, and reconnect bundle imports into dry-run validation plus guarded persistence states for the future page/runtime migration
  - does not enable the public synchronous `AssessmentRuntimeAdapter` yet

Auth surface isolation audit:

- `npm run auth:surface`
  - verifies legacy account, profile, community, share, and admin pages still render `AccountHold` or `RelaunchState` hold surfaces while auth/cloud reconnect is blocked
  - verifies high-risk account, admin, upload, social, card, comment, and settings APIs have expected method guards, rate limits, and server-side auth markers where applicable
  - verifies no root Next `middleware.ts` or `middleware.js` has been activated before auth reconnect is deliberate
  - does not enable `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud`

Account runtime audit:

- `npm run auth:runtime`
  - executes the five held account handlers and asserts `503 account_runtime_held`
  - asserts an authenticated cloud endpoint returns `401` before Prisma access when no session exists
  - asserts both Auth.js handler methods return `503` while no auth secret is configured

## User result assets

- `GET /api/me/results`
  - list saved quiz results with summary, report status, card, share page, and MBTI Z artifact metadata, including Movie Profile when `scoreDetail` contains movie scoring data, for authenticated users
- `POST /api/me/reconnect-bundle/import`
  - validate a guest-local handoff bundle for the authenticated account scope
  - defaults to `status: "validated"` and `dryRun: true`
  - supports guarded `dryRun:false` import for completed guest results, premium/share/card scaffolds, event logs, and pending-session answers
  - `npm run reconnect:cloud-import` verifies the extracted persistence helper with an in-memory Prisma-shaped transaction before any Supabase target exists
  - still does not enable the public cloud runtime until a real Supabase target is verified
- `GET /api/me/reports`
  - list premium report scaffolds and teaser sections for authenticated users
- `GET /api/me/share-cards`
  - list share-card records and public slugs for authenticated users

## Operational endpoints

- `GET /api/health/db`
  - database reachability check with current app environment metadata
