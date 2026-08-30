# V3 Shared Contract Tasks

Owner: Lead Integrator
Parallel group: `V3-00`
Status: `DONE`

## V3-SYS-001 Current Baseline

- capture Home, Types and Dashboard at 390x844 and 1440x1000
- record current Navbar item count, locale control count and ESTJ hardcode
- record Type disclosure count and Dashboard default visible sections

Acceptance:

- evidence paths point to current production build
- metrics include status, overflow, controls and console errors

## V3-SYS-002 Navigation IA Lock

- primary: Home, Quiz, 16 Types
- right commands: Log in, Menu
- secondary: My Results, language, guest storage note
- define TH/EN labels and active matching rules

Acceptance:

- exactly three desktop primary destinations
- `/login` is action label, not Account noun
- `/dashboard` remains reachable within one interaction

## V3-SYS-003 Locale Ownership Lock

- enumerate every `LocaleToggle` use
- classify shared-shell vs custom-layout routes
- specify removal list and exception list
- define route-preserving locale behavior

Acceptance:

- one locale control per viewport
- no active route loses language access

## V3-SYS-004 Type Detail Schema Lock

- define exact required fields and bilingual types
- define slug normalization and related-type references
- define original-content and disclaimer rules
- publish read contract for Home and Atlas agents

Acceptance:

- schema supports all sections in master plan
- validator can report exact type/field missing

## V3-SYS-005 Route Contract

- add planned `/types/[code]` manifest entry
- expected user-facing route count becomes 31
- define sample path `/types/intj`
- define states `populated`, `not-found`

Acceptance:

- route inventory and QA scope are explicit before implementation

## V3-SYS-006 Shared File Lock

- assign copy, data, global CSS, manifest and package ownership
- create copy-request handoff format
- reject concurrent edits to locked files

Acceptance:

- each feature packet has non-overlapping primary ownership

## V3-SYS-007 Baseline Decision Report

- document why Dashboard is retained as My Results
- document why Home uses deterministic four-House visual
- document why Type detail is static route rather than disclosure/modal

Required checks:

- `npm run ui:manifest:verify`
- `npm run ui:v2:quality`
- `git diff --check`

Evidence root:

`output/ui-skills-router/YYYY-MM-DD/v3-00-contract/`
