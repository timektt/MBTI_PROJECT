# My Results Task Pack

## Objective

ปรับ `/dashboard` จากหน้าที่ดูเหมือน system dashboard ให้เป็นพื้นที่ผู้ใช้ชื่อ `ผลของฉัน / My Results` โดยเก็บความสามารถ guest-local ที่มีอยู่ครบ: ผลล่าสุด ประวัติในเครื่อง PNG export pending result และ reconnect bundle

## Product Decision

- Preserve `/dashboard` for backward compatibility and runtime contracts.
- Replace visible `Dashboard` wording with `ผลของฉัน / My Results`.
- Do not expose queue, adapter, storage key, or reconnect payload in the primary experience.
- Place recovery/export diagnostics in an `Advanced` section when still needed.
- Login is a top-right Navbar command, not a card labeled `บัญชี`.

## Owner And Boundaries

- Primary owner: `My Results Agent`
- Reviewers: `Lead Agent`, `QA Integration Agent`
- Writable files: `pages/dashboard.tsx`, `components/dashboard/**`, and focused dashboard tests.
- Coordinate before editing Navbar, locale components, or shared copy.
- Do not change persistence keys, reconnect format, PNG contract, or guest-local semantics without an approved migration task.

## Dependencies

- Requires `V3-SYS-001` through `V3-SYS-007`.
- Consumes Navbar and locale behavior from `01-navbar-locale.md`.

## Tasks

## V3-RESULTS-001 - Capture Existing Behavior Contract

Status: `DONE`

Subtasks:

- List no-result, latest-result, pending-result, local-history, reconnect, export, and recoverable-error states.
- Identify exact local helpers and storage boundaries without printing personal data.
- Record every current user action and destination.
- Add or update focused regression tests before rearranging markup.

Acceptance:

- Every capability maps to a V3 destination.
- Nothing is deleted merely because its current UI is technical.

## V3-RESULTS-002 - Rename The User-Facing Surface

Status: `DONE`

Subtasks:

- Change visible Dashboard copy to `ผลของฉัน / My Results`.
- Update menu label, document title, H1, empty state, and supporting descriptions.
- Keep `/dashboard` as the route.
- Remove `บัญชี / Account` from this page unless it represents real authenticated state.

Acceptance:

- No primary surface calls the page Dashboard.
- Login remains the Navbar command.

## V3-RESULTS-003 - Establish The Page Hierarchy

Status: `DONE`

Subtasks:

- Order content as page header, latest result, next action, history, recovery/export tools, and advanced diagnostics.
- Use unframed sections; reserve cards for individual results/history entries.
- Keep the first viewport focused on the user's result.
- Give loading and pending regions stable dimensions.

Acceptance:

- Latest result is dominant when available.
- System mechanics are absent from the first viewport.

## V3-RESULTS-004 - Redesign Latest Result

Status: `DONE`

Subtasks:

- Show type code, localized name, date, concise summary, and only score/confidence data the runtime actually supports.
- Link to `/types/[code]`, PNG export, and retake Quiz.
- Avoid false numerical precision.
- Keep image and text in responsive flow without absolute-position overlap.

Acceptance:

- Result and next action are identifiable within five seconds.
- Existing actions preserve their behavior.

## V3-RESULTS-005 - Redesign Pending Result State

Status: `DONE`

Subtasks:

- Explain remaining progress in user language.
- Add one clear Resume action.
- Keep reset secondary and confirm before clearing.
- Remove queue/runtime terms.

Acceptance:

- Pending progress is visibly distinct from a completed result.
- Resume and reset are not ambiguous.

## V3-RESULTS-006 - Redesign Local History

Status: `DONE`

Subtasks:

- Use a compact chronological list or grid optimized for comparison.
- Show type and completion date; show change indicators only if real data supports them.
- Use icon actions with tooltips where familiar icons exist.
- Define behavior for long history beyond the initial display limit.

Acceptance:

- Long dates and localized names do not overflow.
- History works at 320px and 200 percent zoom.

## V3-RESULTS-007 - Build Useful Empty And Error States

Status: `DONE`

Subtasks:

- Empty state leads to Quiz.
- Recoverable errors explain the action without exposing raw exceptions.
- Missing local storage retains navigation and Quiz access.
- Add loading UI only where state is truly asynchronous.

Acceptance:

- Empty, error, and unavailable-storage states each have one clear next action.
- No raw JSON, stack trace, storage key, or internal error code is shown by default.

## V3-RESULTS-008 - Move Recovery And Export Utilities Into Advanced

Status: `DONE`

Subtasks:

- Keep reconnect import/export available.
- Place technical recovery actions under `Advanced / ขั้นสูง`.
- Explain impact before import, overwrite, or reset.
- Preserve the bundle format and verification script.

Acceptance:

- Primary result use needs no reconnect knowledge.
- Existing reconnect verification still passes.

## V3-RESULTS-009 - Remove Duplicate Locale Controls And Account Clutter

Status: `DONE`

Subtasks:

- Remove page-local `LocaleToggle` when shared Navbar exists.
- Consume the shared locale state without adding another switch.
- Remove account queue/status UI with no guest-local action.
- Keep Login in Navbar and do not invent authenticated state.

Acceptance:

- Exactly one visible language control exists.
- No `บัญชี` copy substitutes for a Login command.

## V3-RESULTS-010 - Responsive And Accessibility Pass

Status: `DONE`

Subtasks:

- Test every state at 320, 390, 768, 1024, and 1440px.
- Verify heading order, landmarks, focus, disclosures, confirmation behavior, tooltips, and touch targets.
- Test unusually long Thai and English strings.
- Check result imagery, history, button rows, and utility panels for overlap.

Acceptance:

- All state variants pass overlap and overflow checks.
- Advanced tools are keyboard operable and correctly announced.

## V3-RESULTS-011 - Regression And Visual Evidence

Status: `DONE`

Subtasks:

- Run reconnect import verification.
- Verify latest, pending, empty, history, PNG export, and reset confirmation.
- Capture desktop and mobile screenshots for completed, pending, and empty states.
- Record that `/dashboard` deep links remain valid.

Acceptance:

- Guest-local workflows remain functional.
- At least six screenshots cover three states across mobile and desktop.

## Completion Gate

Complete only when `/dashboard` behaves as My Results, Login is a Navbar action, all current guest-local capabilities remain, technical recovery is secondary, and core states have fresh responsive browser evidence.
