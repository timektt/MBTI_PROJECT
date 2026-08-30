# UI V4 Agent Team

## 1. Team Shape

| Agent | Role | Owns | Must not own |
| --- | --- | --- | --- |
| A0 Lead Integrator | contract, sequencing, copy/token/file locks, integration | master decisions, shared locks, final merge and gates | generated art variants or page-local styling |
| A1 UX Audit Agent | route inventory, baseline screenshots, prune matrix, IA | read-only audit artifacts and `V4-AUD-*` | product source implementation |
| A2 Visual Direction Agent | concept spine, section composition, reference research | concept briefs and visual acceptance notes | production image files or runtime code |
| A3 Image Generation Agent | raster production and asset manifest handoff | `output/.../concepts`, `public/mbti-z/v4/**`, prompt ledger | page layout, copy, route behavior |
| A4 Shared Shell Agent | Navbar, responsive menu, locale ownership, shell | `Navbar`, `_app`, shell components after locks | type data, dashboard behavior, QA manifest |
| A5 Core Journey Agent | Home, Quiz, Result page sprints | route-local components for `/`, `/quiz`, `/result/[id]` | shared tokens without request |
| A6 Type Discovery Agent | Atlas, 16 detail routes, type content | `/types`, `/types/[code]`, type data and validator | Navbar, dashboard, generated assets |
| A7 Results And Hold Agent | My Results and compact held templates | `/dashboard`, `AccountHold`, `RelaunchState` | guest runtime contracts or auth activation |
| A8 QA Evidence Agent | fixtures, manifest, browser matrix, a11y and freshness | `data/ui/**`, V4 QA scripts, evidence reports | weakening existing V3 gates |
| A11 Release Operations Agent | repo stabilization, PR/CI/AI governance, Vercel Preview/Production and rollback | delivery cards, GitHub/Vercel settings and secret-safe evidence | feature UI, cloud/auth activation or secret output |

## 2. Agent Creation Prompts

### A3 Image Generation Agent

```text
Role: MBTI Z V4 Image Generation Agent.
Read the V4 master plan, SKILL-MATRIX.md, IMAGE-ASSET-PLAN.md and your assigned card.
Use imagegen-frontend-web only for one-section horizontal concept references.
Use built-in imagegen for approved production raster assets.
Never generate text, logos, fake UI, watermarks, random decoration or unassigned images.
For each asset, preserve the approved focal-safe areas, route placement, ratio, palette and no-text constraint.
Inspect every output, version filenames non-destructively, move accepted files into public/mbti-z/v4, and record prompt, mode, dimensions, bytes and route placement.
Do not edit page code. Send an asset handoff to the consuming page agent.
```

### A5 Core Journey Agent

```text
Role: MBTI Z V4 Core Journey Agent.
Work one approved route sprint at a time in order Home -> Quiz -> Result.
Keep guest-local runtime, scoring, persistence and PNG export behavior unchanged.
Consume only assets accepted by A3 and registered by the Lead/QA path.
Use fixed media geometry and mobile tap/focus equivalents for hover behavior.
Do not edit shared shell, global tokens or centralized copy without a handoff request.
Return changed files, checks, before/after screenshots and residual risk.
```

### A8 QA Evidence Agent

```text
Role: MBTI Z V4 QA Evidence Agent.
Build reproducible evidence from current source and current assets only.
Verify all required routes, states, locales and viewports; inspect console, overflow, overlap, keyboard, focus, reduced motion, image crop and layout shift.
Keep V3 guards intact and add V4 freshness checks instead of replacing historical evidence.
Reject screenshots without source fingerprint or generated assets outside the manifest.
Do not alter feature UI to make a test pass; report the failure to the owner.
```

## 3. Parallel Work Rules

- A1 and A2 may work in parallel after A0 locks scope.
- A3 may generate concepts while A1 finishes pruning, but production assets wait for direction approval.
- A4 starts after IA/locale ownership is locked.
- A5 and A6 can run in parallel only after shared shell and asset contracts are stable.
- A7 starts after Result hierarchy is stable because Dashboard consumes real result artifacts.
- A8 can prepare fixtures early but records final evidence only after owner handoff.
- A11 starts delivery Cards 23-25 before new implementation PRs; Vercel Cards 26-28 wait for protected remote baseline and declared product gates.

## 4. Claim And Handoff Contract

```text
Agent:
Card:
Status:
Started from source fingerprint:
Files claimed:
Read-only dependencies:
Assets consumed/produced:
Evidence directory:
Checks run:
Acceptance result:
Residual risks:
Requested next owner:
```

## 5. Conflict Rules

1. one writer per shared file
2. generated assets are immutable after acceptance; revision creates `-v2`, never overwrite
3. page agent cannot change asset crop by editing the bitmap; request a new variant or use approved `object-position`
4. QA never edits feature UI
5. Lead resolves cross-agent copy/token changes before integration
