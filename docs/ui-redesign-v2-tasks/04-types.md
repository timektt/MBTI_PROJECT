# UI V2 Page Tasks: Types `/types`

Primary files:

- `pages/types.tsx`
- `components/mbti-z/type-card.tsx`
- `components/mbti-z/animal-portrait.tsx`
- `components/mbti-z/house-badge.tsx`
- `lib/mbti-z-copy.ts`
- `data/mbti/mbti-z-data.mjs`

Page objective: scan 16 types และเข้าใจ 4 houses โดยไม่ต้องอ่าน paragraph ทุก card

## TYPES-001: Full Content Fixture And Baseline

- Status: `DONE`
- Priority: `P0`
- Parallel group: `P1-TYPES`
- Dependencies: `SYS-005`

Tasks:

- render all 16 types in TH/EN
- capture all 6 viewports
- inventory image size, card height, text line count, sticky elements and surface nesting

Acceptance: baseline includes longest type name/summary and all assets

## TYPES-002: Taxonomy And House Navigation

- Status: `DONE`
- Priority: `P0`
- Dependencies: `TYPES-001`, `SYS-003`

Tasks:

- one segmented house control on mobile
- house navigation remains visible but does not stack with header
- active house uses color plus text/state, not color alone
- desktop taxonomy supports scanning without excessive sticky behavior

Acceptance: switch houses by pointer and keyboard; no sticky overlap

## TYPES-003: House Editorial Band

- Status: `DONE`
- Priority: `P1`
- Dependencies: `TYPES-002`

Tasks:

- house title and concise description
- one accent family per house
- image/scene only when it reveals house identity
- remove decorative badges and runtime metadata

Acceptance: active house purpose understood before type list

## TYPES-004: Type Listing Item

- Status: `DONE`
- Priority: `P0`
- Dependencies: `RESULT-004`, `TYPES-002`

Tasks:

- mobile media row with identifiable animal image
- desktop stable 4-column or density-tested grid
- type code, archetype and short descriptor only in default item
- no nested card and no paragraph wall

Acceptance: all 16 items scan by code and visual; stable heights within each breakpoint

## TYPES-005: Type Detail Disclosure

- Status: `DONE`
- Priority: `P1`
- Dependencies: `TYPES-004`

Tasks:

- choose inline disclosure or dedicated detail section based on baseline evidence
- preserve focused item and return position
- expose extended summary without loading all copy visually by default
- semantic button/region relationship

Acceptance: one detail opens at a time on mobile; keyboard and screen reader state clear

## TYPES-006: Asset Recognizability Audit

- Status: `DONE`
- Priority: `P1`
- Dependencies: `RESULT-004`, `TYPES-004`

Tasks:

- inspect 16 animal posters at actual rendered size
- flag assets that read as abstract sigil instead of animal
- separate layout defects from asset-generation backlog

Acceptance: every type has a visible, non-broken portrait whose named animal remains recognizable without adjacent text on desktop and mobile

Closure evidence (2026-07-16):

- replacement portrait set passes `16/16` recognizability review at rendered sizes `86x108` desktop and `78x98` mobile
- automated render audit passes `8/8` House/viewport samples with four cards per House, no overlap, no horizontal overflow, no broken image and no console/page error
- source PNG optimization reduces the 16-poster payload from `38,526,536` to `13,659,551` bytes (`64.5%`) without changing dimensions, paths or recognizability
- `npm run assets:verify` passes all 16 unique `1080x1350` animal posters, per-file `1.1 MB` budget and total `14 MB` budget
- evidence: `output/ui-skills-router/2026-07-16/animal-recognizability-after/`

## TYPES-007: Search/Filter Decision Gate

- Status: `DONE_DEFERRED`
- Priority: `P2`
- Dependencies: `TYPES-004`

Decision:

- add search only if user cannot scan/filter 16 items efficiently
- do not add search as decorative feature

Acceptance: documented evidence for add/defer decision

## TYPES-008: Locale And Text Stress

- Status: `DONE`
- Priority: `P1`
- Dependencies: `TYPES-004`, `TYPES-005`

Acceptance: TH/EN labels, longest archetype and descriptor fit 320px and 200% zoom

## TYPES-009: Loading/Empty/Error Resilience

- Status: `DONE`
- Priority: `P2`
- Dependencies: `SYS-007`

Tasks: safe rendering for missing asset/content entry without blank grid or crash

## TYPES-010: Types Completion Gate

- Status: `DONE`
- Priority: `P0`
- Dependencies: `TYPES-001..009`

Validation:

- `npm run data:validate`
- `npm run assets:verify`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- all 16 types, 2 locales, 6 viewports
- keyboard, 200% zoom, reduced motion, console and broken-image audit

Evidence path: `output/ui-skills-router/YYYY-MM-DD/v2-05-types/`

Batch B evidence (2026-07-15):

- before/after screenshots: 2 locales x 6 viewports
- all 4 house tabs: selected state, 4 cardsต่อ house และ broken images `0`
- keyboard ArrowRight เปลี่ยน focus และ `aria-selected`; disclosure เปิดได้ครั้งละหนึ่ง item
- no horizontal overflow, card overlap, console error หรือ control ต่ำกว่า `44px`
- asset verifier: 4 house scenes, 16 profiles, 16 animal posters, failures `0`
- search deferred: house filter ลดรายการ default เหลือ 4 items ซึ่ง scan ได้โดยไม่ต้องเพิ่ม search UI
- missing/malformed profile fields now normalize into 16 stable type slots; missing and failed animal media render accessible fallbacks
- Batch E state evidence covers media loading, all-image failure resilience, populated, selected-house and expanded disclosure states
- native Chrome 200% passes at effective viewport `600x450` without horizontal overflow
- all 16 replacement animal portraits pass recognizability, crop, overlap and contrast review on desktop and mobile
- zoom evidence: `output/ui-skills-router/2026-07-16/native-zoom-current/types-200.png`
- asset evidence: `output/ui-skills-router/2026-07-16/animal-recognizability-after/`
- evidence: `output/ui-skills-router/2026-07-15/v2-05-types/`
- Batch E evidence: `output/ui-skills-router/2026-07-15/v2-08-full-quality/`

## Non-Scope

- changing taxonomy/data meaning, generating new assets without approval, public user profiles
