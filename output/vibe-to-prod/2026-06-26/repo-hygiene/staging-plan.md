# Repo Hygiene Staging Plan

Date: 2026-06-26

## Purpose

Normalize the previous `mbti_test/` app root move into the repository root while removing tracked PostgreSQL data files from the Git index.

This plan is intentionally not executed by the audit command.

## Current Evidence

- `npm run repo:hygiene:strict` now reports `blockerCount: 0`.
- Old root tracked paths: 0
- Old root tracked source/config paths: 0
- Old root tracked `db_data` paths: 0
- Root app untracked source groups: 0
- Staged old-root deleted paths: 1384
- Unreviewed missing old-root source counterparts: 0

## Reviewed Retirements

These old-root source paths have no root counterpart and should stay retired:

- `mbti_test/middleware.ts`
  - Reason: guest-first runtime intentionally has no active Next middleware until server-side auth/authorization is rebuilt.
- `mbti_test/pages/reset-password.ts`
  - Reason: old duplicate API handler lived under `pages/` and is replaced by `pages/api/reset-password.ts` plus `pages/reset-password.tsx`.
- `mbti_test/scripts/debug-env.ts`
  - Reason: old debug helper printed `DATABASE_URL` and should not be restored.

## Apply Sequence

This sequence was applied on 2026-06-26 without committing or pushing.

1. Re-run the read-only audit:

```bash
npm run repo:hygiene
```

2. Review untracked/generated files before staging:

```bash
git status --short
```

3. Remove tracked database data from the Git index while preserving local working files if any still exist:

```bash
git rm --cached -r mbti_test/db_data
```

4. Stage old-root deletions deliberately:

```bash
git add -u -- mbti_test
```

5. Stage root app files with explicit pathspecs instead of a bare `git add -A`:

```bash
git add -- .gitignore .env.example .github AGENTS.md BUILD_DEV.md CONTEXT.md Dockerfile PRD.md code_review.md components.json components data design-qa.md design-system devcheck.md docker-compose.override.yml docker-compose.yml docs eslint.config.mjs event-flow.md lib next.config.ts package-lock.json package.json pages postcss.config.js prisma project-structure.md public react-qrcode-logo.d.ts scripts styles tailwind.config.js tsconfig.json types
```

6. Optionally stage only this pass's evidence artifacts if the PR is expected to carry local audit evidence:

```bash
git add -- output/vibe-to-prod/2026-06-26/repo-hygiene output/vibe-to-prod/2026-06-26/env-preflight
```

7. Confirm generated scratch artifacts are still unstaged unless intentionally included:

```bash
git status --short
```

8. Re-run the strict audit:

```bash
npm run repo:hygiene:strict
```

9. Re-run the product checks:

```bash
npm run data:validate
npx --yes tsx scripts/verify-reconnect-import.ts
npm run typecheck
npm run lint
npm run build
```

## Expected Result

- `npm run repo:hygiene:strict` passes.
- `mbti_test/db_data/*` is removed from tracking.
- The root app paths are tracked.
- `.env*` files remain untracked except `.env.example`.
- Reviewed retired files are not restored.
