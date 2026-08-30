# Fantasy Art And Motion V2 Research

Date: 2026-08-30
Status: `RESEARCH SYNTHESIS READY`
Purpose: extract global-quality patterns without copying proprietary source, assets or trade dress

## 1. Research Questions

1. เว็บ fantasy ที่ดีสร้าง immersion โดยไม่ทำให้ primary task ยากอย่างไร
2. character/type catalog ควรแสดง identity อย่างไรโดยไม่กลายเป็น card wall ที่ซ้ำกัน
3. animation แบบไหนให้ความรู้สึก premium แต่ยังเบาและ accessible
4. image delivery และ motion architecture แบบไหนเหมาะกับ Next.js Pages Router ที่มีระบบเดิมอยู่แล้ว

## 2. Reference Findings

### D&D Beyond

Sources:

- [D&D Beyond Players and Character Builder](https://www.dndbeyond.com/en/players)
- [How to create your first D&D character](https://www.dndbeyond.com/posts/1059-how-to-create-your-first-dungeons-dragons)

Observed pattern:

- ภาพ fantasy ขนาดใหญ่ทำหน้าที่สร้างโลกและแรงจูงใจ
- builder แยกเป็น step ที่คาดเดาได้ มี category, search/filter และ progressive disclosure
- fantasy decoration อยู่รอบ utility surface ไม่ทับ control หรือข้อความสำคัญ

Adapt for MBTI Z:

- Home/Result/Type Detail เป็นพื้นที่ immersion
- Quiz/filters/history เป็น task surface ที่สงบและ geometry คงที่
- ใช้ House เป็น browseable identity category แต่ Type card ลิงก์ไป route เต็ม ไม่เปิดรายละเอียดซ้อนใน dropdown

Do not copy:

- class names, iconography, frame art, character builder layout หรือ source component

### Baldur's Gate 3

Source: [Baldur's Gate 3 About](https://baldursgate3.game/about)

Observed pattern:

- character art ใหญ่และอ่าน silhouette ได้ทันที
- หนึ่ง section เน้นหนึ่ง subject พร้อม trait/narrative identity ที่ชัด
- ใช้ scroll เป็นจังหวะ narrative ไม่แสดงทุกอย่างเป็น card เท่ากันหมด

Adapt for MBTI Z:

- Result/Type Detail ให้ Animal เป็น subject หลักหนึ่งตัว ไม่ใช้ภาพ collage ที่แย่งกัน
- Type section ใช้ headline + narrative + evidence/data แล้วค่อย reveal section ถัดไป
- Animal pose, gaze และ environment ต้องอธิบาย personality ก่อนผู้ใช้อ่าน copy

Do not copy:

- character designs, costume, UI chrome, logos, composition หรือ visual effects เฉพาะของเกม

### Riot Games

Source: [Riot Games](https://www.riotgames.com/en)

Observed pattern:

- ใช้ immersive media hero เป็น first signal ชัดเจนเพียงจุดเดียว
- หลัง Hero เปลี่ยนเป็น content grid ที่ restrained และ scan ง่าย
- controls เรียบ ไม่พยายามให้ทุก component cinematic เท่ากัน

Adapt for MBTI Z:

- Home Hero V2 รับภาระ brand world หลัก
- sections ถัดไปใช้ภาพ House/Animal เท่าที่ช่วย identity
- motion density ลดลงเมื่อเข้าสู่ Quiz, Atlas filter และ Dashboard

Do not copy:

- video/media assets, navigation styling, branded game tiles หรือ animation timing แบบตรงตัว

## 3. Framework And Performance Findings

### Motion LazyMotion

Source: [Motion LazyMotion documentation](https://motion.dev/docs/react-lazy-motion)

- เอกสารระบุว่า `motion` component แบบเต็มมี feature bundle ประมาณ 34KB ขณะที่ `LazyMotion` + `m` สามารถลด initial feature bundle ลงได้ถึงประมาณ 4.6KB
- รองรับทั้ง synchronous และ asynchronous feature loading
- สำหรับ repo นี้ให้ `MEASURE FIRST`: build/bundle proof ต้องชี้ว่าการย้าย import คุ้มค่าก่อน refactor

### MotionConfig And Reduced Motion

Source: [MotionConfig documentation](https://www.motion.dev/docs/react-motion-config)

- `reducedMotion="user"` เป็น site-wide policy ที่เหมาะสม
- transform/layout animation จะถูกลด ขณะที่ opacity/background color ยังใช้เพื่อรักษา feedback ได้
- repo มี `ReducedMotionProvider` และ `MotionConfig` อยู่แล้ว จึงควรขยายระบบเดิมแทนสร้าง provider ซ้ำ

### Motion Performance

Source: [Motion performance guide](https://motion.dev/docs/performance)

- transform/opacity เป็น baseline ที่ปลอดภัยกว่า property ที่ trigger layout/paint
- layer size และ effect บน element ใหญ่มีผลต่อ performance
- filter, clip-path และ JavaScript-driven animation ต้อง profile ไม่ใช่สมมติว่าเร็ว

### Next Image

Sources:

- [Next.js Pages Router Image component](https://nextjs.org/docs/pages/api-reference/components/image)
- [Next.js image optimization guide](https://nextjs.org/docs/14/pages/building-your-application/optimizing/images)

- `fill` ต้องใช้กับ container ที่มี geometry และ `sizes` ที่ตรงกับ layout จริง
- eager/priority ใช้เฉพาะ LCP image; below-fold images lazy-load
- width/height หรือ aspect ratio reservation เป็นส่วนสำคัญของ CLS control
- art direction ที่ crop ต่างกันมากอาจใช้ mobile variant แยก แทนการบังคับ one-image crop จน subject หาย

### Core Web Vitals And CSS Animation

Sources:

- [web.dev Core Web Vitals](https://web.dev/articles/vitals)
- [web.dev high-performance CSS animations](https://web.dev/articles/animations-guide)

- target: LCP <=2.5s, INP <=200ms, CLS <=0.1 ที่ 75th percentile
- animation ควรใช้ transform/opacity เป็นหลัก
- reserve image dimensions และหลีกเลี่ยง animation ที่เปลี่ยน width/height/top/left ของ document content

## 4. Component Pattern Decomposition

สิ่งต่อไปนี้เป็น pattern ที่จะเขียนใหม่ให้เข้ากับ repo ไม่ใช่ code ที่คัดจาก reference:

| Pattern | Input | Output | Implementation constraint |
| --- | --- | --- | --- |
| Immersive media hero | one approved visual + DOM copy + CTA | strong first viewport | one LCP image, no video, no card wrapper |
| Identity catalog | House/Animal metadata | scan/filter/open detail | fixed media frame, route navigation, no nested dropdown detail |
| Character narrative stage | one Animal + type content | identity-led reading | one dominant subject, section rhythm |
| Progressive task surface | question/progress/answers | predictable quiz | no decorative image, stable controls |
| Artifact reveal | result + scores + export | clear personalized outcome | one-shot staging, real data only |
| Reduced-motion boundary | user preference | alternate motion | distance 0, scale 1, short opacity feedback |

## 5. Library Decision Record

| Library/technique | Status | Evidence required to revisit |
| --- | --- | --- |
| Framer Motion 12.9.2 | keep | already installed and used |
| CSS transitions/keyframes | keep | native, ideal for hover/focus |
| LazyMotion | conditional | bundle comparison and migration test |
| GSAP | reject | only reconsider for timeline unavailable in current stack |
| Lottie/Rive | reject | only reconsider with approved interactive vector asset need |
| Lenis | reject | only reconsider after native-scroll UX failure evidence |
| Three.js | reject | only reconsider if full 3D becomes a core product capability |

## 6. Practical Design Rules From Research

1. Art carries world-building; controls carry tasks.
2. One viewport should have one dominant visual subject.
3. Motion must explain entry, selection, hierarchy or state change.
4. A hover effect cannot be the only way to reveal required information.
5. Image scale occurs inside an overflow-hidden frame; outer card dimensions never animate.
6. In-view animation runs once unless the state itself changes.
7. Below-fold imagery is lazy and has reserved aspect ratio.
8. Every generated image has an exact route/slot/crop/byte contract.

## 7. Research Acceptance

- all sources are official/product/framework sources
- patterns are described as observations/inferences, not copied implementation
- no recommendation requires a new dependency
- fantasy immersion is concentrated in Home/Result/Type identity surfaces
- Quiz/Dashboard/Held retain task clarity and lightweight behavior
