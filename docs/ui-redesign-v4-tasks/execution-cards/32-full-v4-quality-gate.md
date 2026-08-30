# Card 32 - Full V4 Quality Gate

Owner: A8 QA Evidence Agent
Approver: A0 Lead Integrator
Status: `PENDING`
Tasks: `V4-QA-001..018`
Depends on: Cards 13, 20, 23, 26, 28, 30 and 31

## Objective

Produce one-source-fingerprint route/state/locale/viewport quality proof and release recommendation.

## Writable Files

`data/ui/**`, V4 QA scripts, evidence/report docs; feature defects return to owner.

## Checklist

- route/state manifest, fixtures and freshness checks
- overflow/overlap, keyboard, focus, zoom, reduced motion and localization
- image decode/crop/bytes/layout shift and PNG export
- core journey, 16 type routes, held routes and auth isolation
- data/types/assets/V3 regression/lint/typecheck/build

## Acceptance And Evidence

Zero unexplained UI failures; all final evidence is current; V3 functional contract passes; runtime remains `guest-local`; residual risks and rollback notes are published.
