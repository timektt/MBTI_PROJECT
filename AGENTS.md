# Agent Instructions

## Project State

- This repository is a Next.js 15 Pages Router app for `MBTI Z`.
- Use `npm`; `package-lock.json` is the active lockfile.
- The active product runtime is `guest-local`. Do not switch `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME` to `cloud` until the Supabase-backed adapter has been implemented and verified.
- The current repo has app files at the repository root, while Git history may still show the previous `mbti_test/` app root as deleted. Do not normalize, restore, or stage that move without an explicit task.

## Source Of Truth

- Read `PRD.md`, `CONTEXT.md`, `docs/architecture-overview.md`, `docs/api-surface.md`, `docs/env-matrix.md`, and `docs/execution-status.md` before changing product behavior.
- Treat `CONTEXT.md` as glossary only. Do not put implementation plans there.
- Use `docs/vibe-to-prod-readiness.md` for current production-readiness gates and first-slice direction.
- Code wins over docs when they conflict, but surface the conflict in the final response.

## Workflow

- Work in small vertical slices. Do not redesign the whole app or reconnect all cloud/auth behavior in one pass.
- Default slice shape: user action -> UI/runtime boundary -> validation -> persistence/export artifact -> visible result -> test.
- Keep guest-first quiz, result, dashboard, local history, reconnect bundle, and PNG export working while changing any adjacent surface.
- Do not add dependencies unless existing primitives cannot solve the problem and the trade-off is documented.
- Do not commit, push, deploy, run destructive migrations, or touch production services without explicit confirmation.

## Checks

- Prefer the smallest relevant check first.
- Useful commands:
  - `npm run data:validate`
  - `npx --yes tsx scripts/verify-reconnect-import.ts`
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
  - `npm run env:check`
  - `npm run preflight:preview`
- Never claim a check passed unless it actually ran in this workspace.

## Security And Production Gates

- Never print or commit `.env`, `.env.local`, OAuth secrets, database URLs, Pusher secrets, Cloudinary secrets, or NextAuth secrets.
- Keep `.env.example` committed as names/placeholders only.
- Treat auth, admin, profile, upload, email, database persistence, public share pages, and cloud reconnect as high-risk paths.
- Enforce authorization server-side when reactivating any account, admin, social, or cloud-backed endpoint.
- For production readiness, require passing typecheck, lint, relevant tests, build, env validation, rollback notes, and browser proof for user-facing routes.
