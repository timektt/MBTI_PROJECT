# MBTI Nocturne Rollout Plan

> Archived plan. The active product-facing UI direction is now `MBTI Z`, tracked in `docs/mbti-z-execution-board.md` and `design-system/mbti-z/MASTER.md`.
> Keep this file only as historical context for the earlier Nocturne-era rollout.

วันที่: 2026-06-05

เอกสารนี้เป็น historical plan สำหรับการยก `MBTI Project` ไปสู่เวอร์ชัน `MBTI Nocturne` แบบ `guest-first`, `luxury cyber`, `premium black glass`, `dark moody`, และ `immersive assessment`.

## 1. Executive Read

### Target state

ผู้ใช้ต้องได้รับประสบการณ์นี้:

`Landing -> 48-question Quiz -> Result Artifact -> Dashboard Archive`

โดย:

- ไม่ต้อง login เพื่อเริ่มทำแบบทดสอบ
- ได้ MBTI type จริงจาก scoring logic
- ได้ free summary ที่ดู premium และเชื่อถือได้
- เห็นว่าระบบ account/share/premium/cloud save มีอยู่ใน product map แต่ยังอยู่ใน `hold / reconnect` state
- legacy routes ไม่หลุดกลับไปหน้าเก่าที่ visual หรือ runtime พัง

### Strategic priority

ลำดับความสำคัญที่ถูกต้องตอนนี้คือ:

1. polish `core guest product`
2. unify legacy surfaces ให้เป็น Nocturne
3. prepare cloud reconnect seams
4. ค่อย reconnect auth/save/share จริงเมื่อ infra พร้อม

### What not to do now

- ไม่เริ่มจาก 3D scene
- ไม่ migrate animation library ตอนนี้
- ไม่ปล่อย social/admin/account routes ให้หลุดกลับไป UI เก่า
- ไม่พยายามทำ premium/payment ก่อน flow หลักจะดูแพงและนิ่งพอ

## 2. Verified Baseline

สิ่งที่ยืนยันจาก repo และ localhost รอบนี้:

- stack คือ `Next.js 15.3.1`, `React 19`, `Tailwind 3.3`, `TypeScript`
- package manager คือ `npm`
- animation runtime หลักที่ติดตั้งอยู่แล้วคือ `framer-motion@12.9.2`
- dev server เปิดได้ที่ `http://localhost:3000`
- หน้า home ปัจจุบันขึ้น `MBTI Nocturne` และมี core flow แบบ guest แล้ว
- flow หลัก `landing -> quiz -> result -> dashboard` มีอยู่จริง
- legacy และ admin หลาย route ถูกย้ายเข้า `relaunch state / hold state` แล้ว
- account surface มี `guest-to-cloud handoff` messaging แล้ว แต่ยังไม่ import ขึ้น server/cloud จริง

### Browser baseline snapshot

สิ่งที่เห็นจริงจาก `http://localhost:3000/` รอบล่าสุด:

- title: `MBTI Nocturne | Cyber Personality Assessment`
- top shell: `HOME / QUIZ / DASHBOARD / ACCOUNT`
- status cue: `GUEST MODE ACTIVE`
- hero lockup: `NOCTURNE STAR LAB`
- value strip: `GUEST-FIRST RUNTIME · 48 PROMPTS · TH/EN`
- CTA หลัก: `เริ่มทำแบบทดสอบ 48 ข้อ`
- CTA รอง: `เปิดแดชบอร์ดตัวอย่าง`
- trust copy หลัก: `NO LOGIN BEFORE START`, `BILINGUAL RUNTIME`, `CLOUD RECONNECT QUEUED`

สรุป:

- baseline ปัจจุบัน “มาถูกทางแล้ว” ในเชิง product narrative
- แต่ยังต้องยกจาก polished MVP ไปเป็น premium world-class experience
- งานรอบต่อไปจึงไม่ควรเริ่มจากเพิ่ม feature แต่ควรเริ่มจาก `hierarchy`, `motion choreography`, `surface consistency`, และ `trust framing`

## 3. Design Synthesis

### Inputs used

- `ui-ux-pro-max`
- `/Users/time/Downloads/starchart-DESIGN.md`
- current repo implementation

### Synthesis outcome

ชื่อ direction ในรอบนั้น: `Nocturne Star Lab`

แกนภาพลักษณ์:

- luxury cyber
- premium black glass
- mysterious self-discovery
- deep-space atmosphere
- cinematic but controlled
- Thai-first readable UI with editorial English moments

### What we keep from StarChart

- deep-space layering
- nebula glow logic
- star-gold reward moments
- pill CTA silhouette
- `Space Mono` style meta labels
- 8px rhythm mindset

### What we intentionally change from StarChart

- ตัดความเป็น kids product ออก
- ไม่ใช้ playful display fonts แบบ cartoon
- ลด purple dominance
- ทำให้ contrast, spacing, and copy density ดู mature และ credible

### Typography direction

แนะนำสำหรับ rollout ถัดไป:

- display / English editorial moments: `Bodoni Moda` หรือ `Playfair Display`
- Thai-first interface / body: `Bai Jamjuree`
- technical labels / dimensions / runtime meta: `Space Mono`

เหตุผล:

- user market เป็นไทย + 2 ภาษา
- ต้องการความหรู แต่ยังอ่านไทยได้ดี
- serif ใช้เฉพาะ hero, result title, premium moments ไม่ควรลากไปทั้ง UI

## 4. Design Tokens To Lock

```css
--cyber-bg: #05070f;
--cyber-bg-soft: #0a1020;
--cyber-panel: rgba(12, 16, 30, 0.72);
--cyber-panel-strong: rgba(10, 14, 24, 0.88);
--cyber-border: rgba(190, 199, 255, 0.14);
--cyber-text: #f3f5ff;
--cyber-text-soft: rgba(243, 245, 255, 0.72);
--cyber-violet: #b679ff;
--cyber-gold: #f5c76d;
--cyber-cyan: #7cc8ff;
--cyber-success: #4ade80;
--cyber-danger: #f87171;
--cyber-radius-panel: 28px;
--cyber-radius-chip: 999px;
--cyber-blur: 20px;
--cyber-ease: cubic-bezier(0.16, 1, 0.3, 1);
```

Rules:

- gold ใช้กับ CTA, highlight, reward moment เท่านั้น
- violet ใช้กับ interaction energy
- cyan ใช้กับ system signal และ data interpretation
- glass ทุกจุดต้องมี `border + blur + gradient` พร้อมกัน ไม่ใช้ blur ล้วน

## 5. Product Architecture

### Primary public flow

- `/`
- `/quiz`
- `/result/[id]`
- `/dashboard`

### Hold / relaunch flow

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/profile*`
- `/settings*`
- `/share*`
- `/card*`
- `/explore`
- `/leaderboard`
- `/admin*`

### Runtime principle

- main flow ใช้ `guest-local` ได้ก่อน
- cloud-ready seam ต้องอยู่ใน `assessment-runtime`
- account/cloud screens ต้องพูดความจริงเรื่องสถานะ ไม่ปลอมว่า feature พร้อม

## 6. Rollout Phases

## Phase A — Core Experience Polish

เป้าหมาย:

- ทำให้ `landing -> quiz -> result -> dashboard` ดูระดับ premium จริง
- ตัดความรู้สึก MVP/placeholder ออกจาก flow หลัก

Definition of done:

- ทุกหน้าใน flow หลักมี hierarchy, pacing, motion, and mobile layout ที่ deliberate
- visual language สม่ำเสมอ
- motion ดูแพงแต่ไม่หนัก

## Phase B — Surface Unification

เป้าหมาย:

- ทำให้ hold/relaunch/admin routes ไม่ดูเป็นงานคั่นเวลา
- ผู้ใช้ไม่เจอ broken experience เมื่อคลิกออกจาก flow หลัก

Definition of done:

- route เก่าใช้ language และ CTA ชุดเดียวกัน
- ไม่มีหน้าไหนที่หลุดไป form/runtime เก่าที่พัง

## Phase C — Cloud Reconnect Prep

เป้าหมาย:

- เตรียม import path ของ guest session/history/result
- ให้ cloud reconnect เป็นงานเชื่อม ไม่ใช่การรื้อ flow ใหม่

Definition of done:

- runtime adapter รองรับ future cloud mode
- มี import bundle contract
- API/import path ถูกออกแบบพร้อม idempotency

## Phase D — Live Infra Reconnect

เป้าหมาย:

- สร้าง Supabase target ใหม่
- bind env
- apply migration/seed
- เชื่อม auth/save/share/history จริง

Definition of done:

- guest handoff import ได้
- logged-in history ใช้งานได้
- Vercel preview/prod พร้อม

## 7. Detailed Backlog

สถานะ:

- `done` = ทำแล้วใน repo
- `next` = ควรทำต่อทันที
- `later` = มีเหตุผลให้ defer

### Track 1 — Design System and Shell

`NOC-0101` Lock token map in code and docs

- Status: `next`
- Files:
  - `styles/globals.css`
  - `tailwind.config.js`
  - `design-system/mbti-nocturne/MASTER.md`
- Work:
  - sync token names ให้ลด duplication
  - แยก surface tiers ชัดขึ้น
  - define hero/result/dashboard-specific accent usage
- Acceptance:
  - token naming เสถียร
  - design doc ตรงกับ CSS จริง

`NOC-0102` Introduce luxury bilingual typography policy

- Status: `next`
- Files:
  - `pages/_app.tsx`
  - `pages/index.tsx`
  - `styles/globals.css`
  - `design-system/mbti-nocturne/MASTER.md`
- Work:
  - ตัดสินใจ font stack ขั้นสุดท้ายสำหรับ TH/EN
  - map display/body/mono usage ต่อหน้า
  - define fallback chain ชัด
- Acceptance:
  - heading, body, meta labels มี role ชัด
  - Thai readability ไม่ลดลง

`NOC-0103` Refine navbar and shell behaviors

- Status: `next`
- Files:
  - `components/Navbar.tsx`
  - `components/cyber/ambient-stage.tsx`
- Work:
  - ปรับ sticky behavior ให้หรูขึ้น
  - ลด visual noise ใน top bar
  - ทำ mobile CTA state ให้ชัด
- Acceptance:
  - navbar อ่านง่ายบน mobile
  - first viewport ไม่แน่นเกิน

`NOC-0104` Lock ambient depth system

- Status: `next`
- Files:
  - `components/cyber/ambient-stage.tsx`
  - `styles/globals.css`
  - `components/cyber/motion/ambient-orb.tsx`
- Work:
  - แยก atmospheric layers เป็น `base wash`, `grid field`, `orb drift`, `noise veil`
  - กำหนด opacity budget ต่อหน้า
  - ทำให้แต่ละ route ใช้ ambient logic ชุดเดียวกันแต่เปลี่ยน intensity ได้
- Acceptance:
  - ทุกหน้าหลักมี depth ที่ชัด แต่ไม่รก
  - mobile ไม่เกิด visual mud

### Track 2 — Landing

`NOC-0201` Rebuild hero as premium entry scene

- Status: `next`
- Files:
  - `components/marketing/premium-home.tsx`
  - `components/cyber/motion/*`
- Work:
  - ทำ hero ให้เป็น single dominant scene
  - ใช้ glow, grid, and glass layering แบบคุมปริมาณ
  - เพิ่ม CTA hierarchy: start assessment > dashboard sample > status
- Acceptance:
  - hero สื่อ premium lab ทันที
  - CTA หลักเห็นใน viewport แรกบน mobile และ desktop

`NOC-0202` Reframe section order around trust and immersion

- Status: `next`
- Files:
  - `components/marketing/premium-home.tsx`
- Work:
  - order ใหม่:
    1. immersive hero
    2. journey map
    3. what this test measures
    4. result artifact preview
    5. why trust this system
    6. final CTA
  - ตัด section ที่ซ้ำหรือเล่า product value ช้าเกิน
- Acceptance:
  - landing อ่านเป็น product narrative เดียว
  - ไม่รู้สึกเหมือน marketing blocks มาต่อกัน

`NOC-0203` Add premium trust layer without fake claims

- Status: `next`
- Files:
  - `components/marketing/premium-home.tsx`
- Work:
  - เพิ่ม trust cards แบบ honest:
    - 48 questions
    - bilingual
    - guest-first
    - cloud reconnect in progress
  - ไม่ใช้ testimonial ปลอม
- Acceptance:
  - credibility เพิ่มขึ้น
  - copy ไม่ overclaim

`NOC-0204` Build chaptered landing narrative

- Status: `next`
- Files:
  - `components/marketing/premium-home.tsx`
  - `components/cyber/chapter-track.tsx`
- Work:
  - ทำ section flow ให้เหมือน journey เดียว ไม่ใช่แค่กอง blocks
  - ใช้ chapter markers แบบ subtle เพื่อพา user จาก discovery ไปสู่ action
  - ทำ final CTA ให้เป็น “entry to ritual” มากกว่าปุ่ม marketing ทั่วไป
- Acceptance:
  - landing อ่านต่อเนื่องแบบ cinematic
  - CTA ปลายทางรู้สึกเป็น logical next step

### Track 3 — Quiz

`NOC-0301` Turn quiz into paced chapter experience

- Status: `done`
- Files:
  - `pages/quiz.tsx`
  - `components/cyber/chapter-track.tsx`
  - `components/cyber/motion/question-transition.tsx`
- Work:
  - แบ่ง 48 questions เป็น phases ที่มีชื่อและ tone
  - เพิ่ม phase transitions ที่สั้นและคุมจังหวะ
  - ทำ progress model ให้รู้สึกเดินหน้า ไม่ใช่แค่เลขเพิ่ม
- Acceptance:
  - 48 ข้อไม่ flat
  - ผู้ใช้เห็น phase context ระหว่างทำ

`NOC-0302` Upgrade answer cards for mobile-first clarity

- Status: `done`
- Files:
  - `pages/quiz.tsx`
  - shared UI primitives if needed
- Work:
  - ทำ selected state ชัดเจนขึ้น
  - ปรับ line-height และ padding สำหรับภาษาไทย
  - ลด accidental mis-taps
- Acceptance:
  - answer tap target ใช้งานดีบน mobile
  - selected/unselected แยกชัดแม้ไม่มี hover

`NOC-0303` Add in-flow reassurance and session continuity cues

- Status: `next`
- Files:
  - `pages/quiz.tsx`
  - `lib/assessment-runtime.ts`
- Work:
  - เพิ่ม small status copy เช่น autosaved locally
  - แสดง phase count และ session readiness
  - ถ้ามี history เดิมให้เสนอ resume อย่างนุ่มนวล
- Acceptance:
  - user เข้าใจว่าคำตอบยังอยู่
  - resume/new session logic ไม่สับสน

`NOC-0304` Refine deep-assessment pacing for 48+ questions

- Status: `next`
- Files:
  - `pages/quiz.tsx`
  - `components/cyber/motion/question-transition.tsx`
  - `components/cyber/motion/config.ts`
- Work:
  - แยก cadence ของต้นเกม, กลางเกม, และช่วงท้าย
  - ทำให้ answer feedback เร็วพอ แต่ question transition ยังรู้สึก immersive
  - เพิ่ม subtle phase reset ทุก 12 ข้อ
- Acceptance:
  - ผู้ใช้ไม่เหนื่อยหรือรู้สึก repetitive
  - จังหวะการทำ quiz ดู deliberate บน mobile จริง

### Track 4 — Result

`NOC-0401` Make result reveal feel like an artifact unlock

- Status: `done`
- Files:
  - `pages/result/[id].tsx`
  - `components/cyber/motion/result-reveal.tsx`
- Work:
  - split reveal เป็น 4 layers:
    - identity
    - signal map
    - narrative interpretation
    - premium locked modules
  - เพิ่ม stronger intro state ก่อนเห็น type เต็ม
- Acceptance:
  - result feel มี payoff
  - reveal ไม่ dump content ทีเดียว

`NOC-0402` Tighten bilingual content density

- Status: `done`
- Files:
  - `pages/result/[id].tsx`
  - source content modules
- Work:
  - ลดข้อความที่ยาวเกินใน free summary
  - ทำ headline, subhead, body ให้ชัด
  - วาง TH/EN copy ให้ tone ไม่หลุด
- Acceptance:
  - อ่านง่ายทั้งสองภาษา
  - ไม่รู้สึกเป็น translation dump

`NOC-0403` Improve premium module teaser design

- Status: `done`
- Files:
  - `pages/result/[id].tsx`
  - `components/cyber/account-hold.tsx`
- Work:
  - ให้ locked sections ดู intentional และแพง
  - เชื่อมกับ account reconnect narrative
- Acceptance:
  - premium tease น่าเชื่อถือ
  - ไม่ดูเหมือน disabled card ธรรมดา

`NOC-0404` Add authority framing to result artifact

- Status: `next`
- Files:
  - `pages/result/[id].tsx`
  - `components/cyber/motion/result-reveal.tsx`
- Work:
  - เพิ่ม frame ที่อธิบายว่า result นี้อ่านอะไรจากผู้ใช้บ้าง โดยไม่ overclaim science
  - ทำ score interpretation ให้ดูเป็น “signal reading” ไม่ใช่ random number grid
  - จัด summary density ใหม่สำหรับ mobile
- Acceptance:
  - result page ดูน่าเชื่อถือขึ้น
  - free artifact ยังมีคุณค่าแม้ยังไม่ login

### Track 5 — Dashboard and Handoff

`NOC-0501` Upgrade dashboard into a personal archive

- Status: `done`
- Files:
  - `pages/dashboard.tsx`
- Work:
  - ทำ latest result hero ให้ชัด
  - ทำ history list ให้เป็น archive system
  - ทำ reconnect bundle section ให้สวยกว่าสถานะ debug
- Acceptance:
  - dashboard รู้สึกมี value แม้ยัง guest-only
  - history scan ง่าย

`NOC-0502` Refine guest-to-cloud handoff storytelling

- Status: `done`
- Files:
  - `pages/dashboard.tsx`
  - `components/cyber/account-hold.tsx`
  - `lib/assessment-runtime-types.ts`
- Work:
  - เปลี่ยนภาษาจาก technical bundle เป็น user-facing archive sync narrative
  - technical terms คงไว้เฉพาะจุดเล็ก ๆ
- Acceptance:
  - คนทั่วไปเข้าใจว่าข้อมูลถูกเก็บไว้ใน browser ตอนนี้
  - คนที่ technical ยังเห็นว่ามี reconnect path

`NOC-0503` Design login/register as premium queue, not broken auth

- Status: `done`
- Files:
  - `pages/login.tsx`
  - `pages/register.tsx`
  - `pages/forgot-password.tsx`
  - `components/cyber/account-hold.tsx`
- Work:
  - ยกระดับ account hold layout
  - เพิ่ม value framing ว่า login จะปลดอะไรบ้าง
- Acceptance:
  - หน้า auth ไม่รู้สึก dead end

`NOC-0504` Turn dashboard into personal vault home

- Status: `done`
- Files:
  - `pages/dashboard.tsx`
  - `components/cyber/reconnect-bundle-actions.tsx`
- Work:
  - ให้ latest artifact เป็น hero จริงของหน้า
  - ลดความรู้สึก diagnostic/debug ของ reconnect blocks
  - ทำ archive cards ให้ดูเป็นของสะสมที่มีมูลค่า
- Acceptance:
  - dashboard มีแรงพอให้ user อยากกลับมา
  - first screen ไม่ดูเป็น utility page
- Evidence:
  - `output/ui-skills-router/2026-06-26/dashboard-result-responsive/responsive-proof-report.json`
  - `docs/mbti-z-execution-board.md` `NEXT-05`

### Track 6 — Legacy and Admin Surface Unification

`NOC-0601` Unify all relaunch states into one content matrix

- Status: `done`
- Files:
  - `components/cyber/relaunch-state.tsx`
  - `design-system/mbti-nocturne/pages/relaunch-states.md`
- Work:
  - define messaging matrix:
    - account
    - share
    - community
    - profile
    - verification
    - operations
  - remove copy drift between pages
- Acceptance:
  - every hold state follows same structure and tone
- Evidence:
  - `lib/mbti-z-copy.ts`
  - `components/cyber/relaunch-state.tsx`
  - `output/ui-skills-router/2026-06-26/mbtiz-0501-relaunch-copy/manifest.json`

`NOC-0602` Re-skin remaining legacy routes that still visually drift

- Status: `done for current guest-local UI scope`
- Files:
  - remaining `pages/*` not yet aligned
- Work:
  - audit edge routes
  - either convert to relaunch state or full Nocturne screen
- Acceptance:
  - no user-facing route looks like the old product
- Evidence:
  - `output/ui-skills-router/2026-06-25/audit-after/audit-report.json` covers `30` user-facing routes with no unreviewed page route left outside the audit matrix.
  - Remaining cloud/auth/admin behavior is intentionally not reactivated in this UI pass.

### Track 7 — Cloud Reconnect Preparation

`NOC-0701` Define guest handoff import contract

- Status: `done`
- Files:
  - `lib/assessment-runtime-types.ts`
  - new import service files
  - `docs/platform-setup-runbook.md`
- Work:
  - lock bundle schema
  - define idempotent import behavior
  - specify result/session/history merge rules
  - expose local recovery/import actions in Nocturne surfaces
- Acceptance:
  - import contract documented and typed
  - guest runtime can restore latest result, history, and session from a valid bundle

`NOC-0702` Add server-side guest handoff import endpoint

- Status: `next`
- Files:
  - `pages/api/me/*`
  - new service file under `lib/*`
  - `lib/schema.ts`
- Work:
  - accept guest handoff bundle
  - validate payload
  - prepare DB write path for future live env
- Acceptance:
  - endpoint exists
  - validation path exists
  - logic is idempotent by design

`NOC-0703` Implement runtime mode switching

- Status: `later`
- Files:
  - `lib/assessment-runtime.ts`
  - guest/cloud adapter files
- Work:
  - env-driven adapter selection
  - cloud mode fallback to guest when unavailable
- Acceptance:
  - runtime can switch without page rewrites

### Track 8 — Live Infra

`NOC-0801` Create new Supabase project

- Status: `blocked-external`
- Dependency: explicit user confirmation
- Acceptance:
  - project exists
  - connection strings available

`NOC-0802` Apply Prisma migration and seed

- Status: `blocked-external`
- Dependency: `NOC-0801`
- Acceptance:
  - schema applied
  - MBTI seed data loaded

`NOC-0803` Bind repo to Vercel project

- Status: `blocked-external`
- Dependency: repo/project selection
- Acceptance:
  - preview deploy works
  - envs configured

## 8. Detailed Motion Plan

motion policy ของโปรเจกต์นี้:

- 1 view = 1 primary motion moment + 1 supporting stagger
- animate `transform` + `opacity` ก่อน property อื่น
- ambient motion ต้องช้าและอยู่ background จริง
- ห้ามให้ animation เป็นเงื่อนไขของการเข้าใจเนื้อหา

### Motion primitives to standardize

`MOT-0101` `reveal` variants

- single block enter
- section enter
- stagger group

`MOT-0102` `question-transition`

- answer confirm
- card exit
- next card enter
- progress pulse

`MOT-0103` `result-reveal`

- blackout or veil intro
- type lock
- dimension scan
- insight cascade

`MOT-0104` ambient scene variants

- landing
- quiz
- result
- dashboard
- hold
- operations

### Duration guidelines

- hover/tap: `160-220ms`
- card enter: `320-460ms`
- hero reveal: `420-560ms`
- question swap: `200-320ms`
- result staged blocks: `380-700ms`
- ambient loops: `18s-32s`

### Accessibility rules

- respect `prefers-reduced-motion`
- remove parallax and long blur sweeps when reduced motion is on
- mobile ต้องไม่พึ่ง hover
- no infinite decorative motion on multiple panels in one viewport

## 9. Exact Next Sprint

ถ้าจะเริ่ม implementation ต่อทันที ให้ทำ sprint นี้ก่อน:

1. `NOC-0101` lock tokens
2. `NOC-0102` finalize typography policy
3. `NOC-0201` rebuild hero scene
4. `NOC-0202` reorder landing sections
5. `NOC-0301` phase-based quiz pacing
6. `NOC-0401` artifact-style result reveal
7. `NOC-0501` dashboard archive upgrade
8. `NOC-0601` relaunch state content matrix
9. `NOC-0701` guest handoff import contract

ผลลัพธ์ของ sprint นี้ควรทำให้:

- ภาพรวม product ดูแพงขึ้นชัดเจน
- flow หลักรู้สึก complete กว่าเดิม
- cloud reconnect ใกล้การใช้งานจริงขึ้น

## 10. Acceptance Checklist

ก่อนถือว่ารอบ redesign นี้พร้อมก้าวต่อ:

- `npm run lint` ผ่าน
- `npm run typecheck` ผ่าน
- `npm run build` ผ่าน
- browser verify ผ่านบน:
  - `/`
  - `/quiz`
  - `/result/[id]`
  - `/dashboard`
  - representative hold states
- mobile viewport ไม่มี layout break สำคัญ
- hero CTA และ quiz answer tap targets ใช้งานง่ายบน touch
- reduced motion path ยังอ่าน flow ได้ครบ

## 11. Decision Summary

คำตอบสั้นที่สุดสำหรับรอบนี้:

- ทำต่อจาก `guest-first Nocturne` ที่มีอยู่ ไม่ย้อนกลับไปแก้ auth ก่อน
- ใช้ `StarChart` เป็น visual reference แต่ต้อง adultize
- ใช้ `ui-ux-pro-max` เป็นตัวล็อก direction: immersive discovery + liquid glass + premium typography
- focus ที่ `core product polish + reconnect seam`
- defer live infra จนกว่าจะได้ Supabase/Vercel target จริง
