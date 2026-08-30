# MBTI Nocturne Animation Stack

> Archived note. The active motion/source naming now uses MBTI Z naming in `components/cyber/motion/*` and `design-system/mbti-z/MASTER.md`.
> Keep this file only as historical context for earlier animation-package decisions.

วันที่: 2026-06-05

เอกสารนี้สรุปว่า animation layer ไหนควรใช้ package อะไร, ควรติดตั้งเมื่อไร, และควรวางเข้า repo นี้อย่างไรให้เข้ากับ `luxury cyber + premium black glass + dark moody`

## 1. Executive Decision

คำตอบสั้นที่สุด:

1. ตอนนี้ **ยังไม่ต้องติดตั้ง animation package เพิ่ม**
2. ใช้ `framer-motion@12.9.2` ที่มีอยู่แล้วเป็น motion runtime หลัก
3. เพิ่ม `lenis` เฉพาะเมื่อเริ่มทำ long-scroll storytelling จริง
4. เพิ่ม `gsap` เฉพาะเมื่อมี scene ที่ต้องใช้ timeline sequencing แบบ Motion คุมไม่คุ้ม
5. ยังไม่ควรเพิ่ม `three`, `@react-three/fiber`, `Rive`, `Lottie` ในรอบถัดไป

เหตุผล:

- repo นี้ใช้ `framer-motion` อยู่แล้วหลายจุด
- flow หลักของ product ยังอยู่ในช่วง polish ไม่ใช่ช่วง 3D spectacle
- perceived quality ของเว็บนี้จะมาจาก `timing + hierarchy + restraint` มากกว่า dependency ใหม่

## 2. Verified Repo State

- `framer-motion` ติดตั้งแล้วใน `package.json`
- ใช้อยู่จริงใน:
  - `components/marketing/premium-home.tsx`
  - `pages/quiz.tsx`
  - `pages/result/[id].tsx`
  - `pages/dashboard.tsx`
  - `components/cyber/motion/*`
- project ใช้ `Next.js Pages Router` และ `React 19`
- baseline localhost ตอนนี้มี `guest-first landing`, `48-question quiz`, `result artifact`, `dashboard archive`

สรุป:

- ทางที่คุ้มที่สุดตอนนี้คือ **optimize motion architecture ก่อน install package**

## 3. Official Sources Checked

- [Motion for React installation](https://motion.dev/docs/react-installation)
- [GSAP installation](https://gsap.com/docs/v3/Installation/)
- [Lenis package](https://www.npmjs.com/package/lenis)
- [React Three Fiber installation](https://r3f.docs.pmnd.rs/getting-started/installation)
- [Three.js installation](https://threejs.org/manual/en/installation.html)
- [Rive React runtime](https://rive.app/docs/runtimes/react/react)

## 4. Package Decision Matrix

| Layer | Package | ตอนนี้ควรทำอะไร | คำสั่ง | เหมาะกับ use case | Recommendation |
|---|---|---|---|---|---|
| Core UI motion | `framer-motion` | ใช้ต่อทันที | none | page reveal, quiz transition, result reveal, dashboard stagger | ใช้เลย |
| Smooth scroll | `lenis` | defer | `npm install lenis` | long-scroll landing, chapter glide, premium scroll feeling | เพิ่มเฉพาะตอนเริ่ม scroll storytelling |
| Timeline engine | `gsap` | defer | `npm install gsap` | SVG line draw, chapter timelines, highly sequenced scenes | ยังไม่ต้องเพิ่ม |
| 3D scene | `three @react-three/fiber @react-three/drei` | future | `npm install three @react-three/fiber @react-three/drei` | interactive constellation chamber, real parallax depth | defer ไว้เฟสหลัง |
| Authored vector animation | `@rive-app/react-webgl2` | future | `npm i --save @rive-app/react-webgl2` | ถ้ามี `.riv` asset ของแบรนด์จริง | ไม่คุ้มตอนนี้ |
| JSON animation asset | `lottie-react` | future | `npm i lottie-react` | ถ้ามี motion asset สำเร็จรูปจาก design team | ไม่คุ้มตอนนี้ |

## 4.1 Exact decision for this repo

สำหรับ repo นี้ ณ ตอนนี้:

1. **ไม่ install อะไรเพิ่ม**
2. ใช้ `framer-motion@12.9.2` ต่อไปก่อน
3. ถ้าจะเพิ่ม package ตัวแรก ให้เพิ่ม `lenis`
4. `gsap` และ `three` ต้องมี scene ที่ justify ชัดก่อน

เหตุผล:

- หน้า current ยังได้ผลตอบแทนจาก `hierarchy + timing + sequencing` มากกว่าจาก dependency ใหม่
- guest-first flow ต้องนิ่งก่อน ไม่ควรเอา runtime complexity ใหม่เข้ามาเร็วเกิน
- motion ที่สวยสำหรับ product นี้ไม่ใช่ motion ที่เยอะที่สุด แต่เป็น motion ที่ “พอเหมาะและคุมจังหวะ”

## 5. Why Framer Motion First

`framer-motion` เพียงพอสำหรับสิ่งที่ product นี้ต้องใช้ใน phase ถัดไป:

- hero reveal
- section stagger
- question swap
- answer confirmation
- progress interpolation
- result artifact reveal
- dashboard archive entrance
- hover and tap polish
- locked/relaunch shimmer

จุดสำคัญ:

- flow นี้เน้น `reading self-discovery data`
- ถ้า motion หนักเกิน เนื้อหาจะด้อยลง
- Motion ต้อง “เสริมความรู้สึกแพง” ไม่ใช่ “แย่งซีนเนื้อหา”

## 6. Motion vs Motion Package Migration

official docs ใหม่ของ Motion แนะนำ:

```bash
npm install motion
```

และ import จาก:

```ts
import { motion } from "motion/react";
```

แต่ repo นี้ใช้:

```ts
import { motion } from "framer-motion";
```

คำแนะนำ:

- **ห้าม migrate ตอนนี้**
- ถ้าจะ migrate ให้เป็น task แยกหลังจาก UI รอบใหญ่ stable แล้ว

เหตุผล:

- ต้องแก้ imports หลายไฟล์
- ต้อง re-test motion behavior ทุกหน้าหลัก
- ไม่มี payoff พอสำหรับ phase นี้

### Current repo-safe install guidance

ตอนนี้คำสั่งที่ “ควรใช้จริง” มีแค่สองแบบ:

ถ้าจะอยู่กับของเดิม:

```bash
# do nothing
```

ถ้าจะเพิ่ม smooth scroll หลัง landing ยาวขึ้นจริง:

```bash
npm install lenis
```

ยังไม่ควรทำตอนนี้:

```bash
npm install gsap
npm install three @react-three/fiber @react-three/drei
npm i --save @rive-app/react-webgl2
npm i lottie-react
```

เหตุผลคือ package เหล่านี้จะเพิ่ม scope ของ implementation และ QA มากกว่าประโยชน์ที่ได้ใน sprint ถัดไป

## 7. Install Plan By Phase

### Phase 1 — Current safest path

ไม่ต้อง install อะไรเพิ่ม

```bash
# no install needed
```

ทำแทน:

- tighten motion tokens
- cleanup variants
- unify reveal choreography
- QA desktop/mobile/reduced motion

### Phase 2 — Add smooth scroll only if landing needs it

ติดตั้ง:

```bash
npm install lenis
```

เมื่อไรค่อยเพิ่ม:

- landing เปลี่ยนเป็น long-scroll narrative จริง
- result page ต้องการ chapter glide ระหว่าง section
- ต้องการ smooth scroll feeling ระดับ premium มากกว่าที่ CSS/native scroll ให้

ไม่ควรเพิ่มถ้า:

- landing ยังไม่ยาวพอ
- mobile performance ยังไม่มั่นใจ
- reduced-motion path ยังไม่ได้ล็อก

### Phase 3 — Add timeline control only for one justified scene

ติดตั้ง:

```bash
npm install gsap
```

เพิ่มเฉพาะเมื่อมี scene แบบนี้:

- constellation line draw ตอน reveal MBTI type
- hero intro ที่ต้องคุมหลาย layer แบบ frame-precise
- chapter transitions ที่ Motion จัดการยากเกินไป

กฎ:

- isolate GSAP under scene-specific components
- ห้ามให้ GSAP คุม element เดียวกับที่ Framer คุม

### Phase 4 — Add 3D only if product direction explicitly changes

ติดตั้ง:

```bash
npm install three @react-three/fiber @react-three/drei
```

เหมาะเมื่อ:

- product ตัดสินใจทำ `interactive star chamber`
- ต้องมี depth จริง, pointer interaction, or constellation map แบบ dynamic

ยังไม่เหมาะตอนนี้ เพราะ:

- cost สูง
- perf risk สูง
- content/flow ยังได้ประโยชน์น้อยกว่า polish 2D motion

## 8. Exact Placement in This Repo

### ใช้ `framer-motion` ตรงไหน

Landing:

- hero headline reveal
- chapter cards stagger
- CTA pulse
- trust panel entrance

Quiz:

- question card out/in
- answer confirm flash
- phase transition veil
- progress pulse

Result:

- type reveal
- score scan
- insight card stagger
- premium locked module shimmer

Dashboard:

- latest artifact mount
- archive list stagger
- reconnect panel reveal

Hold / Relaunch:

- soft veil
- card entrance
- subtle glow shift on CTA

## 8.1 Installation gates

### Gate for adding `lenis`

เพิ่มได้เมื่อครบทุกข้อ:

- landing กลายเป็น long-scroll chapter จริง
- reduced-motion path ถูกล็อกแล้ว
- mobile browser QA ผ่าน
- scroll behavior เดิมของ native browser รู้สึกไม่พอจริง

### Gate for adding `gsap`

เพิ่มได้เมื่อครบทุกข้อ:

- มี 1 scene ที่ Motion ทำได้ไม่สวยหรือ maintain ยากจริง
- scene นั้นถูก isolate เป็น component เดียว
- มี owner ชัดเจนว่าจะไม่ใช้ GSAP กระจายทั่วระบบ

### Gate for adding `three` / `@react-three/fiber`

เพิ่มได้เมื่อครบทุกข้อ:

- direction product เปลี่ยนไปสู่ interactive constellation / chamber จริง
- ยอมรับ perf budget และ asset pipeline ที่สูงขึ้น
- landing และ result 2D version ปัจจุบันถูก polish จน “ตัน” แล้ว

## 9. Motion Density Rules

### Landing

- density: medium
- feel: mysterious, premium, welcoming
- target durations:
  - hero reveal `420-560ms`
  - card stagger `70-110ms`
  - hover lift `160-220ms`

### Quiz

- density: medium-high
- feel: immersive, focused, fast enough to keep momentum
- target durations:
  - answer feedback `140-180ms`
  - question exit `180-240ms`
  - question enter `220-320ms`
  - phase veil `260-380ms`

### Result

- density: high but staged
- feel: payoff, discovery, premium artifact unlock
- target durations:
  - intro veil `260-360ms`
  - type lock `420-620ms`
  - score scan `500-760ms`
  - insight stagger `90-140ms`

### Dashboard

- density: low-medium
- feel: archival, calm, high-value
- target durations:
  - hero mount `320-420ms`
  - history stagger `60-90ms`
  - hover emphasis `150-180ms`

## 10. Motion Rules

Use:

- animate `transform` and `opacity` first
- animate glows via opacity/background-position/filter intensity, not layout
- stage reveal in waves
- keep ambient loops very slow

Avoid:

- animating `width`, `height`, `top`, `left` for primary page transitions
- animating 4-5 decorative things in the same viewport
- infinite loops on every card
- blur + scale + parallax stacked on the same element

## 11. Reduced Motion Policy

ถ้า user เปิด `prefers-reduced-motion: reduce`

- ปิด parallax
- ปิด smooth scroll runtime
- ปิด long ambient loops ที่เด่น
- เปลี่ยน staged reveal เป็น quick fade
- คง motion ที่จำเป็นต่อ feedback เท่านั้น เช่น loading, submit, state change

## 12. Recommended File Architecture

ถ้าจะขยาย motion system ต่อ ให้คุมในไฟล์พวกนี้:

```txt
components/cyber/motion/
  config.ts
  reveal.tsx
  stagger.tsx
  question-transition.tsx
  result-reveal.tsx
  ambient-orb.tsx
  reduced-motion-provider.tsx
```

ถ้าเพิ่ม `lenis` ภายหลัง:

```txt
components/cyber/motion/
  scroll-runtime.tsx
```

ถ้าเพิ่ม `gsap` ภายหลัง:

```txt
components/cyber/scenes/
  landing-hero-scene.tsx
  result-constellation-scene.tsx
```

## 13. Implementation Tasks

`MOT-1001` Audit current motion variants

- Status: `next`
- Goal:
  - หา variant ที่ซ้ำหรือ behavior ที่ drift

`MOT-1002` Lock shared easing and duration tokens

- Status: `next`
- Files:
  - `components/cyber/motion/config.ts`
  - `styles/globals.css`

`MOT-1003` Standardize page-level reveal wrappers

- Status: `next`
- Files:
  - `components/cyber/motion/reveal.tsx`
  - `components/cyber/motion/stagger.tsx`

`MOT-1004` Upgrade quiz pacing

- Status: `next`
- Files:
  - `components/cyber/motion/question-transition.tsx`
  - `pages/quiz.tsx`

`MOT-1005` Upgrade result sequencing

- Status: `next`
- Files:
  - `components/cyber/motion/result-reveal.tsx`
  - `pages/result/[id].tsx`

`MOT-1006` Decide whether Lenis is justified

- Status: `later`
- Gate:
  - only after landing/result long-scroll polish is done
  - only after browser QA on mobile

`MOT-1007` Prototype one GSAP-only scene if Framer ceiling is reached

- Status: `later`
- Gate:
  - only if one specific scene cannot be expressed cleanly with Motion

`MOT-1008` Evaluate Lenis with a disposable branch

- Status: `later`
- Goal:
  - ทดลอง `lenis` เฉพาะ landing โดยไม่กระทบ flow อื่น
- Success criteria:
  - scroll feel ดีขึ้นชัดเจนบน desktop
  - mobile ไม่มี lag หรือ gesture conflicts
  - ปิด reduced-motion แล้วไม่เหลือ side effect

## 14. Final Recommendation

สำหรับสิ่งที่คุณต้องการตอนนี้:

- ใช้ `framer-motion` ต่อทันที
- ทำให้ motion ของ `landing`, `quiz`, `result`, `dashboard` ดู deliberate ก่อน
- ถ้าหลัง polish แล้วยังอยากได้ scroll feel ที่หรูขึ้น ค่อยเพิ่ม `lenis`
- อย่าเริ่มจาก `gsap` หรือ `three` เพราะจะเพิ่ม complexity เร็วเกิน value
