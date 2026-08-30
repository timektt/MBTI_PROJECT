# MBTI Z Launch Handoff

Generated: 2026-06-29T05:37:17.118Z

Target: `preview`
Env source: `.env.example`
Overall status: `blocked`

## Proven Local Gates

- Repository hygiene: `ok`
- Visual assets: `4/4 houses, 16/16 animal posters`
- Auth surface isolation: `ok`
- UI route sweep: `30/30 routes, 66/66 samples`
- Supabase required migrations: `2/2`
- Vercel deploy contract files: `4/4`
- Vercel deploy contract scripts: `4/4`
- Cloud API contracts: `6/6`
- Cloud API shape checks: `9/9`
- Runtime mode requested by env: `guest-local`

## Current Blockers

Supabase:
- local_database_connection
- non_supabase_database_connection
- local_database_connection
- non_supabase_database_connection
- approved_supabase_project_ref_missing

Vercel:
- missing_vercel_project_binding
- approved_vercel_project_id_missing

Environment:
- NEXT_PUBLIC_SITE_URL still points to localhost.
- NEXTAUTH_URL still points to localhost.
- DATABASE_URL still points to a local database.
- DIRECT_URL still points to a local database.
- Placeholder values detected for: NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_ID, GITHUB_SECRET, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, EMAIL_FROM, PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, NEXT_PUBLIC_PUSHER_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

Cloud runtime:
- cloud_adapter_implemented
- env_deploy_ready

## Required External Actions

- Create or select a fresh MBTI Z Supabase project in the approved organization.
- Update `data/runtime/supabase-target-readiness.json` with the approved preview/production project refs.
- Bind deploy-safe `DATABASE_URL` and `DIRECT_URL` values from that Supabase target without committing secrets.
- Create and bind a dedicated Vercel project for `timektt/MBTI_PROJECT`.
- Update `data/runtime/vercel-target-readiness.json` with the approved Vercel project id.
- Configure preview/production Vercel env values from `.env.example` after Supabase target refs are approved.
- Replace preview/production placeholder and localhost env values in the deployment environment; keep `.env.example` placeholder-only.
- Keep `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=guest-local` until Supabase/Vercel/env gates are ready and the cloud adapter is implemented.

## Verification Commands

```bash
npm run verify
npm run supabase:target -- --target=preview --file=.env.example --json
npm run vercel:target -- --target=preview --json
npm run preflight:preview -- --file=.env.example --json
```

## Notes

- This handoff is secret-safe: it records env key status, blockers, hosts/refs, and guard summaries, not secret values.
- A blocked handoff is expected until fresh Supabase and Vercel targets are approved and bound.
- Do not enable `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud` while this handoff is blocked.
