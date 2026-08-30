# MBTI Z Responsive Redesign V2 Plan

วันที่: 2026-07-15

เอกสารนี้แทนที่ทิศทางภาพ `Nocturne Product Atlas` สำหรับงาน UI/UX รอบถัดไป โดยไม่ลบประวัติหรือหลักฐานของแผนเดิม เป้าหมายคือเปลี่ยน MBTI Z จากหน้า dark cyber ที่ใช้ panel และ badge หนาแน่น ไปเป็น consumer identity product ที่สงบ อ่านง่าย ใช้ภาพและผลลัพธ์เป็นตัวนำ และมี responsive behavior ที่ออกแบบตามบริบทของอุปกรณ์จริง

Execution backlog แบบแตก task รายหน้าและทำคู่ขนานได้อยู่ที่ `docs/ui-redesign-v2-tasks/README.md` ให้ใช้ task pack นั้นเป็น source of truth สำหรับ task status, dependencies, parallel groups และ acceptance criteria ส่วนเอกสารนี้เก็บ design direction และ page-level strategy

## 1. Executive Decision

ชื่อ direction: `Signal & Story`

คำอธิบาย: dark editorial identity system ที่ให้ข้อมูลบุคลิกเป็นเรื่องเล่าและ artifact ส่วนตัว ใช้สี house/type เป็นสัญญาณ ไม่ใช้ glow, border, gradient, chip และ uppercase label เป็น decoration ทั่วทั้งหน้า

หลักตัดสินใจ:

- รักษา dark identity ของ MBTI Z แต่เปลี่ยนพื้นหลังจาก cyber texture หนาเป็น neutral ink surface ที่สงบ
- ให้ Result Artifact, animal portrait และ type identity เป็น visual anchor จริง
- ใช้หนึ่ง accent family ต่อบริบท ไม่ใช้ amber, purple และ cyan แข่งกันใน section เดียว
- ใช้ border เฉพาะจุดที่แสดง grouping หรือ interaction boundary
- mobile เป็น single-task flow; desktop เป็น reading canvas ที่มี utility rail เท่าที่จำเป็น
- ไม่เปลี่ยน scoring, data shape, export contract, reconnect contract หรือ `guest-local` runtime

## 2. Evidence And Diagnosis

หลักฐาน browser ล่าสุด:

- Home mobile: `output/ui-skills-router/2026-07-01/grd-06-shared-surface-cleanup/after/home-mobile-390x844-after.png`
- Types mobile: `output/ui-skills-router/2026-07-01/grd-06-shared-surface-cleanup/after/types-mobile-390x844-after.png`
- Result mobile: `output/ui-skills-router/2026-07-01/grd-06-shared-surface-cleanup/after/result-mobile-390x844-after.png`
- Quiz mobile/desktop: `output/ui-skills-router/2026-07-15/redesign-v2-baseline/quiz-*.png`
- Dashboard mobile/desktop: `output/ui-skills-router/2026-07-15/redesign-v2-baseline/dashboard-*.png`

ข้อวินิจฉัย:

1. DOM metrics ไม่พบ horizontal overflow หรือ element intersection ในหน้าที่ตรวจเดิม แต่ผู้ใช้ยังรับรู้ว่ากล่องทับกัน เพราะทุก surface มี border, radius, badge และ contrast ใกล้กัน
2. Home mobile ยาวประมาณ 5,418px และมี surface ที่ตรวจนับได้ 28 จุด ทำให้หน้าอ่านเป็น card feed มากกว่า product story
3. Result mobile ยาวประมาณ 5,761px โดย Result identity, export proof, answer summary, dimensions และ premium copy มีน้ำหนักใกล้กันเกินไป
4. Types ลดจำนวน surface ได้แล้ว แต่ type card ยัง text-heavy และรูป animal/type เล็กเกินกว่าจะเป็น visual anchor
5. Quiz desktop กระจาย content เต็มความกว้าง และ fixed footer ทับพื้นที่การมองของ answer cards; mobile มีพื้นที่ว่างช่วงคำถามมากเกินและลำดับ interaction ไม่กระชับ
6. Dashboard แสดง reconnect/runtime detail แบบ system console ก่อน user value ทำให้ archive และผลล่าสุดไม่ใช่สิ่งแรกที่ผู้ใช้เข้าใจ
7. Codebase มี visual vocabulary ซ้ำสูง: linear gradients 36 จุด, `cyber-panel` 28 จุด, `cyber-data-chip` 20 จุด และ arbitrary tracking/radius หลายสิบจุด

## 3. Reference Principles

ใช้ reference เป็น benchmark ด้านหลักคิด ไม่ copy brand, layout, copy หรือ asset:

| Reference | หลักที่นำมาใช้ |
| --- | --- |
| 16Personalities | one promise + one primary CTA, taxonomy ที่ group type ชัด, imagery ช่วยอธิบาย identity |
| The Pattern | personalized insight เป็นเรื่องเล่า, หนึ่ง product concept ต่อ section, ลดศัพท์ระบบที่ผู้ใช้ไม่จำเป็นต้องรู้ |
| Linear UI refresh | ลด visual weight ของ navigation/utility, ลด icon และ border, ให้ structure ถูกสัมผัสได้โดยไม่ต้องตีกรอบทุกอย่าง |
| Linear Mobile | mobile เป็น compact workflow ที่ออกแบบใหม่ ไม่ใช่ desktop ย่อส่วน |

## 4. Information Architecture

ลำดับผลิตภัณฑ์ใหม่:

1. `Discover`: Home อธิบาย value และพาเริ่ม quiz
2. `Assess`: Quiz เป็น single-question focus
3. `Recognize`: Result เปิดด้วย identity และ artifact
4. `Explore`: Types ให้เปรียบเทียบ house/type แบบ scan ได้
5. `Keep`: Dashboard เก็บ result/history/export/reconnect
6. `Resume`: Login/Hold อธิบายสิ่งที่ใช้ได้ตอนนี้และทางกลับเข้า guest flow

Content hierarchy ทุกหน้า:

- Level 1: page purpose หรือ personal identity
- Level 2: section narrative และ primary action
- Level 3: supporting facts หรือ utility
- Metadata: แสดงเมื่อจำเป็นต่อการตัดสินใจเท่านั้น และไม่ใช้ uppercase tracking หนาเป็น default

## 5. Design Foundations

### 5.1 Color

- `canvas`: neutral black/ink ไม่ติด blue หรือ purple มากเกินไป
- `surface-1`: reading surface สำหรับเนื้อหาหลัก
- `surface-2`: interactive/selected surface เท่านั้น
- `text-primary`, `text-secondary`, `text-muted`: contrast แยกชัดสามระดับ
- `accent`: ใช้ house/type context หนึ่ง family ต่อ viewport section
- ห้ามใช้ multicolor gradient เป็นพื้นปุ่ม default; gradient ใช้กับ artifact หรือ visual asset เท่านั้น

### 5.2 Typography

- Display: ใช้กับ hero/result identity เท่านั้น ไม่เกิน 2 จุดต่อหน้า
- Heading: section title ขนาดคงที่ตาม breakpoint ไม่ใช้ viewport-width scaling
- Body: mobile ขั้นต่ำ 16px, line-height 1.55-1.75
- Label: 12-14px, letter spacing ปกติ; uppercase เฉพาะ code เช่น `ESTJ`, `TH`, `EN`
- จำกัด reading line length ที่ประมาณ 45-70 ตัวอักษรต่อบรรทัด

### 5.3 Spacing And Grid

- base spacing: `4, 8, 12, 16, 24, 32, 48, 64, 96`
- mobile gutter: 16px ที่ 320-389, 20px ที่ 390-767
- tablet gutter: 32px
- desktop gutter: 40-64px พร้อม max content width 1200-1280px
- reading column: 640-760px
- ห้ามใช้ negative margin เพื่อทำ visual overlap ระหว่าง card

### 5.4 Surface And Radius

- มี surface depth ไม่เกิน 3 ระดับ: canvas, reading band, interactive item
- ห้าม card-in-card เกินหนึ่งชั้น
- radius scale: 6px, 10px, 16px; 20px ใช้เฉพาะ artifact/media ขนาดใหญ่
- section เป็น unframed band ก่อน; ใช้ card เฉพาะ repeated item, modal หรือ framed tool
- border 1px ใช้เมื่อ background contrast ไม่พอหรือ element interactive

### 5.5 Controls And Motion

- touch target ขั้นต่ำ 44x44px
- primary CTA หนึ่งปุ่มต่อ decision point
- icon button ใช้ Lucide icon + tooltip/accessible name
- motion 160-240ms สำหรับ state transition; 320-480ms สำหรับ reveal สำคัญ
- รองรับ `prefers-reduced-motion`; ไม่มี reveal ที่ทำให้ full-page screenshot หรือ content discovery พลาด

### 5.6 Imagery

- animal/type art ต้องใช้ aspect ratio คงที่และเห็น subject ชัด
- Home first viewport ต้องมี product/result visual จริง ไม่ใช้ orb หรือ abstract decoration เป็น hero หลัก
- Result Artifact เป็นภาพหลัก; chart และ metadata เป็นข้อมูลรอง
- image crop ต้องมี focal-point rule แยก mobile/desktop

## 6. Responsive Contracts

| Range | Layout contract | Navigation | Content behavior |
| --- | --- | --- | --- |
| 320-479 | single column, 16-20px gutter | compact top bar + menu sheet | ตัด metadata รอง, CTA เต็มความกว้าง, ไม่มี horizontal rail หลายชั้น |
| 480-767 | single column กว้างขึ้น | compact top bar | ภาพใหญ่ขึ้น, repeated item อาจเป็น 2-column เฉพาะรายการสั้น |
| 768-1023 | 6/8-column tablet grid | top nav แบบย่อ | ใช้ split layout เฉพาะเมื่อทั้งสองฝั่งอ่านได้อย่างน้อย 320px |
| 1024-1279 | 12-column compact desktop | full nav | utility rail ได้ แต่ไม่ sticky ถ้าบัง/แย่ง main task |
| 1280-1599 | centered 12-column | full nav | reading canvas + optional side rail, max-width ชัด |
| 1600+ | max-width ไม่ยืด text ตาม viewport | full nav | เพิ่ม whitespace ไม่เพิ่มขนาด font หรือจำนวนคอลัมน์โดยอัตโนมัติ |

Cross-device contracts:

- รองรับ portrait/landscape, safe-area inset, touch และ pointer/hover
- ไม่มี horizontal overflow ที่ 320-1600px
- core action และ content ต้องใช้ได้ที่ browser zoom 200%
- sticky/fixed region รวมกันต้องไม่กินพื้นที่แนวตั้งเกิน 20% ของ viewport mobile
- text, icon และ image ห้ามเปลี่ยน layout เมื่อ loading/hover/selected

## 7. Page Plans

### 7.1 Home `/`

เป้าหมาย: ภายใน 5 วินาทีผู้ใช้เข้าใจว่า MBTI Z ให้ผลอะไรและเริ่ม quiz ได้

- first viewport: literal product promise, short supporting copy, primary CTA, artifact/animal visual หนึ่งชิ้น
- ย้าย metric/chip และ implementation language ออกจาก hero
- section ต่อไปเป็น `What you get`: Type, House, Animal, Movie Profile ใช้ visual strip ไม่ใช้ 4 nested cards
- `4 Houses`: editorial band + selectable house tabs; mobile แสดง house เดียวต่อครั้ง
- social/proof copy ใช้ข้อความสั้นและภาพ product ไม่ใช้ feature card grid
- acceptance: CTA และ product visual เห็นใน first viewport ที่ 390x844 และ 1440x1000

### 7.2 Quiz `/quiz`

เป้าหมาย: คำถามและการตอบเป็นสิ่งเดียวที่เด่นที่สุด

- mobile: top progress bar + compact chapter label + question + 5-point response control + bottom action region ที่ไม่ทับ content
- desktop: จำกัด question column 760-900px; response choices อยู่ใน viewport เดียวเมื่อความสูง 768px
- เปลี่ยน answer cards ขนาดใหญ่เป็น accessible segmented/radio scale ที่มี endpoint labels ชัด
- previous/restart เป็น secondary actions; next เปิดเมื่อเลือกแล้ว
- preserve answer state, locale, keyboard navigation และ reduced motion
- acceptance: ใช้งานได้ที่ 320x700, 390x844, 768x1024, 1024x768 และ 200% zoom

### 7.3 Result `/result/[id]`

เป้าหมาย: ผู้ใช้รู้จัก type/house/animal และบันทึก artifact ได้ใน 1-2 viewport แรก

- first viewport: type code, archetype, one-sentence identity, animal/artifact, download/share action
- second band: four dimensions เป็น compact visualization ไม่เป็น 4 panel ใหญ่
- narrative sections ใช้ reading column พร้อม local table of contents บน desktop; mobile ใช้ section navigation แบบ compact
- answer summary และ technical metadata ย้ายเข้า disclosure/accordion
- premium/reconnect message เป็น contextual footer ไม่แย่ง identity
- acceptance: export action เข้าถึงได้ภายใน viewport แรกหรือ action bar ที่ไม่ทับเนื้อหา

### 7.4 Types `/types`

เป้าหมาย: scan 16 types และเข้าใจ 4 houses ได้เร็ว

- header สั้นลง; taxonomy เป็น primary navigation
- desktop: 4 house bands หรือ filter + 4-column visual grid ตาม density ที่ผ่าน stress test
- mobile: house segmented control หนึ่งชุด; type item เป็น media row ที่ animal image ใหญ่พอและ copy ไม่เกิน 3 บรรทัด
- type detail เปิดเป็น dedicated section/page หรือ disclosure ไม่ยัดรายละเอียดทั้งหมดใน listing card
- สี house เป็น accent signal; card base ยังคง neutral
- acceptance: ไม่เกิด sticky tab ซ้อน header, ไม่มี text truncation ที่ทำให้ความหมายหาย, 16 types scan ได้โดยไม่ต้องอ่าน paragraph ทุกใบ

### 7.5 Dashboard `/dashboard`

เป้าหมาย: latest result และ archive มาก่อน runtime/reconnect operations

- first viewport: latest result หรือ meaningful empty state + `Start quiz`
- history เป็น timeline/list ที่ scan วันที่, type และ action ได้
- export/reconnect เป็น utility panel หรือ settings disclosure
- ซ่อน bundle version, runtime counters และ handoff internals จาก default view; แสดงใน advanced details
- mobile: one primary section at a time; desktop ใช้ main archive + narrow utility rail
- acceptance: ผู้ใช้ตอบได้ทันทีว่า “ผลล่าสุดคืออะไร” และ “จะเปิด/ดาวน์โหลดตรงไหน”

### 7.6 Login/Hold And Paused Routes

เป้าหมาย: ไม่ทำให้ผู้ใช้เข้าใจผิดว่า feature พร้อมใช้งาน และไม่แสดง internal architecture เกินจำเป็น

- ใช้ shared `Service Hold` template: title, concise reason, available-now action, optional technical details
- login/register/profile/social/admin paused routes ใช้ visual language เดียวกัน
- mobile ไม่เกินหนึ่ง main card; technical status อยู่ใน disclosure
- guest flow และ reconnect bundle ต้องยังเข้าถึงได้ตาม contract เดิม

### 7.7 Shared Shell And States

- Navbar: mobile menu sheet, desktop stable navigation, active state ไม่ใช้ pill ทุก item
- Locale: compact segmented control; mobile รวมใน menu เมื่อพื้นที่ไม่พอ
- loading: skeleton ตาม layout จริงและไม่มี CLS
- empty/error/offline: มี one clear recovery action
- focus, hover, pressed, disabled และ selected states ครบทุก interactive primitive

## 8. Optional Design Archive

Figma is optional for this project and is not a completion, release or implementation gate. The running production build, browser screenshots and structured audit reports are the authoritative UI evidence.

Optional archive target: `iwIxUicscMJ5kjjykNvKXD`

Figma pages:

1. `00 Audit`: current screenshots + annotated hierarchy/responsive issues
2. `01 References`: principles และ pattern notes จาก reference สากล
3. `02 Foundations`: color, type, spacing, radius, elevation, motion
4. `03 Components`: button, icon button, locale, nav, tabs, answer scale, media row, artifact, disclosure
5. `04 Core Journey`: Home, Quiz, Result
6. `05 Discovery Archive`: Types, Dashboard
7. `06 System States`: Hold, empty, loading, error, offline
8. `07 Responsive QA`: frame matrix และ implementation screenshots

Frame matrix ต่อหน้าหลัก:

- `320x700`: smallest supported compact mobile
- `390x844`: primary mobile
- `768x1024`: tablet portrait
- `1024x768`: tablet landscape/small desktop
- `1440x1000`: primary desktop

Optional archive workflow:

- ใช้เมื่อทีมต้องการ editable design archive หรือ designer handoff เพิ่มเติม
- capture เฉพาะ running app ที่ผ่าน browser QA แล้ว
- ห้ามใช้ Figma availability, quota หรือ approval มาบล็อก implementation/completion
- หากไม่ทำ Figma archive ให้ browser evidence paths ในแผนนี้เป็น final source of truth

## 9. Implementation Waves

สถานะล่าสุด 2026-07-16:

- `V2-00..03 Baseline, Shell, Home, Quiz`: implementation และ responsive/state evidence complete
- `V2-04 Result`: identity-first result, four-house fixtures, server/client PNG export และ WebKit regression complete
- `V2-05 Types`: taxonomy, disclosure, 16 recognizable animal portraits และ desktop/mobile geometry complete
- `V2-06 Dashboard`: latest-first, empty/resume, history และ reconnect utility states complete
- `V2-07 System And Legacy States`: account/profile/community/admin hold surfaces และ 25-route contract complete
- `V2-08 Full Quality Gate`: strict verifier ผ่าน `30/30` routes, `88/88` viewport samples, `17/17` active states และ `12/12` command gates; current-source rerender วันที่ 2026-07-16 ผ่านซ้ำ `30/30` routes และ `88/88` samples
- `V2-09 Residual Closure`: native Chrome `200%`, WebKit success/fallback export, 16-animal recognizability และ asset payload budget complete
- Figma archive ถูก defer ตามการตัดสินใจของผู้ใช้และไม่เป็น blocker; browser evidence เป็น final implementation proof
- prototype evidence: `output/ui-skills-router/2026-07-15/signal-story-lowfi/screenshots/`
- Home implementation evidence: `output/ui-skills-router/2026-07-15/v2-02-home/after/`
- Quiz implementation evidence: `output/ui-skills-router/2026-07-15/v2-03-quiz/after/`
- full quality evidence: `output/ui-skills-router/2026-07-15/v2-08-full-quality/audit-report.json`
- current-source browser evidence: `output/ui-skills-router/2026-07-16/v2-10-completion-audit/project-matrix-report.json`
- residual closure evidence: `output/ui-skills-router/2026-07-16/v2-09-residual-closure/audit-report.json`

### V2-00 Baseline And Tokens

- inventory style usage และ route families
- เพิ่ม semantic tokens โดยไม่ลบ legacy classes ทันที
- สร้าง responsive QA harness และ fixture data
- proof: token specimen + empty/loading/error specimens

### V2-01 Shared Shell

- Navbar, container, locale, button, focus, disclosure, loading primitives
- proof: shell ที่ 5 viewports + keyboard/safe-area checks

### V2-02 Home

- implement first viewport และ content bands
- proof: before/after screenshots + CTA visibility + asset framing

### V2-03 Quiz

- implement question canvas, response scale, progress/action regions
- proof: first/middle/final question, mobile landscape, keyboard, persisted progress
- completed proof: core scale and Movie Profile layouts at `320x700`, `390x844`, `768x1024`, `1024x768`, and `1440x1000`; no horizontal overflow, fixed regions, undersized controls, or footer/answer overlap

### V2-04 Result

- implement identity-first artifact, dimensions, narrative hierarchy, export access
- proof: 4 representative house/type fixtures + PNG export regression

### V2-05 Types

- implement taxonomy, house switcher, visual type listing/detail
- proof: all 16 types, longest TH/EN copy, 320/390/768/1440

### V2-06 Dashboard

- implement latest result, archive, empty state, advanced reconnect utility
- proof: empty/one/many history states + reconnect bundle regression

### V2-07 System And Legacy States

- unify login/hold/paused routes and system states
- proof: route sweep ทุก public/paused route

### V2-08 Full Quality Gate

- accessibility, responsive, visual regression, performance, build และ documentation sync
- proof: screenshot index, browser metrics, test log และ remaining-risk list

## 10. Validation Matrix

ทุก wave ต้องรันตามความเสี่ยง:

- functional: `npm run data:validate`, reconnect verifier และ route-specific tests
- static: `npm run typecheck`, `npm run lint`
- production: `npm run build`
- browser: Chrome + Safari, iPhone-class + Android-class viewport
- responsive: 320, 390, 768, 1024, 1440 และ 1600px
- accessibility: keyboard-only, visible focus, semantic controls, contrast, reduced motion, zoom 200%
- visual: no overflow, no clipping, no incoherent overlap, no more than two nested surface levels
- content: longest Thai/English strings, empty/one/many/error/loading states
- asset: animal/artifact visible, stable aspect ratio, no layout shift

## 11. Acceptance Gates

งานยังไม่ถือว่าเสร็จจนผ่านทั้งหมด:

1. ไม่มี horizontal overflow ตั้งแต่ 320-1600px
2. touch target หลักไม่น้อยกว่า 44x44px
3. primary reading text mobile ไม่น้อยกว่า 16px
4. primary CTA ของ Home และ primary answer action ของ Quiz อยู่ใน workflow ที่เห็นและกดได้ชัด
5. Result identity และ export action เข้าถึงได้ใน 1-2 viewport แรก
6. ไม่มี card-in-card เกินหนึ่งชั้น และไม่มี page section ที่ถูกทำเป็น floating card โดยไม่จำเป็น
7. หนึ่ง section ใช้ accent family เดียว
8. mobile ไม่ซ่อน core feature ที่ desktop มี
9. keyboard, focus, reduced motion, safe area และ zoom 200% ผ่าน
10. `guest-local`, local history, reconnect bundle และ PNG export ไม่ regression

## 12. Stop Conditions

หยุด implementation และกลับมาแก้ design เมื่อพบข้อใดข้อหนึ่ง:

- browser reference frame ที่ 390 และ 1440 ยังไม่ผ่าน แต่เริ่มเขียน page component แล้ว
- ต้องเพิ่ม arbitrary CSS เพื่อแก้เฉพาะ viewport มากกว่า 2 จุดใน component เดียว
- shared component ต้องรู้ route-specific layout มากเกินไป
- product behavior หรือ runtime contract ต้องเปลี่ยนเพื่อให้ visual design ทำงาน
- screenshot ผ่านเพราะซ่อน content สำคัญหรือ truncate ความหมาย

## 13. Current Final Gate

UI/UX V2 scope complete ตาม acceptance gates และ browser evidence ปัจจุบัน โดย runtime ยังคง `guest-local` และไม่มี production deploy Figma archive เป็น optional follow-up และไม่กระทบ completion status
