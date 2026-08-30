# MBTI Z UI Agent Team

วันที่เริ่มใช้: 2026-07-15

เอกสารนี้กำหนด role, ownership และ handoff ของ agent team สำหรับ `docs/ui-redesign-v2-tasks/README.md` เป้าหมายคือเพิ่ม throughput โดยไม่ให้ agents แก้ shared files ชนกันหรือเปิด runtime ที่ยังไม่พร้อม

## 1. Team Structure

| Role | Current agent | Primary ownership | May edit | Must not edit |
| --- | --- | --- | --- | --- |
| Lead Integrator | Main Codex task | architecture decisions, integration, shared scripts, final QA | any file required after review | production/deploy/git actions without approval |
| UI Systems Architect | Linnaeus | `SYS-001..003` | route manifest, token/layout contract tools | page implementations, runtime behavior |
| QA & Fixture Engineer | Franklin | `SYS-004..005`, evidence reproducibility | `scripts/ui-fixtures/**`, focused QA tooling | production data, scoring, page design |
| Page Experience Lead | Boyle | active page vertical slice | explicitly assigned page files | shared/global files not assigned |

Agent names are temporary. Role and ownership in this file are durable.

## 2. Lead Integrator

Responsibilities:

- select batch and critical path
- assign disjoint write scopes
- read every returned diff before integration
- resolve design/runtime conflicts
- add package scripts only after tool output is reviewed
- run final typecheck, lint, build, runtime and browser gates
- update task status/evidence
- keep `guest-local` active

Stop conditions:

- two agents need the same source file
- behavior/runtime contract must change for visual design
- output requires auth, database, cloud, admin or production access
- agent modifies files outside ownership

## 3. UI Systems Architect

Mission: ทำให้ทุก page task ใช้ route, token, spacing และ responsive contract เดียวกัน

Inputs:

- `docs/ui-redesign-v2-tasks/00-shared-foundation.md`
- `styles/globals.css`
- `design-system/mbti-z/MASTER.md`
- Pages Router inventory
- current browser evidence

Outputs:

- machine-readable route/state manifest
- manifest verifier
- token migration findings
- responsive shell constraints
- shared component ownership recommendations

Quality bar:

- no broad visual rewrite
- every rule references route/component evidence
- additive migration until full route sweep passes
- 320-1600 and 200% zoom considered

## 4. QA & Fixture Engineer

Mission: ทำให้ page states และ screenshots สร้างซ้ำได้โดยไม่พึ่ง stale localStorage หรือ production data

Inputs:

- guest runtime/session/result shapes
- question bank and result model
- route/state manifest
- browser viewport matrix

Outputs:

- deterministic fixture generator/checker
- browser init/localStorage payloads
- fixture IDs stable across runs
- state-to-route mapping
- DOM metrics and screenshot evidence contract

Quality bar:

- no production DB or external service
- no scoring/data-shape change
- output deterministic
- generated artifacts isolated under output path
- invalid and empty states included

## 5. Page Experience Lead

Mission: implement one assigned active page slice using approved task IDs and existing shared contracts

Inputs:

- page task file
- baseline screenshots
- design-system source
- selected UI Skills context
- deterministic fixtures

Outputs:

- focused page diff
- loading/empty/error/populated states in scope
- responsive screenshots
- interaction and accessibility proof
- remaining-risk list

Quality bar:

- user goal is first visual signal
- no card-in-card or fixed overlap
- one primary action per decision point
- preserve runtime, export and persistence contracts
- no shared-file edit without reassignment

## 6. File Ownership Protocol

Before spawn:

1. Lead lists exact owned paths.
2. Agent confirms no additional files are needed before editing them.
3. Overlapping ownership is prohibited.
4. Existing dirty changes are treated as user-owned.

During work:

- agent may read any file
- agent edits only assigned paths
- agent does not revert, stage, commit, push or deploy
- agent reports unexpected external changes instead of overwriting them

After work:

1. Agent lists changed files.
2. Agent lists commands actually run.
3. Lead reviews diff and tests.
4. Lead either integrates, requests correction or discards only the agent-owned diff.

## 7. Parallel Batch Template

```text
Batch: <name>
Critical path owned by Lead: <task IDs>

Agent A
- Role:
- Task IDs:
- Write scope:
- Required output:
- Validation:

Agent B
- Role:
- Task IDs:
- Write scope:
- Required output:
- Validation:

Agent C
- Role:
- Task IDs:
- Write scope:
- Required output:
- Validation:

Integration gate
- Diff review:
- Shared contract checks:
- Browser matrix:
- Status/evidence update:
```

## 8. Current Batch A

### UI Systems Architect: Linnaeus

- Task: `SYS-001`
- Status: `DONE`
- Owns:
  - `data/ui/route-state-manifest.mjs`
  - `scripts/verify-ui-route-state-manifest.mjs`
- Output: 30-route manifest and exact-coverage verifier

### QA & Fixture Engineer: Franklin

- Task: `SYS-004`
- Status: `DONE`
- Owns:
  - `scripts/ui-fixtures/**`
- Output: deterministic guest-local fixture generator and check mode

### Page Experience Lead: Boyle

- Tasks: first Result slice from `RESULT-003`, `RESULT-006`, `RESULT-007`, `RESULT-009`, `RESULT-010`
- Status: `DONE`
- Owns:
  - `pages/result/[id].tsx`
- Output: identity-first Result page preserving export/runtime contracts

### Lead Integrator

- Owns:
  - `package.json` integration scripts
  - task status docs
  - final build/browser QA
- Output: reviewed integrated batch and evidence
- Status: `DONE`

## 9. Current Batch B

### Home Experience Lead: Banach

- Tasks: `HOME-HARD-001`, `HOME-HARD-002`, `HOME-HARD-004`, page-local `HOME-HARD-003`
- Status: `DONE`
- Owns:
  - `components/marketing/premium-home.tsx`
- Output: hardened Home hierarchy, media framing and longest-copy behavior

### Types Experience Lead: Lorentz

- Tasks: `TYPES-001..008`, prioritizing `TYPES-002..005` and `TYPES-008`
- Status: `DONE`
- Owns:
  - `pages/types.tsx`
  - `components/mbti-z/type-card.tsx`
- Output: scan-first house taxonomy, stable type listing and accessible detail disclosure

### UI Systems Architect: Darwin

- Tasks: shared navigation slice from `SYS-003`, `HOME-HARD-003`
- Status: `DONE`
- Owns:
  - `components/Navbar.tsx`
- Output: responsive, keyboard-safe shared navigation without header/menu overlap

### Lead Integrator

- Owns:
  - before/after browser evidence
  - package/task integration
  - final runtime/build gates
- Status: `DONE`

## 10. Current Batch C

### Quiz Workflow Lead: Fermat

- Tasks: `QUIZ-HARD-001..006`
- Status: `DONE`
- Owns:
  - `pages/quiz.tsx`
  - `components/mbti-z/quiz/answer-deck.tsx`
- Output: deterministic final-submit, locale, recovery and short-viewport hardening

### Dashboard Experience Lead: Sagan

- Tasks: `DASH-001..006`, `DASH-008..010`
- Status: `DONE`
- Owns:
  - `pages/dashboard.tsx`
- Output: latest-first Dashboard, empty/resume states and compact local history

### Reconnect Utility Lead: Anscombe

- Tasks: `DASH-007`, reconnect portion of `DASH-010`
- Status: `DONE`
- Owns:
  - `components/cyber/reconnect-bundle-actions.tsx`
- Output: collapsed advanced recovery utility with announced validation states

### Lead Integrator

- Owns:
  - deterministic before/after state matrix
  - integration corrections and touch-target audit
  - runtime, production build and task evidence gates
- Status: `DONE`

Residuals:

- native Chrome 200% closed on 2026-07-16 after resetting a stale viewport override and verifying DOM metrics plus screenshots
- forced Quiz `localStorage` failure, normal submit and rapid double activation all pass in `v2-08-full-quality/quiz-submit-report.json`

Evidence:

- Quiz: `output/ui-skills-router/2026-07-15/v2-04-quiz/after/`
- Dashboard: `output/ui-skills-router/2026-07-15/v2-06-dashboard/after/`
- final production server: `http://127.0.0.1:3025`

## 11. Current Batch D

### Account Hold Experience Lead: McClintock

- Tasks: `ACCOUNT-001..005`
- Status: `DONE`
- Owns:
  - `components/cyber/account-hold.tsx`
  - `pages/login.tsx`
  - `pages/register.tsx`
  - `pages/forgot-password.tsx`
- Output: route-specific account hold hierarchy, Guest recovery actions and compact reconnect placement

### Relaunch Surface Lead: Beauvoir

- Tasks: `PROFILE-001..003`, `COMM-001..003`, `ADMIN-001`
- Status: `DONE`
- Owns:
  - `components/cyber/relaunch-state.tsx`
- Output: responsive unframed hold template, 22 typed intents and localized route-truthful presentation

### Held Route Contract Lead: Popper

- Tasks: `PROFILE-101..111`, `COMM-101..106`, `ADMIN-101..105`
- Status: `DONE`
- Owns:
  - 22 profile/settings/community/share/admin page wrappers
- Output: exact intent/scenario bindings with no backend or API activation

### Lead Integrator

- Owns:
  - `scripts/verify-held-route-contract.mjs`
  - `scripts/audit-auth-surface-isolation.mjs`
  - `package.json`
  - browser evidence and task status integration
- Status: `DONE`
- Evidence: `output/ui-skills-router/2026-07-15/v2-07-held-routes/audit-report.json`

## 12. Current Batch E

### Types Resilience Lead: Godel

- Status: `DONE`
- Output: canonical 16-slot normalization, missing-content fallback and failed-image recovery

### Result Contract Auditor: Nietzsche

- Status: `DONE`
- Output: read-only audit that identified balanced-fixture, locale-query, export-feedback and Satori overflow gaps

### UI Quality Contract Engineer: Hubble

- Status: `DONE`
- Output: `scripts/verify-ui-v2-quality.mjs`, strict 30-route/88-sample/17-state contract

### Lead Integrator

- Status: `DONE WITH EXPLICIT RESIDUALS` (superseded by Batch F)
- Output: Result fixes, semantic landmark repair, Dashboard loading identity, production browser matrices and task integration
- Residuals at Batch E close were asset recognizability and optional Figma archive; native 200% zoom, current WebKit export and asset recognizability closed on 2026-07-16
- Evidence: `output/ui-skills-router/2026-07-15/v2-08-full-quality/audit-report.json`

## 13. Current Batch F: Residual Closure

### Browser Compatibility QA

- Status: `DONE`
- Output: native Chrome 200% route sweep and WebKit server/fallback PNG export proof

### Figma Sync QA

- Status: `DEFERRED OPTIONAL`
- Output: browser evidence is authoritative; editable Figma archive is not required for completion

### Visual Asset QA

- Status: `DONE`
- Output: before/after recognizability review, rendered geometry audit, 16-type acceptance matrix and source PNG payload budget

### House Asset Artists

- Purple, Green, Yellow and Blue owners each produced four species-specific 4:5 portraits
- Status: `DONE` (`16/16`, unique optimized `1080x1350` PNG; total `13,659,551` bytes)

### Lead Integrator

- Status: `DONE`
- Output: current browser evidence, WebKit rerun, task matrix reconciliation and final quality gates complete
- Runtime boundary: remains `guest-local`; no auth/cloud/admin activation and no production deploy

## 14. Reusable Spawn Prompt Requirements

Every agent prompt must include:

- role
- repo path
- task IDs
- exact write scope
- required source docs
- non-scope
- validation commands
- warning that other agents are editing different files
- final response contract

## 15. Team Completion Gate

Batch closes only when:

- every agent returns final status
- no ownership violation exists
- returned diffs pass review
- generated tools run successfully
- page implementation passes typecheck/lint/build
- browser evidence covers stated page states and viewports
- task status is updated from evidence, not from agent claim alone
