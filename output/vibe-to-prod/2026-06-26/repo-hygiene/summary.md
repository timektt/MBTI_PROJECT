# Repo Hygiene Audit

Date: 2026-06-26

## Scope

- Added a non-destructive repository hygiene audit for the current root-app move state.
- Kept the existing `mbti_test/` deletion/root-app untracked state untouched.
- Added ignore rules to prevent new `db_data/` directories from being added.

## Latest Report

- Evidence: `output/vibe-to-prod/2026-06-26/repo-hygiene/audit-report.json`
- `blockerCount`: 0
- `trackedDbDataCount`: 0
- `trackedOldRootCount`: 0
- `trackedOldSourceCount`: 0
- `rootAppUntrackedCount`: 0
- `stagedDeletedOldRootCount`: 1384
- `stagedDeletedOldSourceCount`: 39
- `warningCount`: 0
- Blockers: none

## Commands

- `npm run repo:hygiene`
- `npm run repo:hygiene:strict`
- `find pages -maxdepth 2 -name 'reset-password*' -print`
- `npm run build`

`repo:hygiene:strict` passes after the root app move is staged deliberately and tracked `mbti_test/db_data/*` paths are removed from the index.

## Reset Password Route Check

- Active root app files:
  - `pages/reset-password.tsx`
  - `pages/api/reset-password.ts`
- `pages/reset-password.ts` does not exist in the root app.
- `npm run build` passed and emitted a single `/reset-password` page plus `/api/reset-password` API route.
- Remaining duplicate references are old tracked `mbti_test/` paths until the root move is normalized.

## Source Move Review

- Pre-staging old-root non-db_data source/config files: 141
- Pre-staging root counterparts found: 138
- Pre-staging missing root counterparts: 3
- Post-staging tracked old-root source files: 0
- Post-staging unreviewed missing counterparts: 0
- Reviewed retirements:
  - `mbti_test/middleware.ts`: guest-first runtime intentionally has no active Next middleware until server-side auth/authorization is rebuilt
  - `mbti_test/pages/reset-password.ts`: old duplicate API handler lived under `pages/` and is replaced by `pages/api/reset-password.ts` plus `pages/reset-password.tsx`
  - `mbti_test/scripts/debug-env.ts`: old debug helper printed `DATABASE_URL` and should not be restored
