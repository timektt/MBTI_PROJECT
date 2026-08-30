# Platform Setup Runbook

เอกสารนี้สรุปการผูกระบบภายนอกที่โปรเจกต์นี้ต้องใช้ต่อจาก backlog ให้ทีมทำตามได้ตรงกัน

สถานะปัจจุบันต้องเข้าใจก่อน:

- primary flow ตอนนี้วิ่งบน `guest-first local runtime`
- external services ยังเป็น phase ถัดไปสำหรับการคืน `cloud save / auth-backed persistence / premium unlock / deployment`

## GitHub

- Repo: `timektt/MBTI_PROJECT`
- Default branch: `main`
- Use GitHub for:
  - issue backlog
  - PR review
  - release tracking
  - branch discipline

### Required repo files

- `.github/ISSUE_TEMPLATE/*`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `docs/mbti-product-task-backlog.md`
- `docs/architecture-overview.md`

### Recommended issue buckets

- Repo stabilization
- Data foundation
- Quiz engine
- Result experience
- Dashboard and saved history
- Share card
- Launch readiness

## Notion

Use Notion as the product command center for:

- `MBTI Product HQ`
- PRD
- roadmap
- question bank
- result content matrix
- launch checklist

### Created in this session

- `MBTI Product HQ`
- `PRD - Premium MBTI Platform`
- `Execution Roadmap`
- `Quiz Question Bank`
- `Result Content Matrix`
- `Data Dictionary`
- `Execution Roadmap DB`
- `Launch Checklist DB`
- `Quiz Question Bank DB`
- `Result Content Matrix DB`

### Current Notion workspace status

- `Quiz Question Bank DB`
  - current canonical source ใน repo มี 60 questions แล้ว (`48` core MBTI + `12` Movie Profile)
  - Notion database ยังควรถูก sync ให้ตรงกับ canonical module รอบถัดไป
  - linked views:
    - `Active Questions`
    - `Question Review Board`
- `Result Content Matrix DB`
  - free summary and premium strengths starter rows for all 16 MBTI types in `th` and `en`
  - linked views:
    - `Result Content Table`
    - `Result Copy Board`
- `Launch Checklist DB`
  - HQ-linked views:
    - `Launch Checklist Table`
    - `Launch Checklist Board`

### Repo content source of truth

- canonical MBTI data lives in `data/mbti/foundation-data.mjs`
- `prisma/seed.ts` reads from that module instead of owning starter content directly
- validate canonical data with `npm run data:validate` before large seed or content updates
- verify the schema/migration/seed bootstrap contract with `npm run db:bootstrap:verify` before applying migrations or seeds to a fresh Supabase target
- client assessment runtime boundary now lives in `lib/assessment-runtime.ts`
  - current active adapter is still `guest-local`
  - the file exists to keep future cloud reconnect work from touching every page directly
- guest runtime now also materializes a local `guest-to-cloud handoff bundle`
  - source data: current guest session, latest result, and recent history
  - current user-facing surfaces:
    - `dashboard`
    - `login/register/forgot-password` hold state
  - current artifact actions:
    - download bundle JSON locally
    - copy bundle JSON locally
    - restore/import a valid bundle back into the browser via recovery console
  - intended future usage: import guest data into account-backed persistence after auth reconnect
  - current logic verifier:
    - `npx --yes tsx scripts/verify-reconnect-import.ts`
    - covers invalid JSON, invalid bundle shape, valid import, and idempotent re-import
  - current cloud import helper verifier:
    - `npm run reconnect:cloud-import`
    - covers deterministic completed-result import, premium/share/card scaffolds, pending-session answer import, skipped answer accounting, event log creation, and idempotent re-import against an in-memory Prisma-shaped transaction
  - cloud reconnect contract:
    - `POST /api/me/reconnect-bundle/import`
    - validates the same guest handoff schema for an authenticated user in default `dryRun` mode
    - supports guarded `dryRun:false` import for completed guest results, premium/share/card scaffolds, event logs, and pending-session answers
    - does not enable `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud`; live persistence proof still requires a verified Supabase target

## Supabase

- Target organization: `timektt's Org`
- Connector-authenticated org check currently shows exactly one available organization:
  - `timektt's Org` (`bvtouqsabldotwjbpejw`)
  - plan: `free`
- Existing project discovered in this session:
  - `MBTI Social Platform`
  - project id: `pjsahbngizfwiatgnwby`
  - region: `ap-southeast-1`
- Additional currently visible projects in the same org:
  - `DATA_1` (`INACTIVE`)
  - `Vote_Project` (`ACTIVE_HEALTHY`, unrelated to MBTI)

### Intended usage

- Postgres hosting for production and preview-compatible environments
- schema changes applied from Prisma-authored SQL migrations
- optional generated TypeScript types for API consistency

### Current blocker

- The old project `MBTI Social Platform` is not the runtime target for the current MBTI Z relaunch.
- A fresh Supabase project is required before cloud-backed verification can continue.
- `data/runtime/supabase-target-readiness.json` currently keeps preview/production target refs unset and status `blocked`.
- `npm run supabase:target -- --target=preview --file=.env.local` must pass before preview/prod env binding can be treated as isolated.
- The same Supabase target gate also verifies the repo still contains the required fresh-target migrations before any external apply step:
  - `20260604190000_add_premium_mbti_foundation`
  - `20260629040000_add_mbti_z_question_metadata`
- The current Supabase MCP flow for project creation requires:
  1. user confirmation of the target organization
  2. `get_cost`
  3. `confirm_cost`
  4. `create_project`

### Important rule

Prisma remains the schema source of truth even when migrations are applied through Supabase tooling.

## Vercel

- Team discovered in this session:
  - `SuperBear's projects`
  - team id: `team_B5Pm6p3bUokzVLTwf29XJO1q`

### Intended usage

- preview deployments for pull requests
- production deployment from `main`
- environment variable management
- build/runtime verification

### Required environment variables

Use `.env.example` as the canonical key list when configuring Vercel environments.

### Preflight helpers added in this repo

- `npm run env:check`
  - validate local `.env.local` without printing secret values
- `npm run env:check:preview`
  - validate preview/prod-style environment values from current shell
- `npm run preflight`
  - run repo + env readiness checks for local development
- `npm run preflight:preview`
  - run repo + env readiness checks before preview/prod handoff
- `npm run launch:handoff`
  - generate a secret-safe launch handoff packet from the current preflight, Supabase, Vercel, env, and cloud-runtime gates
  - default output: `output/vibe-to-prod/<date>/launch-handoff/`
- `npm run supabase:target`
  - verify `DATABASE_URL` and `DIRECT_URL` resolve to the approved Supabase project ref without printing secret values
  - verify required Supabase migration directories are present before a fresh-target apply
- `npm run vercel:target`
  - verify `.vercel/project.json` resolves to the approved Vercel project/org target without deploying
  - verify the local Vercel deploy contract before project handoff:
    - framework: `nextjs`
    - package manager: `npm`
    - lockfile: `package-lock.json`
    - build command: `npm run build`
    - required scripts: `build`, `start`, `verify`, `preflight:preview`

### Current blocker

- The repo is not yet bound to a live Vercel project in this session.
- `data/runtime/vercel-target-readiness.json` currently keeps preview/production project ids unset and status `blocked`.
- `npm run vercel:target -- --target=preview` must pass before preview/prod deploy binding can be treated as isolated.
- The same Vercel target gate now verifies the repo deploy contract before handoff so the dedicated project is not created against the wrong package manager, root, or build command.
- `vercel` CLI is present on the machine, but it is not logged in.
- Connector-authenticated project listing for `SuperBear's projects` does not contain an MBTI-specific project yet.
- The authenticated Vercel `/new` flow is reachable and shows a Git repository URL import field, but the project has not been created or bound yet.
- Chrome-authenticated import flow now resolves the exact repo `timektt/MBTI_PROJECT` and proposes `mbti-project` as the project slug.
- The remaining action at this point is the actual create/deploy step, which has been intentionally held back pending explicit production-deploy confirmation.

## Runtime verification status

### Already verified locally

- `landing -> quiz -> result -> dashboard` works in guest mode on localhost
- the public shell no longer polls `next-auth` session on primary guest routes
- guest-to-cloud handoff package can now be surfaced, downloaded, and acknowledged from both `/dashboard` and `/login`
- guest-to-cloud handoff package now also has a local recovery/import path in the UI
- MBTI Z hold/relaunch states render correctly on representative legacy routes:
  - `/profile`
  - `/settings`
  - `/explore`
  - `/share/[slug]`
  - `/card/[id]`
  - `/setup-profile`
  - `/verify-email`
- build/type/lint/data validation all pass

### Still blocked on cloud runtime

- local Postgres is not installed on this machine
- Docker is not available on this machine
- no fresh Supabase runtime target has been provisioned yet
- Vercel project is still unlinked
- the handoff bundle is ready locally, but there is still no cloud target to receive it
- Chrome-based file upload automation for the recovery path may require enabling `Allow access to file URLs` on the Codex Chrome Extension before upload verification can be fully automated

## Local validation flow

Run these commands before opening a PR:

```bash
npm run repo:hygiene:strict
npm run data:validate
npm run assets:verify
npm run db:bootstrap:verify
npm run reconnect:verify
npm run reconnect:cloud-import
npm run runtime:guards:all
npm run auth:surface
npm run ui:route-sweep:verify
npm run ui:completion
npm run cloud:contracts
npm run cloud:server-contracts
npm run cloud:adapter
npm run env:check
npm run lint
npm run typecheck
npm run build
```

For full local verification:

```bash
npm run verify
```

`npm run verify` now includes repo hygiene, data validation, MBTI Z visual asset verification, DB bootstrap contract verification, reconnect import verification, reconnect cloud import verification, runtime fallback guards, auth surface isolation, UI route-sweep evidence verification, UI completion evidence verification, cloud API client contract verification, cloud server contract verification, cloud adapter lifecycle verification, lint, typecheck, and production build.

For deployment-oriented verification:

```bash
npm run preflight
npm run launch:handoff -- --target=preview --file=.env.example
```
