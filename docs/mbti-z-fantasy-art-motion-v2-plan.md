# MBTI Z Fantasy Art And Motion V2 Plan

Date: 2026-08-30
Status: `LOCAL PRODUCT GATES PASSED - REMOTE DELIVERY IN PROGRESS`
Parent program: `docs/mbti-z-product-ui-v4-plan.md`
Direction: `Living Archive - Stylized Realistic Fantasy`
Runtime boundary: `guest-local`
Stable tasks: 136
Execution cards: 28

Current checkpoint: research, direction, pilot, 21 production assets, motion cleanup,
route integration and local QA are complete at source fingerprint
`b88194bef675c27c9316a7eb83848b21ec7acf75df280db5c0e7cc160276b2af`.
GitHub PR governance and Vercel Preview/Production remain delivery gates and are
not implied by the local result.

เอกสารนี้เป็น change-request overlay ของ UI V4 เดิม ใช้สำหรับยกระดับภาพและ motion โดยไม่ย้อนสถานะงาน Home/shared shell ที่ผ่านแล้ว และไม่เปลี่ยน scoring, persistence, reconnect bundle, PNG export, auth/cloud หรือ route contract

## 1. Objective

เปลี่ยน visual language จากภาพที่คุณภาพและสไตล์ไม่ต่อเนื่อง ให้กลายเป็นโลก fantasy เดียวกันที่มีลักษณะดังนี้:

- `stylized realistic fantasy`: anatomy, light, material และ environment น่าเชื่อ แต่มี shape language แบบ animated feature/concept art
- คมชัด อ่าน silhouette ได้ทันที ไม่เป็นภาพ AI ฟุ้ง ไม่เป็น photoreal ตรงๆ และไม่เป็น anime/chibi
- ภาพทุกภาพมีหน้าที่กับ identity, hierarchy หรือ narrative ไม่ใช้เป็น filler
- motion ทำให้เว็บรู้สึกมีชีวิตผ่าน reveal, state transition และ hover/focus feedback โดยไม่ทำให้ layout ขยับหรือใช้งานยาก
- responsive, reduced motion, Core Web Vitals และ guest-local behavior เป็น release gate ไม่ใช่สิ่งแก้ทีหลัง
- source control, PR/CI/AI review และ Vercel deployment เป็น delivery workstream จริง ไม่ใช่เอกสารที่ค้างอยู่เฉพาะ local

## 2. Research Conclusions

รายละเอียดและ source links อยู่ใน `docs/ui-redesign-v4-tasks/FANTASY-ART-MOTION-V2-RESEARCH.md`

### Patterns To Adapt

1. **D&D Beyond**: ใช้ fantasy art สร้างโลก แต่ character-building flow ใช้ step, search, filter และ progressive disclosure ที่ตรงไปตรงมา
2. **Baldur's Gate 3**: หนึ่ง character ต่อหนึ่ง narrative identity; ใช้ภาพใหญ่และ copy สั้นแทน card wall
3. **Riot Games**: มี immersive media hero เพียงจุดเด่น แล้วลด motion/visual density ในส่วนที่ผู้ใช้ต้องเลือกหรืออ่าน
4. **Motion**: ใช้ `MotionConfig` + reduced motion ระดับระบบ และพิจารณา `LazyMotion` จาก bundle evidence เท่านั้น
5. **Next Image**: reserve media geometry, กำหนด `sizes`, eager เฉพาะ LCP image และ lazy-load ภาพใต้ fold
6. **web.dev**: จำกัด animation หลักไว้ที่ `transform`/`opacity`; เป้าหมาย LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 ที่ p75

### Patterns Not To Copy

- ไม่คัดลอก source/component, artwork, character, layout หรือ trade dress ของ reference site
- ไม่ใช้ video hero, WebGL หรือ parallax ต่อเนื่อง เพราะต้นทุนและ device risk ไม่เหมาะกับ product นี้
- ไม่ใช้ card grid เป็น default ของทุก section
- ไม่ใช้ proprietary fantasy symbol, costume, weapon หรือ creature design จากเกมอื่น

## 3. Verified Current Gap

| Asset family | Current state | V2 decision |
| --- | --- | --- |
| Home Hero V1 | cinematic architecture, neutral แต่ยัง dark/photoreal เกิน direction ใหม่ | สร้าง V2 แบบ stylized realistic และรักษา safe area เดิม |
| 4 House scenes | 1600x960 PNG, เบาแต่ abstract/flat และ narrative ต่ำ | สร้าง 4 environment scenes ในโลกเดียวกัน |
| 16 Animal portraits | 1080x1350 PNG, ประมาณ 600KB-1.0MB ต่อไฟล์, style/lighting ไม่สม่ำเสมอ | ทำ pilot 4 types ก่อน แล้วผลิต 16 canonical portraits หลัง style lock |
| Quiz | task-focused และพื้นที่ mobile จำกัด | ไม่เพิ่มภาพ; เพิ่ม state/microinteraction เบาๆ |
| Result | มี animal identity จริง | ใช้ canonical Animal V2 + staged reveal/data motion |
| Type Atlas/Detail | มี route และข้อมูลแล้ว | ใช้ภาพ V2, fixed media geometry และ controlled reveal |
| Dashboard | เน้น result/history | ใช้ artifact จริง ไม่มี decorative hero |
| Held routes | intentional hold | ไม่มีภาพใหม่; compact truthful state + soft mount |

## 4. Art Direction V2

### 4.1 Style Definition

`Cinematic stylized realism with animated-feature clarity`:

- believable animal anatomy and environmental scale
- crisp silhouette, controlled edge hierarchy and clean focal detail
- painterly material response with precise eyes, fur/feather edges and readable gesture
- lighting cinematic แต่ shadow ยังอ่านได้บนจอ mobile
- color separation ชัด ไม่ wash ทั้งเฟรมด้วย House color เดียว
- fantasy อยู่ใน environment, light, material และ symbolic detail ไม่ใช่ costume ที่เลียนแบบ IP อื่น

### 4.2 House World Rules

| House | Environment language | Accent use | Avoid |
| --- | --- | --- | --- |
| Purple | observatory archive, obsidian, brass, celestial instruments | violet in mineral/reflection | purple fog wash, generic wizard room |
| Green | living conservatory, moss stone, botanical glass, water | green in bioluminescent life | neon jungle, elf franchise cues |
| Yellow | sunlit civic hall, warm stone, banners without symbols | gold/yellow in daylight and cloth | royal-logo imitation, full orange frame |
| Blue | kinetic forge/coastal storm lab, steel, glass, moving weather | blue in electricity/water | cyberpunk, blue gradient dashboard |

### 4.3 Animal Portrait Contract

- aspect ratio `4:5`, canonical production size `1080x1350`
- animal occupiesประมาณ 58-72% ของเฟรม ไม่ใช่ passport close-up ทุกตัว
- three-quarter pose หรือ meaningful movement; eyes/gesture encode type personality
- environment hints House world แต่ไม่แย่ง subject
- safe crop: face/eyes อยู่ใน center 60% และไม่ชิดบน/ข้าง
- ไม่มีเสื้อผ้ามนุษย์, text, logo, UI, watermark หรือ weapon ที่ชวนให้นึกถึง franchise
- 16 ภาพต้องใช้ camera language, edge quality, black point และ material fidelity ชุดเดียวกัน

### 4.4 Pilot Before Batch

Pilot 6 assets:

1. `INTJ Obsidian Raven` - Purple representative
2. `INFJ Moon Deer` - Green representative
3. `ISTJ Iron Wolf` - Yellow representative
4. `ISTP Steel Panther` - Blue representative
5. Home Hero V2 candidate
6. Purple House environment candidate

Batch 16 Animals และ 4 Houses เริ่มได้เมื่อ pilot ผ่าน style consistency, crop, readability และ byte budget เท่านั้น

## 5. Motion Strategy

### 5.1 Library Decision

| Option | Decision | Reason |
| --- | --- | --- |
| Existing `framer-motion` | `KEEP` | มี provider/primitives/reduced-motion อยู่แล้วและรองรับ route states |
| CSS transitions/keyframes | `KEEP` | เหมาะกับ hover/focus และ one-shot media reveal ที่ไม่ต้องมี React orchestration |
| `LazyMotion` + `m` | `MEASURE FIRST` | มีโอกาสลด initial feature bundle แต่ migration ต้องพิสูจน์จาก bundle/build |
| GSAP | `REJECT` | เพิ่ม dependency/mental model โดยไม่จำเป็น |
| Lottie/Rive | `REJECT` | ต้องมี asset runtime ใหม่และไม่แก้ core identity problem |
| Lenis/smooth-scroll | `REJECT` | กระทบ native scroll/accessibility และไม่ช่วย core flow |
| Three.js/WebGL | `REJECT` | หนักเกิน scope และ mobile/QA cost สูง |

### 5.2 Motion Ownership

- CSS: hover, focus-visible, active press, child-image scale, subtle light sweep
- Framer Motion: page/section mount, question enter/exit, result staging, filter/list transition
- no infinite ambient loops ใน core routes
- retire/deprecate `AmbientOrb`; ห้ามเพิ่ม orb/glow decoration ใหม่
- motion ต้องไม่เปลี่ยน document geometry หลัง initial layout

### 5.3 Motion Tokens

| Interaction | Duration | Distance/scale | Rule |
| --- | ---: | --- | --- |
| press | 120-160ms | scale 0.98-0.99 | pointer only; no layout shift |
| hover/focus | 180-260ms | media scale max 1.05 | transform child media only |
| section reveal | 320-520ms | y 12-24px | once, opacity + transform |
| hero reveal | 640-820ms | media scale 1.025 -> 1 | one-shot only |
| question transition | 320-420ms | x/y max 20px | preserve answer geometry |
| reduced motion | <=180ms | distance 0, scale 1 | opacity only where useful |

### 5.4 Page Motion Map

| Route | Motion treatment |
| --- | --- |
| Home | one-shot Hero image settle + copy stagger; House media hover/focus; section reveal once |
| Quiz | existing question transition; answer selection state; progress update without width-driven layout |
| Result | type/animal staged reveal; score bars `scaleX`; export feedback; no looping aura |
| Type Atlas | first-row reveal; filter result crossfade; card media hover/focus inside fixed frame |
| Type Detail | portrait crop reveal; section reveal; sticky index active-state transition |
| Dashboard | latest artifact mount; history row insertion/removal; clear state feedback |
| Held | icon/title/action soft mount only; no image/parallax |

## 6. Asset And Performance Budgets

| Surface | Budget | Loading rule |
| --- | ---: | --- |
| Home Hero V2 | <=300KB desktop; mobile variant <=180KB when needed | only LCP image eager/priority |
| House environment | <=220KB each | first visible candidate measured; others lazy |
| Animal portrait | <=350KB each; target full set <=5.6MB | lazy except active Result/Type hero |
| Home initial image transfer | <=550KB | no eager grid payload |
| Type Atlas first viewport image transfer | <=750KB | accurate `sizes`, below-fold lazy |

Technical targets:

- LCP <=2.5s at p75 target
- INP <=200ms at p75 target
- CLS <=0.1 at p75 target
- no horizontal overflow at 320/390/768/1024/1440
- no animation-triggered layout shift
- no more than 6 simultaneously animated nodes in a viewport
- large `filter`, `clip-path`, backdrop blur and animated box-shadow require profiling or removal

## 7. Component Decomposition

Patterns are reconstructed for this codebase, not copied from reference source.

| Component/primitives | Responsibility | Owner |
| --- | --- | --- |
| `FantasyMediaFrame` | fixed aspect ratio, `next/image`, focal position, overlay, loading contract | Shared/Motion Agent |
| `CharacterPortraitStage` | canonical Animal portrait treatment for Result/Type | Type/Core Agent |
| `HouseSceneCard` | fixed card geometry, image-only transform, keyboard/tap parity | Home/Type Agent |
| `NarrativeReveal` | thin wrapper over existing `Reveal` tokens | Motion Agent |
| `ScoreBarMotion` | transform-based result dimension animation | Motion/Core Agent |
| `FilterResultTransition` | Atlas result crossfade/layout-safe transition | Motion/Type Agent |
| `ReducedMotionProvider` | existing global preference boundary | Shared owner; preserve |

Do not add all components automatically. Add a component only when at least two consuming surfaces share the exact contract.

## 7.1 Source Control And Deployment Contract

Verified current delivery state on 2026-08-30:

- GitHub repository exists at `timektt/MBTI_PROJECT`, visibility `PUBLIC`
- remote has only `main` at `d264286`; remote still contains the old `mbti_test/` root
- no remote PR, Actions run, branch protection or ruleset exists yet
- local CI and PR template exist but are not landed on remote
- Vercel CLI `54.7.1` is authenticated as `timektt`
- accessible Vercel team is `SuperBear's projects` (`team_B5Pm6p3bUokzVLTwf29XJO1q`)
- no `mbti-project` exists in that team and this workspace has no `.vercel/project.json`

### Branch Model

Do not create long-lived `dev`, `staging` or `prod` branches.

```text
main (protected canonical source)
  <- Pull Request from codex/<bounded-task>
       <- deterministic CI + AI advisory review + evidence
```

- `main` is canonical source; it maps to Production only after Vercel binding and promotion gates are active
- every implementation uses a short-lived `codex/*` branch
- squash merge is preferred; branch is deleted after merge
- solo phase requires PR and CI but may use zero required human approvals
- force push and direct push to protected `main` are disabled

### Review Authority

- deterministic authority: required GitHub Actions status `verify`
- AI reviewer: advisory diff/security/UX review; findings must be resolved or explicitly dismissed with reason
- AI review must not receive secrets, `.env` values, production data or browser storage payloads
- screenshot and browser evidence remain required for UI PRs

### Vercel Environment Model

- `Preview`: public QA deployment for a PR/branch; not a production-readiness claim
- `Production`: promoted only from protected `main` after all FAM and delivery gates pass
- no separate Staging project/branch at this phase
- both environments remain `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=guest-local`
- auth/cloud/social/admin remain held; do not set fake production secrets to make validation pass
- Vercel target name: `mbti-project`, root `.`, framework Next.js, package manager npm

Official delivery references:

- [Vercel Git deployments](https://vercel.com/docs/git)
- [Vercel environments](https://vercel.com/docs/deployments/environments)
- [Promote Preview to Production](https://vercel.com/docs/deployments/promote-preview-to-production)
- [Production rollback](https://vercel.com/docs/deployments/rollback-production-deployment)

## 8. Delivery Waves

### Wave 0 - Repository And PR Foundation

- reconcile the 1,708-file staged root move plus unstaged/untracked current work without discarding user changes
- create `codex/repo-stabilization` and a reviewable baseline adoption PR
- land CI/PR template, enable protected `main`, required `verify` and AI advisory review
- establish future `codex/* -> PR -> squash main` workflow

### Wave A - Research And Lock

- lock reference lessons, copyright boundary, current asset inventory and performance baseline
- publish System Prompt V2 and rejection rubric
- capture pilot briefs and crop contracts

### Wave B - Pilot Generation

- generate four representative animals + Home Hero + one House scene
- visual QA at desktop/mobile crops
- approve or revise art direction before batch

### Wave C - Production Asset Set

- Home Hero V2
- four House environments
- 16 Animal portraits in four House batches
- optimize, hash, manifest and verify every accepted asset

### Wave D - Motion Foundation

- audit direct `framer-motion` imports and current primitives
- remove/deprecate AmbientOrb usage
- measure `LazyMotion` migration benefit
- lock tokens and shared primitives

### Wave E - Route Integration

- Home -> Quiz -> Result
- Type Atlas -> all 16 Type Detail routes
- My Results -> held routes
- one route sprint and evidence closeout at a time

### Wave F - Quality Gate

- responsive/locale/state/reduced-motion matrix
- asset budget and build output
- interaction, keyboard, overflow and visual regression proof
- preserve V3 gate history; add V2 overlay evidence to current V4 source

### Wave G - Vercel Delivery

- create and link dedicated `mbti-project` under `SuperBear's projects`
- update Vercel target manifest with real project/org ids only after creation
- configure a guest-local deployment contract without fake cloud/auth secrets
- deploy and smoke a Preview URL; attach it to the PR evidence
- after all product and delivery gates pass, promote protected `main` to Vercel Production
- verify canonical URL, core routes, asset delivery, console/network behavior and rollback to the previous deployment

## 9. Agent Model

| Agent | Role | Primary cards | Shared-file rule |
| --- | --- | --- | --- |
| A0 Lead Integrator | scope, sequence, locks, final acceptance | 01, 04, 07, 22 | sole final integrator |
| A2 Visual Research Agent | references, pattern decomposition, art rubric | 01-03 | docs/evidence only |
| A3 Art Director And Prompt Agent | System Prompt V2, pilot review, consistency | 03-07 | no page code |
| A3B Image Production Agent | generated raster, optimization handoff, ledger | 05-13 | `public/mbti-z/v4/**` only after approval |
| A9 Motion Systems Agent | motion audit, tokens, primitives, bundle evidence | 14-15 | motion files only |
| A5 Core Journey Agent | Home, Quiz, Result integration | 16-17 | route-local files |
| A6 Type Discovery Agent | Atlas, Type Detail integration | 18 | type routes/data only |
| A7 Results And Hold Agent | Dashboard/Held integration | 19 | no auth activation |
| A8 QA And Performance Agent | browser/perf/a11y/evidence | 20-22 | does not alter feature UI |
| A11 Release Operations Agent | repo stabilization, PR/CI/AI governance, Vercel deployment | 23-28 | no feature UI edits; no secret output |

## 10. Approval Gates

1. `FAM-GATE-01 Research`: reference synthesis, no-copy boundary and component decisions accepted
2. `FAM-GATE-02 Pilot`: 6 pilot assets pass style/crop/readability review
3. `FAM-GATE-03 Assets`: Hero + 4 Houses + 16 Animals pass manifest and byte budget
4. `FAM-GATE-04 Motion`: tokens, reduced motion and bundle decision pass
5. `FAM-GATE-05 Core`: Home/Quiz/Result pass route evidence
6. `FAM-GATE-06 Discovery`: Atlas + 16 details pass routing/crop/responsive matrix
7. `FAM-GATE-07 Release`: Dashboard/Held + full quality/build gates pass from one source fingerprint
8. `FAM-GATE-08 Repository`: baseline adoption PR passes CI/AI review and protected `main` is active
9. `FAM-GATE-09 Preview`: dedicated Vercel Preview deploy passes core-route/browser/network smoke
10. `FAM-GATE-10 Production`: protected `main` production deployment, canonical smoke and rollback proof pass

## 11. Non-Scope

- no Figma gate
- no named-artist or named-studio style imitation
- no copying proprietary components or artwork
- no auth/cloud/premium activation
- no scoring, question bank or result schema changes
- no dependency addition without measured gap
- no direct push to `main`, force push or deployment outside Cards 23-28
- no Supabase/cloud/auth activation as a side effect of Vercel deployment
- no fake secrets or placeholder production credentials

## 12. Source Files

- Research: `docs/ui-redesign-v4-tasks/FANTASY-ART-MOTION-V2-RESEARCH.md`
- System prompt: `docs/ui-redesign-v4-tasks/FANTASY-ART-V2-SYSTEM-PROMPT.md`
- Stable tasks: `docs/ui-redesign-v4-tasks/FANTASY-ART-MOTION-V2-TASKS.md`
- Execution cards: `docs/ui-redesign-v4-tasks/fantasy-art-motion-v2-cards/`
- Delivery cards: Cards 23-28 under the same execution-card directory

## 13. Definition Of Done

งานนี้เสร็จเมื่อภาพ production 21 ภาพที่อนุมัติแล้วมี style เดียวกันและผ่าน crop/byte/manifest gate, motion ทุก route เคารพ reduced motion และไม่ทำให้ geometry shift, core routes ผ่าน browser matrix ทุก viewport/locale/state, V3 guest-local behavior ไม่ regress, repository ใช้ protected-main PR workflow จริง และ Vercel Preview/Production ผ่าน smoke กับ rollback proof จาก source fingerprint เดียวกัน โดย runtime ยังเป็น `guest-local`
