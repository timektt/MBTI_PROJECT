# MBTI Z UI V3 Agent Team

## 1. Team Shape

Use six execution roles. One agent may cover multiple roles sequentially, but shared ownership must remain exclusive.

| Role | Mission | Primary files |
| --- | --- | --- |
| Lead Integrator | lock decisions, copy integration, shared CSS, final merge | plan/docs, `lib/mbti-z-copy.ts`, `styles/globals.css` |
| Shell Agent | simplify Navbar and centralize locale access | `components/Navbar.tsx`, `pages/_app.tsx`, `components/cyber/locale-toggle.tsx` |
| Home Experience Agent | replace ESTJ hero and build cinematic Home interactions | `components/marketing/premium-home.tsx` |
| Type Profile Agent | own detailed type data, validator and dynamic route | type data, validator, `pages/types/[code].tsx`, detail components |
| Atlas Agent | turn cards into route navigation and remove disclosure | `pages/types.tsx`, `components/mbti-z/type-card.tsx` |
| My Results Agent | redesign Dashboard as user-owned result history | `pages/dashboard.tsx`, Dashboard-local components |
| QA Integration Agent | manifest, fixtures, browser matrix and release evidence | `data/ui/*`, QA scripts, output evidence |

Lead and QA are integration roles; implementation can still run with six agents by assigning QA to Lead after feature streams finish.

## 2. Ownership Rules

- An agent may edit only files listed in its packet.
- `lib/mbti-z-copy.ts`, `styles/globals.css`, manifest and package files require exclusive lock.
- When copy is needed, feature agent returns a `copyRequest` object rather than editing the shared copy file.
- Type Profile Agent publishes a read contract before Home/Atlas consume new fields.
- QA Agent never repairs UI silently; it reports the failing route/task back to owner.
- Lead applies integration fixes only after identifying ownership and regression scope.

## 3. Handoff Format

Every agent response must contain:

```text
Role:
Execution card:
Task IDs:
Status: DONE | VERIFY | BLOCKED
Started from SHA:
Files changed:
Behavior changed:
Commands run:
Browser evidence:
Shared-file requests:
Residual risks:
Recommended next owner:
```

Every assignment must name exactly one file from `execution-cards/`. An agent may receive the next card only after the current card reaches `DONE` or has a Lead-approved handoff boundary.

## 4. Agent Prompts

### Shell Agent

```text
Role: Shell Agent
Repo: /Users/time/Desktop/Projects/MBTI_PROJECT
Read: AGENTS.md, docs/mbti-z-product-ui-v3-plan.md, docs/ui-redesign-v3-tasks/01-navbar-locale.md
Goal: Reduce Navbar to 3 primary destinations, add right-side Log in command, move My Results and locale into the menu, and remove duplicate page-level locale controls only where shared Navbar remains available.
Runtime: guest-local; do not activate auth.
Ownership: Navbar, shell, locale component only. Do not edit copy/global CSS without Lead handoff.
Validate: keyboard, Escape/focus return, mobile sheet, 320/390/768/1024/1440/1600 and 200% zoom.
Return the standard handoff.
```

### Home Experience Agent

```text
Role: Home Experience Agent
Repo: /Users/time/Desktop/Projects/MBTI_PROJECT
Read: AGENTS.md, master V3 plan, 02-home-experience.md
Goal: Replace hardcoded ESTJ hero with deterministic Four-House Result Constellation, deepen Home content, and add cinematic hover/focus/tap interactions with stable geometry.
Use existing animal/house assets and motion primitives. No new dependency, random selection, negative overlap or essential hover-only content.
Ownership: premium-home.tsx and Home-scoped components. Request shared copy/token edits through Lead.
Validate: pointer, keyboard, touch, reduced motion, no layout shift, all global viewports.
Return the standard handoff.
```

### Type Profile Agent

```text
Role: Type Profile Agent
Repo: /Users/time/Desktop/Projects/MBTI_PROJECT
Read: AGENTS.md, master V3 plan, 04-type-detail-routes.md
Goal: Create original bilingual detailed content for 16 types, validate schema, and implement statically generated /types/[code] routes.
Do not copy external profile text or make medical/career guarantees.
Ownership: detailed type data, validator, detail route/components. Publish data contract before Atlas/Home consume it.
Validate: 16 slugs, TH/EN completeness, 404, metadata, related links, responsive reading and build.
Return the standard handoff.
```

### Atlas Agent

```text
Role: Atlas Agent
Repo: /Users/time/Desktop/Projects/MBTI_PROJECT
Read: AGENTS.md, master V3 plan, 03-type-atlas.md
Goal: Remove inline disclosures, make every Type card navigate to /types/[code], preserve House filter context, and remove duplicate locale control after Shell contract lands.
Ownership: pages/types.tsx and TypeCard only.
Do not edit type data or manifest.
Validate: 16 unique links, keyboard tabs/cards, longest TH/EN copy and all global viewports.
Return the standard handoff.
```

### My Results Agent

```text
Role: My Results Agent
Repo: /Users/time/Desktop/Projects/MBTI_PROJECT
Read: AGENTS.md, PRD.md, master V3 plan, 05-my-results.md
Goal: Reframe /dashboard as My Results while preserving latest result, history, pending session, PNG export and reconnect behavior.
Hide runtime/account/bundle jargon from default view; keep Advanced recovery complete.
Ownership: dashboard page and page-local components. Request copy edits through Lead.
Validate: empty, pending, one, many, selected, recovery-expanded, export and reconnect regression.
Return the standard handoff.
```

### QA Integration Agent

```text
Role: QA Integration Agent
Repo: /Users/time/Desktop/Projects/MBTI_PROJECT
Read: AGENTS.md, master V3 plan, 06-quality-gates.md
Goal: Extend manifest/evidence from 30 to 31 routes, verify current-source freshness, rerun browser matrices and enforce all required gates.
Do not weaken assertions or mark failures passed. Return failing task IDs to owners.
Close every browser/context/process started and audit temporary automation profiles.
Return the standard handoff.
```

## 5. Integration Order

1. Lead locks shared contract.
2. Shell, Home, Type Data and My Results run in parallel.
3. Atlas starts after Shell and Type Data contracts.
4. Type route starts after data validator.
5. Lead integrates copy/global tokens.
6. QA reruns current evidence after all source changes.
7. Lead performs requirement-by-requirement completion audit.

## 6. Conflict Escalation

Stop and hand back to Lead when:

- two agents need the same shared file
- route/data contract changes after dependent work started
- design requires runtime/schema changes
- a fix needs more than two viewport-specific arbitrary overrides
- a screenshot passes only after hiding required content
- auth/cloud behavior would need to be enabled
