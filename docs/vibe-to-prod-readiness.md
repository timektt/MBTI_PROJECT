# Vibe To Prod Readiness: MBTI Z

Date: 2026-06-25

## Classification

`prototype-hardening` with a `production-gate`.

The app has a working guest-first product path, but it is not production-ready because the repo move state, cloud target, auth/admin/upload surfaces, env handling, and validation gates still need hardening.

## Skill Routing

- Used `vibe-to-prod` as the controller.
- Used `grill-with-docs` for repo-aware domain language and artifact decisions.
- `repo-hybrid-retrieval` was not available in this session, so evidence was gathered with targeted `rg`, `find`, and source reads.
- UI implementation skills were not used because this pass creates guardrails and a first-slice plan rather than changing a route design.

## Evidence Inspected

- `README.md`
- `CONTEXT.md`
- `package.json`
- `.gitignore`
- `.env.example`
- `.github/workflows/ci.yml`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `docs/architecture-overview.md`
- `docs/api-surface.md`
- `docs/data-foundation.md`
- `docs/env-matrix.md`
- `docs/execution-status.md`
- `docs/mbti-z-execution-board.md`
- `lib/assessment-runtime.ts`
- `lib/assessment-runtime-guest.ts`
- `lib/reconnect-bundle.ts`
- `lib/mbti-guest.ts`
- `lib/result-share-image.ts`
- `pages/quiz.tsx`
- `pages/result/[id].tsx`
- `pages/dashboard.tsx`
- `pages/api/result-share-image.tsx`
- `prisma/schema.prisma`
- `scripts/check-env.mjs`
- `scripts/launch-preflight.mjs`
- `scripts/verify-reconnect-import.ts`

## Resolved Decisions

- Active runtime remains `guest-local`.
- Cloud runtime is a future adapter path and must not be enabled until Supabase/Vercel are verified.
- The first production-minded path is guest quiz/result/dashboard/reconnect/export, not account/cloud/social/admin.
- Auth, admin, upload, profile, email, public share, and cloud persistence are high-risk gates.
- `MBTI Z` is the current product name. `Nocturne` is legacy/hold-state language and should not leak into primary product copy unless deliberately scoped.
- `npm` is the package manager for this repo.

## Open Decisions

1. Root move: decide whether the repository root is now the permanent app root, then stage that move deliberately.
2. Tracked database data: decide whether to remove tracked `mbti_test/db_data/*` from Git history/current tracking in a dedicated hygiene PR.
3. Cloud target: create or select a fresh Supabase project for MBTI Z before cloud runtime work.
4. Vercel target: bind the repo to a dedicated Vercel project before preview/staging.
5. Naming cleanup: product-facing UI now audits clean as `MBTI Z`; source-level motion helpers and handoff filenames were renamed to MBTI Z, while legacy `Nocturne` references remain only in archived/historical docs.

## Current Production Blockers

### P0

- The root move and tracked DB cleanup are staged locally; `npm run repo:hygiene:strict` now passes with `blockerCount: 0`.
- The staged repo hygiene diff still needs review/commit before it can be treated as landed source control state.
- No fresh Supabase runtime target is verified for MBTI Z cloud persistence.
- No dedicated Vercel project binding is confirmed in the repo.

### P1

- `.env.example` existed locally but was ignored by `.gitignore` before this pass; it must remain commit-safe and visible in reviews.
- Reconnect import verification had drifted from the current bundle schema and needed repair.
- No active Next middleware protects admin/account/social routes right now; do not treat hold-state pages as production-protected until auth/authorization is restored server-side.
- The server PNG route now runs as a Node Pages API route instead of an Edge route; local production build no longer emits the prior Edge Runtime `url` warning.

## Validation Run: 2026-06-25

Passed:

- `npm run data:validate`
- `npx --yes tsx scripts/verify-reconnect-import.ts`
- `npm run typecheck`
- `npm run env:check`
- `npm run lint`
- `npm run build`

Notes:

- Reconnect verification now generates its test bundle from the current runtime/data shape instead of an old hardcoded fixture.
- Development env contract is present in `.env.local`; no secret values were printed.
- Build completed without the prior Edge Runtime warning after moving `/api/result-share-image` to Node runtime.
- Full `ui-skills-router` audit passed across 30 routes / 66 samples with `issues: 0`.
- Primary route viewport audit passed across 6 routes / 4 required viewports with `issues: 0`.
- `POST /api/result-share-image` returned a valid `image/png` from `next start` with PNG signature `89504e470d0a1a0a`.

## Validation Run: 2026-06-26

Passed:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run data:validate`
- `npm run env:check`
- `npx --yes tsx scripts/verify-reconnect-import.ts`

Notes:

- Added a Pages Router document shell with `<Html lang="th">`.
- Added a global `prefers-reduced-motion: reduce` CSS policy that disables smooth scrolling and clamps non-essential animation/transition duration.
- Browser accessibility audit passed across 6 primary routes x 2 viewports with `issues: 0`.
- Quiz reduced-motion keyboard proof passed: `Space` selects a radio answer, the next action becomes enabled, `Enter` advances from `คำถาม 1 / 60` to `คำถาม 2 / 60`, and running animations remain `0`.
- Evidence is stored in `output/ui-skills-router/2026-06-26/accessibility-audit/`.
- Export fidelity proof now covers the server PNG path and Chrome browser fallback:
  - direct `POST /api/result-share-image` returned `image/png`, `1080x1350`, PNG signature `89504e470d0a1a0a`
  - clicking the result page download button on the normal server path downloaded the same `1080x1350` PNG
  - forcing `/api/result-share-image` to return `503` exercised the `html2canvas` fallback and downloaded a valid `1080x1350` PNG
  - the fallback needed export-safe clone CSS because `html2canvas` cannot parse the app's global `oklch(...)` Tailwind color tokens
  - WebKit/Safari-engine proof also passed for normal server-button download and forced `html2canvas` fallback at `1080x1350`
- Evidence is stored in `output/ui-skills-router/2026-06-26/export-fidelity/`.
- Dashboard/result responsive proof now passes on the production `next start` build:
  - `/dashboard` and `/result/guest-mqtpomkf-estj` passed at `375x812`, `768x1024`, `1024x768`, and `1440x900` with `issues: 0`
  - no horizontal overflow, no browser/page errors, and the visible `ดาวน์โหลด PNG` action stays in the first viewport
  - all hidden export targets measured `1080x1350` and loaded the animal image before capture
  - `/dashboard` now places the latest artifact block before the compact metrics so `Artifact ล่าสุด` and the `ESTJ` artifact stay inside the early mobile reading path
- Evidence is stored in `output/ui-skills-router/2026-06-26/dashboard-result-responsive/`.
- Home compression proof now passes on the production `next start` build:
  - `/` passed at `375x812`, `768x1024`, `1024x768`, and `1440x900` with `issues: 0`
  - route height dropped from `6031` to `5387` on mobile, `5353` to `4742` on tablet, `4378` to `3806` on tablet landscape, and `4003` to `3268` on desktop
  - first-viewport CTA and the `4 Houses` / `Movie Profile` / `Result Artifact` promise remain visible early
  - visual compression came from tighter hero actions/metrics, a smaller artifact preview on mobile, compact proof chips, shorter feature cards, and list-style `why` / journey sections
- Evidence is stored in `output/ui-skills-router/2026-06-26/home-compression/`.
- Login/mobile vertical-budget proof now passes for `MBTIZ-0607`:
  - `/login` mobile height dropped from `3645` to `2723`
  - `/login` passed at `375x812`, `768x1024`, and `1440x900` with `issues: 0`
  - primary `เข้าแบบทดสอบ` CTA stays in the first viewport and reconnect/runtime sections remain available later in the page
  - guard check for `/types` and `/quiz` at `375x812` passed with `issues: 0`
  - selected UI Skills context was `pbakaus/layout` plus `pbakaus/distill`
- Evidence is stored in `output/ui-skills-router/2026-06-26/mbtiz-0607-login-compression/`.
- Quiz copy centralization moved another `MBTIZ-0501` slice forward:
  - `/quiz` navigation labels, stage labels, and `QuizAnswerDeck` interaction labels now live under `mbtiZQuizCopy`
  - `QuizAnswerDeck` no longer branches on locale for user-facing labels; it receives a typed `answerDeckCopy` object
  - TH and EN selected-answer states passed at `375x812` and `1440x900` with `issueCount: 0`
  - relaunch scenarios now share typed copy from `lib/mbti-z-copy.ts` instead of component-local scenario copy
  - `/profile`, `/settings`, `/explore`, `/share/test`, `/verify-email`, and `/admin` passed at `375x812` and `1440x900` with `issueCount: 0`
  - mobile EN toggle proof passed for every relaunch scenario
  - final UI smoke after the latest build passed `/`, `/login`, `/result/guest-mqu0ksv3-estj`, and `/profile` at `375x812` and `1440x900` with `issueCount: 0`
  - active page UI copy audit no longer finds page-local TH/EN copy branches outside presentation formatting and API/generated legacy text
- Evidence is stored in `output/ui-skills-router/2026-06-26/mbtiz-0501-quiz-copy/`, `output/ui-skills-router/2026-06-26/mbtiz-0501-relaunch-copy/`, and `output/ui-skills-router/2026-06-26/mbtiz-0501-final-ui-smoke/`.
- Shell and primitive audit now closes the remaining UI foundation packet:
  - `MBTIZ-0301` is done after source-level motion helpers and reconnect handoff filenames were renamed from old `Nocturne` naming to MBTI Z naming
  - source grep no longer finds `Nocturne`, `nocturne`, or `mbti-nocturne` in active source directories outside docs/history
  - `MBTIZ-0304` is done by evaluation: `Tabs` and `ScrollArea` are used on dense route panels, while `Progress` and extra `Tooltip` adoption are deferred because they do not remove current page complexity
- Evidence is stored in `output/ui-skills-router/2026-06-26/mbtiz-0301-0304-shell-primitives/`.
- Project-wide UI completion audit:
  - route matrix evidence covers 30 routes / 66 samples with `issueCount: 0`
  - current production `next start` route sweep on 2026-06-29 rechecked 30 routes / 66 browser samples with `issueCount: 0`
  - `npm run ui:route-sweep:verify` now locks that sweep against the current `pages/` route set and passes with `30/30` routes, `66/66` samples, and `0` issues
  - `npm run ui:completion` now locks the full route sweep, reconnect controls compact proof, and UI closeout doc fragments into one durable guard
  - latest completion guard evidence is stored in `output/ui-skills-router/2026-06-29/ui-completion-verify/ui-completion.json`
  - primary route gate evidence covers 6 routes / 24 samples across 4 viewports with `issueCount: 0`
  - reconnect controls compact proof closes the remaining dashboard/login utility-panel audit: `/dashboard` cloud tab and `/login` passed 4 browser samples with default `textarea: 0`, recovery-open `textarea: 1`, no horizontal overflow, and no browser errors
  - active design-system docs now point to `design-system/mbti-z/MASTER.md`; `mbti-nocturne` docs are explicitly historical
  - UI scope is complete for the current guest-local MBTI Z product, while cloud/auth/deploy work remains outside this UI gate
- Evidence is stored in `output/ui-skills-router/2026-06-26/ui-project-completion-audit/`.
- Evidence is stored in `output/ui-skills-router/2026-06-29/reconnect-controls-compact/`.
- Repo hygiene guardrail:
  - added `scripts/audit-repo-hygiene.mjs`
  - added `npm run repo:hygiene` and `npm run repo:hygiene:strict`
  - latest strict audit reports `blockerCount: 0`
  - latest audit reports `trackedDbDataCount: 0`, `trackedOldRootCount: 0`, `trackedOldSourceCount: 0`, and `rootAppUntrackedCount: 0`
  - source move review has `warningCount: 0`; pre-staging review found 138 old-root source files with root counterparts and 3 missing counterparts as reviewed retirements
  - `.gitignore` now prevents future `db_data/` directories from being added at root, under `mbti_test`, or nested paths
- Evidence is stored in `output/vibe-to-prod/2026-06-26/repo-hygiene/audit-report.json` and the apply sequence is documented in `output/vibe-to-prod/2026-06-26/repo-hygiene/staging-plan.md`.
- Preview/production env preflight guardrail:
  - launch preflight now includes repository hygiene status
  - launch preflight now includes cloud runtime readiness status
  - launch preflight now includes auth surface isolation status
  - launch preflight now includes MBTI Z visual asset status
  - launch preflight now includes UI route-sweep evidence status
  - launch preflight now includes Supabase target readiness status
  - launch preflight now includes Vercel target readiness status
  - launch handoff generation now writes a secret-safe external setup packet from the same gates with `npm run launch:handoff`
  - latest launch handoff proof is stored in `output/vibe-to-prod/2026-06-29/launch-handoff/` and reports the current expected status as `blocked`
  - `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME` is now included in env audit output
  - preview/production validation now fails on placeholder values, localhost URLs/database URLs, malformed URLs/connection strings, and `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud` before the Supabase-backed adapter is verified
  - preview/production validation now also blocks URL origin drift, non-HTTPS deploy URLs, non-Postgres database schemes, invalid email transport shapes, short `NEXTAUTH_SECRET`, and Pusher server/client key or cluster mismatch
  - `.env.example` preview proof correctly reports `repoHygiene.ok: true` and `authSurface.ok: true`, then fails with `supabaseTarget.ok: false`, `vercelTarget.ok: false`, `cloudRuntime.ok: false`, `missing: 0`, and `blockingWarnings: 5`
- Supabase target readiness guardrail:
  - added `data/runtime/supabase-target-readiness.json`
  - added `scripts/supabase-target-readiness.mjs`
  - added `npm run supabase:target`
  - the guard extracts Supabase project refs from direct Postgres and pooler URLs without printing credentials
  - the guard verifies the required fresh-target migration dirs are present before external schema apply: `20260604190000_add_premium_mbti_foundation` and `20260629040000_add_mbti_z_question_metadata`
  - preview/production validation blocks local DB URLs, non-Supabase hosts, mismatched refs, known blocked legacy refs, and missing approved target refs
  - current manifest remains `blocked` because preview/production `expectedProjectRef` values are intentionally unset until a fresh MBTI Z Supabase project is approved
- Vercel target readiness guardrail:
  - added `data/runtime/vercel-target-readiness.json`
  - added `scripts/vercel-target-readiness.mjs`
  - added `npm run vercel:target`
  - the guard checks `.vercel/project.json` without deploying or reading env secrets
  - the guard now also verifies the local Vercel deploy contract: `npm`, `package-lock.json`, `npm run build`, required route/build files, and required scripts (`build`, `start`, `verify`, `preflight:preview`)
  - preview/production validation blocks missing/invalid Vercel bindings, missing project/org ids, mismatched approved ids, known blocked project ids, and missing approved target project ids
  - latest `.env.example` preview proof reports the local deploy contract ready with `4/4` required files and `4/4` required scripts, then fails intentionally on missing Vercel binding and missing approved project id
  - current manifest remains `blocked` because preview/production `expectedProjectId` values are intentionally unset until a dedicated MBTI Z Vercel project is created and bound
- Cloud runtime readiness guardrail:
  - added `data/runtime/cloud-runtime-readiness.json` as the cloud readiness manifest
  - added `scripts/cloud-runtime-readiness.mjs`
  - added `npm run cloud:readiness` and `npm run cloud:readiness:strict`
  - latest proof reports manifest status `blocked`, required API routes present `6`, required API route contracts passing static checks `6`, nested UI-facing/API shape checks passing `9`, required Prisma models present `6`, migration directories `16`
  - the static contract gate checks method guards, server-session auth, rate limits, request schemas, user-scoped Prisma access, response keys, localized question metadata, Movie Profile artifact replay, and guest handoff dry-run plus guarded persistence import for the required cloud routes
  - latest proof reports blockers `cloud_adapter_implemented` and `env_deploy_ready`
- Runtime mode guardrail:
  - added `scripts/verify-runtime-guards.ts`
  - added `npm run runtime:guards`, `npm run runtime:guards:cloud`, and `npm run runtime:guards:all`
  - `guest-local` mode reports `configuredMode: guest-local`, `activeMode: guest-local`, and `cloudReady: false`
  - forced `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud` reports `configuredMode: cloud`, then safely falls back to `activeMode: guest-local` while the cloud readiness manifest is still `blocked`
  - the fallback reason is explicit, so accidental cloud env activation is visible during local and CI checks instead of silently switching behavior
- Verify gate hardening:
  - added `npm run reconnect:verify`
  - added `npm run reconnect:cloud-import`
  - added `npm run db:bootstrap:verify`
  - added `npm run assets:verify`
  - added `npm run ui:route-sweep:verify`
  - added `npm run ui:completion`
  - added `npm run cloud:contracts`
  - added `npm run cloud:server-contracts`
  - expanded `npm run verify` to run repo hygiene, data validation, MBTI Z visual asset verification, DB bootstrap contract verification, reconnect import verification, reconnect cloud import verification, runtime fallback guards, auth surface isolation, UI route-sweep evidence verification, UI completion evidence verification, cloud API client contract verification, cloud server contract verification, cloud adapter lifecycle verification, lint, typecheck, and production build
  - latest `npm run verify` passed, so the existing CI workflow now covers the new local production-readiness gates without changing its entry command
- DB bootstrap contract:
  - added `scripts/verify-db-bootstrap-contract.mjs`
  - validates Prisma schema models/constraints, foundation migration fragments, MBTI Z metadata migration fragments, idempotent seed upserts, and canonical data counts without connecting to Supabase
  - latest proof reports `requiredModelCount: 6`, `createdTableCount: 9`, profiles `16`, questions `60`, options `288`, core questions `48`, movie questions `12`, and core dimensions `4`
  - this prepares the fresh Supabase target path without creating a project, applying migrations, seeding data, or enabling `cloud` runtime
- Cloud API client contract:
  - added `lib/assessment-runtime-cloud-client.ts`
  - added `scripts/verify-cloud-api-contract.ts`
  - mock-fetch proof covers `/api/health/db`, `/api/quiz/start`, `/api/quiz/answer`, `/api/quiz/submit`, `/api/me/results?locale=th`, `/api/me/reconnect-bundle/import`, MBTI Z artifact metadata, guest handoff dry-run validation, guarded reconnect persistence import, and sanitized non-2xx error handling
  - this creates the client-side service boundary for the future cloud adapter without enabling `cloud` runtime
- Cloud API server contract:
  - added `lib/api-request.ts`
  - added `lib/reconnect-bundle-cloud-import.ts`
  - added `scripts/verify-cloud-server-contract.ts`
  - added `scripts/verify-reconnect-cloud-import.ts`
  - cloud `POST` routes now use safe JSON body parsing before schema validation
  - malformed JSON strings now return `400` on `/api/quiz/start`, `/api/quiz/answer`, and `/api/quiz/submit`
  - `/api/quiz/start` now returns MBTI Z question metadata for quiz UI rendering: `kind`, `module`, `poles`, `metaLabel`, `weights`, and `movieScores`
  - `/api/quiz/submit` and `/api/me/results` now return MBTI Z artifact metadata for house, animal, Movie Profile, share path, premium preview, and explicit `cloud-core-v1` coverage
  - `/api/me/reconnect-bundle/import` now validates guest handoff bundles for authenticated users in default `dryRun` mode and supports guarded `dryRun:false` persistence import for completed guest results plus pending-session answers
  - `npm run reconnect:cloud-import` verifies the extracted reconnect persistence helper with an in-memory Prisma-shaped transaction, including idempotent result/report/share/card writes and pending-session answer import/skip counts
  - `npm run cloud:server-contracts` now verifies `6` manifest-required server routes with `failedRouteCount: 0` and includes nested shape checks for localized question metadata, Movie Profile artifact replay from `scoreDetail`, dry-run reconnect validation, conflict guard, and persistence import scaffolds
  - this strengthens the Supabase-backed route contract without connecting to Supabase or enabling `cloud` runtime
- Cloud adapter lifecycle:
  - added a gated async cloud service adapter scaffold in `lib/assessment-runtime-cloud.ts`
  - added `scripts/verify-cloud-adapter-lifecycle.ts`
  - added `npm run cloud:adapter`
  - blocked manifest still keeps public `createCloudRuntimeAdapter()` disabled and reports fallback to `guest-local`
  - implemented manifest stub can create the cloud service adapter and drive the mock API lifecycle
  - service adapter now normalizes cloud quiz start responses into session snapshots, result lists into dashboard state, reconnect bundle dry-run validation, and guarded reconnect persistence import state, while keeping the active public runtime on `guest-local`
- Auth surface isolation:
  - added `scripts/audit-auth-surface-isolation.mjs`
  - added `npm run auth:surface`
  - hardened admin card list/delete APIs with explicit method guards and rate limits
  - hardened password reset request/reset APIs with rate limits
  - hardened image upload API with server-side session auth and safer Cloudinary logging
  - `npm run auth:surface` now verifies `25` hold-state pages, `18` high-risk API guard contracts, and absence of root Next middleware before auth reconnect is deliberate
  - expanded `npm run verify` and launch preflight to include the auth surface isolation gate
- Evidence is stored in `output/vibe-to-prod/2026-06-29/cloud-runtime-readiness/preview-example-cloud-readiness.json`.
- Evidence is stored in `output/vibe-to-prod/2026-06-26/env-preflight/preview-example-preflight.json`.
- Evidence is stored in `output/vibe-to-prod/2026-06-26/runtime-guards/`.
- Evidence is stored in `output/vibe-to-prod/2026-06-26/verify-gate/`.
- Evidence is stored in `output/vibe-to-prod/2026-06-29/asset-verify/`.
- Evidence is stored in `output/vibe-to-prod/2026-06-29/ui-route-sweep-verify/`.
- Evidence is stored in `output/vibe-to-prod/2026-06-29/cloud-api-client-contract/`.
- Evidence is stored in `output/vibe-to-prod/2026-06-29/cloud-server-contract/`.
- Evidence is stored in `output/vibe-to-prod/2026-06-29/cloud-adapter-lifecycle/`.
- FigJam checkpoint refresh now reflects the current UI gates:
  - existing board `MBTI Z Redesign Delivery Map` was updated with `MBTI Z UI QA Checkpoint 2026-06-26`
  - diagram marks `NEXT-02`, primary route matrix, `NEXT-05`, and `NEXT-06` as locked before `NEXT-07`
  - later 2026-06-29 route-sweep and asset guards close the local route/asset decisions; the FigJam note is retained as historical checkpoint evidence
- Evidence is stored in `output/ui-skills-router/2026-06-26/figma-checkpoint/`.
- Figma milestone capture set for `MBTIZ-0604` is now placed:
  - captured 6 primary routes x 2 viewports from production `next start` with Chrome via Playwright
  - manifest reports `sampleCount: 12` and `issueCount: 0`
  - all 12 PNGs uploaded successfully into the existing FigJam board `MBTI Z Redesign Delivery Map`
  - uploaded node IDs are `4:206` through `15:206`
  - Figma section layout/labels are deferred because the Figma MCP Starter plan tool-call limit was reached after placement verification
- Evidence is stored in `output/ui-skills-router/2026-06-26/figma-captures/`.
- Asset-board decision is now locked for current UI signoff:
  - `4` house scenes exist at `1600x960`
  - `16` animal posters exist at `1080x1350`
  - `npm run assets:verify` locks the files against `mbtiZProfiles`, expected PNG signatures, and expected dimensions with `0` failures
  - the current style route is accepted as dark, house-color-linked, same-origin, and export-safe
  - animal posters currently read more as abstract sigils than literal animal emblems, so any future work should be a focused recognizability refinement pass rather than a broad moodboard reset
- Evidence is stored in `output/ui-skills-router/2026-06-26/asset-board/`.

## Recommended First Vertical Slice

## Slice

Guest result artifact and reconnect/export gate.

## In Scope

- Complete quiz as guest.
- Persist local `GuestResult` and history.
- Render `/result/[id]`.
- Render `/dashboard` with latest artifact, local history, reconnect bundle status, and PNG export action.
- Validate reconnect bundle import against the current schema.
- Validate server PNG export payload shape.

## Out Of Scope

- Account login persistence.
- Supabase writes.
- Premium unlock/payment.
- Public share slugs.
- Admin operations.
- Production deploy.

## Files Likely To Change

- `scripts/verify-reconnect-import.ts`: keep fixture generation aligned with runtime schema.
- `lib/reconnect-bundle.ts`: only if schema behavior changes.
- `lib/mbti-guest.ts`: only if bundle/result compatibility changes.
- `components/cyber/reconnect-bundle-actions.tsx`: only for import/export UX fixes.
- `components/mbti-z/download-result-button.tsx`: only for PNG fallback or error-state fixes.
- `pages/api/result-share-image.tsx`: only for server PNG validation/rendering fixes.
- `docs/execution-status.md`: record verified evidence after the slice.

## Acceptance Criteria

- Given no local result, `/dashboard` shows an intentional empty state.
- Given a completed guest quiz, `/result/[id]` renders type, house, animal, Movie Profile, dimensions, and export affordance.
- Given a completed guest quiz, `/dashboard` shows the same latest result and a non-empty reconnect bundle.
- Given invalid reconnect JSON, import returns `invalid_json`.
- Given invalid reconnect shape, import returns `invalid_bundle`.
- Given a valid reconnect bundle, import returns `imported`, restores latest result, restores history, restores pending session, and re-import is overwrite-safe.
- Given a valid result payload, `POST /api/result-share-image` returns a non-empty PNG.

## Tests And Checks

- `npm run data:validate`
- `npx --yes tsx scripts/verify-reconnect-import.ts`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Browser check on `/quiz`, `/result/[id]`, `/dashboard` at desktop and mobile widths.
- PNG export check for server path and browser fallback path.

## Risks

- Browser localStorage compatibility and stale bundle shapes.
- PNG export fidelity with local images, fonts, Node server rendering, and browser fallback.
- Naming drift between `MBTI Z` and legacy `Nocturne` copy.
- Current Git move state can hide real diffs until staged cleanly.

## Rollback

- Keep `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=guest-local`.
- If reconnect import regresses, disable import UI while preserving download/copy bundle actions.
- If server PNG export regresses, fall back to DOM capture and keep user-visible error state.

## PR Breakdown

1. Repo hygiene and guardrails: settle root move, remove tracked DB data from tracking, keep `.env.example` visible, add source-of-truth docs, and make `npm run repo:hygiene:strict` pass.
2. Reconnect verifier and runtime schema gate.
3. Browser proof for quiz/result/dashboard and PNG export.
4. Cloud target setup only after the guest-first gate is stable.

## Release Status

`not-production-ready`

The next implementation slice is clear and testable, but staging/production should wait until the P0 blockers are resolved.
