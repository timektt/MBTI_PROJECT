# V3 Quality Gates And Completion Audit

## Objective

พิสูจน์ว่า V3 แก้ navigation, route architecture, duplicate locale controls, content depth, responsive overlap และ runtime regression ครบทั้งโปรเจค ไม่ใช่เฉพาะ screenshot บางหน้า

## Owner And Boundaries

- Primary owner: `QA Integration Agent`
- Final approver: `Lead Agent`
- Feature agents repair defects inside their writable boundaries.
- QA may add focused audit tests after coordinating shared files.
- Figma is not required and is not a completion gate. Browser-rendered implementation is the source of truth.

## Evidence Layout

```text
output/ui-redesign-v3/
  desktop/
  mobile/
  states/
  audit/
```

Every run records source SHA when available, viewport, route, locale, fixture/state, command, timestamp, console summary, and overlap result.

## Tasks

## V3-QA-001 - Freeze The V3 Route Manifest

Status: `DONE`

Subtasks:

- Enumerate user-facing routes from `pages/**`.
- Expand `/types/[code]` to 16 paths.
- Classify each route as primary navigation, secondary menu, contextual link, or hidden system route.
- Record static, client-only, and data-dependent behavior.
- Include existing result and recovery routes plus one invalid type route.

Acceptance:

- Every route has an owner and expected status.
- The exact route total is derived from current source, not copied from an old audit.

## V3-QA-002 - Verify Navbar Information Architecture

Status: `DONE`

Subtasks:

- Verify exactly three persistent links: Home, Quiz, and 16 Types.
- Verify Login is the top-right command.
- Verify My Results and language are in the secondary menu.
- Test active state, Escape, outside click, route change, dismissal, and focus restoration.

Acceptance:

- Desktop and mobile never show more than three primary links.
- Menu passes keyboard and touch use.

## V3-QA-003 - Verify Locale Control Uniqueness

Status: `DONE`

Subtasks:

- Scan every `LocaleToggle` render.
- Assert at most one visible language control per route with shared Navbar.
- Verify language changes Navbar, page content, relevant metadata, and saved preference.
- Verify placement remains predictable between routes.

Acceptance:

- `/types` and `/dashboard` have no duplicate controls.
- Locale remains one shared state contract.

## V3-QA-004 - Verify Home Identity And Interaction

Status: `DONE`

Subtasks:

- Confirm the first viewport does not use ESTJ as the sole product representative.
- Verify the deterministic Four-House Result Constellation covers all four houses.
- Test hover, focus, touch, and reduced motion.
- Verify all CTAs and the next-section viewport hint.

Acceptance:

- No random initial hero state is used.
- Enhancement causes no layout movement or overlap.

## V3-QA-005 - Verify Type Atlas Navigation

Status: `DONE`

Subtasks:

- Verify exactly 16 type cards.
- Verify click and keyboard navigation to correct detail routes.
- Verify no inline expanded/disclosure profile remains.
- Verify filters cannot strand the user without a useful empty state.

Acceptance:

- All 16 links resolve.
- Browser Back returns predictably to Atlas.

## V3-QA-006 - Verify Type Content Completeness

Status: `DONE`

Subtasks:

- Run the type-detail validator.
- Check 16 types in Thai and English.
- Verify required sections, related links, disclaimer, metadata, and 404.
- Spot-check depth across all four houses.

Acceptance:

- 32 localized profiles pass.
- No placeholder, copied body, broken relation, or missing section remains.

## V3-QA-007 - Verify My Results State Matrix

Status: `DONE`

Subtasks:

- Exercise completed, pending, history, empty, unavailable-storage, import, export, recoverable-error, and reset-confirmation states.
- Verify user terminology and Advanced placement.
- Verify Login remains in Navbar with no fake account state.
- Verify `/dashboard` deep linking.

Acceptance:

- Every state has one clear next action.
- Guest-local behavior remains intact.

## V3-QA-008 - Run The Responsive Route Matrix

Status: `DONE`

Required viewport classes: `320x800`, `390x844`, `768x1024`, `1024x768`, and `1440x1000`.

Subtasks:

- Render every route at the appropriate mobile, tablet, and desktop risk level.
- Run full coverage on Home, Quiz, Atlas, four representative profiles, My Results, Account/Login, and result routes.
- Run smoke coverage on the remaining 12 profiles.
- Detect horizontal overflow, clipped controls, text/image collision, off-canvas content, and fixed/sticky overlap.
- Test both locales on high-risk routes.

Acceptance:

- Zero unintended horizontal overflow.
- Zero incoherent text, image, card, Navbar, or control overlap.
- Every high-risk route has mobile and desktop evidence.

## V3-QA-009 - Accessibility And Zoom Audit

Status: `DONE`

Subtasks:

- Verify landmarks, headings, labels, names, roles, states, alt text, focus, and touch targets.
- Test keyboard-only navigation and menu/dialog focus management.
- Test 200 percent browser zoom.
- Check contrast and non-color indicators.
- Verify `prefers-reduced-motion`.

Acceptance:

- No keyboard trap or unreachable action exists.
- Text and controls remain usable at 200 percent zoom.

## V3-QA-010 - Asset And Performance Audit

Status: `DONE`

Subtasks:

- Verify images load with correct dimensions and responsive sizing.
- Check Home interaction for oversized duplicate assets.
- Review route bundle changes and avoidable client animation work.
- Check image warnings, hydration errors, and repeated asset failures.

Acceptance:

- No broken or blank primary visual exists.
- No severe V3 performance regression remains.

## V3-QA-011 - Runtime Regression Checks

Status: `DONE`

Subtasks:

- Run `npm run data:validate`.
- Run `npx --yes tsx scripts/verify-reconnect-import.ts`.
- Run focused Navbar, Home, Atlas, type-route, and My Results tests.
- Verify quiz completion, local history, result rendering, reconnect import, and PNG export.

Acceptance:

- Guest-first quiz to visible result works.
- Persistence/export contracts remain unchanged or have an approved migration.

## V3-QA-012 - Static Analysis And Production Build

Status: `DONE`

Subtasks:

- Run `npm run typecheck`.
- Run `npm run lint`.
- Run `npm run build`.
- Run `npm run env:check` when required.
- Separate pre-existing failures from V3 regressions with evidence.

Acceptance:

- Typecheck, lint, and build pass.
- Environment blockers name only missing variable names, never secret values.

## V3-QA-013 - Browser Hygiene And Evidence Integrity

Status: `DONE`

Subtasks:

- Use local browser tooling in an isolated profile.
- Close every browser, context, page, server, and test process started by the audit.
- Check leftover automation processes and profiles.
- Trace screenshots to route, viewport, locale, fixture, and source revision.
- Preserve or strengthen the existing freshness guard.

Acceptance:

- No task-started process remains.
- Stale screenshots cannot pass as current proof.

## V3-QA-014 - Publish The Completion Audit

Status: `DONE`

Subtasks:

- Publish a route-by-route pass/fail table.
- List defects by severity with route, viewport, locale, and reproduction.
- Compare implementation with every locked master-plan decision.
- State readiness for user acceptance review.
- Keep High/Critical overlap, broken navigation, duplicate locale, missing route, or runtime regression as blockers.

Acceptance:

- No ambiguous `mostly done` status exists.
- Every failed gate has an owner and follow-up task ID.

## Final Release Gate

V3 reaches user acceptance review only when feature packs are complete, high-risk routes have fresh browser evidence, static checks and build pass, runtime contracts work, and no Critical or High finding remains.
