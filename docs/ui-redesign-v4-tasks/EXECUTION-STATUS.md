# MBTI Z UI V4 Execution Status

Updated: 2026-08-31
Runtime boundary: `guest-local`
Current source fingerprint: `84a9199a1732dd68abe418c435fbba1e5e6fd680bbc3c89efa19719c451fa3aa`
Current completed slice: protected PR checks and dependency-remediated Preview acceptance
Next slice: explicit Production approval, protected merge and first-release evidence

## Active Change Request

`Fantasy Art And Motion V2` is now `DEPENDENCY PREVIEW ACCEPTED - PRODUCTION NOT PROMOTED` with 136 additional overlay tasks and 28 execution cards. These counts are intentionally not merged into the original 142-task V4 ledger.

Local evidence now includes 21 accepted V2 assets, shared motion cleanup, all 16
type routes, 130 browser samples with zero failures/asset fallbacks, full
`npm run verify`, a 48-page build and Lighthouse lab reports. GitHub protected
main governance is active and protected Preview acceptance is complete. Production
remains a separate security and rollback gate.

The remediation branch now uses the bundled `next/og` renderer, Auth.js v5 beta,
Next.js 16.3.3, React 19.2.8 and a native ESLint flat config. Unused production
dependencies were removed or moved to development ownership. `npm audit --omit=dev`
reports zero findings locally, account runtime contracts pass, and the 49-page
Webpack production build passes. PR `#9`, GitHub CI and the dependency-remediated
Vercel Preview pass from runtime SHA `4e50113`; merge and Production remain
separate approval gates.

Execution order before continuing route polish:

1. research/current-asset lock
2. six-asset style pilot and approval
3. accepted production image batches plus motion architecture audit
4. route integration and full responsive/performance evidence
5. protected-main PR workflow, Vercel Preview, Production promotion and rollback proof

Source: `docs/mbti-z-fantasy-art-motion-v2-plan.md`

## Program Totals

| State | Stable tasks | Meaning |
| --- | ---: | --- |
| `DONE` | 37 | acceptance and current-source evidence pass |
| `DEFERRED` | 4 | image generation rejected by the need gate; code-first alternative is recorded |
| `IN PROGRESS / PENDING` | 101 | remaining audit, route and full-QA work |
| Total | 142 | unchanged stable task inventory |

## Card Status

| Cards | Status | Evidence / next action |
| --- | --- | --- |
| 01-03 Program contract | `READY / PENDING` | preserve guest-local and historical behavior gates; produce dedicated program-contract evidence before shared shell work |
| 04 Baseline core routes | `IN PROGRESS` | Home captured at five viewports; Quiz, Result, Atlas, Type Detail and My Results remain |
| 05 Overlap/layout audit | `IN PROGRESS` | Home geometry and visual-crowding audit complete; remaining routes pending |
| 06 Pruning inventory | `IN PROGRESS` | Home classified and pruned; remaining routes pending |
| 07 Home approval packet | `DONE` | user authorized project-wide execution; Home audit and exact scope recorded |
| 08 Existing asset audit | `DONE` | 4 House + 16 Animal assets decoded and verified |
| 09 Home concept direction | `DONE` | need gate narrowed generation to one unresolved Hero slot; three controlled candidates reviewed |
| 10 Home production Hero | `DONE` | accepted 1672x941 WebP, 106,168 bytes |
| 11 Quiz production image | `DEFERRED` | `SKIP`: task focus and mobile space are more important than atmosphere |
| 12 Held production image | `DEFERRED` | `SKIP`: compact state template communicates the route without illustration |
| 13 Asset ledger/verification | `DONE` | prompt, hash, crop contract and `assets:verify` gate recorded |
| 14-16 Shared shell | `DONE` | existing signal primitives retained; compact 320px Login, opaque menu surface, focus trap/return and TH/EN evidence pass |
| 17 Home Hero | `DONE` | full-bleed image, MBTI Z brand signal, one primary CTA and next-section hint |
| 18 Home bands | `DONE` | six sections reduced to four bands and Result Anatomy reduced to three layers |
| 19 Home hover/pruning | `DONE` | House hover/focus is container-safe; interactive Type mosaic and repeated CTA band removed |
| 20 Home closeout | `DONE` | TH/EN browser matrix passed 10/10 captures |
| 21-31 Remaining routes | `DONE` | Quiz, Result, Atlas, all Type Detail routes, My Results and held routes pass current-source evidence |
| 32 Full V4 quality gate | `DONE WITH RESIDUAL` | current source passed 31 route patterns, 16 Type routes and 130 local browser samples; dependency-remediated Preview route/API smoke passed, while a new protected CDN browser run remains an explicit residual |

## Home Verification

- `npm run assets:verify`: passed, including V4 Hero dimensions and byte budget
- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run data:validate` and `npm run types:validate`: passed
- `npm run ui:v3:contract`: passed after updating Home checks from old implementation syntax to V4 behavior invariants
- `npm run build`: passed, 48 static pages generated
- `node scripts/run-ui-v4-browser-evidence.cjs`: passed 10/10 TH/EN captures
- `node scripts/run-ui-v4-shell-evidence.cjs`: passed 10/10 TH/EN samples plus 200% reflow equivalent
- `npm run ui:v3:quality`: expected freshness failure because the full V3 route sweep predates current V4 source; Card 32 owns replacement full-route evidence
- Browser evidence: `output/ui-redesign-v4/2026-08-30/home/`

## Next Execution Order

1. Review PR `#9` and the accepted Preview evidence.
2. Obtain explicit approval before merging the protected branch or changing the Production alias.
3. Confirm the protected `main` SHA equals the approved runtime revision after merge.
4. Create and smoke the first healthy guest-local Production deployment.
5. Record that deployment as the rollback predecessor for the next release.
6. Follow up with route-scoped rate-limit keys before any account runtime activation.
