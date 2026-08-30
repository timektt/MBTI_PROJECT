# MBTI Nocturne Design System

> Archived source. The active product-facing source-of-truth is now `design-system/mbti-z/MASTER.md`.
> Keep this file only as historical reference for the earlier Nocturne direction.

เวอร์ชันนี้เป็น source-of-truth เดิมหลังการ relaunch รอบ `guest-first cyber dark runtime`

ถ้าจะทำหน้าหรือ component ใหม่:

1. ถ้างานเป็น product-facing MBTI Z ให้เริ่มจาก `design-system/mbti-z/MASTER.md`
2. ใช้ไฟล์นี้เฉพาะเมื่อต้องอ้างอิง decision เก่า
3. ถ้า implementation ปัจจุบันใน repo ขัดกับเอกสาร ให้ถือว่าโค้ดจริงใน `styles/globals.css`, `components/cyber/*`, `pages/*` เป็นหลัก แล้วค่อย sync doc ให้ตรง

page overrides ที่มีอยู่ตอนนี้:

- `pages/assessment-flow.md`
- `pages/relaunch-states.md`

---

## Product Direction

- Brand name at the time: `MBTI Nocturne`
- Mood: `luxury cyber`, `premium black glass`, `mysterious self-discovery`, `immersive dark`
- Audience: Thai Gen Z first, bilingual expansion
- Interaction principle: low-friction entry, high-trust presentation, cinematic transitions without heavy runtime fragility
- Runtime reality: product flow หลักตอนนี้เป็น `guest-first`; account/cloud features แสดงเป็น intentional hold state

## Visual Rules

### What this interface should feel like

- เหมือน premium personality lab ที่มีความมืด ลึก และ deliberate
- มี glow และ glass แต่ไม่ฟุ้งจนกลายเป็น sci-fi toy
- มีพลังแบบ cyber แต่ยังอ่านง่ายบน mobile
- ใช้ motion เพื่อ “เปิด layer ของข้อมูล” ไม่ใช่เพื่อทำ gimmick

### Avoid

- purple-on-white หรือ luxury beige style ของเวอร์ชันก่อน
- flat dark background แบบไม่มี depth
- glow ซ้อนหลายสีมั่ว ๆ บน element เดียว
- UI ที่เล่น hacker/computer aesthetic จนเสียความน่าเชื่อถือ
- animation ที่เร็วเกินหรือถี่เกินจนดู cheap

## Typography

- Interface heading / system titles: `Chakra Petch`
- Luxury display / editorial English moments: `Playfair Display`
- Body / Thai-first interface: `Bai Jamjuree`
- Code / meta labels: `Space Mono`

### Usage

- Interface titles, product sections, and structured UI headings: `font-editorial`
- English editorial moments and premium hero lockups: `font-luxury`
- Thai-first hero moments that still need a sharper system feel: `font-thai-editorial`
- Long-form copy, UI labels, helper text: `font-interface`
- Technical labels, dimensions, compact metadata: `font-code`

### Tone rules

- Interface heading ใช้ตัวพิมพ์คม ชัด กว้าง ดูเป็น engineered artifact
- Luxury serif ใช้แบบจำกัดพื้นที่ เพื่อเน้น premium contrast ไม่ใช่ลากไปทั้งระบบ
- Body text ต้องอ่านง่ายกว่าหน้า portfolio/fashion site ทั่วไป
- Uppercase tracking ใช้กับ eyebrow, state, meta labels เท่านั้น

## Color System

ค่าจริงอ้างอิง implementation ปัจจุบันใน [styles/globals.css](/Users/time/Desktop/Projects/MBTI_PROJECT/styles/globals.css:1)

### Core tokens

- `--cyber-bg`: `#05070f`
- `--cyber-bg-soft`: `#0a1020`
- `--cyber-panel`: `rgba(12, 16, 30, 0.72)`
- `--cyber-panel-strong`: `rgba(10, 14, 24, 0.88)`
- `--cyber-border`: `rgba(190, 199, 255, 0.14)`
- `--cyber-accent`: `#b679ff`
- `--cyber-gold`: `#f5c76d`
- `--cyber-blue`: `#7cc8ff`
- `--cyber-cyan`: `#62dbff`
- `--cyber-text-soft`: `rgba(243, 245, 255, 0.72)`

### Color roles

- Gold = CTA, premium cue, important state reveal
- Violet = interaction energy, selected state, immersive motion accent
- Blue = informational / mapping / dimension / system signal
- White = content and structural contrast

### Background layering

ทุกหน้าหลักควรมีอย่างน้อย 3 ชั้น:

1. dark deep-space base
2. soft radial glow หรือ atmospheric wash
3. grid / dot / scanline layer แบบ opacity ต่ำ

## Surfaces

### Primary shells

- `cyber-shell`: page background shell
- `cyber-panel`: standard glass card
- `cyber-panel-strong`: hero / primary highlight section
- `cyber-panel-muted`: softer secondary panel

### Surface rules

- ใช้ border บาง ๆ เสมอเพื่อกัน glass กลืนกับพื้นหลัง
- backdrop blur ต้องมี แต่ไม่ควรพึ่ง blur อย่างเดียว ต้องมี gradient และ shadow ประกอบ
- radius ใช้ใหญ่กว่าระบบเดิม: `1.4rem - 2rem` สำหรับ major panels

## Navigation

Navbar ต้อง:

- sticky
- โปร่งแบบ glass
- มี `Guest Mode Active` state ชัด
- มี CTA ฝั่งขวาเสมอ
- ไม่ใช้ social/app nav แบบระบบเดิมเป็นหน้า default

## Motion

### Approved motion language

- staggered reveal
- fade + translateY
- soft scale reveal
- floating atmospheric orb motion
- progress bar interpolation
- result reveal as sequential information blocks

### Motion constraints

- entry motion: `400ms - 800ms`
- hover motion: `150ms - 300ms`
- ambient loops: `18s+`
- ต้องรองรับ `prefers-reduced-motion`

### Libraries

- current primary runtime: `framer-motion`
- อย่าเพิ่ม `gsap`, `lenis`, `three` จนกว่าจะมี use case ที่ต้องใช้จริง

## Product Flow Rules

### Guest-first now

เส้นทางหลักในรอบนี้คือ:

`/ -> /quiz -> /result/[id] -> /dashboard`

สิ่งที่ต้องเป็นจริง:

- เข้า quiz ได้ทันที
- ทำ 48 ข้อได้จริง
- ได้ MBTI type จาก scoring จริง
- dashboard จำผลล่าสุดและ history ใน localStorage ได้
- หน้า account ไม่พัง แต่กลายเป็น hold state อย่างตั้งใจ
- public shell ไม่ควรผูก session polling กับทุกหน้าในเส้นทางหลัก

### Offline account messaging

สำหรับ feature ที่ยังไม่กลับมา:

- account sync
- share card
- premium unlock
- cloud save

ให้สื่อสารตรง ๆ ว่าอยู่ใน `hold / offline / relaunch queue` ไม่หลอกว่าพร้อมใช้งาน

### Relaunch states

route ที่ยังกลับไปใช้ runtime เก่าไม่ได้ ต้องไม่ปล่อยเป็น broken page หรือ raw redirect

ให้ใช้ relaunch states ที่:

- อธิบายเหตุผลของการพักหน้า
- ชี้กลับไป guest-first flow
- คุม visual language ให้อยู่ใน Nocturne ต่อเนื่อง

## Component Patterns

### Buttons

- Primary CTA: gold-to-violet gradient pill
- Secondary CTA: glass border pill
- Tertiary / state CTA: subtle border + low-opacity fill

### Stat cards

- ใช้ไอคอนใน soft capsule
- label เป็น mono uppercase
- value ใช้ display font ขนาดใหญ่

### Result modules

- แยก `free summary`, `dimension balance`, `premium teaser`, `runtime notice` ออกจากกันชัด
- อย่า dump text ยาวเป็นก้อนเดียว

### Quiz answers

- answer card ต้องกดง่ายบน mobile
- selected state ต้องชัดแม้ไม่มี hover
- dimension badge ต้องเห็นชัด แต่ไม่แย่งสายตาจากคำถาม
- question screen ควรมีซ้าย-ขวา hierarchy ที่ชัด:
  - ฝั่ง narrative/runtime
  - ฝั่งคำถาม/action
- phase rail ต้องช่วยให้ 48 ข้อรู้สึกเป็น journey ไม่ใช่ฟอร์มยาว

### Quiz chamber

- ใช้ `signal chamber` เป็นภาษาหลักของ quiz stage
- มี runtime reassurance ชัด เช่น local memory, progress, phase cue
- answer cards ควรมี `option`, `dimension pole`, และ body copy ที่กดง่ายบน mobile

### Result artifact

- result hero ต้องทำหน้าที่เป็น artifact reveal ไม่ใช่ summary box ธรรมดา
- free layer ที่ต้องเห็นชัด:
  - MBTI type
  - archetype name
  - summary block
  - `Artifact signature`
  - dimension balance
  - premium teaser
  - recent signal trail
- premium modules ควรดูเหมือน locked product surface ไม่ใช่ disabled panel

### Dashboard archive

- dashboard ต้องรู้สึกเหมือน personal vault มากกว่าหน้า utility
- latest artifact เป็นพระเอก
- history ต้องเรียกเป็น archive trail และ scan ได้เร็ว
- reconnect/handoff state ต้อง present แบบ product narrative ไม่ใช่ debug dump
- ถ้ามี handoff bundle แล้ว ต้องมี export actions ที่ดูเป็น premium artifact ต่อเนื่องกับหน้า ไม่ใช่ raw utility buttons

## Accessibility / Quality Gates

- ไม่มีข้อความสำคัญที่ contrast ต่ำจนอ่านลำบาก
- keyboard focus ต้องยังเห็นบน interactive element
- ไม่มี horizontal scroll บน mobile
- sticky navbar ต้องไม่บัง content ตอนโหลด
- animation ห้ามเป็น dependency ของความเข้าใจเนื้อหา

## Current Source Files

- Theme tokens: [styles/globals.css](/Users/time/Desktop/Projects/MBTI_PROJECT/styles/globals.css:1)
- Cyber primitives: [components/cyber](/Users/time/Desktop/Projects/MBTI_PROJECT/components/cyber)
- Main flow:
  - [components/marketing/premium-home.tsx](/Users/time/Desktop/Projects/MBTI_PROJECT/components/marketing/premium-home.tsx:1)
  - [pages/quiz.tsx](/Users/time/Desktop/Projects/MBTI_PROJECT/pages/quiz.tsx:1)
  - [pages/result/[id].tsx](/Users/time/Desktop/Projects/MBTI_PROJECT/pages/result/[id].tsx:1)
  - [pages/dashboard.tsx](/Users/time/Desktop/Projects/MBTI_PROJECT/pages/dashboard.tsx:1)
- Relaunch state system:
  - [components/cyber/relaunch-state.tsx](/Users/time/Desktop/Projects/MBTI_PROJECT/components/cyber/relaunch-state.tsx:1)
  - representative routes under [pages/profile.tsx](/Users/time/Desktop/Projects/MBTI_PROJECT/pages/profile.tsx:1), [pages/settings/index.tsx](/Users/time/Desktop/Projects/MBTI_PROJECT/pages/settings/index.tsx:1), [pages/explore.tsx](/Users/time/Desktop/Projects/MBTI_PROJECT/pages/explore.tsx:1), [pages/share/[slug].tsx](/Users/time/Desktop/Projects/MBTI_PROJECT/pages/share/[slug].tsx:1)

## Status

Design system นี้ไม่ใช่แค่ concept แล้ว แต่ถูก apply ลงโค้ดจริงใน primary flow เรียบร้อย และผ่าน browser verification ล่าสุดกับ `quiz -> result -> dashboard` หลัง page-system polish รอบล่าสุด
