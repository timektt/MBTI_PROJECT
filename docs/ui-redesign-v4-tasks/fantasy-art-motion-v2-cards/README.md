# Fantasy Art And Motion V2 Execution Cards

Parent plan: `docs/mbti-z-fantasy-art-motion-v2-plan.md`
Stable tasks: `../FANTASY-ART-MOTION-V2-TASKS.md`
Cards: 28
Status: `READY FOR SEQUENTIAL EXECUTION`

## Card Inventory

| Cards | Scope | Owner | Parallel rule |
| --- | --- | --- | --- |
| 01-02 | current-state + global reference lock | A2 | sequential |
| 03-04 | art world + System Prompt V2 | A3 | after 02 |
| 05-07 | six-asset pilot + style approval | A3/A3B/A0 | 05 and 06 parallel; 07 joins |
| 08-13 | Hero, Houses, four Animal batches | A3B | 09-13 may parallel after 07 with separate files |
| 14-15 | motion audit + primitives | A9 | sequential; can run beside asset batches |
| 16-19 | route integration | A5/A6/A7 | starts after required assets + 15 |
| 20-22 | asset/perf, responsive/a11y, regression/final | A8/A0 | sequential closeout |
| 23-25 | delivery contract, repo stabilization, PR/CI/AI governance | A11/A0 | begins before new implementation branches |
| 26-27 | Vercel project binding and Preview deployment | A11/A8 | after protected remote baseline |
| 28 | Production promotion, smoke and rollback | A11/A8/A0 | after all FAM gates |

## Required Card Handoff

```text
Agent:
Card:
Status:
Source fingerprint:
Files claimed:
Read-only dependencies:
Assets consumed/produced:
Checks run:
Evidence directory:
Acceptance result:
Residual risks:
Next owner:
```

## Shared Locks

- `public/mbti-z/v4/**`: A3B during accepted asset production
- image manifest/verifier: A3B writes, A8 reviews
- `components/cyber/motion/**`: A9 only during Cards 14-15
- `styles/globals.css`: A0 integration only
- Home/Quiz/Result route files: A5
- Type Atlas/Detail route files: A6
- Dashboard/Held route files: A7
- browser fixtures/reports: A8
- GitHub/Vercel settings, deployment records and delivery evidence: A11 with A0 approval

Cards 01-22 do not authorize dependency installation, commit, push or deploy. Cards 23-28 authorize bounded branch/PR/Vercel delivery actions only after their declared gates; they never authorize force push, secret exposure or auth/cloud/Supabase activation.
