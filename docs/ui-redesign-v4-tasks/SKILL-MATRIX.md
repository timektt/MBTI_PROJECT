# V4 Skill Matrix

## 1. UI Skills Router Record

```text
UI Skills Router:
- scope: project-wide
- commands: npx --yes ui-skills start; categories; list --category systems|visual|craft|accessibility|testing|nextjs; get pbakaus/distill; get pbakaus/layout; get leonxlnx/imagegen-frontend-web
- selected: pbakaus/distill, pbakaus/layout, leonxlnx/imagegen-frontend-web
- used for: pruning audit, responsive/layout contract, section-level image direction
- local evidence: source files, design-system docs, before/after browser screenshots, DOM/console/overflow/a11y checks
```

Selection is capped at three external slugs because this is a broad multi-surface plan. These slugs guide critique and task design; they do not override the repo.

## 2. Required Skill Routing

| Phase | Skill | Purpose | Required output |
| --- | --- | --- | --- |
| Program control | `vibe-to-prod` | keep source-of-truth, vertical slices and production gates | master plan, scope fence, release gates |
| Project UI routing | `ui-skills-router` | select smallest external critique context | command/slug record |
| Simplification | `pbakaus/distill` | remove redundant UI without deleting capability | prune/keep/demote matrix |
| Layout | `pbakaus/layout` | reading order, grouping, rhythm and responsive structure | spatial thesis + viewport behavior |
| Per-page sprint | `mbti-page-ux-sprint` | screenshot-first route work in this repo | approval packet + before/after evidence |
| Implementation | `frontend-design` | implement approved distinctive UI | route/component code only after approval |
| Section references | `leonxlnx/imagegen-frontend-web` | horizontal concept only for unresolved image-led sections | non-runtime concept frames when need gate passes |
| Production images | `imagegen` | generate/edit raster assets | final bitmap in workspace + prompt/version record |
| Browser proof | local Playwright/Browser workflow | screenshot, keyboard, console, overflow and state proof | machine-readable report + PNGs |
| Production gate | existing npm scripts | protect runtime and build | command logs from one source revision |
| Source control delivery | GitHub CLI + repository CI | branch, PR, required checks, AI review evidence and protected main | merged baseline and ruleset evidence |
| Hosting delivery | Vercel CLI + official Git integration | project binding, Preview, Production, logs and rollback | deployment URLs/ids tied to source SHA |

## 3. Skill Boundaries

- `imagegen-frontend-web` creates design references only after the need gate; it does not require one image per section when the page is already solved by existing assets/code.
- `imagegen` creates bitmap assets; it does not write layout or choose copy.
- `frontend-design` starts only after a page approval packet is accepted.
- `page-ux-sprint` handles one route at a time even though the overall plan covers the whole project.
- Figma is not used because no current Figma source is required and browser evidence already has a stable local workflow.
- No new npm dependency is authorized by any skill recommendation.

## 4. Page-To-Skill Map

| Route | Primary external context | Supporting local skill |
| --- | --- | --- |
| `/` | `distill` + `imagegen-frontend-web` | `mbti-page-ux-sprint`, `frontend-design`, `imagegen` |
| `/quiz` | `layout` | `mbti-page-ux-sprint`, `frontend-design` |
| `/result/[id]` | `layout` | `mbti-page-ux-sprint`, `frontend-design` |
| `/types` | `distill` + `layout` | `mbti-page-ux-sprint`, `frontend-design` |
| `/types/[code]` | `layout` | `mbti-page-ux-sprint`, `frontend-design` |
| `/dashboard` | `distill` + `layout` | `mbti-page-ux-sprint`, `frontend-design` |
| held routes | `distill` | shared-template implementation + route sweep |

## 5. Validation Commands

Use the smallest gate first, then broaden:

```bash
npm run data:validate
npm run types:validate
npm run assets:verify
npm run ui:v3:contract
npm run lint
npm run typecheck
npm run build
```

V4-specific scripts may be added only in QA workstream and must preserve V3 freshness checks.
