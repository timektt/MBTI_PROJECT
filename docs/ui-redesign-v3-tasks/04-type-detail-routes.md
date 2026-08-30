# Type Detail Routes Task Pack

## Objective

สร้างหน้า profile แยกสำหรับ MBTI ครบทั้ง 16 แบบที่ `/types/[code]` แทนการเปิดรายละเอียดแบบ disclosure ภายใน card โดยเนื้อหาต้องอ่านได้ทั้งไทยและอังกฤษ รองรับ static generation และเชื่อมกลับไปยัง Type Atlas ได้ชัดเจน

## Owner And Boundaries

- Primary owner: `Type Profile Agent`
- Reviewers: `Lead Agent`, `QA Integration Agent`
- Writable files: `pages/types/[code].tsx`, `components/types/type-detail/**`, `data/mbti/mbti-z-type-details.mjs`, `scripts/validate-mbti-type-details.mjs`, and focused tests.
- Read-only dependencies: `data/mbti/mbti-z-data.mjs`, shared shell, locale provider, and shared copy.
- External personality sites are information-architecture references only. Do not copy their prose.

## Dependencies

- Requires `V3-SYS-001` through `V3-SYS-007`.
- Consumes the Navbar contract from `01-navbar-locale.md`.
- Coordinates route-link behavior with `03-type-atlas.md`.

## Tasks

## V3-TYPE-001 - Define The Detail Schema

Status: `DONE`

Subtasks:

- Define one stable profile schema in `data/mbti/mbti-z-type-details.mjs`.
- Require `code`, localized name, tagline, overview, letter explanation, strengths, growth areas, decision style, communication style, relationships, work, teamwork, stress signals, recovery practices, Movie Profile, related types, and disclaimer.
- Keep content structured as fields and arrays, not opaque HTML.
- Reuse existing facts where they are already authoritative.
- Document paragraph fields versus short scan-friendly fields.

Acceptance:

- The schema supports every approved section without `any`-shaped access.
- Thai and English have the same structural shape.

## V3-TYPE-002 - Author Original Content For All 16 Types

Status: `DONE`

Subtasks:

- Add `intj`, `intp`, `entj`, `entp`, `infj`, `infp`, `enfj`, `enfp`, `istj`, `isfj`, `estj`, `esfj`, `istp`, `isfp`, `estp`, and `esfp`.
- Write original Thai and English copy for every required field.
- Keep descriptions behavior-focused and avoid deterministic identity, diagnosis, career-success, or relationship claims.
- Keep depth consistent; no type may be a placeholder or visibly shorter shell.
- Keep Movie Profile entertainment-oriented with a disclaimer.

Acceptance:

- Exactly 16 records and two complete locales per record exist.
- No TODO, lorem ipsum, empty arrays, duplicated body, or copied third-party prose remains.

## V3-TYPE-003 - Build A Content Validator

Status: `DONE`

Subtasks:

- Add `scripts/validate-mbti-type-details.mjs`.
- Validate exact code coverage, duplicates, locales, required sections, empty arrays, and related-type references.
- Reject unknown related types and unintended self-relations.
- Produce actionable errors with type code, locale, and field path.
- Add a package script only if it matches existing script conventions.

Acceptance:

- The validator exits non-zero for incomplete content and passes for the committed dataset.
- A malformed fixture or focused test proves the failure path.

## V3-TYPE-004 - Create A Typed Read Contract

Status: `DONE`

Subtasks:

- Add a small read helper that normalizes route params to lowercase.
- Return `null` for unsupported codes; never fall back to ESTJ or another type.
- Keep locale selection at the view boundary so both payloads remain statically available.
- Avoid duplicating source data between Atlas and detail routes.

Acceptance:

- Route code consumes one documented API.
- Invalid codes cannot accidentally render a valid profile.

## V3-TYPE-005 - Implement Static Route Generation

Status: `DONE`

Subtasks:

- Create `pages/types/[code].tsx` with `getStaticPaths` and `getStaticProps`.
- Generate exactly 16 lowercase paths with `fallback: false`.
- Decide and test uppercase behavior; prefer canonical lowercase redirect or 404, never duplicate content.
- Keep compatibility with Pages Router and guest-local runtime.
- Add no cloud, auth, database, or API requirement.

Acceptance:

- All 16 routes build statically.
- `/types/xxxx` returns the framework 404.

## V3-TYPE-006 - Add Metadata And Canonical Identity

Status: `DONE`

Subtasks:

- Set localized title and description from profile data.
- Add canonical lowercase route identity using the existing metadata pattern.
- Ensure one H1 includes code and localized name.
- Avoid medical or predictive claims.

Acceptance:

- Every type has distinct metadata and exactly one H1.

## V3-TYPE-007 - Build The Type Hero

Status: `DONE`

Subtasks:

- Build an unframed hero with code, name, tagline, four-letter rail, house identity, and Back to Types action.
- Keep the type identity visible in the first viewport on mobile and desktop.
- Use real product visual assets; do not make the hero a decorative card.
- Keep Quiz as a secondary action.

Acceptance:

- It works at 320, 390, 768, 1024, and 1440px widths without overlap.
- Identity changes meaningfully across all four houses.

## V3-TYPE-008 - Build Sticky Section Navigation

Status: `DONE`

Subtasks:

- Add navigation for Overview, Strengths, Relationships, Work, Stress, and Movie Profile.
- Use unique anchors, visible focus, and sticky-Navbar scroll offsets.
- Use a scrollable rail or compact menu on narrow screens.

Acceptance:

- Every item reaches the correct section by keyboard and touch.
- Navigation never covers the destination heading.

## V3-TYPE-009 - Render Overview And Letter Meaning

Status: `DONE`

Subtasks:

- Render overview at a readable line length.
- Explain each preference pair without implying ability or moral value.
- Avoid four nested decorative cards.
- Verify Thai wrapping and English labels.

Acceptance:

- All four letters are explained and remain usable at 200 percent zoom.

## V3-TYPE-010 - Render Strengths And Growth Areas

Status: `DONE`

Subtasks:

- Give strengths and growth areas equal visual weight.
- Include context and practical examples rather than adjective-only lists.
- Avoid good-versus-bad traffic-light colors.
- Use the existing icon library where icons improve scanning.

Acceptance:

- Both sections are complete for every profile and collapse cleanly to one column.

## V3-TYPE-011 - Render Relationships, Work, Team, Stress, And Recovery

Status: `DONE`

Subtasks:

- Present decision and communication patterns before relationship and work sections.
- Separate individual work style, team collaboration, and leadership tendencies.
- Pair stress signals with concrete recovery practices.
- Keep language probabilistic and context-aware.

Acceptance:

- All sections appear in the agreed order.
- No diagnosis, hiring, or compatibility guarantee is made.

## V3-TYPE-012 - Add Movie Profile, Related Types, And Disclaimer

Status: `DONE`

Subtasks:

- Render Movie Profile as an analogy with a visible entertainment disclaimer.
- Link related types to valid `/types/[code]` routes.
- Add a concise reflection-tool disclaimer.
- Add clear routes back to Type Atlas and Quiz.

Acceptance:

- Every related link resolves and the disclaimer is visible without looking like an error.

## V3-TYPE-013 - Responsive, Accessibility, And Motion Pass

Status: `DONE`

Subtasks:

- Audit overflow, anchor offsets, wrapping, and image crop at required viewports.
- Verify landmarks, headings, focus order, focus visibility, alt text, and touch targets.
- Respect `prefers-reduced-motion`.
- Verify locale switching does not reset the route or cause layout collisions.

Acceptance:

- No overlap or clipped text exists at required viewports.
- Keyboard-only navigation reaches every action and section.

## V3-TYPE-014 - Produce Route Evidence

Status: `DONE`

Subtasks:

- Capture desktop and mobile proof for one representative type from each house.
- Capture one full-page section-sequence screenshot.
- Record all 16 route status checks plus one invalid route.
- Store evidence under the convention in `06-quality-gates.md`.

Acceptance:

- Evidence covers `INTJ`, `INFJ`, `ISFJ`, and `ISTP`, or approved replacements.
- Invalid-route proof is included.

## Completion Gate

Complete only when 16 static routes and 32 localized profiles pass validation, invalid codes return 404, Atlas cards navigate to these pages, no inline disclosure remains, and fresh responsive evidence shows no overlap.
