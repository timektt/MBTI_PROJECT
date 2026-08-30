# UI V4 Execution Cards

These 32 cards are assignable units built from the 142 stable tasks in packets `00` through `07`. Stable IDs remain authoritative; cards only group work for ownership and handoff.

## Card Inventory

| Card | Stable tasks | Owner | Depends on | Current status |
| --- | --- | --- | --- | --- |
| `01-contract-fingerprint.md` | `SYS-001..003` | A0 | none | READY |
| `02-contract-ia-visual.md` | `SYS-004..005` | A0 | 01 | PENDING |
| `03-contract-files-evidence.md` | `SYS-006..010` | A0 | 02 | PENDING |
| `04-baseline-core-routes.md` | `AUD-001..003` | A1 | 03 | IN PROGRESS |
| `05-overlap-layout-audit.md` | `AUD-004..005`, `AUD-011` | A1 | 04 | IN PROGRESS |
| `06-pruning-inventory.md` | `AUD-006..009` | A1 | 04 | IN PROGRESS |
| `07-route-outcomes-home-packet.md` | `AUD-010..012` | A1 | 05,06 | DONE |
| `08-existing-asset-audit.md` | `IMG-001..003` | A2 | 06 | DONE |
| `09-home-concept-frames.md` | `IMG-004..006` | A2 | 07,08 | DONE |
| `10-home-production-hero.md` | `IMG-007..008` | A3 | 09 + approval | DONE |
| `11-quiz-production-image.md` | `IMG-009..010` | A3 | quiz audit + approval | DEFERRED |
| `12-hold-production-image.md` | `IMG-011..012` | A3 | held audit + approval | DEFERRED |
| `13-asset-ledger-verification.md` | `IMG-013..016` | A3 | 10..12 | DONE |
| `14-shell-tokens-containers.md` | `SHELL-001..003` | A4 | 05,06 | DONE |
| `15-navbar-desktop-mobile.md` | `SHELL-004..006` | A4 | 14 | DONE |
| `16-navbar-behavior-evidence.md` | `SHELL-007..010` | A4 | 15 | DONE |
| `17-home-hero-first-viewport.md` | `HOME-001..004` | A5 | 10,16 + approval | DONE |
| `18-home-content-bands.md` | `HOME-005..006`, `HOME-008..009` | A5 | 17 | DONE |
| `19-home-hover-pruning.md` | `HOME-007`, `HOME-010..011` | A5 | 18 | DONE |
| `20-home-closeout.md` | `HOME-012` | A5 | 19 | DONE |
| `21-quiz-states-hierarchy.md` | `QUIZ-001..004` | A5 | 11,16,20 + approval | PENDING |
| `22-quiz-interaction-runtime.md` | `QUIZ-005..008` | A5 | 21 | PENDING |
| `23-quiz-responsive-closeout.md` | `QUIZ-009..010` | A5 | 22 | PENDING |
| `24-result-identity-actions.md` | `RESULT-001..006` | A5 | 16,23 + approval | PENDING |
| `25-result-content-export.md` | `RESULT-007..010` | A5 | 24 | PENDING |
| `26-result-states-closeout.md` | `RESULT-011..012` | A5 | 25 | PENDING |
| `27-atlas-scan-routing.md` | `ATLAS-001..007` | A6 | 13,16 + approval | PENDING |
| `28-atlas-responsive-closeout.md` | `ATLAS-008..010` | A6 | 27 | PENDING |
| `29-type-contract-hero.md` | `TYPE-001..006` | A6 | 28 + approval | PENDING |
| `30-type-content-matrix.md` | `TYPE-007..014` | A6 | 29 | PENDING |
| `31-my-results-held-routes.md` | `DASH-001..010`, `HOLD-001..008` | A7 | 12,16,26 + approvals | PENDING |
| `32-full-v4-quality-gate.md` | `QA-001..018` | A8 | 13,20,23,26,28,30,31 | PENDING |

## Card Template

```text
Card:
Owner:
Stable task IDs:
Status: READY | PENDING | IN PROGRESS | VERIFY | DONE | BLOCKED | DEFERRED
Depends on:
Objective:
Writable files:
Read-only files:
Implementation checklist:
Acceptance criteria:
Commands:
Evidence path:
Handoff to:
Residual risk:
```

## Execution Rule

A card becomes `IN PROGRESS` only after owner claim and dependency proof. It becomes `DONE` only when the acceptance in its packet and current-source evidence both pass. Status is updated incrementally; do not mark a batch complete retroactively.
