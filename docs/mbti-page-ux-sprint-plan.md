# MBTI Page UX Sprint Plan

วันที่: 2026-06-06

เอกสารนี้เป็นแผนทำงานแบบ page-by-page สำหรับปรับ UI/UX ของ `MBTI_PROJECT` โดยใช้ skill ใหม่:

- Skill: `/Users/time/.codex/skills/mbti-page-ux-sprint`
- Repo: `/Users/time/Desktop/Projects/MBTI_PROJECT`
- หลักการ: screenshot ก่อน, audit ก่อน, แตก task ก่อน, รอ approve ก่อนแก้โค้ด

สถานะตอนสร้างเอกสารนี้:

- ยังไม่ได้แก้ UI ใด ๆ จากแผนนี้
- worktree มี dirty state เดิมจำนวนมากจากการย้าย `mbti_test` มา root
- ห้าม revert หรือ clean งานเดิม
- ใช้ `npm` เพราะมี `package-lock.json`

สถานะปิดรอบล่าสุด: `2026-06-29`

- page-by-page sprint scope สำหรับ 6 primary routes ถูกปิดแล้วโดย evidence ใต้ `output/ui-ux-sprints/2026-06-25/*`
- project-wide route matrix ใต้ `output/ui-skills-router/2026-06-25/audit-after/audit-report.json` ครอบ `30` user-facing routes และไม่มี page route ใน `pages/` ที่หลุดออกจาก audit set
- current production sweep ใต้ `output/ui-skills-router/2026-06-29/current-route-sweep/audit-report.json` ตรวจซ้ำ `30` routes / `66` browser samples ด้วย `issueCount: 0`
- named guard `npm run ui:route-sweep:verify` ตอนนี้ล็อก current sweep กับ route set จริง: `30/30` routes, `66/66` samples, `0` issues
- named completion guard `npm run ui:completion` ตอนนี้ล็อกทั้ง route sweep, reconnect controls compact proof, และ docs closeout fragments ให้ผ่านใน gate เดียว
- completion guard evidence: `output/ui-skills-router/2026-06-29/ui-completion-verify/ui-completion.json`
- named asset guard `npm run assets:verify` ตอนนี้ล็อกภาพ `4/4` house scenes และ `16/16` animal posters กับ dimensions/export contract จริง
- reconnect controls audit สำหรับ dashboard/login ปิดแล้ว: `output/ui-skills-router/2026-06-29/reconnect-controls-compact/audit-report.json` ตรวจ `/dashboard` cloud tab และ `/login` ที่ `390x844` + `1440x1000` ด้วย `issueCount: 0`; default state ไม่มี textarea, recovery console เปิดเมื่อกด toggle เท่านั้น และไม่เกิด horizontal overflow
- relaunch/admin/social/account long-tail pages ถูกตั้งใจให้ใช้ `RelaunchState` หรือ `AccountHold` แทน UI เก่า
- งานที่เหลือไม่ใช่ page UI/UX blocker แล้ว: focused animal-poster recognizability เป็น asset refinement และ cloud/auth/deploy เป็น production gate แยกต่างหาก

หมายเหตุ: packet tables ด้านล่างเป็น historical baseline จากตอนเริ่ม sprint วันที่ `2026-06-06`; อย่าใช้ `Pending` ในตารางเหล่านั้นเป็น current status ให้ดู board หลักที่ `docs/mbti-z-execution-board.md` และ evidence paths ข้างบนแทน

---

## 1. Operating Rules

### 1.1 ทำทีละหน้าเท่านั้น

ห้าม implement หลาย route ในรอบเดียว แม้ปัญหาจะคล้ายกัน ให้เปิดเป็น page packet แยก

ลำดับ default:

1. `/quiz`
2. `/result/[id]`
3. `/dashboard`
4. `/`
5. `/login`
6. `/types`

ถ้าคุณสั่งเปลี่ยนลำดับ ให้ยึดลำดับใหม่เฉพาะรอบนั้น

### 1.2 Approval gate

แต่ละหน้าต้องผ่าน gate นี้ก่อนแก้:

1. inspect files
2. capture screenshot baseline
3. audit UX
4. propose task options
5. wait for your approval
6. implement only approved tasks
7. capture after screenshots
8. summarize and stop

### 1.3 ห้ามแตะนอก scope

ใน page sprint ห้ามแตะ:

- scoring logic
- auth logic
- database migration
- global design direction ทั้งระบบ
- dependency ใหม่
- route อื่นที่ไม่ได้ approve

ยกเว้นคุณ approve ชัดเจนใน packet ของหน้านั้น

---

## 2. Screenshot Protocol

### 2.1 Viewport matrix

ทุก page packet ใช้ baseline นี้:

| Viewport | Size | Purpose |
| --- | --- | --- |
| Mobile | `390x844` | Thai mobile reading, CTA, tap target, overflow |
| Tablet | `768x1024` | medium grid behavior, spacing, wrapping |
| Desktop | `1440x1000` | first viewport hierarchy, right rail, density |

ถ้าหน้ามี state สำคัญ ให้ถ่าย state เพิ่ม:

- empty state
- populated state
- loading/error state
- result/export state

### 2.2 Screenshot path

ก่อนแก้:

```text
output/ui-ux-sprints/2026-06-06/<page-slug>/before/
```

หลังแก้:

```text
output/ui-ux-sprints/2026-06-06/<page-slug>/after/
```

### 2.3 Evidence rule

ทุก issue ใน packet ต้องอ้างอิงอย่างน้อยหนึ่งอย่าง:

- screenshot path
- route/component file
- observed browser behavior
- design-system rule

ห้ามใช้คำกว้าง ๆ เช่น "ดูไม่สวย" โดยไม่มี evidence

---

## 3. Global Prep Tasks

| ID | Status | Task | Output |
| --- | --- | --- | --- |
| `UXS-000` | Done | Create reusable Codex skill | `/Users/time/.codex/skills/mbti-page-ux-sprint` |
| `UXS-001` | Done for `/quiz` | Confirm repo root and dirty worktree | short status before screenshot |
| `UXS-002` | Done for `/quiz` | Confirm dev server ownership or start `npm run dev` | local URL |
| `UXS-003` | Done for `/quiz` | Load design-system master and page override | packet context |
| `UXS-004` | Done for `/quiz` | Capture baseline screenshot matrix | files under `output/ui-ux-sprints` |
| `UXS-005` | Done for `/quiz` | Produce page approval packet | Thai task packet |
| `UXS-006` | Todo after approval | Implement approved tasks only | focused diff |
| `UXS-007` | Todo after approval | Validate and capture after screenshots | command result + screenshot paths |

---

## 4. Page Packet 1: Quiz

### Target

- Route: `/quiz`
- Files:
  - `pages/quiz.tsx`
  - `components/mbti-z/quiz/answer-deck.tsx`
  - `lib/mbti-z-copy.ts`
  - `design-system/mbti-z/pages/quiz.md`

### UX goal

ทำให้แบบทดสอบเป็น center of gravity:

- เห็นคำถามชัด
- progress ชัด
- answer choice กดง่าย
- 5-level scale ไม่กินพื้นที่เกินจำเป็น
- mobile ไม่ยาว/ไม่หลวมเกิน
- motion ช่วย feedback ไม่ใช่รบกวน

### Baseline tasks

| ID | Status | Task |
| --- | --- | --- |
| `QZ-001` | Done | Capture screenshots at `390`, `768`, `1440` |
| `QZ-002` | Done | Audit question hierarchy and support chrome |
| `QZ-003` | Done | Audit answer-card affordance, selected state, tap target |
| `QZ-004` | Done | Audit progress/chapter information and remaining-count clarity |
| `QZ-005` | Done | Audit TH/EN copy and label density |
| `QZ-006` | Done | Propose approved task options, then wait |

### Candidate task bank

These are not approved yet. They become actionable only after screenshot evidence:

- `QZ-FIX-A`: compress support chrome if it pushes question below first viewport
- `QZ-FIX-B`: improve selected/hover/tap affordance in `answer-deck`
- `QZ-FIX-C`: simplify side rail if it duplicates progress
- `QZ-FIX-D`: tighten mobile answer grid and spacing
- `QZ-FIX-E`: improve reduced-motion behavior if animation distracts

---

## 5. Page Packet 2: Result

### Target

- Route: `/result/[id]`
- Files:
  - `pages/result/[id].tsx`
  - `components/mbti-z/result-share-card.tsx`
  - `components/mbti-z/download-result-button.tsx`
  - `components/mbti-z/animal-portrait.tsx`
  - `pages/api/result-share-image.tsx`
  - `lib/result-share-image.ts`
  - `design-system/mbti-z/pages/result.md`

### UX goal

ผลลัพธ์ต้องเป็น deliverable หลัก:

- type identity เห็นทันที
- summary อ่านง่าย
- house/animal/movie profile มีความหมาย
- dimension scores scan ได้
- PNG download ชัดและไม่พัง
- mobile ไม่ยาวจนเสียจังหวะ

### Baseline tasks

| ID | Status | Task |
| --- | --- | --- |
| `RS-001` | Pending | Find or create valid guest result id |
| `RS-002` | Pending | Capture result screenshots at `390`, `768`, `1440` |
| `RS-003` | Pending | Capture/share-card export surface if available |
| `RS-004` | Pending | Audit hierarchy: type, animal, summary, dimensions, premium modules |
| `RS-005` | Pending | Audit `1080x1350` export fidelity and download CTA |
| `RS-006` | Pending | Propose approved task options, then wait |

### Candidate task bank

- `RS-FIX-A`: compact top hero/right rail without hiding identity
- `RS-FIX-B`: improve dimension score readability
- `RS-FIX-C`: reduce repeated copy blocks
- `RS-FIX-D`: harden PNG export visual fidelity
- `RS-FIX-E`: improve not-found result state

---

## 6. Page Packet 3: Dashboard

Current closeout: `DB-004` ถูกปิดในรอบ `2026-06-29` โดยย้าย reconnect recovery console เป็น collapsed utility panel ใน `components/cyber/reconnect-bundle-actions.tsx` และยืนยันด้วย `output/ui-skills-router/2026-06-29/reconnect-controls-compact/audit-report.json`. Dashboard ยังเก็บ reconnect controls ไว้ใน `cloud` tab เพื่อไม่แย่ง latest artifact/archive primary task.

### Target

- Route: `/dashboard`
- Files:
  - `pages/dashboard.tsx`
  - `components/cyber/reconnect-bundle-actions.tsx`
  - `components/mbti-z/result-share-card.tsx`
  - `lib/assessment-runtime.ts`
  - `lib/mbti-z-copy.ts`
  - `design-system/mbti-z/pages/dashboard.md`

### UX goal

Dashboard ต้องใช้พื้นที่คุ้ม:

- latest artifact มาก่อน
- history/archive เป็น secondary
- reconnect/export controls ไม่แย่ง primary task
- empty state ไม่ดูเหมือนหน้าพัง
- desktop ใช้ grid คุ้ม, mobile ไม่ยาวเกิน

### Baseline tasks

| ID | Status | Task |
| --- | --- | --- |
| `DB-001` | Pending | Capture empty/populated state if possible |
| `DB-002` | Pending | Audit latest-result section and action priority |
| `DB-003` | Pending | Audit history/archive density |
| `DB-004` | Pending | Audit reconnect bundle controls |
| `DB-005` | Pending | Audit desktop right rail and mobile stacking |
| `DB-006` | Pending | Propose approved task options, then wait |

### Candidate task bank

- `DB-FIX-A`: reduce hero narrative and move latest result higher
- `DB-FIX-B`: compact archive/history cards
- `DB-FIX-C`: separate reconnect as utility panel
- `DB-FIX-D`: improve empty state CTA
- `DB-FIX-E`: reduce duplicate PNG/share controls

---

## 7. Page Packet 4: Home

### Target

- Route: `/`
- Files:
  - `pages/index.tsx`
  - `components/marketing/premium-home.tsx`
  - `components/mbti-z/house-badge.tsx`
  - `components/mbti-z/result-share-card.tsx`
  - `lib/mbti-z-copy.ts`
  - `design-system/mbti-z/pages/home.md`

### UX goal

Home ต้องตอบใน first viewport:

- MBTI Z คืออะไร
- ทำไมควรเริ่ม quiz
- ผู้ใช้จะได้อะไรหลังทำ
- 4 houses / animal / movie profile คือ value ไม่ใช่ decoration

### Baseline tasks

| ID | Status | Task |
| --- | --- | --- |
| `HM-001` | Pending | Capture full page and first viewport screenshots |
| `HM-002` | Pending | Audit first viewport signal and CTA |
| `HM-003` | Pending | Audit page height and repeated sections |
| `HM-004` | Pending | Audit result preview and house preview clarity |
| `HM-005` | Pending | Audit TH-first copy and English technical labels |
| `HM-006` | Pending | Propose approved task options, then wait |

### Candidate task bank

- `HM-FIX-A`: compress hero and proof strip
- `HM-FIX-B`: reduce repeated explainer bands
- `HM-FIX-C`: make result artifact preview more actionable
- `HM-FIX-D`: improve house preview scanability
- `HM-FIX-E`: align TH/EN copy hierarchy

---

## 8. Page Packet 5: Login Hold

Current closeout: `LG-004` ถูกปิดในรอบ `2026-06-29` โดยทำให้ reconnect bundle panel บน `AccountHold` compact ขึ้น, เอา wrapper card ซ้อนออก, และซ่อน recovery textarea จนกดเปิด console. Browser proof อยู่ที่ `output/ui-skills-router/2026-06-29/reconnect-controls-compact/audit-report.json`.

### Target

- Route: `/login`
- Files:
  - `pages/login.tsx`
  - `components/cyber/account-hold.tsx`
  - `components/cyber/reconnect-bundle-actions.tsx`
  - `lib/mbti-z-copy.ts`
  - `design-system/mbti-z/pages/login-hold.md`

### UX goal

หน้านี้ต้องพูดความจริง:

- account/cloud ยังเป็น hold state
- guest path ใช้ได้ทันที
- reconnect bundle เข้าใจง่าย
- ไม่ทำให้ผู้ใช้คิดว่ามี login จริงพร้อมแล้วถ้ายังไม่พร้อม

### Baseline tasks

| ID | Status | Task |
| --- | --- | --- |
| `LG-001` | Pending | Capture screenshots at `390`, `768`, `1440` |
| `LG-002` | Pending | Audit account-hold message clarity |
| `LG-003` | Pending | Audit primary/secondary CTA order |
| `LG-004` | Pending | Audit reconnect bundle panel complexity |
| `LG-005` | Pending | Audit mobile vertical height |
| `LG-006` | Pending | Propose approved task options, then wait |

### Candidate task bank

- `LG-FIX-A`: reduce explanation blocks
- `LG-FIX-B`: make guest path primary
- `LG-FIX-C`: simplify bundle panel
- `LG-FIX-D`: improve empty/no-bundle state
- `LG-FIX-E`: clarify future account/cloud promise

---

## 9. Page Packet 6: Types

### Target

- Route: `/types`
- Files:
  - `pages/types.tsx`
  - `components/mbti-z/type-card.tsx`
  - `components/mbti-z/house-badge.tsx`
  - `data/mbti/mbti-z-data.mjs`
  - `lib/mbti-z-copy.ts`
  - `design-system/mbti-z/pages/types.md`

### UX goal

Types page ต้องเป็น encyclopedia ที่ scan ได้:

- 4 houses เข้าใจเร็ว
- 16 types ไม่แน่นจนอ่านไม่ได้
- animal/type summary มีจุดหมาย
- mobile/tablet density คุมได้

### Baseline tasks

| ID | Status | Task |
| --- | --- | --- |
| `TP-001` | Pending | Capture screenshots at `390`, `768`, `1440` |
| `TP-002` | Pending | Audit house overview cards |
| `TP-003` | Pending | Audit type card density |
| `TP-004` | Pending | Audit tab/scroll behavior on mobile |
| `TP-005` | Pending | Audit copy consistency and fit text |
| `TP-006` | Pending | Propose approved task options, then wait |

### Candidate task bank

- `TP-FIX-A`: compact house overview
- `TP-FIX-B`: improve type-card hierarchy
- `TP-FIX-C`: reduce repeated metadata
- `TP-FIX-D`: improve mobile tabs/scroll affordance
- `TP-FIX-E`: add concise type comparison affordance if approved

---

## 10. Approval Packet Format

ทุก packet ต้องจบด้วยคำถามนี้:

```text
ให้ approve งานไหนสำหรับหน้านี้?
เลือก task id ได้ เช่น QZ-FIX-A + QZ-FIX-D หรือสั่งเพิ่ม/ตัด task ก่อนเริ่มแก้ได้
```

เมื่อ approve แล้วจึงเริ่ม patch โค้ด

---

## 11. Validation Policy

หลัง implement งานที่ approve:

1. capture after screenshots ด้วย viewport เดิม
2. run `npm run lint`
3. run `npm run typecheck`
4. run `npm run build` ถ้าแตะ shared UI, route, export surface, หรือหลาย component
5. สรุป diff, validation, risk, screenshot before/after

---

## 12. Next Action

เริ่มจาก `Page Packet 1: /quiz`

งานถัดไปเมื่อคุณให้เริ่ม packet:

1. เปิดหรือ reuse dev server
2. capture `/quiz` baseline screenshots
3. ทำ UX audit เฉพาะหน้า `/quiz`
4. ส่ง approval packet
5. รอคุณ approve ก่อนแก้โค้ด
