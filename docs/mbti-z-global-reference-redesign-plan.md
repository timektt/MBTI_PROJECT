# MBTI Z Global Reference Redesign Plan

วันที่: 2026-06-30

เอกสารนี้เป็น plan รอบใหม่สำหรับแก้ UI/UX ที่ยังดูไม่สวย, หนาแน่นเกินไป, หรืออ่านแล้วรู้สึกว่าชั้นข้อมูลทับกัน แม้ browser audit ล่าสุดจะไม่เจอ overlap เชิง DOM แล้วก็ตาม รอบนี้เปลี่ยนจาก bug-fix pass เป็น design-led sprint: อ้างอิงเว็บสากลที่ออกแบบดี, สร้าง Figma checkpoint, แก้ทีละหน้า, แล้วส่ง screenshot proof ให้ตรวจทุก slice

## Current Figma Target

- Figma design file: [MBTI Z Global Reference Redesign Sprint 2026-06-30](https://www.figma.com/design/iwIxUicscMJ5kjjykNvKXD)
- Figma file key: `iwIxUicscMJ5kjjykNvKXD`
- GRD-03 checkpoint file: [MBTI Z GRD-03 Result Artifact Clarity](https://www.figma.com/design/S4ZSzDrJcD7HbGVWZtreFk)
- GRD-03 checkpoint file key: `S4ZSzDrJcD7HbGVWZtreFk`
- สถานะ: สร้างไฟล์สำเร็จแล้วผ่าน Figma MCP
- ข้อจำกัดตอนสร้าง plan: หลังสร้างไฟล์และ inspect metadata แล้ว Figma MCP Starter plan hit tool-call limit จึงยังไม่ได้วาง frame/mockup/capture ลงไฟล์ในรอบนี้
- ข้อจำกัดตอน GRD-03: สร้าง checkpoint file สำเร็จ แต่ `search_design_system` hit Starter plan MCP tool-call limit จึงใช้ running-app Playwright screenshots เป็น visual proof หลัก
- ข้อจำกัดตอน GRD-04: `upload_assets` hit Starter plan MCP tool-call limit จึงยัง upload after screenshots เข้า Figma ไม่ได้ และใช้ running-app Playwright screenshots เป็น QA proof หลัก
- ข้อจำกัดตอน GRD-05: `upload_assets` ยัง hit Starter plan MCP tool-call limit จึงใช้ running-app Playwright screenshots เป็น QA proof หลักต่อ
- ข้อจำกัดตอน GRD-06: retry `upload_assets` วันที่ 2026-07-15 แล้วยัง hit Starter plan MCP tool-call limit; shared-surface QA จึงใช้ running-app screenshots, DOM intersection metrics และ PNG endpoint proof เป็นหลัก
- เมื่อ quota พร้อมอีกครั้ง workflow ต่อไปคือ `generate_figma_design` capture ของหน้า local app + `use_figma` สร้าง redesign frames จาก reference patterns ในไฟล์เดียวกัน

## Global Reference Set

ใช้ reference เหล่านี้เป็น inspiration และ design benchmark เท่านั้น ไม่ copy layout, image, copy, หรือ brand asset ตรง ๆ

| Reference | URL | Pattern ที่นำมาใช้กับ MBTI Z |
| --- | --- | --- |
| Linear | https://linear.app/ | dark product surface ที่คม, card hierarchy น้อยแต่ชัด, ใช้ spacing ให้รู้สึก premium มากกว่าการซ้อน card หลายชั้น |
| Stripe | https://stripe.com/ | hero ที่มี product signal ชัด, CTA ไม่รก, visual rhythm ระหว่าง headline / proof / module |
| Arc | https://arc.net/ | editorial product storytelling, first viewport ไม่อัดข้อมูลทั้งหมดในครั้งเดียว |
| Cosmos | https://www.cosmos.so/ | visual discovery grid, image-first browsing, ใช้ภาพเป็น content ไม่ใช่ decoration |
| 16Personalities | https://www.16personalities.com/personality-types | taxonomy ของ personality types ที่ scan ได้เร็ว, grouping ชัด, card title/type ไม่แย่งกัน |
| The Pattern | https://www.thepattern.com/ | personality/insight product tone ที่ลึกลับแต่ยังอ่านง่าย |
| Co-Star | https://www.costarastrology.com/ | consumer identity app ที่ใช้ visual mood เข้ม แต่ไม่ปล่อยให้ UI controls หายไปกับ background |

## Current Visual Diagnosis

หลักฐานปัจจุบัน:

- `output/ui-skills-router/2026-06-29/overlap-fix/production/home-mobile-share-card.png`
- `output/ui-skills-router/2026-06-29/overlap-fix/production/types-mobile-cards.png`
- `output/ui-skills-router/2026-06-29/current-route-sweep/audit-report.json`

ข้อสังเกต:

1. `/` home ยังมี card stack หนาเกินไปใน mobile first viewport ช่วง artifact preview แย่งน้ำหนักกับ hero และทำให้หน้าอ่านเป็นชุดกล่องต่อกันมากกว่าหน้า product ที่มี hierarchy ชัด
2. `/types` mobile ยังใช้ horizontal content หลายชั้น: house cards, segmented filter, house detail, type chips และ section copy ทำให้รู้สึกเหมือนถูกตัด/ซ้อน แม้ metric จะไม่เจอ DOM overlap
3. รูป animal/type card ยังเป็น asset ที่น่าสนใจ แต่ถูกวางใน container ที่แคบ/แน่นเกิน ทำให้ภาพไม่ช่วยนำสายตา
4. dark cyber background มี personality แต่ตอนนี้ dominant เกินไป จน surface/card/control หลายระดับแข่งกันเอง
5. หน้า `result`, `dashboard`, `login` เคยผ่าน responsive proof แล้ว แต่ต้อง re-check visual density หลังเปลี่ยน shared card/token เพราะมี component reuse ข้ามหน้า

## Design Direction

รอบนี้ใช้ชื่อ direction ว่า `Nocturne Product Atlas`

หลักการ:

- ลดจำนวน card ซ้อน: ใช้ page bands + structured panels แทน card-in-card
- ให้ภาพเป็น first-class content: animal/type/house image ต้องมีพื้นที่จริงและ aspect ratio stable
- ใช้ hierarchy 3 ชั้นพอ: page headline, section heading, item label; หลีกเลี่ยง eyebrow/chip/title/card title ซ้อนในกล่องเดียว
- mobile ต้องอ่านเป็นลำดับเดียว: ไม่ใช้ horizontal rail หลายชั้นติดกันในจอเดียว
- desktop ต้องดูเป็น product shell ไม่ใช่ landing page ที่มี decoration หนา
- เลี่ยง palette โทนเดียว: เก็บ dark base ได้ แต่ลด purple-only dominance ด้วย emerald, amber, cyan, neutral contrast ตาม house/type context

## Figma Workflow

เมื่อ Figma quota พร้อม ให้ทำตามลำดับนี้:

1. Capture current app เข้า Figma
   - รัน local app ด้วย `npm run dev` หรือ `npm run build && npm run start`
   - ใช้ `generate_figma_design` กับ target file `iwIxUicscMJ5kjjykNvKXD`
   - capture route: `/`, `/types`, `/result/[fixture]`, `/dashboard`, `/login`, `/quiz`
   - viewport: `390x844`, `768x1024`, `1440x1000`
2. สร้างหน้าใน Figma
   - `01 References`
   - `02 Current Screens`
   - `03 Direction Tokens`
   - `04 Home Redesign`
   - `05 Types Redesign`
   - `06 Result Dashboard Login QA`
3. วาง reference annotations
   - ไม่ paste screenshots ของ reference website ถ้าไม่มีสิทธิ์ชัดเจน
   - ใช้ text notes + layout principles + local mock frames แทน
4. ทำ mockup ด้วย `use_figma`
   - สร้าง auto-layout frames ก่อน
   - สร้าง shared primitives: section band, media card, type row, house tab, artifact preview
   - validate screenshot node ต่อ section เพื่อจับ cropped text และ overlap
5. หลัง implement ใน code
   - capture after screenshot จาก browser
   - วาง after captures ลง Figma เป็น QA checkpoint
   - screenshot ที่ส่งให้ผู้ใช้ต้องมาจาก running app ไม่ใช่ mockup อย่างเดียว

## Implementation Slices

### GRD-01 Home Product Hero

Route: `/`

สถานะ: implemented + validated on 2026-06-30

เป้าหมาย:

- ให้ first viewport เป็น product promise + one strong visual ไม่ใช่กล่องหลายชั้น
- artifact preview ต้องเป็น supporting proof ไม่ใช่ card ใหญ่ที่ดูเหมือน modal ซ้อนใน hero

งาน:

- ลด chip/metric stack ใน mobile
- เปลี่ยน hero เป็น 2-zone layout: `message/action` + `visual artifact`
- ทำ artifact preview ให้เป็น compact media panel มี stable aspect ratio
- ย้าย secondary detail ลง next band

Proof:

- screenshots: `390x844`, `768x1024`, `1440x1000`
- checks: no horizontal overflow, no clipped card, primary CTA visible in first viewport
- evidence:
  - `output/ui-skills-router/2026-06-30/grd-01-home-product-hero/home-mobile-390x844-after.png`
  - `output/ui-skills-router/2026-06-30/grd-01-home-product-hero/home-tablet-768x1024-after.png`
  - `output/ui-skills-router/2026-06-30/grd-01-home-product-hero/home-desktop-1440x1000-after.png`
  - `output/ui-skills-router/2026-06-30/grd-01-home-product-hero/*-metrics.json`

### GRD-02 Types Atlas

Route: `/types`

สถานะ: implemented + validated on 2026-07-01

เป้าหมาย:

- เปลี่ยนจาก encyclopedia ที่เป็น rail/card หลายชั้นเป็น atlas ที่ scan ได้
- animal image, type code, house, and short summary ต้องไม่แย่งกัน

งาน:

- mobile: house selector เป็น single sticky-lite segmented row หรือ dropdown-like control ไม่ซ้อนกับ horizontal card rail
- type cards ใช้ media-left/media-top responsive pattern พร้อม fixed image box
- house overview ลดเป็น compact summary band; detail อยู่หลัง selector
- type grid ต้องมี row rhythm ชัดและ gap พอ

Proof:

- screenshots: top, middle cards, selected house detail ที่ `390x844`, `768x1024`, `1440x1000`
- metric: `typeCardOverlap = 0`, no text clipping, no horizontal overflow
- evidence:
  - `output/ui-skills-router/2026-07-01/grd-02-types-atlas/after/types-mobile-390x844-after.png`
  - `output/ui-skills-router/2026-07-01/grd-02-types-atlas/after/types-mobile-390x844-after-cards.png`
  - `output/ui-skills-router/2026-07-01/grd-02-types-atlas/after/types-tablet-768x1024-after.png`
  - `output/ui-skills-router/2026-07-01/grd-02-types-atlas/after/types-desktop-1440x1000-after.png`
  - `output/ui-skills-router/2026-07-01/grd-02-types-atlas/after/*-metrics.json`

### GRD-03 Result Artifact Clarity

Route: `/result/[id]`

สถานะ: implemented + validated on 2026-07-01

เป้าหมาย:

- result page ต้องรู้สึกเหมือน premium personalized artifact ไม่ใช่ dashboard ที่มีหลาย panel แข่งกัน

งาน:

- แยก export card, explanation, actions, reconnect status ให้มี hierarchy ชัด
- preview/export card ต้องใช้ layout เดียวกับ home แต่ไม่ลด fidelity ของ PNG export `1080x1350`
- download/share controls ใช้ icon buttons + labels เฉพาะ command ที่จำเป็น

Proof:

- screenshots: `390x844`, `768x1024`, `1440x1000`
- export proof: server PNG + browser fallback ยังผ่านเดิม
- evidence:
  - `output/ui-skills-router/2026-07-01/grd-03-result-artifact/after/mobile-390x844-after.png`
  - `output/ui-skills-router/2026-07-01/grd-03-result-artifact/after/tablet-768x1024-after.png`
  - `output/ui-skills-router/2026-07-01/grd-03-result-artifact/after/desktop-1440x1000-after.png`
  - `output/ui-skills-router/2026-07-01/grd-03-result-artifact/after/server-export-proof.json`
  - `output/ui-skills-router/2026-07-01/grd-03-result-artifact/after/browser-fallback-proof.json`
  - `output/ui-skills-router/2026-07-01/grd-03-result-artifact/after/after-report.json`

### GRD-04 Dashboard Archive

Route: `/dashboard`

สถานะ: implemented + validated on 2026-07-01

เป้าหมาย:

- dashboard ต้องเป็น utility/product workspace ไม่ใช่ landing section ต่อจาก result

งาน:

- latest artifact เป็น primary area
- history/archive เป็น dense list หรือ compact cards
- reconnect controls อยู่ใน utility panel ไม่แย่ง primary task

Proof:

- screenshots: default state + recovery panel open ที่ mobile/desktop
- no textarea visible by default
- evidence:
  - `output/ui-skills-router/2026-07-01/grd-04-dashboard-archive/after/mobile-390x844-default-after.png`
  - `output/ui-skills-router/2026-07-01/grd-04-dashboard-archive/after/mobile-390x844-recovery-open-after.png`
  - `output/ui-skills-router/2026-07-01/grd-04-dashboard-archive/after/desktop-1440x1000-default-after.png`
  - `output/ui-skills-router/2026-07-01/grd-04-dashboard-archive/after/desktop-1440x1000-recovery-open-after.png`
  - `output/ui-skills-router/2026-07-01/grd-04-dashboard-archive/after/after-report.json`

### GRD-05 Login / Account Hold

Route: `/login`

สถานะ: implemented + validated on 2026-07-01

เป้าหมาย:

- login/hold page ต้องสื่อว่า guest runtime ใช้ได้ต่อ ไม่ใช่ error page ที่เต็มไปด้วย status cards

งาน:

- ลด technical status copy ใน first viewport
- ทำ recovery/import เป็น secondary utility panel
- CTA route กลับ quiz/result/dashboard ชัด

Proof:

- screenshots: default + recovery open ที่ `390x844`, `1440x1000`
- no horizontal overflow
- evidence:
  - `output/ui-skills-router/2026-07-01/grd-05-login-account-hold/after/mobile-390x844-default-after.png`
  - `output/ui-skills-router/2026-07-01/grd-05-login-account-hold/after/mobile-390x844-recovery-open-after.png`
  - `output/ui-skills-router/2026-07-01/grd-05-login-account-hold/after/desktop-1440x1000-default-after.png`
  - `output/ui-skills-router/2026-07-01/grd-05-login-account-hold/after/desktop-1440x1000-recovery-open-after.png`
  - `output/ui-skills-router/2026-07-01/grd-05-login-account-hold/after/after-report.json`

### GRD-06 Shared Surface Cleanup

Scope:

- `components/marketing/premium-home.tsx`
- `components/mbti-z/type-card.tsx`
- `components/mbti-z/result-share-card.tsx`
- `components/cyber/account-hold.tsx`
- shared CSS/tokens in `styles/globals.css` when needed

สถานะ: implemented + validated on 2026-07-15

เป้าหมาย:

- ลด duplicate one-off card style
- ทำ spacing/radius/media box stable ทั้ง project

งาน:

- สร้าง class/token pattern สำหรับ surface, inset panel, media frame, compact metric
- ห้ามเพิ่ม dependency จนกว่า native Tailwind/React pattern ทำไม่ได้จริง
- ห้ามแก้ scoring/auth/runtime behavior

Proof:

- run `npm run typecheck`
- run `npm run lint`
- run `npm run build`
- run `npm run ui:completion`
- final route sweep หรือ targeted Playwright screenshot audit ตาม slice
- evidence:
  - `output/ui-skills-router/2026-07-01/grd-06-shared-surface-cleanup/after/home-mobile-390x844-after.png`
  - `output/ui-skills-router/2026-07-01/grd-06-shared-surface-cleanup/after/home-desktop-1440x1000-after.png`
  - `output/ui-skills-router/2026-07-01/grd-06-shared-surface-cleanup/after/types-mobile-390x844-after.png`
  - `output/ui-skills-router/2026-07-01/grd-06-shared-surface-cleanup/after/types-desktop-1440x1000-after.png`
  - `output/ui-skills-router/2026-07-01/grd-06-shared-surface-cleanup/after/result-mobile-390x844-after.png`
  - `output/ui-skills-router/2026-07-01/grd-06-shared-surface-cleanup/after/result-desktop-1440x1000-after.png`
  - `output/ui-skills-router/2026-07-01/grd-06-shared-surface-cleanup/after/login-mobile-390x844-after.png`
  - `output/ui-skills-router/2026-07-01/grd-06-shared-surface-cleanup/after/login-desktop-1440x1000-after.png`
  - `output/ui-skills-router/2026-07-01/grd-06-shared-surface-cleanup/after/after-report.json`
  - `output/ui-skills-router/2026-07-01/grd-06-shared-surface-cleanup/after/result-export-proof.png`

## Screenshot Delivery Matrix

ทุก slice ต้องส่งภาพต่อไปนี้:

| Slice | Mobile | Tablet | Desktop | Detail proof |
| --- | --- | --- | --- | --- |
| Home | `390x844` top + artifact | `768x1024` top | `1440x1000` first viewport | CTA visible, artifact not clipped |
| Types | top + mid grid | top + selected house | first viewport + grid | type card no overlap |
| Result | top + export panel | top | first viewport | PNG export proof unchanged |
| Dashboard | default + recovery open | optional | default + recovery open | utility panel not primary |
| Login | default + recovery open | optional | default + recovery open | no huge textarea by default |
| Quiz | smoke only unless touched | smoke only | smoke only | answer controls still accessible |

## Validation Gates

ขั้นต่ำหลังแต่ละ implementation slice:

1. Browser screenshot proof from running app
2. DOM layout metrics
   - no horizontal overflow
   - no negative intersection gap for known card groups
   - no clipped primary media/card
3. `npm run typecheck`
4. `npm run lint`
5. `npm run build` for any shared component/token change
6. `npm run ui:completion` before calling the redesign pass closed

## Stop Conditions

หยุดและกลับมาวาง decision gate ถ้าเจอข้อใดข้อหนึ่ง:

- Figma MCP quota ยังไม่พอสำหรับ capture/mockup หลังต้องแก้เกินหนึ่งหน้า
- การแก้ shared surface ทำให้ export PNG fidelity เปลี่ยน
- ต้องเพิ่ม dependency ใหม่เพื่อแก้ layout
- ต้องแตะ auth/cloud/runtime behavior
- screenshot after ยังดูเหมือน card-in-card หรือมี visual overlap แม้ DOM metric ผ่าน

## Recommended Next Gate

`GRD-01` ถึง `GRD-06` ผ่าน implementation + browser validation แล้ว ไม่มี code slice ค้างใน plan นี้ การ upload after screenshots เข้า Figma file `iwIxUicscMJ5kjjykNvKXD` ถูกจัดเป็น optional archive และไม่เป็น completion gate
