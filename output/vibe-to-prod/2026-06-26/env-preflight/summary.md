# Preview Environment Preflight

Date: 2026-06-26

## Scope

- Hardened environment validation for preview and production targets.
- Added `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME` to the env audit surface.
- Added the repository hygiene gate to launch preflight output.
- Added the cloud runtime readiness gate to launch preflight output.
- Kept secret values out of output; validation reports key names and categories only.

## Guardrail Change

For `preview` and `production`, the env checker now fails when it detects:

- placeholder values
- localhost or `127.0.0.1` URLs/database URLs
- malformed app URLs
- malformed database connection strings
- `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud` before the Supabase-backed adapter is implemented and verified

For `development`, these remain visible warnings unless required keys are missing.

## Evidence

- JSON report: `output/vibe-to-prod/2026-06-26/env-preflight/preview-example-preflight.json`
- `ok`: false
- `repoHygiene.ok`: true
- repo hygiene blockers: 0
- `cloudRuntime.ok`: false
- `cloudRuntime.summary.manifestStatus`: blocked
- cloud runtime blockers:
  - `cloud_adapter_implemented`
  - `env_deploy_ready`
- `env.ok`: false
- missing required keys: 0
- deploy-blocking env warnings: 5
- Vercel binding check: false

The `.env.example` preview check is expected to fail because it intentionally contains placeholder and localhost values. Repo hygiene is no longer the blocking reason in this preflight.
