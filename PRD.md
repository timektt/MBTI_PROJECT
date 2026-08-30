# PRD: MBTI Z

## 1. Problem

MBTI Z should give Thai-first users a polished personality assessment flow that works before account/cloud infrastructure is fully reconnected. The current product must preserve a reliable guest-first path while preparing for account-backed persistence, premium reports, share cards, and production deployment.

## 2. Users And Roles

- Guest: takes the assessment, views a result artifact, exports PNG, and keeps local history in the browser.
- User: future account-backed version of a guest with saved results, profile, premium report access, and share history.
- Admin: future operations role for moderation, user/card management, and content operations.
- Operator: developer or product owner validating launch readiness, environments, migrations, and release gates.

## 3. Core Flows

1. Guest opens `/quiz`, answers the canonical MBTI Z question bank, and receives a local result.
2. Guest opens `/result/[id]`, sees MBTI type, house, animal signature, Movie Profile, dimensions, and premium teaser.
3. Guest opens `/dashboard`, sees latest result, local history, PNG export, and reconnect bundle status.
4. Guest downloads or copies a `guest-cloud-handoff-v1` reconnect bundle for future cloud/account import.
5. Operator validates env, data, build, and route behavior before enabling preview, production, or cloud runtime.

## 4. Non-Goals

- Do not enable cloud save until a fresh Supabase target and cloud adapter are verified.
- Do not enable premium unlock/payment in the current slice.
- Do not reactivate social/community/admin behavior beyond intentional hold states until auth and authorization are production-ready.
- Do not deploy production without explicit confirmation and a rollback path.

## 5. Acceptance Criteria

- Given a clean browser, when a guest completes `/quiz`, then `/result/[id]` renders a valid MBTI Z artifact without server persistence.
- Given a local result exists, when the guest opens `/dashboard`, then the latest result, history, reconnect status, and PNG export affordance are visible.
- Given a valid reconnect bundle JSON, when it is imported through the runtime boundary, then latest result, history, and pending session are restored idempotently.
- Given invalid reconnect payloads, when imported, then the app rejects them without corrupting current local data.
- Given preview or production is being prepared, when preflight runs, then required env names, docs, CI, migrations, and deployment binding status are explicit.

## 6. Data Model

- Guest runtime stores `GuestSession`, `GuestResult`, history, and `GuestCloudReconnectBundle` in browser storage.
- Prisma remains the source of truth for future cloud-backed models: `User`, `AssessmentSession`, `AssessmentAnswer`, `QuizResult`, `PersonalityProfile`, `PremiumReport`, `ShareCard`, and `EventLog`.
- Current production discipline: no destructive migrations, no production database writes, and no cloud runtime switch until adapter verification exists.

## 7. API And Integration Contract

- Active guest quiz/result/dashboard path should not require database APIs.
- `POST /api/result-share-image` accepts validated result payloads and returns a `1080x1350` PNG.
- Future cloud assessment endpoints live under `/api/quiz/*` and `/api/me/*`, but are next-phase paths until auth/cloud persistence is verified.
- `GET /api/health/db` is the operational DB reachability check for cloud phases.

## 8. Security

- Auth: NextAuth exists but account surfaces are intentionally held until reconnect.
- Authorization: required server-side before restoring admin, social, profile, upload, or cloud persistence behavior.
- Rate limit: required for auth, upload, email, and future public share/assessment APIs before production exposure.
- Audit log: use `EventLog` or an equivalent append-only trail for sensitive cloud/account events.
- Secret handling: commit env names/placeholders only; never commit real `.env` values.

## 9. Observability

- Local guest flow: deterministic scripts plus browser QA evidence.
- Cloud preview/production: preflight output, CI, health check, build logs, and smoke tests.
- Future account/cloud events: structured logs for assessment session lifecycle, reconnect import, premium unlock, share-card generation, and admin actions.

## 10. Release Plan

- Staging: bind a dedicated Vercel project and fresh Supabase project, then keep runtime as `guest-local` until cloud adapter passes.
- Migration: additive Prisma migrations only, reviewed before execution.
- Rollback: disable cloud runtime by setting `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=guest-local`; keep guest path independent from account/cloud services.
- Feature flag: cloud persistence, premium unlock, public share, and admin operations should return behind explicit readiness gates.
