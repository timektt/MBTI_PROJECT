# Card 26 - Runtime, Build, Evidence Integrity, And Completion Audit

Task IDs: `V3-QA-011`, `V3-QA-012`, `V3-QA-013`, `V3-QA-014`
Owner: `QA Integration Agent` with `Lead Integrator`
Status: `DONE`
Depends on: Cards 24 and 25

## Deliverable

ปิด V3 ด้วย runtime regression, production build, fresh evidence และ route-by-route completion audit

## Checklist

- Run data validation and reconnect import verification.
- Verify Quiz to result, local history, PNG export, and recovery flows.
- Run focused feature tests.
- Run `npm run typecheck`, `npm run lint`, `npm run build`, and required env checks.
- Separate pre-existing failures from V3 regressions with exact evidence.
- Trace every screenshot to route, viewport, locale, fixture, timestamp, and source revision.
- Preserve or strengthen evidence freshness checks.
- Close all task-started browser/server processes and audit leftovers.
- Publish route-by-route pass/fail, severity, owner, and UAT readiness.

## Acceptance

- Runtime contracts work and static gates pass.
- No stale screenshot is accepted.
- No Critical or High finding remains.
- Audit says `READY FOR UAT` or lists exact blocking cards; never `mostly done`.

## Evidence

- Command log and exit status.
- Current-source evidence index.
- Completion audit and blocker register.
