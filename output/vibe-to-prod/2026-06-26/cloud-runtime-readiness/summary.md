# Cloud Runtime Readiness

Date: 2026-06-26

## Scope

- Added a cloud runtime readiness audit for MBTI Z preview/production gates.
- The audit reads code structure and env key status without printing secret values.
- Launch preflight now includes this cloud readiness gate.

## Evidence

- JSON report: `output/vibe-to-prod/2026-06-26/cloud-runtime-readiness/preview-example-cloud-readiness.json`
- `ok`: false
- `blockerCount`: 2
- `manifestStatus`: blocked
- manifest blocker ids:
  - `supabase_target`
  - `cloud_adapter_implementation`
  - `deploy_env_ready`
- `cloudAdapterImplemented`: false
- cloud service adapter factory present: true
- cloud service adapter manifest guard present: true
- required API routes present: 5
- required API route contracts passing static checks: 5
- required Prisma models present: 6
- Prisma migration directories: 15
- `envOk`: false
- missing required env keys: 0
- deploy-blocking env warnings: 5

## Current Blockers

- `cloud_adapter_implemented`
  - `lib/assessment-runtime-cloud.ts` still returns `null`, so `cloud` mode is intentionally not ready.
- `env_deploy_ready`
  - `.env.example` is not a deploy env; it still contains localhost and placeholder values by design.

## Meaning

Repo hygiene is no longer the preview blocker. The remaining preview/cloud blockers are the missing Supabase-backed adapter, deploy-ready environment values, and Vercel binding.

The cloud readiness source-of-truth is `data/runtime/cloud-runtime-readiness.json`; `lib/assessment-runtime-cloud.ts` reads that manifest before enabling cloud mode.

The async cloud service adapter scaffold now exists and is manifest-gated. Public `createCloudRuntimeAdapter()` still returns `null` until the sync page runtime is deliberately migrated or wrapped.

The manifest now also defines expected API route contracts for the cloud assessment surface. The readiness audit statically checks method guards, authentication boundaries, rate limiting, request schemas, user-scoped Prisma access, and response keys for the five required cloud routes.
