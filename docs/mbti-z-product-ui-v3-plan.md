# MBTI Z Product UI V3 Plan

Date: 2026-07-16
Direction: `Living Identity`
Status: `COMPLETE - LOCAL UAT READY`
Runtime boundary: `guest-local`

เอกสารนี้เป็น source of truth สำหรับ UI/UX รอบถัดไปหลัง V2 โดยแก้ปัญหาที่ผู้ใช้ตรวจพบใน Home, Navbar, Type Atlas และ Dashboard โดยตรง V2 และหลักฐานเดิมยังเก็บเป็น history แต่ task ใหม่ต้องอ้างอิงแผนนี้กับ `docs/ui-redesign-v3-tasks/README.md`

## 1. Executive Decisions

| Issue | Current evidence | V3 decision |
| --- | --- | --- |
| Home แสดง `ESTJ` เพียง type เดียว | `components/marketing/premium-home.tsx` hardcode `profiles.find(...ESTJ)` | เปลี่ยนเป็น `Four-House Result Constellation` แสดงตัวแทน 4 houses พร้อมกัน ไม่สุ่มและไม่ผูก hero กับ type เดียว |
| Navbar มีรายการมากเกินไป | desktop แสดง Home, Quiz, 16 Types, Dashboard, Account, locale และ Start Quiz | primary navigation เหลือ Home, Quiz, 16 Types; มุมขวาเป็น `เข้าสู่ระบบ` และ icon menu สำหรับ My Results/language/secondary links |
| คำว่า `บัญชี` ไม่บอก action | `/login` ถูก label ว่า `บัญชี` | เปลี่ยนเป็น CTA `เข้าสู่ระบบ / Log in`; route ยังเป็น truthful account hold จน auth พร้อม |
| Type Atlas มี language control ซ้ำ | Navbar และ `pages/types.tsx` render locale controls พร้อมกัน | locale control มี source เดียวใน Navbar menu; remove page-local toggle ทุกหน้าที่ใช้ shared shell |
| Type card เปิดรายละเอียดด้วย dropdown | `TypeCard` มี disclosure state ใน listing | card เป็น navigation item ไป `/types/[code]`; ไม่มี inline dropdown |
| ไม่มี type detail deep link | route manifest มี `/types` อย่างเดียว | เพิ่ม static routes `/types/intj` ถึง `/types/esfp` พร้อม content TH/EN และ not-found behavior |
| Dashboard ดูเป็น system console | copy ใช้ Dashboard, vault, runtime, account queue | เก็บ capability ตาม PRD แต่ reframe เป็น `ผลของฉัน / My Results`; latest result และ history มาก่อน Advanced recovery |
| Home hover ยังนิ่ง | interaction หลักมีเพียงสี/scale เล็กน้อย | เพิ่ม cinematic hover/focus states แบบ transform-only, fixed geometry, pointer + keyboard parity และ reduced-motion fallback |

## 2. Product Boundary

### Required

- รักษา guest quiz, local result, local history, reconnect bundle และ PNG export
- Navbar มี primary destinations 3 รายการเท่านั้น
- Login เป็น command button ที่มุมขวาบน ไม่ใช้คำว่า Account/บัญชีเป็น nav label
- Type Atlas ไม่มี inline disclosure และทุก type เปิด dedicated route ได้
- Type detail มีข้อมูลต้นฉบับของ MBTI Z ครบ 16 types ทั้ง TH/EN
- My Results ตอบได้ทันทีว่า “ผลล่าสุดคืออะไร”, “เปิด/ดาวน์โหลดตรงไหน”, “มีประวัติอะไรบ้าง”
- Home ไม่ใช้ single-type hero และ interaction ต้องไม่ทำ layout shift

### Non-scope

- ไม่เปิด NextAuth, Supabase, account persistence หรือ cloud runtime
- ไม่เปลี่ยน scoring, question bank, result shape หรือ reconnect bundle schema
- ไม่ลบ `/dashboard`; route นี้ยังเป็น contract เดิมและเปลี่ยนเฉพาะ user-facing identity
- ไม่เพิ่ม random hero ที่ทำให้ SSR/hydration และ screenshot evidence ไม่ deterministic
- ไม่ copy copywriting, illustration หรือ layout จาก reference ภายนอก
- ไม่เพิ่ม animation library ถ้า existing motion primitives และ CSS ทำได้
- ไม่ deploy, commit หรือ push ใน task pack นี้

## 3. Evidence-Based Diagnosis

### Home

- hero media ใช้ `ESTJ` ที่ `components/marketing/premium-home.tsx`
- local `homeCopy` ใน component ซ้ำกับ `mbtiZHomeCopy` ใน `lib/mbti-z-copy.ts`
- current Home มี hero, outcome list, House preview และ final CTA แต่ขาด type discovery, result anatomy และ richer interaction
- product visual มี geometry ดีอยู่แล้ว จึงควรเปลี่ยน content model/interaction โดยไม่รื้อ shell ทั้งหน้า

### Navbar And Locale

- `components/Navbar.tsx` มี 5 nav items, locale switch และ Start Quiz CTA บน desktop
- mobile menu รวม 5 nav itemsกับ locale อีกชุด
- `LocaleToggle` ถูก render ซ้ำใน Types, Dashboard, Result และ hold/relaunch surfaces แม้ Navbar ครอบทุก route ผ่าน `_app.tsx`
- task ต้องตรวจ custom `getLayout` ก่อน remove page-local control เพื่อไม่ทำให้ route ใดสูญเสีย language access

### Type Atlas

- `pages/types.tsx` normalize 16 profiles และแบ่ง 4 houses ได้อยู่แล้ว
- `components/mbti-z/type-card.tsx` ใช้ disclosure ทำให้ listing card รับทั้ง discovery และ reading responsibility
- data ปัจจุบันมี `summary`, `strengths`, `growth`, `fit`, house, animal และ bilingual archetype เพียงพอเป็น foundation แต่ยังต้องเพิ่ม detailed sections อย่างเป็นระบบ

### Dashboard

- PRD กำหนด `/dashboard` เป็น core flow สำหรับ latest result, history, PNG export และ reconnect bundle
- UI ปัจจุบันทำ capability ครบ แต่ copy เช่น `vault`, `runtime`, `account queue`, `handoff` นำศัพท์ระบบขึ้นหน้า default มากเกินไป
- decision คือ preserve route/API/runtime contract และ redesign information hierarchy

## 4. Reference Principles

References ใช้เพื่อศึกษาหลักคิด ไม่ copy brand หรือเนื้อหา:

- `16Personalities` individual profile: ใช้ dedicated URL และ section navigation แยก Introduction, strengths, relationships, career และ workplace
  - https://www.16personalities.com/intj-personality
- `Truity` type profile: แยก work style, team behavior, leadership และ relationships เป็น reading sections
  - https://www.truity.com/blog/personality-type/intj/careers
- `Linear Mobile` navigation: ให้ผู้ใช้ prioritize destinations หลักและย้ายรายการรองออกจาก navigation surface หลัก
  - https://linear.app/changelog/2026-01-22-customize-your-navigation-in-linear-mobile

MBTI Z adaptation:

- Type profile ต้องเป็น original MBTI Z narrative ที่เชื่อม House, Animal และ Movie Profile
- Navbar ให้ product journey มาก่อน system destinations
- interaction ใช้ภาพจริงของ type/house เป็น visual signal ไม่ใช้ decoration ที่ไม่เกี่ยวกับเนื้อหา

## 5. Information Architecture

### Global primary navigation

1. `หน้าแรก / Home` -> `/`
2. `แบบทดสอบ / Quiz` -> `/quiz`
3. `16 Types` -> `/types`

### Right-side commands

- `เข้าสู่ระบบ / Log in` -> `/login`
- menu icon -> secondary menu

### Secondary menu

- `ผลของฉัน / My Results` -> `/dashboard`
- locale segmented control -> `TH / EN`
- guest storage status เป็นข้อความรอง ไม่เป็น nav item
- optional links ในอนาคตต้องเข้าเมนูนี้ก่อน ห้ามเพิ่ม primary nav โดยไม่มี IA review

### Route additions

| Route | Purpose | Rendering |
| --- | --- | --- |
| `/types` | scan/filter 16 types | existing page, simplified cards |
| `/types/[code]` | detailed public type profile | static generation for 16 lowercase codes |
| `/dashboard` | My Results | preserve route, rename user-facing surface |

Canonical type URLs:

- lowercase only เช่น `/types/intj`
- listing links generate lowercase paths
- unknown code returns 404
- route metadata title pattern: `{CODE} — {Archetype} | MBTI Z`

## 6. Shared Shell Specification

### Desktop 1024+

- logo left
- center primary links 3 items
- right `Log in` button + menu icon
- active state ใช้ underline/accent rail ไม่ใช้ pill หนาทุก item
- menu popover/drawer รองรับ click outside, Escape, focus return และ route-change close

### Mobile 320-1023

- logo left
- compact Login command right
- menu icon rightสุด
- primary และ secondary linksอยู่ใน one menu sheet
- locale อยู่ใน menu footer เพียงตำแหน่งเดียว
- menu sheet max-height ตาม `100dvh` และรองรับ safe-area

### Locale ownership

- `MbtiZLocaleProvider` ยังเป็น state source of truth
- Navbar menu เป็น UI control source of truth
- page-local locale control ถูกลบเมื่อ shared Navbar แสดงอยู่
- Result loading/not-found branches ต้องไม่สร้าง locale control ซ้ำ
- language change ต้อง preserve current route และ dynamic type code

## 7. Home V3 Specification

### 7.1 Hero: Four-House Result Constellation

แทน single `ESTJ` visual ด้วย media mosaic 4 ส่วน:

- Purple representative: `INTJ`
- Green representative: `INFJ`
- Yellow representative: `ISFJ`
- Blue representative: `ISTP`

ตัวแทนนี้ใช้เพื่อแสดง breadth ของระบบ ไม่สื่อว่า type ใดดีกว่า type อื่น และต้องอ่าน profile list จาก data source ไม่สร้าง copy ซ้ำใน component

Desktop interaction:

- default เห็น subject ของทั้ง 4 types
- hover/focus tile: image scale `<= 1.06`, local contrast เพิ่ม, code/archetype/house reveal
- non-active tiles dim เล็กน้อยแต่ยังอ่านได้
- pointer trail หรือ light sweep จำกัดอยู่ภายใน media tileและใช้ pseudo-element
- container geometry คงที่ ไม่มี grid track expansion และไม่มี text overlap

Mobile interaction:

- 2x2 mosaic คงที่
- tap/focus เลือก tile แล้วแสดง summary ใน fixed detail region ใต้ mosaic
- ไม่มี essential information ที่พึ่ง hover

### 7.2 Content Bands

1. Hero promise + primary Quiz CTA
2. Result anatomy: Type, House, Animal, Movie Profile, PNG
3. Four Houses interactive visual
4. How it works: answer -> reveal -> save/share
5. My Results persistence: อธิบาย local history แบบภาษาผู้ใช้
6. final quiz CTA

### 7.3 Hover Language

- outcome rows: accent line draw + icon reveal + text contrast
- House visual: image pan `<= 2%`, accent border, selected description crossfade
- CTA: icon translate `<= 4px`, background/contrast change; no size change
- all hover states mirror `focus-visible`
- `prefers-reduced-motion` disables transform/parallax while preserving color/state

### 7.4 Copy Source

- eliminate duplicate local `homeCopy` or explicitly retire unused `mbtiZHomeCopy`
- one authoritative bilingual export only
- copy must explain value, not implementation words เช่น runtime, module, schema

## 8. Type Atlas V3 Specification

### Listing responsibility

Type Atlas มีหน้าที่ scan และเลือก ไม่ใช่อ่าน profile เต็ม:

- House tabs/filter
- House visual/narrative แบบย่อ
- 4 type cards ต่อ House
- card แสดง animal, code, archetype, summary สูงสุด 2-3 บรรทัด
- explicit `อ่านโปรไฟล์ / View profile` affordance
- card/link ไป `/types/{code.toLowerCase()}`
- remove disclosure state, chevron และ inline detailed region

### URL state

- optional `?house=purple|green|yellow|blue` เพื่อ preserve filter เมื่อกลับจาก detail
- invalid query fallback เป็น purple โดยไม่ error
- active House state keyboard accessible

### Locale

- remove page-local `LocaleToggle`
- Navbar menu เปลี่ยนภาษาโดย listing content update ทันที
- TH/EN copy ต้องไม่เปลี่ยน card geometry แบบรุนแรง

## 9. Type Detail Route Specification

### Content schema per type

ทุก type ต้องมี TH/EN fields ครบ:

- `code`, `slug`, `houseKey`, `animalKey`, image path
- archetype และ one-sentence identity
- long introduction 2-3 paragraphs
- four-letter breakdown: E/I, S/N, T/F, J/P
- strengths 4-6 items
- growth edges 3-5 items
- decision style
- communication style
- relationships/friendship style
- work/team style
- under-stress pattern
- recovery practices
- Movie Profile lens
- practical environments/roles โดยระบุว่าเป็น tendency ไม่ใช่ข้อจำกัด
- related types 2-3 links
- disclaimer: educational reflection, not diagnosis or career guarantee

### Page composition

1. breadcrumb + House context
2. full-bleed identity hero with animal portrait
3. sticky local section navigation on desktop; compact jump menu on mobile
4. overview and letter breakdown
5. strengths / growth split band
6. communication / relationships
7. work / team / stress / recovery
8. Movie Profile lens
9. related types
10. Quiz CTA

### Static generation

- `getStaticPaths` returns 16 lowercase slugs
- `getStaticProps` resolves validated localized-neutral profile data
- locale remains client/provider state; static props contain both languages or stable profile key
- unknown slug returns `notFound: true`
- data validator fails when any type or locale field is missing

## 10. My Results Specification

### Product decision

เก็บ `/dashboard` เพราะเป็น core guest capability แต่ไม่แสดงคำว่า Dashboard ใน user-facing navigation/copy ใช้ `ผลของฉัน / My Results`

### Default hierarchy

1. latest result or resume assessment
2. primary actions: Open result, Download PNG
3. recent history
4. empty state with Start Quiz
5. Advanced recovery disclosure

### Remove from default view

- runtime counters
- account queue
- cloud relaunch language
- bundle version/internal handoff wording
- decorative “vault” metaphors ที่ทำให้ action หาไม่เจอ

### Advanced recovery

- reconnect import/export ยังคงครบแต่ collapsed by default
- copy ใช้ `ย้ายหรือกู้คืนข้อมูล / Transfer or recover data`
- destructive overwrite confirmation คงเดิม
- technical details แสดงเฉพาะเมื่อผู้ใช้เปิด disclosure

### Route and compatibility

- route ยังเป็น `/dashboard`
- all existing localStorage reads/writes preserved
- held/account copy ที่ link มาหน้านี้ใช้ label `My Results`

## 11. Responsive Contracts

| Viewport | Navbar | Home constellation | Type Atlas | Type Detail | My Results |
| --- | --- | --- | --- | --- | --- |
| 320x700 | logo/login/menu | 2x2 + detail below | one column | one reading column | latest/empty first |
| 390x844 | logo/login/menu | 2x2 + richer label | one column | jump menu | latest + actions |
| 768x1024 | menu or compact 3-link | 2x2 wide | 2-column cards | reading + jump menu | result + history |
| 1024x768 | 3-link desktop | 4-tile media | 2/4 columns by stress test | reading + side nav | main + compact advanced |
| 1440x1000 | full 3-link | cinematic 4-tile | 4 columns | reading + side nav | latest + history |
| 1600x1000 | max-width fixed | add whitespace only | max-width fixed | max-width fixed | max-width fixed |

Global:

- no horizontal overflow
- primary targets >= 44x44px
- primary mobile text >= 16px
- fixed/sticky UI ไม่บัง content ที่ 200% zoom
- hover never changes layout dimensions
- TH/EN longest copy and 16 type profiles pass

## 12. Data And Content Architecture

Recommended:

- keep identity fields in `data/mbti/mbti-z-data.mjs`
- add detailed editorial fields in a dedicated structured module เช่น `data/mbti/mbti-z-type-details.mjs`
- add validator script for exact 16 slugs and required TH/EN fields
- do not place 16 long profiles inside page component
- do not scrape/copy third-party profile text
- normalize links/related types from codes, not hardcoded URLs

Content quality rules:

- no deterministic claims เช่น “คุณจะเป็น...”
- use tendency language เช่น “มัก”, “มีแนวโน้ม”, “อาจ”
- career sections describe environments and work patterns, not guaranteed occupations
- relationships sections avoid compatibility scoring without evidence
- each TH/EN section should carry equivalent meaning, not literal machine translation

## 13. Implementation Waves

### Wave V3-00: Contract Lock

- lock IA, labels, type detail schema and route manifest change
- assign shared-file owners
- baseline screenshots Home/Types/Dashboard desktop+mobile

### Wave V3-01: Parallel Foundations

- Stream A: Navbar + locale ownership
- Stream B: type detail data + validator
- Stream C: My Results copy hierarchy
- Stream D: Home constellation prototype using existing assets

### Wave V3-02: Discovery Journey

- Type Atlas cards -> routes
- implement `/types/[code]`
- related-type navigation and back-to-House behavior

### Wave V3-03: Product Polish

- Home content bands and hover/focus system
- My Results visual redesign
- remove duplicate locale controls across shared-shell routes

### Wave V3-04: Full Quality Gate

- route manifest becomes 31 routes
- active state evidence adds Type Detail populated/not-found and Atlas navigation states
- current project matrix rerun after all render-affecting changes
- build, runtime, reconnect and export regression

## 14. Acceptance Gates

1. Home hero shows 4 houses and no hardcoded single-type bias.
2. Navbar primary navigation contains exactly 3 destinations.
3. Login appears as a right-side command and no primary label says Account/บัญชี.
4. One visible locale control exists per viewport; Types has no duplicate.
5. All 16 Type cards navigate to unique canonical detail routes.
6. Type Atlas has no inline dropdown/disclosure details.
7. All 16 detail routes build and render complete TH/EN content.
8. Unknown type code returns 404 without framework/runtime error.
9. My Results preserves latest/history/export/reconnect contracts while removing system-first copy.
10. Hover/focus effects are visually meaningful, geometry-stable and reduced-motion safe.
11. Required flows pass 320-1600px and 200% zoom.
12. `guest-local`, local history, reconnect bundle and PNG export do not regress.

## 15. Required Validation

- `npm run data:validate`
- new type-detail content validator
- `npm run assets:verify`
- `npm run reconnect:verify`
- `npm run runtime:guards`
- `npm run auth:surface`
- `npm run ui:manifest:verify`
- `npm run ui:fixtures:check`
- `npm run ui:v2:quality` or renamed V3 equivalent after evidence migration
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `git diff --check`
- Chrome current matrix and WebKit PNG export regression
- browser process/profile cleanup check after automation

## 16. Execution Source

Task packets, dependencies, agent ownership and handoff format:

- `docs/ui-redesign-v3-tasks/README.md`
- `docs/ui-redesign-v3-tasks/AGENT-TEAM.md`
- `docs/ui-redesign-v3-tasks/execution-cards/README.md`

Execution uses the 27 granular cards in `execution-cards/`. Each card maps to the stable task IDs defined by the workstream packets; cards must not create a second task-ID namespace.

## 17. Completion Record

Completed: 2026-07-17
Runtime: `guest-local`
Local UAT: `http://localhost:3030`

Delivered:

- Navbar has exactly Home, Quiz and 16 Types as primary destinations; Log in is the right-side command.
- Home uses a deterministic INTJ/INFJ/ISFJ/ISTP Four-House constellation with stable hover, focus and tap behavior.
- Type Atlas has four responsive House filters and 16 semantic route links with no inline disclosure.
- `/types/[code]` statically generates all 16 lowercase routes with TH/EN long-form profiles, related links, canonical metadata and 404 behavior.
- `/dashboard` is presented as My Results while latest result, pending session, eight-item history, PNG and reconnect behavior remain available.
- Shared-shell routes have no page-local `LocaleToggle` consumers.

Current evidence:

- `output/ui-redesign-v3/audit/browser-audit-report.json`: 31 route patterns, 16 concrete type paths, 130 responsive samples, zero failures.
- `output/ui-redesign-v3/audit/interaction-audit-report.json`: 17 navigation, locale, routing, metadata, hover and reflow checks.
- `output/ui-redesign-v3/audit/my-results-state-report.json`: 10 My Results state and PNG checks.
- `output/ui-redesign-v3/audit/webkit-png-report.json`: WebKit PNG regression proof.
- `output/ui-redesign-v3/screenshots/`: current production-build screenshots.

Current command gates:

- `npm run ui:v3:contract`
- `npm run ui:manifest:verify`
- `npm run ui:route-sweep:verify`
- `npm run ui:v3:quality`
- `npm run ui:completion`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `git diff --check`

Historical note: `npm run ui:v2:quality` intentionally remains a V2 history gate and reports stale 30-route evidence after the V3 route addition. V3 completion is owned by `ui:v3:quality` and the freshness-aware V3 route sweep.
