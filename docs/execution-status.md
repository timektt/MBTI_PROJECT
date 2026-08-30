# Execution Status

เอกสารนี้สรุปสถานะล่าสุดของ MBTI product หลัง relaunch รอบ `guest-first cyber dark runtime`

## Current repo status

สิ่งที่เสร็จแล้วในโค้ด:

- primary product flow ถูกย้ายเป็น `guest-first`
  - `/`
  - `/quiz`
  - `/result/[id]`
  - `/dashboard`
- guest session, result, และ history ถูกเก็บผ่าน `localStorage` โดยใช้ [lib/mbti-guest.ts](/Users/time/Desktop/Projects/MBTI_PROJECT/lib/mbti-guest.ts:1)
- flow หลักของ assessment ตอนนี้เรียกผ่าน runtime boundary [lib/assessment-runtime.ts](/Users/time/Desktop/Projects/MBTI_PROJECT/lib/assessment-runtime.ts:1) แทนการผูก `pages/*` กับ `mbti-guest` ตรง ๆ
- question bank/runtime ปัจจุบันมี `60` ข้อ (`48` core MBTI + `12` Movie Profile) จาก canonical source [data/mbti/foundation-data.mjs](/Users/time/Desktop/Projects/MBTI_PROJECT/data/mbti/foundation-data.mjs:1)
- cyber dark design system ใหม่ถูก apply ลง:
  - global shell
  - navbar
  - landing
  - quiz
  - result
  - dashboard
  - login/register/forgot-password hold state
- legacy user-facing routes ที่ยังพึ่ง auth/DB ถูกย้ายเข้า MBTI Z hold/relaunch states แล้ว:
  - `/profile`
  - `/settings`
  - `/settings/password`
  - `/setup-profile`
  - `/setup-username`
  - `/verify-email`
  - `/reset-password`
  - `/explore`
  - `/leaderboard`
  - `/share/[slug]`
  - `/card/[id]`
  - `/card/me`
  - `/profile/[username]/*`
  - `/u/[username]`
- admin routes ถูกย้ายเข้า MBTI Z operations hold state แล้ว:
  - `/admin`
  - `/admin/cards`
  - `/admin/comments`
  - `/admin/settings`
  - `/admin/users`
- ไม่มี active Next middleware แล้ว; `/admin/*` แสดง hold state โดยตรง และยังไม่ควรถูกนับว่า production-protected จนกว่า auth/authorization จะถูก reconnect server-side
- account pages ที่เดิมพึ่ง auth/runtime ถูกเปลี่ยนเป็น intentional hold state แทน broken forms
- public app shell ไม่ poll `next-auth` session แล้วหลังถอด `SessionProvider` ออกจาก guest-first runtime
- active root app ตอนนี้มี `pages/reset-password.tsx` เป็น page เดียวสำหรับ `/reset-password`; duplicate route ที่ยังเห็นจาก Git เป็น old-root `mbti_test/` tracking noise จนกว่า MBTI-0001 จะ settle root move
- `quiz`, `result`, `dashboard` ยังคง behavior เดิม แต่ถูกย้ายให้พึ่ง runtime abstraction เพื่อเตรียม reconnect cloud path
- guest runtime ตอนนี้สร้าง `guest-to-cloud handoff bundle` แล้วจาก session/result/history จริง เพื่อเตรียม reconnect persistence ภายหลัง
- guest runtime ตอนนี้มี `handoff artifact actions` แล้ว:
  - download bundle JSON จาก browser ได้
  - copy bundle JSON ได้
  - restore/import bundle กลับเข้า browser ได้ผ่าน recovery console
  - action นี้ถูกยกขึ้นทั้งบน `dashboard` และ `account hold`
- local reconnect bundle contract ถูกล็อกเป็น typed schema แล้วที่:
  - [lib/reconnect-bundle.ts](/Users/time/Desktop/Projects/MBTI_PROJECT/lib/reconnect-bundle.ts:1)
  - [lib/assessment-runtime-types.ts](/Users/time/Desktop/Projects/MBTI_PROJECT/lib/assessment-runtime-types.ts:1)
  - [lib/assessment-runtime-guest.ts](/Users/time/Desktop/Projects/MBTI_PROJECT/lib/assessment-runtime-guest.ts:1)
- guest runtime ตอนนี้รองรับ:
  - invalid JSON rejection
  - invalid bundle rejection
  - valid bundle restore
  - idempotent re-import behavior
- motion system รอบใหม่ถูกยกขึ้นเป็น reusable primitives ใต้ [components/cyber/motion](/Users/time/Desktop/Projects/MBTI_PROJECT/components/cyber/motion)
  - `Reveal`
  - `Stagger`
  - `QuestionTransition`
  - `ResultReveal`
  - `ReducedMotionProvider`
  - `AmbientOrb`
- narrative structure components ถูกเพิ่มเพิ่มขึ้นอีกชั้นที่ [components/cyber/chapter-track.tsx](/Users/time/Desktop/Projects/MBTI_PROJECT/components/cyber/chapter-track.tsx:1)
  - ใช้กับ landing journey map
  - ใช้กับ quiz phase pacing
  - ใช้กับ result artifact layering
- [components/cyber/ambient-stage.tsx](/Users/time/Desktop/Projects/MBTI_PROJECT/components/cyber/ambient-stage.tsx:1) รองรับ route-specific scenes แล้ว:
  - `landing`
  - `quiz`
  - `result`
  - `dashboard`
  - `hold`
- `landing`, `quiz`, `result`, `dashboard` ถูก refactor ให้ใช้ motion primitives กลางแทน animation logic กระจายตามหน้า
- landing มี journey map ที่สะท้อน `ui-ux-pro-max` direction แบบ horizontal discovery มากขึ้น
- landing hero ถูกยกใหม่เป็น MBTI Z celestial lab scene ที่มี luxury editorial typography, guest-first trust chips, และ artifact preview ใน viewport แรก
- typography policy ถูกขยับเป็น 4-layer system:
  - `Bai Jamjuree` สำหรับ body / Thai-first interface
  - `Chakra Petch` สำหรับ interface heading
  - `Playfair Display` สำหรับ luxury editorial moments
  - `Space Mono` สำหรับ meta/runtime labels
- quiz pacing ถูกยกขึ้นอีกชั้นด้วย phase messaging + chapter track ระหว่างการทำแบบทดสอบ
- result page มี staged reveal, artifact layers, signal summary, และ animated dimension bars แบบ systemized มากขึ้น
- dashboard และ hold/relaunch surfaces ถูก sync ให้ใช้ ambient hold scene เดียวกัน
- `dashboard` และ `account hold` surfaces แสดง reconnect readiness จาก handoff bundle จริงแล้ว
- `dashboard` และ `account hold` surfaces แสดง exportable handoff artifact ได้จริงแล้ว ไม่ใช่แค่ status copy
- quiz page รอบล่าสุดถูกยกให้เป็น `signal chamber` ที่มี:
  - left-side runtime narrative
  - phase card
  - local memory cues
  - answer cards ที่ชัดขึ้นสำหรับ mobile และ bilingual copy
- result page รอบล่าสุดถูกยกเป็น artifact screen ที่มี:
  - stronger hero artifact
  - `Artifact signature`
  - `Dimension balance`
  - `Premium teaser`
  - `Recent signal trail`
- dashboard รอบล่าสุดถูกยกเป็น vault/archive surface ที่มี:
  - stronger latest artifact hero
  - `Personal archive trail`
  - `Vault signal`
  - `Cloud relaunch queue`
  - reconnect metadata ที่ดูเป็น product มากกว่า debug state
- canonical design source ถูกแยกไว้ที่:
  - `design-system/mbti-z/MASTER.md`
  - `design-system/mbti-z/pages/*`

สิ่งที่ผ่านการตรวจแล้ว:

- `npm run data:validate`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- browser verification ผ่านกับ flow:
  - `/`
  - `/quiz`
  - `/result/[id]`
  - `/dashboard`
  - `/login`
  - `/profile`
  - `/settings`
  - `/explore`
  - `/share/[slug]`
  - `/card/[id]`
  - `/setup-profile`
  - `/verify-email`
  - `/reset-password`
  - `/profile/[username]/followers`
- browser verification ล่าสุดหลัง `ui-skills-router` pass:
  - full route matrix ผ่าน 30 routes / 66 samples ที่ `390x844`, `768x1024`, และ `1440x1000` ด้วย `issues: 0`
  - current production route sweep รอบ `2026-06-29` ตรวจซ้ำ 30 routes / 66 samples จาก `next start` ด้วย `issueCount: 0` และเก็บหลักฐานไว้ที่ `output/ui-skills-router/2026-06-29/current-route-sweep/audit-report.json`
  - `npm run ui:route-sweep:verify` now locks that sweep against the current `pages/` route set and passes with `30/30` routes, `66/66` samples, and `0` issues
  - `npm run ui:completion` now locks the route sweep plus reconnect controls compact proof into one durable UI closeout gate
  - primary route gate ผ่าน `/`, `/quiz`, `/types`, `/login`, `/dashboard`, `/result/guest-*` ที่ `375x812`, `768x1024`, `1024x768`, และ `1440x900` ด้วย `issues: 0`
  - ไม่พบ `Nocturne` product-facing title/body copy, unnamed interactive, unlabeled inputs, small touch targets, horizontal overflow, bad responses, หรือ browser console issues ใน matrix ที่ตรวจ
  - `/quiz` ใช้ runtime ปัจจุบัน 60 questions (`48` core MBTI + `12` Movie Profile)
  - `/dashboard` และ `/login` ยังแสดง reconnect bundle/recovery actions จาก handoff state จริง
- browser accessibility verification ล่าสุดหลัง `MBTIZ-0603`:
  - 6 primary routes x 2 viewports ผ่านด้วย `issues: 0`
  - `<html lang="th">` ถูก set ผ่าน Pages Router document shell
  - ไม่พบ unnamed interactive, missing `img alt`, unexpected `h1`, missing title, หรือ focus offscreen หลังรอ scroll settle
  - reduced-motion proof บน `/quiz` ผ่าน: keyboard เลือกคำตอบและไปคำถามถัดไปได้ โดย `runningAnimations` เป็น `0`
- dashboard/result responsive proof ล่าสุดหลัง `NEXT-05`:
  - Chrome production `next start` matrix ผ่าน `/dashboard` และ `/result/guest-mqtpomkf-estj` ที่ `375x812`, `768x1024`, `1024x768`, และ `1440x900` ด้วย `issues: 0`
  - ไม่พบ horizontal overflow, visible `ดาวน์โหลด PNG` อยู่ใน first viewport ทุก sample, และ hidden export target ทุกจุดวัดได้ `1080x1350`
  - `/dashboard` mobile อ่าน `Artifact ล่าสุด` และ `ESTJ` เร็วขึ้นหลังย้าย latest artifact block ให้อยู่ก่อน compact metrics
- home compression proof ล่าสุดหลัง `NEXT-02`:
  - Chrome production `next start` matrix ผ่าน `/` ที่ `375x812`, `768x1024`, `1024x768`, และ `1440x900` ด้วย `issues: 0`
  - ความสูงลดลงทุก viewport: `6031 -> 5387`, `5353 -> 4742`, `4378 -> 3806`, และ `4003 -> 3268`
  - first viewport ยังมี primary CTA, `4 Houses`, `Movie Profile`, และ `Result Artifact` promise ชัดเจน
  - หน้า home ถูกยุบจาก card-heavy proof bands เป็น compact proof chips/rows โดยไม่เปลี่ยน guest runtime หรือ route contract
- login/mobile vertical-budget proof ล่าสุดหลัง `MBTIZ-0607`:
  - `/login` mobile height ลดจาก `3645` เหลือ `2723`
  - `/login` ผ่านที่ `375x812`, `768x1024`, และ `1440x900` ด้วย `issues: 0`
  - primary CTA `เข้าแบบทดสอบ` อยู่ใน first viewport ทุกจุดตรวจ และ reconnect/runtime sections ยังอยู่ครบ
  - guard proof ของ `/types` และ `/quiz` ที่ `375x812` ผ่านด้วย `issues: 0`
  - ใช้ `pbakaus/layout` และ `pbakaus/distill` เป็น UI Skills context สำหรับ spacing/hierarchy และลด visual bulk
- reconnect controls compact proof ล่าสุดหลัง `DB-004` / `LG-004`:
  - `components/cyber/reconnect-bundle-actions.tsx` ซ่อน recovery textarea เป็น default และเปิดด้วย toggle เฉพาะตอนต้อง restore package
  - `components/cyber/account-hold.tsx` เอา wrapper card ซ้อนรอบ reconnect actions ออกเพื่อลด visual bulk ใน `/login`
  - `/dashboard` cloud tab และ `/login` ผ่านที่ `390x844` และ `1440x1000` ด้วย `issueCount: 0`
  - default state มี `textarea: 0`, recovery-open state มี `textarea: 1`, ไม่มี horizontal overflow และไม่มี browser/console error
  - `npm run ui:completion` now verifies this evidence path alongside the full route sweep before the broader `npm run verify` gate continues
  - Evidence is stored in `output/ui-skills-router/2026-06-29/reconnect-controls-compact/`
- quiz copy centralization proof ล่าสุดหลัง `MBTIZ-0501` slice:
  - `/quiz` navigation labels, stage labels, และ `QuizAnswerDeck` interaction labels ถูกย้ายเข้า `mbtiZQuizCopy`
  - `QuizAnswerDeck` รับ typed `answerDeckCopy` จาก page แทนการ branch locale ภายใน component
  - TH/EN selected-answer proof ผ่านที่ `375x812` และ `1440x900` ด้วย `issueCount: 0`
  - relaunch scenario copy ถูกย้ายเข้า `lib/mbti-z-copy.ts` แล้ว และ `components/cyber/relaunch-state.tsx` ใช้ typed shared copy แทน component-local blocks
  - `/profile`, `/settings`, `/explore`, `/share/test`, `/verify-email`, และ `/admin` ผ่านที่ `375x812` และ `1440x900` ด้วย `issueCount: 0`
  - mobile EN toggle proof ผ่านครบทุก relaunch scenario
  - final smoke หลัง build ล่าสุดผ่าน `/`, `/login`, `/result/guest-mqu0ksv3-estj`, และ `/profile` ที่ `375x812` และ `1440x900` ด้วย `issueCount: 0`
  - `MBTIZ-0501` ปิดในฐานะ copy foundation แล้ว; copy ที่เหลือใน `pages/api/*` เป็น generated/API legacy นอก scope page UI copy
- shell และ support primitive audit ล่าสุด:
  - `MBTIZ-0301` ปิดแล้วหลัง source-level motion helpers และ reconnect handoff filename เปลี่ยนจากชื่อเก่า `Nocturne` ไปเป็น MBTI Z naming
  - source grep ไม่พบ `Nocturne`, `nocturne`, หรือ `mbti-nocturne` ใน active source directories นอก docs/history
  - `MBTIZ-0304` ปิดแบบ evidence-led: ใช้ `Tabs` / `ScrollArea` ใน route ที่ dense จริง และไม่เพิ่ม `Progress` / `Tooltip` เพิ่มโดยไม่มี use case ที่ลด complexity
- project-wide UI completion audit ล่าสุด:
  - route matrix proof ครอบคลุม 30 routes / 66 samples ด้วย `issueCount: 0`
  - named guard `npm run ui:completion` covers current route evidence, reconnect recovery-toggle evidence, and closeout doc fragments
  - latest guard evidence is stored in `output/ui-skills-router/2026-06-29/ui-completion-verify/ui-completion.json`
  - primary route gate proof ครอบคลุม 6 routes / 24 samples ที่ 4 viewports ด้วย `issueCount: 0`
  - active design-system source ถูก sync ให้ชี้ไปที่ `design-system/mbti-z/MASTER.md`; `mbti-nocturne` docs ถูกระบุเป็น historical reference
  - UI scope ของ guest-local MBTI Z รอบนี้ปิดแล้ว แต่ cloud/auth/deploy ยังเป็น production blockers แยกต่างหาก
- FigJam checkpoint ล่าสุดหลัง `NEXT-07`:
  - เพิ่ม diagram `MBTI Z UI QA Checkpoint 2026-06-26` ลงใน existing FigJam board `MBTI Z Redesign Delivery Map`
  - diagram ยืนยัน gate ที่ล็อกแล้ว: `NEXT-02`, primary route matrix, `NEXT-05`, และ `NEXT-06`
  - `MBTIZ-0604` ปิดแล้วในส่วน milestone capture เพราะ full 6-route x 2-viewport capture set ถูกวางใน FigJam board เดียวกันแล้ว
  - capture set ครอบคลุม `/`, `/quiz`, `/types`, `/login`, `/dashboard`, และ `/result/guest-mqtpomkf-estj` ที่ `desktop-1440x900` และ `mobile-375x812`
  - manifest ของ capture set ผ่านด้วย `sampleCount: 12`, `issueCount: 0`, response `200`, ไม่มี horizontal overflow, console errors, page errors, หรือ request failures
  - upload log ยืนยัน PNG ทั้ง 12 ไฟล์ถูกวางใน FigJam node `4:206` ถึง `15:206`; section/label polish ใน FigJam ถูก defer เพราะ Figma MCP Starter plan tool-call limit หลัง verification
- asset-board decision ล่าสุดหลัง `MBTIZ-0606`:
  - ตรวจ asset จริงครบ `4` house scenes และ `16` animal posters
  - dimensions ตรงกับ route/export need: house scenes `1600x960`, animal posters `1080x1350`
  - `npm run assets:verify` now locks the files against `mbtiZProfiles`, expected PNG signatures, and expected dimensions with `4/4` houses, `16/16` animal posters, and `0` failures
  - current style route ถูกล็อกเป็น source territory สำหรับงานภาพต่อ
  - animal posters ยังเป็น abstract sigil มากกว่าสัตว์ที่จำได้ทันที จึงถูกบันทึกเป็น focused refinement backlog ไม่ใช่ blocker ของ UI signoff รอบนี้
- server PNG export verification ล่าสุด:
  - `/api/result-share-image` ถูกย้ายจาก Edge runtime เป็น Node Pages API route
  - `npm run build` ผ่านโดยไม่มี Edge Runtime `url` warning เดิม
  - `POST /api/result-share-image` จาก `next start` คืน `image/png` ที่มี PNG signature ถูกต้อง
  - Chrome result-page download button path คืน PNG `1080x1350` ผ่าน server export
  - เมื่อ force server export เป็น `503`, Chrome fallback ด้วย `html2canvas` คืน PNG `1080x1350` ได้แล้วหลังใส่ export-safe clone CSS เพื่อหลบ `oklch(...)` parsing gap
  - WebKit/Safari-engine proof ผ่านทั้ง server-button download และ forced `html2canvas` fallback ที่ `1080x1350`
  - `MBTIZ-0605` ปิดแล้วด้วยหลักฐาน server, Chrome, และ WebKit/Safari-engine
- logic verification ล่าสุดของ reconnect import path ผ่านเพิ่มด้วย:
  - `npx --yes tsx scripts/verify-reconnect-import.ts`
  - ยืนยัน `invalid_json`, `invalid_bundle`, `imported`, และ overwrite-safe re-import
- cloud reconnect persistence helper verification ล่าสุดผ่านเพิ่มด้วย:
  - `npm run reconnect:cloud-import`
  - ยืนยัน in-memory Prisma-shaped transaction สำหรับ completed guest result, premium report, share card, user card, user profile update, event log, pending-session answer import, skipped answer count, และ idempotent re-import
- runtime guard verification ล่าสุดผ่านเพิ่มด้วย:
  - `npm run runtime:guards`
  - `npm run runtime:guards:cloud`
  - ยืนยันว่า default runtime ยังเป็น `guest-local`
  - ยืนยันว่า forced `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud` ยัง fallback กลับ `activeMode: guest-local` พร้อม `fallbackReason` ระหว่างที่ cloud readiness manifest ยัง `blocked`
- composite verify gate ล่าสุดผ่านด้วย:
  - `npm run verify`
  - gate นี้ครอบคลุม repo hygiene, data validation, DB bootstrap contract, reconnect import, reconnect cloud import, runtime fallback, auth surface isolation, UI route-sweep evidence, UI completion evidence, cloud API client contract, cloud server contract, cloud adapter lifecycle, lint, typecheck, และ production build
- runtime check ล่าสุดของ `/`, `/quiz`, `/dashboard` ไม่ยิง `/api/auth/session` แล้ว
- screenshot หลักฐานของ browser verification รอบล่าสุดถูกเก็บไว้ชั่วคราวใน `.codex-artifacts/`

## Current runtime model

ตอนนี้มี 2 ชั้นที่ต้องแยกให้ออก:

### ชั้นที่ใช้งานได้จริงตอนนี้

- guest-first local runtime
- cyber dark product shell
- bilingual quiz and result rendering
- local result history
- guest-to-cloud handoff bundle สำหรับ reconnect ภายหลัง

### ชั้นที่ยังไม่กลับมา

- auth-based account flow
- cloud save
- premium unlock
- share card runtime ใหม่
- Supabase-backed persistence verification
- Vercel-linked deployment target

## External workspace assets already created

### GitHub

- Repository: `timektt/MBTI_PROJECT`
- Existing tracked issues:
  - `#2 feat: implement database-driven MBTI assessment foundation`
  - `#3 feat: build premium result, dashboard history, and share-card flow`
  - `#4 chore: provision Vercel and Supabase for MBTI production`

### Notion

- `MBTI Product HQ`
- `PRD - Premium MBTI Platform`
- `Execution Roadmap`
- `Quiz Question Bank`
- `Result Content Matrix`
- `Data Dictionary`
- `Execution Roadmap DB`
- `Launch Checklist DB`
- `Quiz Question Bank DB`
- `Result Content Matrix DB`

### Supabase

- target organization identified:
  - `timektt's Org` (`bvtouqsabldotwjbpejw`)
  - plan: `free`
- currently visible projects include:
  - `MBTI Social Platform` — `INACTIVE`
  - `DATA_1` — `INACTIVE`
  - `Vote_Project` — `ACTIVE_HEALTHY` but unrelated to MBTI
- old MBTI project is still not a usable runtime target
- fresh project creation is still required before cloud persistence can resume

### Vercel

- target team identified:
  - `SuperBear's projects`
  - `team_B5Pm6p3bUokzVLTwf29XJO1q`
- repo is still not bound to an MBTI-specific Vercel project
- authenticated import flow now resolves `timektt/MBTI_PROJECT` correctly on `vercel.com/new/import`
- default import parameters currently resolve to:
  - provider: `github`
  - repo: `timektt/MBTI_PROJECT`
  - suggested project name: `mbti-project`
- deploy step was intentionally not executed yet because production deployment still requires explicit confirmation

## What is still incomplete

งานที่ยังไม่จบจริงตาม objective เต็ม:

0. settle repo hygiene/root move so the root app is tracked deliberately and tracked `mbti_test/db_data/*` is removed from the index
1. reconnect guest-first product flow to a fresh Supabase runtime target
2. restore account-backed persistence without breaking the guest path
3. relink premium/share/cloud modules on top of the new MBTI Z UI system
4. bind the repo to a dedicated Vercel project
5. configure preview/production environment variables
6. verify the cloud-backed runtime path end-to-end
7. reconnect or intentionally retire the remaining legacy account/social/admin behavior; visible page UI is already represented by the current route sweep, `RelaunchState`, or `AccountHold`

หมายเหตุ:
- งานข้อนี้ถูกขยับไปอีกขั้นแล้วด้วย admin relaunch state แต่ยังเหลือ route/API/backoffice behavior ที่ยังไม่ reconnect กับ cloud runtime จริง
- ตอนนี้ sprint ฝั่ง motion architecture ขยับไปแล้ว แต่ยังไม่ได้ต่อเข้า Notion/GitHub tracking รอบล่าสุดในเอกสารภายนอกทั้งหมด
- รอบล่าสุดของ core-flow polish ถูก verify แล้ว แต่เอกสารภายนอกยังต้อง sync เพิ่มอีก 1 รอบ
- handoff artifact export/download slice ถูก verify แล้ว และ external tracking ต้อง sync รอบนี้ด้วย
- handoff recovery/import slice ถูก implement และ logic-verified แล้ว แต่ browser automation ยังติดข้อจำกัดของ clipboard/file-upload ใน extension surfaces บางตัว จึงยังไม่ได้ end-to-end automate การพิมพ์ JSON/package upload ผ่าน browser tool แบบเต็ม 100%

## Current blockers

### Supabase

- creating a fresh project still requires explicit user confirmation through the MCP cost flow
- until that happens, live database migration and seed cannot continue

### Repo hygiene

- `npm run repo:hygiene` exists as a non-destructive audit command
- latest strict report: `blockerCount: 0`, `trackedDbDataCount: 0`, `trackedOldRootCount: 0`, `trackedOldSourceCount: 0`, `rootAppUntrackedCount: 0`, `warningCount: 0`
- pre-staging source move review found 138 root counterparts and 3 reviewed retirements: old middleware, duplicate reset-password API handler under `pages/`, and old `debug-env` secret-print helper
- `npm run repo:hygiene:strict` now passes after the root move and tracked DB data removal were staged deliberately
- apply sequence and staged-state evidence are documented in `output/vibe-to-prod/2026-06-26/repo-hygiene/staging-plan.md`

### Vercel

- no dedicated project is linked yet
- deployment should not be triggered blindly before env/runtime alignment is ready

### Environment preflight

- preview/production env validation now blocks placeholder values, localhost URLs/database URLs, malformed URLs/connection strings, and `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud` before cloud adapter verification
- preview/production env validation now also blocks URL origin drift, non-HTTPS deploy URLs, non-Postgres database schemes, invalid email transport shapes, short `NEXTAUTH_SECRET`, and Pusher server/client key or cluster mismatch
- launch preflight now includes repository hygiene status
- launch preflight now includes cloud runtime readiness status
- launch preflight now includes auth surface isolation status
- launch preflight now includes MBTI Z visual asset status
- launch preflight now includes UI route-sweep evidence status
- launch preflight now includes Supabase target readiness status
- launch preflight now includes the Supabase required-migration summary from `supabase:target`
- launch preflight now includes Vercel target readiness status
- launch handoff generation now exists through `npm run launch:handoff` and writes a secret-safe packet under `output/vibe-to-prod/<date>/launch-handoff/`
- `.env.example` preview proof correctly reports `repoHygiene.ok: true` and `authSurface.ok: true`, then fails with `supabaseTarget.ok: false`, `vercelTarget.ok: false`, `cloudRuntime.ok: false`, `missing: 0`, and `blockingWarnings: 5`
- evidence is stored in `output/vibe-to-prod/2026-06-26/env-preflight/preview-example-preflight.json`

### Supabase target readiness

- `data/runtime/supabase-target-readiness.json` records the intended org, blocked status, unset preview/production project refs, and the known legacy MBTI Social Platform ref that must not be reused as the MBTI Z relaunch runtime target
- `scripts/supabase-target-readiness.mjs` parses `DATABASE_URL` and `DIRECT_URL`, redacts credentials, extracts Supabase project refs from direct or pooler URLs, verifies the required fresh-target migration directories, and blocks local/non-Supabase/mismatched/unapproved refs for preview/production
- latest `.env.example` proof reports required migrations `2/2` present, then fails intentionally with local database connections, non-Supabase hosts, and missing approved preview project ref
- this is a preflight/deploy gate; it is not part of `npm run verify` until a real Supabase target exists

### Vercel target readiness

- `data/runtime/vercel-target-readiness.json` records the intended team, repo slug, blocked status, and unset preview/production project ids
- `scripts/vercel-target-readiness.mjs` parses `.vercel/project.json` and blocks missing/invalid bindings, missing project/org ids, mismatched approved ids, and known blocked project ids for preview/production
- the same gate now verifies the local Vercel deployment contract: `npm`, `package-lock.json`, `npm run build`, required route/build files, and required scripts (`build`, `start`, `verify`, `preflight:preview`)
- latest local proof reports deploy contract `4/4` required files and `4/4` required scripts present, then fails intentionally because `.vercel/project.json` is absent and no approved MBTI Z Vercel project id is declared yet
- this is a preflight/deploy gate; it is not part of `npm run verify` until a real Vercel project exists

### Cloud runtime

- `npm run cloud:readiness` exists as a non-secret audit command
- `data/runtime/cloud-runtime-readiness.json` is the cloud readiness manifest read by both runtime code and audit tooling
- latest cloud readiness proof reports manifest status `blocked`, required API routes present `6`, required Prisma models present `6`, migration directories `16`
- latest cloud readiness proof reports required API route contracts passing static checks `6` and nested UI-facing/API shape checks passing `9`
- the static contract gate checks method guards, server-session auth, rate limits, request schemas, user-scoped Prisma access, response keys, localized question metadata, Movie Profile artifact replay, and guest handoff dry-run plus guarded persistence import for the required cloud routes
- latest cloud readiness proof reports blockers `cloud_adapter_implemented` and `env_deploy_ready`
- `lib/assessment-runtime-cloud.ts` intentionally returns `null` while the manifest says `implemented: false`, so cloud mode must not be enabled until the Supabase-backed adapter is implemented and verified
- evidence is stored in `output/vibe-to-prod/2026-06-29/cloud-runtime-readiness/preview-example-cloud-readiness.json`

### Runtime guard

- `npm run runtime:guards` exists to assert the current default runtime stays in `guest-local`
- `npm run runtime:guards:cloud` exists to assert accidental `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud` activation does not switch the app to an unimplemented adapter
- `npm run runtime:guards:all` runs both runtime modes and is included in `npm run verify`
- latest guard proof reports cloud env fallback as `configuredMode: cloud`, `activeMode: guest-local`, `cloudReady: false`, and a non-empty fallback reason
- evidence is stored in `output/vibe-to-prod/2026-06-26/runtime-guards/`

### Verify gate

- `npm run db:bootstrap:verify` exists as the static Prisma schema/migration/seed bootstrap contract check
- `npm run assets:verify` exists as the named MBTI Z visual asset contract check
- `npm run reconnect:verify` exists as the named reconnect import contract check
- `npm run reconnect:cloud-import` exists as the named cloud persistence helper contract check
- `npm run auth:surface` exists as the static auth/admin/social isolation check
- `npm run ui:route-sweep:verify` exists as the current Pages Router UI evidence coverage check
- `npm run ui:completion` exists as the current UI closeout evidence check for route sweep, reconnect controls, and doc fragments
- `npm run cloud:contracts` exists as the mock-fetch cloud API client contract check
- `npm run cloud:server-contracts` exists as the static server route response/guard contract check
- `npm run cloud:adapter` exists as the mock-fetch cloud service adapter lifecycle check
- `npm run verify` now runs repo hygiene, data validation, MBTI Z visual asset verification, DB bootstrap contract verification, reconnect import verification, reconnect cloud import verification, runtime fallback guards, auth surface isolation, UI route-sweep evidence verification, UI completion evidence verification, cloud API client contract verification, cloud server contract verification, cloud adapter lifecycle verification, lint, typecheck, and production build
- latest `npm run verify` passed
- visual asset verifier evidence is stored in `output/vibe-to-prod/2026-06-29/asset-verify/`
- UI route-sweep verifier evidence is stored in `output/vibe-to-prod/2026-06-29/ui-route-sweep-verify/`
- verify-gate evidence is stored in `output/vibe-to-prod/2026-06-26/verify-gate/`

### Launch handoff packet

- `scripts/generate-launch-handoff.mjs` writes a secret-safe launch handoff packet from the current preflight gate
- `npm run launch:handoff -- --target=preview --file=.env.example` records proven local gates, external blockers, and exact next actions without writing secrets
- latest handoff proof is stored in `output/vibe-to-prod/2026-06-29/launch-handoff/` and reports local gates ready while Supabase/Vercel/env/cloud remain blocked
- this prepares Supabase/Vercel handoff but does not create projects, bind env, deploy, or enable cloud runtime

### DB bootstrap contract

- `scripts/verify-db-bootstrap-contract.mjs` verifies the Prisma schema, foundation migration, MBTI Z metadata migration, seed strategy, and canonical data without connecting to Supabase
- latest proof reports required data models `6/6`, migration-created tables `9`, seed destructive markers `0`, profiles `16`, questions `60`, options `288`, core questions `48`, movie questions `12`, and core dimensions `4`
- seed remains idempotent through `upsert` calls backed by schema unique constraints
- this prepares the fresh Supabase target path but does not create a project, apply migrations, seed data, or enable `cloud` runtime

### Auth surface isolation

- `scripts/audit-auth-surface-isolation.mjs` verifies account, profile, community, share, and admin UI routes stay on hold-state components while auth/cloud reconnect remains blocked
- latest proof reports `25` hold pages passing, `18` high-risk API route guard contracts passing, and no root Next middleware
- admin card list/delete APIs now require explicit methods and rate limits
- upload image API now requires server-side session auth before parsing/uploading files
- forgot/reset password APIs now rate-limit reset attempts

### Cloud API client contract

- `lib/assessment-runtime-cloud-client.ts` defines the client-side service boundary for the future cloud adapter
- `scripts/verify-cloud-api-contract.ts` verifies the client contract with mock `fetch`
- latest proof covers health, quiz start, answer save, quiz submit, result list, reconnect bundle dry-run validation, guarded reconnect persistence import, MBTI Z artifact metadata, and sanitized non-2xx error handling
- this does not enable `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud`; the active runtime remains `guest-local`
- evidence is stored in `output/vibe-to-prod/2026-06-29/cloud-api-client-contract/`

### Cloud API server contract

- `lib/api-request.ts` safely parses string JSON request bodies and returns typed success/error results for API handlers
- `/api/quiz/start`, `/api/quiz/answer`, and `/api/quiz/submit` now return `400` for malformed JSON strings before Zod validation instead of allowing an uncaught parse error
- `/api/quiz/start` now localizes and returns MBTI Z question metadata needed by the quiz UI: `kind`, `module`, `poles`, `metaLabel`, `weights`, and `movieScores`
- `/api/quiz/submit` and `/api/me/results` now include an `artifact` payload with MBTI Z house, animal, Movie Profile, share, premium preview, and explicit `cloud-core-v1` coverage metadata
- `/api/me/reconnect-bundle/import` now validates guest-local handoff bundles for authenticated users in default `dryRun` mode and supports guarded `dryRun:false` persistence import for completed guest results plus pending-session answers
- `scripts/verify-cloud-server-contract.ts` statically verifies the `6` manifest-required cloud routes expose expected success response keys, retain method/auth/rate/schema/user-scope guards, and keep nested shape wiring for question metadata, Movie Profile artifacts, dry-run reconnect validation, conflict guard, and persistence import scaffolds
- latest proof reports `routeCount: 6`, `failedRouteCount: 0`
- this does not connect to Supabase and does not enable `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud`
- evidence is stored in `output/vibe-to-prod/2026-06-29/cloud-server-contract/`

### Cloud adapter lifecycle

- `lib/assessment-runtime-cloud.ts` now exposes a gated async cloud service adapter scaffold
- public `createCloudRuntimeAdapter()` still returns `null` while the readiness manifest is blocked
- `scripts/verify-cloud-adapter-lifecycle.ts` verifies blocked and implemented-manifest-stub lifecycle behavior with mock `fetch`
- latest proof confirms blocked manifest falls back to `guest-local`, while an implemented stub can create a cloud service adapter and drive health/start/answer/submit/results/reconnect-import calls with MBTI Z question metadata, Movie Profile artifact coverage, handoff dry-run validation, and guarded persistence import
- the service adapter now exposes cloud session snapshot helpers (`bootstrapSession`, `saveSessionAnswer`, `submitSession`, `getDashboardState`, `validateReconnectBundleImport`, and `importReconnectBundle`) so a future page/runtime migration can consume normalized service state instead of raw route payloads
- evidence is stored in `output/vibe-to-prod/2026-06-29/cloud-adapter-lifecycle/`

## Recommended next work

1. sync GitHub issues and Notion pages with the new guest-to-cloud handoff coverage
2. get explicit approval for fresh Supabase project creation
3. create the new Supabase project, then apply migration + seed
4. reconnect auth/save/share flows on top of the new guest-first runtime and import the handoff bundle
5. link Vercel project after env keys and cloud runtime target are ready
