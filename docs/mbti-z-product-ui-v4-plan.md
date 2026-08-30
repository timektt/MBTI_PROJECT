# MBTI Z Product UI V4 Plan

Date: 2026-08-30
Direction: `Living Archive`
Status: `IMPLEMENTATION ACTIVE - HOME AND SHARED SHELL PASSED; FANTASY V2 PLAN READY`
Runtime boundary: `guest-local`
Primary evidence: current source, current route manifest, current V3 browser gates, fresh V4 screenshots per sprint

## Active Change-Request Overlay

The user requested a sharper `stylized realistic fantasy` image system and lightweight project-wide motion after the initial V4 Home slice. Plan and tasks are versioned separately so current V4 evidence is not rewritten:

- `docs/mbti-z-fantasy-art-motion-v2-plan.md`
- `docs/ui-redesign-v4-tasks/FANTASY-ART-MOTION-V2-RESEARCH.md`
- `docs/ui-redesign-v4-tasks/FANTASY-ART-V2-SYSTEM-PROMPT.md`
- `docs/ui-redesign-v4-tasks/FANTASY-ART-MOTION-V2-TASKS.md`
- `docs/ui-redesign-v4-tasks/fantasy-art-motion-v2-cards/`

This overlay is `PLAN READY - PRODUCTION NOT STARTED`. It adds no dependency and changes no product/runtime source by itself.

เอกสารนี้เป็น source of truth สำหรับการออกแบบ UI/UX รอบ V4 โดยเก็บ V3 เป็น functional baseline และ historical evidence ห้ามแก้สถานะ V3 ให้กลายเป็นงาน V4 และห้ามถือ screenshot เก่าว่าเป็นหลักฐานหลังแก้รอบใหม่

## 1. Classification And Objective

งานนี้เป็น `prototype-hardening + project-wide UI redesign planning` เป้าหมายคือทำให้ MBTI Z อ่านง่าย สวย มีภาพที่ทำหน้าที่จริง รองรับ responsive และตัด UI ที่ไม่ช่วย core journey ออก โดยไม่กระทบ scoring, guest persistence, reconnect bundle, PNG export, API contract หรือ cloud readiness gate

Core journey ที่ต้องชัดที่สุด:

```text
Home -> Quiz -> Result -> My Results
                |
                +-> 16 Types -> Type Detail
```

## 2. Verified Current State

- Next.js 15 Pages Router, React 19, Tailwind 3, `npm`
- active runtime คือ `guest-local`
- V3 มี Navbar 3 primary destinations, dedicated `/types/[code]`, My Results และ browser quality gate แล้ว
- production assets ปัจจุบันมี animal portraits 16 รูปและ house scenes 4 รูป
- core routes มี `/`, `/quiz`, `/result/[id]`, `/types`, `/types/[code]`, `/dashboard`
- account/social/admin routes จำนวนมากยังอยู่ใน truthful hold state ผ่าน `AccountHold` และ `RelaunchState`
- Figma ไม่ใช่ gate; browser-rendered screenshots และ source revision เป็นหลักฐาน authoritative

## 3. V4 Executive Decisions

| Area | V4 decision |
| --- | --- |
| Product focus | ให้ Quiz, Result, Type discovery และ local history เป็น product; route อื่นเป็น secondary/hold |
| Visual direction | `Living Archive`: cinematic editorial, near-black neutral, bone text, restrained gold, house colors เฉพาะจุด |
| Home | full-bleed image-led first viewport, ไม่ผูกกับ ESTJ หรือ type เดียว, CTA เดียวชัดเจน |
| Navbar | desktop เหลือ Home, Quiz, 16 Types; Login + menu ด้านขวา; mobile รวมใน sheet เดียว |
| Card usage | card ใช้เฉพาะ repeated selectable item, result artifact, modal หรือ framed tool; section ปกติใช้ band/grid |
| Images | reuse 20 verified assets ก่อน; generate เฉพาะ asset gap ที่มี placement contract |
| Hover | เพิ่ม depth, crop reveal, light sweep และ metadata reveal โดย fixed geometry; mobile ต้องมี tap/focus equivalent |
| Type Atlas | scan/filter/navigation เท่านั้น; ไม่เปิดข้อมูลยาวใน card |
| Type Detail | dedicated route, editorial reading flow, sticky section index เฉพาะ desktop ที่มีพื้นที่พอ |
| Dashboard | ชื่อผู้ใช้เห็นเป็น `My Results / ผลของฉัน`; latest artifact และ primary actions มาก่อน technical recovery |
| Held routes | ใช้ shared compact template เดียว, ไม่ทำให้ดูเหมือน feature พร้อมใช้ และไม่อยู่ใน primary navigation |
| Responsive | mobile-first ที่ 320/390, intermediate 768/1024, desktop 1440, zoom 200%, TH/EN long-copy |
| Evidence | screenshot before/after + DOM/console/overflow/a11y metrics + current SHA/source hash |

## 4. Visual Thesis

### 4.1 Brand World

- editorial personality archive ไม่ใช่ dashboard หรือ terminal
- imagery แสดงตัวตน House/Animal/Result จริง ไม่ใช้ stock mood หรือ blob decoration
- typography มี scale contrast ชัด แต่ข้อความไทยยาวใช้ readable sans
- sections มีจังหวะสลับ `image-led -> explanatory -> interactive -> quiet CTA`
- accent 4 House ใช้เป็น identity signal ไม่ทาสีทั้งหน้า

### 4.2 Anti-Direction

- ห้าม nested cards, card wall และ section ที่ลอยเป็น card
- ห้าม dark blue/slate ครอบทั้ง UI จนอ่านเป็นสีเดียว
- ห้าม purple-blue gradient, orb, bokeh และ glow ที่ไม่มีหน้าที่
- ห้ามภาพที่มี text baked-in, watermark, logo ปลอม หรือ fake UI
- ห้าม hover ทำ grid ขยายจน element ทับกัน
- ห้ามใช้ภาพ background ใต้ answer text หรือ paragraph โดย contrast ไม่เสถียร
- ห้ามซ่อน core information ไว้เฉพาะ hover

## 5. Information Architecture

### Primary navigation

1. `หน้าแรก / Home` -> `/`
2. `แบบทดสอบ / Quiz` -> `/quiz`
3. `16 Types` -> `/types`

### Right-side commands

- `เข้าสู่ระบบ / Log in` -> `/login`
- menu -> My Results, language, secondary status/recovery link when relevant

### Route tiers

| Tier | Routes | Treatment |
| --- | --- | --- |
| Core | `/`, `/quiz`, `/result/[id]`, `/types`, `/types/[code]`, `/dashboard` | full V4 redesign and complete state coverage |
| Entry hold | `/login`, `/register`, `/forgot-password` | one compact shared account hold experience |
| Secondary hold | profile, social, share, settings, admin routes | one shared relaunch template, no unique redesign per route |
| API/runtime | `pages/api/**`, assessment adapters | no behavior change in V4 UI plan |

## 6. Page Outcomes

| Route | One primary outcome | First viewport | Image role |
| --- | --- | --- | --- |
| `/` | start the assessment | brand promise + one CTA + hint of next section | full-bleed generated hero; existing house art later |
| `/quiz` | answer current question | progress + question + answer deck | restrained generated chamber strip outside answer surface |
| `/result/[id]` | understand and save result | type identity + animal + download | existing animal portrait is primary asset |
| `/types` | compare and open a type | page purpose + filter + first type row | existing asset collage, no new filler image |
| `/types/[code]` | deeply understand one type | type, archetype, house, animal, section index | existing house scene + animal portrait |
| `/dashboard` | reopen latest result/history | latest result + open/download | real result artifacts only; no decorative hero |
| held routes | understand status and next action | truthful hold message + one return action | one shared generated archive-door visual |

## 7. Responsive Contract

- `320x568`: no overlap, no clipped nav, no fixed-width CTA, no horizontal scroll
- `390x844`: primary mobile approval viewport
- `768x1024`: tablet reflow must not mimic squeezed desktop
- `1024x768`: intermediate landscape and menu collision gate
- `1440x1000`: desktop hierarchy and whitespace gate
- `200% zoom`: navigation, drawers, sticky regions and long Thai copy remain operable
- media containers reserve aspect ratio before load; hover may transform child media only
- visual order, DOM order and keyboard order must agree

## 8. Image Production Contract

Image work has two separate deliverables:

1. `concept references`: one horizontal image per page section, stored under `output/ui-redesign-v4/concepts/`; never imported by runtime
2. `production assets`: selected no-text bitmap files stored under `public/mbti-z/v4/`, registered in an asset manifest and consumed by `next/image`

Every production asset needs:

- route and exact section placement
- desktop/mobile focal-safe area
- aspect ratio, intrinsic dimensions and `sizes`
- alt/empty-alt decision
- crop proof at all required viewports
- compression and byte budget
- prompt, generation mode, version and approval record

See `docs/ui-redesign-v4-tasks/IMAGE-ASSET-PLAN.md`.

## 9. Delivery Waves

### Wave 0 - Evidence Lock

- current route/state inventory
- before screenshots
- prune/keep/hold decision lock
- asset inventory and file ownership lock

### Wave 1 - Direction And Assets

- section-level concept references
- Home visual direction approval
- production asset briefs and generated candidates
- asset crop/performance acceptance

### Wave 2 - Shared Shell

- tokens, containers, Navbar, menu, locale ownership, shared held template

### Wave 3 - Core Journey

- Home -> Quiz -> Result
- each route follows one-page screenshot sprint and approval gate

### Wave 4 - Discovery And History

- Type Atlas -> 16 Type Detail routes -> My Results

### Wave 5 - Hold Simplification And Cleanup

- held route consolidation
- remove dead visual primitives only after import/route proof

### Wave 6 - Full Quality Gate

- responsive, accessibility, localization, image, interaction and regression evidence
- V4 gates are added alongside V3 until V4 is formally accepted

## 10. Approval Gates

1. `GATE-V4-01 Direction`: Home + shared shell concept approved
2. `GATE-V4-02 Assets`: selected production images pass crop/rights/performance review
3. `GATE-V4-03 Core`: Home, Quiz, Result pass browser matrix
4. `GATE-V4-04 Discovery`: Atlas and all 16 Type routes pass content/routing matrix
5. `GATE-V4-05 History`: My Results and held routes pass states/recovery checks
6. `GATE-V4-06 Release`: lint, typecheck, data, assets, V3 regression, V4 quality and build pass

## 11. Non-Scope

- no cloud runtime activation
- no auth/account feature activation
- no Supabase migration or production data
- no scoring/question/result-schema changes
- no dependency additions without written gap and Lead approval
- no Figma requirement
- no direct push/force push/manual deployment; root-move adoption, PR merge and Vercel deploy are authorized only through Fantasy V2 Delivery Cards 23-28 and their gates

## 12. Plan Files

- `docs/ui-redesign-v4-tasks/README.md`
- `docs/ui-redesign-v4-tasks/SKILL-MATRIX.md`
- `docs/ui-redesign-v4-tasks/AGENT-TEAM.md`
- `docs/ui-redesign-v4-tasks/UI-PRUNING-MATRIX.md`
- `docs/ui-redesign-v4-tasks/IMAGE-ASSET-PLAN.md`
- `docs/ui-redesign-v4-tasks/00-program-contract.md` through `07-quality-gates.md`
- `docs/ui-redesign-v4-tasks/execution-cards/README.md`

## 13. Definition Of Done

V4 จะถือว่าเสร็จเมื่อ core routes ทุก route มี approved before/after evidence, ไม่มี overlap/overflow, TH/EN และ edge states ผ่าน, generated assets ถูก register/verify, V3 runtime behavior ไม่ regress และ `GATE-V4-06` ผ่านจาก source revision เดียวกันเท่านั้น
