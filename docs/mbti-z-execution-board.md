# MBTI Z Execution Board

อัปเดตล่าสุด: `2026-06-29`

เอกสารนี้เป็น task board คู่กับ `docs/mbti-z-redesign-plan.md` เพื่อใช้ขับงานใน repo จริง

---

## 1. Goal

เป้าหมายของรอบ redesign นี้คือเปลี่ยน surface หลักของ `MBTI Nocturne` ให้เป็น `MBTI Z` แบบใช้งานได้จริงใน guest runtime โดยเน้น:

- home ที่ premium และไม่ยึด `INTJ` ตัวเดียว
- quiz ที่ตอบตรงกลาง มี 5-level scale และ motion ชัด
- result ที่มี `house`, `animal`, `Movie Profile`, และ export PNG
- dashboard ที่แน่นขึ้น ใช้พื้นที่คุ้ม
- login/hold ที่เป็นระเบียบและสื่อสารชัด
- TH-first และแปล TH/EN ครบ

---

## 2. Locked Decisions

### Visual route

- dark cinematic
- fantasy premium
- 4-house color system
- Thai-first editorial hierarchy
- compact, structured layout
- avoid terminal-only cyber styling
- avoid empty decorative panels
- avoid INTJ-only hero framing

### Internet-backed library decisions

- Keep: `framer-motion`, Radix `RadioGroup`, `next/image`, `html2canvas`
- Use on demand through the existing `shadcn/ui` layer:
  - `Tabs`
  - `Progress`
  - `ScrollArea`
  - `Tooltip`
- Add only if needed:
  - `@tailwindcss/container-queries`
  - `embla-carousel-react`
  - `next-i18next/pages`
- Avoid:
  - GSAP
  - Three.js
  - heavy chart libraries

Locked on `2026-06-05` from official docs:

- Motion remains sufficient for layout transitions, tap states, and reduced-motion support
- `html2canvas` stays first for export, but export CSS must stay controlled and same-origin
- `next-i18next/pages` remains optional because the repo is still on Pages Router and the current local dictionary path is cheaper while copy scope stays moderate
- `embla-carousel-react` stays a fallback for `types` mobile ergonomics only if native grid + scroll-snap fails QA

### Plugin workflow

- `Chrome`: live local-app QA on the 6 primary routes across the viewport matrix
- `Figma`: use the current FigJam file as the delivery map and capture stable milestone screens only after responsive + export QA passes
- `Creative Production`: use the house territory board as the art-direction checkpoint, then reopen exploration only if a real visual gap remains after layout QA

Current plugin artifacts:

- Figma FigJam: [MBTI Z Redesign Delivery Map](https://www.figma.com/board/MvriLNNZ9JX4S1rGlnwL8o)
- Figma FigJam diagram in the same board: `MBTI Z Route Task Packets`
- Creative Production: `MBTI Z Style Route`

### Official source registry for this redesign

Use these as the only approved internet references for the current UI/system pass.

| Area | Official source | What it justifies in this repo | Adoption rule |
| --- | --- | --- | --- |
| Motion layout + shared transitions | [motion.dev layout animations](https://motion.dev/motion/layout-animations/) and [LayoutGroup](https://motion.dev/docs/react-layout-group) | answer-card click feedback, tab underlines, compact card reflow, section enter/exit on `quiz`, `dashboard`, and `result` | use the existing `framer-motion` dependency only; do not add GSAP or another animation engine |
| Accessible single-choice answers | [Radix Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group) | the 5-level centered quiz scale must stay keyboard-safe and screen-reader safe | prefer `RadioGroup` over any visual-only toggle pattern for scored answers |
| Dense support primitives | [shadcn/ui Tabs](https://ui.shadcn.com/docs/components/tabs), [Progress](https://ui.shadcn.com/docs/components/progress), [Scroll Area](https://ui.shadcn.com/docs/components/scroll-area), [Tooltip](https://ui.shadcn.com/docs/components/tooltip) | reduce duplicated custom UI in `result`, `dashboard`, and shared support rails | only add/use a primitive when it removes page-local complexity |
| Responsive layout | [Tailwind responsive design](https://tailwindcss.com/docs/responsive-design) and [Tailwind v3.2 container queries](https://tailwindcss.com/blog/tailwindcss-v3-2) | mobile-first route compression, tablet grid tuning, optional card-level responsiveness in dense panels | use current breakpoints first; add `@tailwindcss/container-queries` only if card-level layout still wastes space |
| Image delivery | [Next.js Image for Pages Router](https://nextjs.org/docs/pages/api-reference/components/image) | house scenes, animal portraits, result preview assets, and home hero visuals | keep assets local/static where possible and size them explicitly |
| Typography delivery | [Next.js Font for Pages Router](https://nextjs.org/docs/pages/api-reference/components/font) | future TH/EN font hardening without layout shift | only introduce once the final font stack is locked; wire it from `pages/_app.tsx` |
| PNG export | [html2canvas documentation](https://html2canvas.hertzen.com/documentation), [configuration](https://html2canvas.hertzen.com/configuration), and [FAQ](https://html2canvas.hertzen.com/faq.html) | browser fallback for `1080x1350` artifact export, export-safe CSS rules, and same-origin asset discipline | keep `html2canvas` as fallback; prefer the existing server PNG path first |
| Icon system | [Lucide React guide](https://lucide.dev/guide/packages/lucide-react) | buttons, status chips, metric labels, and utility affordances | use icons for UI actions only, not as replacement fantasy artwork |
| Pages Router i18n fallback | [next-i18next Pages Router API](https://github.com/i18next/next-i18next) | future escalation path if `lib/mbti-z-copy.ts` becomes too large to manage safely | do not add now; typed local dictionaries remain the cheaper path |
| Swipe encyclopedia fallback | [Embla React docs](https://www.embla-carousel.com/docs/v8/get-started/react) | mobile-only swipe rails for `types` or dashboard galleries if native scroll-snap proves weak | optional only; add after native layout QA fails, not before |
| Reduced-motion behavior | [web.dev prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion?hl=en) | keep premium interaction without harming accessibility | disable non-essential motion instead of slowing everything indiscriminately |

---

## 3. Current State Snapshot

### Done

- `MBTIZ-0101` MBTI Z metadata foundation
- `MBTIZ-0102` validation update
- `MBTIZ-0103` movie taste question model
- `MBTIZ-0004` design-system master reset
- `MBTIZ-0201` guest answer/runtime refactor
- `MBTIZ-0202` weighted scoring
- `MBTIZ-0203` result shape expansion
- `MBTIZ-0003` FigJam roadmap generation
- `MBTIZ-0302` reusable house / animal UI components
- `MBTIZ-0303` PNG share card surface
- `MBTIZ-0401` home redesign
- `MBTIZ-0402` quiz redesign
- `MBTIZ-0403` result redesign
- `MBTIZ-0404` dashboard redesign
- `MBTIZ-0405` login/hold redesign
- `MBTIZ-0406` types encyclopedia
- `MBTIZ-0301` shared MBTI Z shell cleanup
- `MBTIZ-0304` support primitive pass
- `MBTIZ-0601` build validation pass
- `MBTIZ-0502` keep-local i18n decision documented
- `MBTIZ-0501` copy foundation and locale cleanup
- `MBTIZ-0602` Chrome QA pass
- `MBTIZ-0603` accessibility review
- `MBTIZ-0607` mobile height compression pass
- `MBTIZ-0604` Figma capture checkpoint
- `MBTIZ-0605` PNG export fidelity QA
- `MBTIZ-0606` territory-board lock for asset prompt consistency
- `MBTIZ-0608` UI completion guard

### In progress

- none for the current UI production-readiness packet

### Pending

- focused asset-poster refinements only; not a blocker for the current route/UI gates

### Latest evidence

- 2026-06-29 remaining-page sweep:
  - active `pages/` user-facing files: `30`
  - audited route paths from the project-wide UI matrix: `30`
  - current production `next start` route sweep: `30` routes / `66` browser samples / `issueCount: 0`
  - named guard: `npm run ui:route-sweep:verify` passes with `30/30` routes, `66/66` samples, and `0` issues
  - named completion guard: `npm run ui:completion` locks the route sweep, reconnect controls compact proof, and closeout docs in one check
  - evidence path: `output/ui-skills-router/2026-06-29/current-route-sweep/audit-report.json`
  - reconnect compact evidence path: `output/ui-skills-router/2026-06-29/reconnect-controls-compact/audit-report.json`
  - completion guard evidence path: `output/ui-skills-router/2026-06-29/ui-completion-verify/ui-completion.json`
  - unreviewed page routes after mapping dynamic examples: `0`
  - long-tail auth/social/admin routes are intentionally represented by `RelaunchState` or `AccountHold`, not by the old product UI
  - stale `In progress` / `Pending` labels in older UI plan docs were synced to the already-proven route evidence
- first fantasy asset layer generated locally: `4` house scenes + `16` type animal posters
- named guard: `npm run assets:verify` passes with `4/4` house scenes, `16/16` animal posters, and `0` failures
- `home`, `types`, `result`, and `dashboard` now share the same asset-backed visual language
- `design-system/mbti-z/MASTER.md` was reset on `2026-06-05` because the previous master was still pointing at an unrelated premium-pink/newsletter-like direction
- Chrome live audit on `2026-06-05` against the current local build at roughly `979px` width returned:
  - `/` -> title localized, but hero headline is still English and total height is still roughly `5929px`
  - `/quiz` -> title localized, body height roughly `3901px`, question-first structure preserved
  - `/dashboard` -> title correct as `Dashboard | MBTI Z`, but the main hero narrative is still English and the route is roughly `3504px`
  - `/login` -> title localized, but the main hold explanation is still English and the route is roughly `2477px`
  - `/types` -> title correct as `16 Types | MBTI Z`, route roughly `2695px`, density now acceptable on the wider surface
- the current planning priority therefore shifted to:
  - TH-first copy cleanup on `home`, `dashboard`, and `login`
  - one more home compression pass
  - mobile/tablet proof on `types` and `quiz`
- after the P0 home/dashboard/login slice on `2026-06-05`, fresh validation now shows:
  - Chrome wide surface after switching locale to `TH`:
    - `/` -> roughly `4023px`
    - `/dashboard` -> roughly `2352px`
    - `/login` -> roughly `1491px`
  - fixed-width Playwright QA at `500px`:
    - `/` -> `5598px`
    - `/dashboard` -> `3103px`
    - `/login` -> `2803px`
    - `/quiz` -> `3950px`
    - `/types` -> `3512px`
- this confirms the current slice did what it was meant to do:
  - `home` dropped materially on both wide and fixed-width surfaces
  - `login` got shorter again after the earlier cleanup
  - `dashboard` gained a tighter top hierarchy without regressing PNG/export surfaces
- Chrome desktop QA passed on:
  - `/`
  - `/login`
  - `/dashboard`
  - `/quiz`
  - `/types`
  - `/result/guest-mq0jug8j-estj`
- Chrome mobile audit at width `430px` showed no horizontal overflow on `/`, `/quiz`, `/login`, and `/types`, but it also showed that the vertical rhythm is still expensive:
  - `/` -> roughly `10086px`
  - `/quiz` -> roughly `4849px`
  - `/login` -> roughly `4171px`
  - `/types` -> roughly `6182px`
- current live home already shows `MBTI Z`, `4 houses`, `Movie Profile`, and `Result Artifact` instead of the old `Nocturne` hero structure
- the new style-route widget in Creative Production should be treated as the current visual checkpoint for layout tone, palette discipline, and what to avoid
- the QA gaps observed on `2026-06-05` have since been closed by the later route matrix, accessibility, export fidelity, reconnect controls, and `npm run ui:completion` evidence listed above
- `POST /api/result-share-image` now returns a real `1080x1350` PNG from the local dev runtime, and the download button falls back to DOM capture only if the server path fails
- `/dashboard` was compacted again on `2026-06-05`: latest artifact stays first, duplicate workspace blocks were removed, and desktop height at `1200x883` dropped to roughly `2468px`
- `/types` was compacted again on `2026-06-05`: dense split cards replaced tall portrait stacks, and desktop height at `1200x883` dropped to roughly `2788px`
- `home`, `login`, `types`, and `quiz` were compacted again on `2026-06-05`:
  - approximate fixed-width QA surface (`500px` runtime) now reads:
    - `/` -> `6037px`
    - `/login` -> `2997px`
    - `/types` -> `3512px`
    - `/quiz` -> `3950px`
  - compared with the earlier same-width-style audit:
    - `/login` improved from roughly `3400px`
    - `/types` improved from roughly `4557px`
    - `/quiz` improved from roughly `4965px`
  - `home` improved only slightly in this historical pass; the later `NEXT-02` and project-wide route sweep evidence are the current source of truth
- route title audit on `2026-06-05` now returns the intended MBTI Z titles on `/`, `/quiz`, `/dashboard`, `/login`, `/types`, and a valid `/result/[id]` happy path
- repo inspection on the same pass confirmed that the visible-language problem has moved from route titles to route content:
  - `lib/mbti-z-copy.ts` still contains the EN narrative blocks that match the live English headlines seen on `home`, `dashboard`, and `login`
  - `pages/index.tsx`, `pages/dashboard.tsx`, and `components/cyber/account-hold.tsx` therefore need one focused locale-handoff proof pass, not another generic copy rewrite
- new FigJam delivery map created for this planning round:
  - `MBTI Z Redesign Delivery Map`
  - https://www.figma.com/board/MvriLNNZ9JX4S1rGlnwL8o
- the `types` + `quiz` density pass on `2026-06-05` now has live proof across both Chrome and fixed-width Playwright:
  - Chrome desktop surface after restarting the local dev server:
    - `/types` -> roughly `2197px`, no horizontal overflow, TH title/hero aligned
    - `/quiz` -> roughly `1275px`, no horizontal overflow, question surface stays centered, answer grid resolves to 5 columns on the wider viewport
  - Playwright fixed-width matrix after the same patch:
    - width `500px`
      - `/types` -> `2982px`
      - `/quiz` -> `2437px`
    - width `768px`
      - `/types` -> `2303px`
      - `/quiz` -> `1508px`
    - width `1024px`
      - `/types` -> `1961px`
      - `/quiz` -> `2052px`
  - compared with the prior `500px` proof:
    - `/types` improved from roughly `3512px` to `2982px`
    - `/quiz` improved from roughly `3950px` to `2437px`
  - the quiz answer deck now resolves to a 2-column stack at `500px` and a 5-column scale again once the wider breakpoint is reached, which fixes the earlier all-vertical mobile waste without losing the centered answer-first layout
- Chrome route audit refresh on `2026-06-05` at roughly `979px` width now reads:
  - `/` -> roughly `4930px`, no horizontal overflow, hero headline is TH-first and now describes `4 Houses`, `สัตว์ประจำ Type`, and `Movie Profile`
  - `/quiz` -> roughly `1275px`, no horizontal overflow, question-first layout remains compact
  - `/login` -> roughly `2224px`, no horizontal overflow, hold page headline is now TH-first
  - `/types` -> roughly `2197px`, no horizontal overflow, atlas route remains materially shorter than earlier passes
  - `/dashboard` -> roughly `3195px`, no horizontal overflow, H1 is TH-first and the route still keeps `Artifact` / `Result` support language
  - `/result/guest-mpzn4gtn-estj` -> roughly `5786px`, no horizontal overflow, `Movie Profile` is present and the primary action list includes `ดาวน์โหลด PNG`
- interpretation from the same audit:
  - this historical audit moved attention away from quiz/types structure
  - later slices closed the result/export proof, home compression, and project-wide route matrix
  - current work should keep the locked route/UI gates green rather than opening another decorative pass

### Historical live deltas from this planning pass

This table is retained for traceability from the early `2026-06-05` planning pass. It is not the current task board; the current closeout state is the `Done` list, `MBTIZ-0608`, `NEXT-01` through `NEXT-07`, and `npm run ui:completion`.

| Surface | Historical finding | Current closeout |
| --- | --- | --- |
| `/` home | route title and TH-first hero aligned, and compression reduced fixed-width height while keeping CTA + artifact promise in the first viewport | closed by `NEXT-02`, current route sweep, and `npm run ui:completion` |
| `/quiz` | title was correct, question remained central, and the answer deck used the smaller mobile stack | closed by `NEXT-04`, route matrix proof, and `npm run ui:completion` |
| `/dashboard` | density was acceptable, PNG export stayed wired, TH hero copy aligned, and responsive proof kept the latest artifact early on mobile | closed by `NEXT-05`, reconnect compact proof, and `npm run ui:completion` |
| `/login` | hold page was TH-first and materially shorter after account-hold cleanup | closed by `MBTIZ-0607`, reconnect compact proof, and `npm run ui:completion` |
| `/types` | route title was correct, card height dropped, and responsive proof held on `500`, `768`, and `1024` | closed by `NEXT-03`, `MBTIZ-0406`, route matrix proof, and `npm run ui:completion` |
| `/result/[id]` | happy-path title was correct and result/export proof was the next focus | closed by `NEXT-05`, `NEXT-06`, route matrix proof, and `npm run ui:completion` |

---

## 4. Task Board

| ID | Status | Files | Dependency | Exit condition |
| --- | --- | --- | --- | --- |
| `MBTIZ-0001` | Done | `design-system/mbti-z/*` | none | master rules + page overrides exist |
| `MBTIZ-0002` | Done | `docs/mbti-z-redesign-plan.md`, `docs/mbti-z-execution-board.md` | none | plan and board reflect repo truth |
| `MBTIZ-0004` | Done | `design-system/mbti-z/MASTER.md` | none | master direction now matches MBTI Z fantasy-dark product truth |
| `MBTIZ-0101` | Done | `data/mbti/mbti-z-data.mjs` | none | 16 types + 4 houses + animals + movie data ready |
| `MBTIZ-0102` | Done | `scripts/validate-mbti-data.mjs` | `0101` | `npm run data:validate` passes |
| `MBTIZ-0103` | Done | `data/mbti/mbti-z-data.mjs` | none | movie prompts and profiles available |
| `MBTIZ-0201` | Done | `lib/mbti-guest.ts`, `lib/reconnect-bundle.ts` | `0101-0103` | runtime handles new data without crashing |
| `MBTIZ-0202` | Done | `lib/mbti-guest.ts` | `0201` | weighted MBTI + movie scoring works |
| `MBTIZ-0203` | Done | `lib/mbti-guest.ts`, `lib/assessment-runtime-types.ts` | `0201` | result carries export-ready fields |
| `MBTIZ-0301` | Done | `components/mbti-z/*`, `components/cyber/motion/*`, `styles/globals.css`, `lib/reconnect-bundle.ts` | `0001` | shell looks like MBTI Z not old Nocturne; source-level motion helper names and handoff filename now use MBTI Z naming |
| `MBTIZ-0302` | Done | `components/mbti-z/house-badge.tsx`, `animal-portrait.tsx`, `type-card.tsx` | `0301` | reusable visuals shared across pages |
| `MBTIZ-0303` | Done | `components/mbti-z/result-share-card.tsx`, `download-result-button.tsx` | `0203` | download PNG works at `1080x1350` |
| `MBTIZ-0304` | Done | `components/ui/tabs.tsx`, `components/ui/scroll-area.tsx`, `components/ui/tooltip.tsx`, `pages/types.tsx`, `pages/result/[id].tsx`, `pages/dashboard.tsx` | `0301` | `Tabs` and `ScrollArea` are adopted where they reduce dense page complexity; `Progress` is intentionally not added because the quiz uses a route-specific animated progress rail; `Tooltip` stays available but unused until an icon-only control needs it |
| `MBTIZ-0401` | Done | `components/marketing/premium-home.tsx`, `pages/index.tsx` | `0301`, `0302`, `0501` | no `Nocturne`, no `48 prompts`, no INTJ-only preview |
| `MBTIZ-0402` | Done | `pages/quiz.tsx`, `components/mbti-z/quiz/*` | `0201`, `0202`, `0301` | centered answer UI + 5-level selection + motion feedback |
| `MBTIZ-0403` | Done | `pages/result/[id].tsx`, `components/mbti-z/result/*` | `0203`, `0302`, `0303` | result hierarchy complete + PNG entry visible |
| `MBTIZ-0404` | Done | `pages/dashboard.tsx`, `components/mbti-z/dashboard/*` | `0203`, `0302` | dense layout with latest artifact first |
| `MBTIZ-0405` | Done | `pages/login.tsx`, `components/cyber/account-hold.tsx` or `components/mbti-z/account-hold.tsx` | `0301`, `0501` | hold page is clean, structured, responsive |
| `MBTIZ-0406` | Done | `pages/types.tsx`, `components/mbti-z/type-card.tsx`, `components/mbti-z/types/*` | `0101`, `0302` | 16 types, 4 houses, and asset cards are stable across desktop/mobile/tablet proof |
| `MBTIZ-0501` | Done | `lib/mbti-z-copy.ts`, `pages/quiz.tsx`, `pages/result/[id].tsx`, `components/mbti-z/quiz/answer-deck.tsx`, `components/cyber/relaunch-state.tsx`, `components/cyber/account-hold.tsx`, `components/marketing/premium-home.tsx`, `output/ui-skills-router/2026-06-26/mbtiz-0501-*/*` | none | TH/EN page UI copy is centralized and typed; quiz labels, relaunch scenarios, home preview summary, hold bundle status, and result account tab copy are now shared; relaunch proof passes 6 routes x 2 viewports with `issueCount: 0` |
| `MBTIZ-0502` | Done | `lib/mbti-z-copy.ts`, docs only | `0501` | explicit keep-local decision documented; `next-i18next` deferred |
| `MBTIZ-0601` | Done | scripts only | all UI milestones | `data:validate`, `typecheck`, `lint`, `build` |
| `MBTIZ-0602` | Done | `output/ui-skills-router/2026-06-25/*` | `0601` | 30-route matrix clean and 6 primary routes pass the 4 required viewport gate |
| `MBTIZ-0603` | Done | `pages/_document.tsx`, `styles/globals.css`, `output/ui-skills-router/2026-06-26/accessibility-audit/*` | `0402`, `0403`, `0501` | keyboard focus, document language, alt/name checks, and reduced-motion proof pass with `issues: 0` |
| `MBTIZ-0604` | Done | Figma capture notes, `output/ui-skills-router/2026-06-26/figma-checkpoint/*`, `output/ui-skills-router/2026-06-26/figma-captures/*` | `0602`, `0605` | FigJam checkpoint is refreshed and the full 6-route x 2-viewport milestone capture set is placed in the board; section polish is deferred by Figma MCP quota |
| `MBTIZ-0605` | Done | `components/mbti-z/download-result-button.tsx`, `output/ui-skills-router/2026-06-26/export-fidelity/*` | `0303`, `0602` | server PNG, Chrome fallback, and WebKit/Safari-engine fallback proof pass at `1080x1350` |
| `MBTIZ-0606` | Done | Creative Production board notes, `public/mbti-z/houses/*`, `public/mbti-z/animals/*`, `output/ui-skills-router/2026-06-26/asset-board/*` | `0302`, `0602` | current style route is accepted as the prompt/source territory; remaining image work is a focused refinement backlog, not open-ended exploration |
| `MBTIZ-0607` | Done | `components/cyber/account-hold.tsx`, `lib/mbti-z-copy.ts`, `/`, `/login`, `/types`, `/quiz` route notes, `output/ui-skills-router/2026-06-26/mbtiz-0607-login-compression/*` | `0602` | mobile vertical budget is reduced without losing route meaning; `/login` mobile height dropped `3645 -> 2723` and guard proof for `/types` + `/quiz` passes with `issues: 0` |
| `MBTIZ-0608` | Done | `scripts/verify-ui-completion.mjs`, `package.json`, `output/ui-skills-router/2026-06-29/current-route-sweep/*`, `output/ui-skills-router/2026-06-29/reconnect-controls-compact/*` | `0602`, `0607` | `npm run ui:completion` passes and locks full route evidence plus reconnect compact proof into the broader `npm run verify` gate |

---

## 4A. Route-First Task Packets

| Packet | Routes | Primary files | Goal | Validation |
| --- | --- | --- | --- | --- |
| `PKT-01` | `/`, `/login` | `pages/index.tsx`, `components/marketing/premium-home.tsx`, `pages/login.tsx`, `components/cyber/account-hold.tsx`, `lib/mbti-z-copy.ts` | lock home/login messaging, head metadata, and primary CTA hierarchy | manual TH/EN pass + Chrome desktop/mobile check |
| `PKT-02` | `/quiz` | `pages/quiz.tsx`, `components/mbti-z/quiz/*`, `components/ui/radio-group.tsx` if added, `lib/mbti-z-copy.ts` | finish centered answer affordance, title copy, motion clarity, and storage labels | keyboard path, reduced-motion path, 5-level answer interaction QA |
| `PKT-03` | `/dashboard`, `/result/[id]` | `pages/dashboard.tsx`, `pages/result/[id].tsx`, `components/mbti-z/result-share-card.tsx`, `components/mbti-z/download-result-button.tsx`, `lib/mbti-z-copy.ts` | make result/dashboard the most polished surfaces and stabilize export hierarchy | PNG export pass + Chrome route check |
| `PKT-04` | `/types` | `pages/types.tsx`, `components/mbti-z/type-card.tsx`, `components/mbti-z/house-badge.tsx`, `components/mbti-z/animal-portrait.tsx` | finish encyclopedia density and mobile/tablet behavior | responsive matrix on `375`, `768`, `1024`, `1440` |
| `PKT-05` | shared shell | `styles/globals.css`, `components/ui/*`, `components/cyber/motion/*`, `lib/mbti-z-copy.ts` | remove spacing inconsistency and shared copy drift without adding duplicate patterns | visual diff + lint/typecheck/build |

## 4AA. Route-to-library application map

This is the concrete implementation sequence to keep the redesign disciplined.

| Packet | Library / primitive | Apply to | Why it belongs there | Hard stop |
| --- | --- | --- | --- | --- |
| `PKT-01` | `next/image`, existing Tailwind shell, optional `next/font` later | `home`, `login` | these routes win by hierarchy, copy, and asset framing, not by adding more interaction chrome | do not add a slider, carousel, or new animation system here |
| `PKT-02` | Radix `RadioGroup` + Motion layout/tap states | `quiz` | this is the only route where choice affordance and center-of-gravity matter more than density | do not replace semantic answers with generic cards that break keyboard navigation |
| `PKT-03` | `Tabs`, `ScrollArea`, `Progress`, existing export stack (`@vercel/og` + `html2canvas` fallback) | `dashboard`, `result` | these routes contain the most information and need structure more than decoration | do not add a charting library for simple dimension bars |
| `PKT-04` | `next/image`, native scroll-snap first, optional Embla fallback | `types` | this route is an encyclopedia, so browseability and rhythm matter more than spectacle | do not introduce Embla unless native mobile browsing remains awkward after QA |
| `PKT-05` | shared spacing tokens, optional container-query plugin if proven necessary | shell-wide components and dense cards | this pass exists to remove inconsistency and wasted space across the whole app | do not start a second visual redesign during this packet |

---

## 4B. Route Budget Gates

| Route | Observed mobile height | Immediate gate | Success signal |
| --- | --- | --- | --- |
| `/` | `~10086px` | remove repeated proof/explainer bands and tighten hero stack | first viewport sells the quiz + result promise cleanly |
| `/quiz` | `~4849px` | keep question-first center and trim support chrome | answer deck remains the visual center on phone |
| `/login` | `~4171px` | merge recovery/help sections | hold page feels deliberate, not fragmented |
| `/types` | `~6182px` | reduce card repetition and tighten section rhythm | encyclopedia stays browsable on phone and tablet |

These are direction gates, not hard failure thresholds.
The main point is to prevent the next pass from adding more vertical weight while "improving" visuals.

## 4C. Immediate Next Task Slice

This is the recommended next execution packet based on the current repo state, the latest Chrome audit, and the internet-backed library decisions above.

| Task | Priority | Files | Why now | Exit condition |
| --- | --- | --- | --- | --- |
| `NEXT-01` TH-first hero copy sweep | `Done` | `lib/mbti-z-copy.ts`, `components/marketing/premium-home.tsx`, `pages/dashboard.tsx`, `components/cyber/account-hold.tsx` | the current slice already closed the visible English hero narratives on the audited TH routes | primary hero/title blocks on `home`, `dashboard`, and `login` now align with TH mode |
| `NEXT-02` Home compression pass | `Done` | `components/marketing/premium-home.tsx`, `pages/index.tsx` | closed with production Chrome proof after replacing card-heavy repeated proof bands with compact rows/chips | body height dropped at all four viewports without weakening the first-viewport CTA or artifact promise |
| `NEXT-03` Types tablet/mobile finish | `Done` | `pages/types.tsx`, `components/mbti-z/type-card.tsx` | this slice is now closed with viewport proof on `500`, `768`, and `1024` | type atlas no longer wastes mobile/tablet height the way it did in the previous pass |
| `NEXT-04` Quiz support-chrome trim | `Done` | `pages/quiz.tsx`, `components/mbti-z/quiz/answer-deck.tsx` | the answer surface is now lighter and the mobile stack is materially shorter | answer deck stays central while support framing becomes secondary on smaller viewports |
| `NEXT-05` Dashboard/result responsive proof | `Done` | `pages/dashboard.tsx`, `pages/result/[id].tsx`, `components/mbti-z/result-share-card.tsx` | closed with production Chrome proof across `/dashboard` and `/result/guest-mqtpomkf-estj` | 8 viewport samples passed with `issues: 0`; latest artifact, result story, PNG CTA, and hidden export targets remain clear |
| `NEXT-06` Export fidelity QA | `Done` | `components/mbti-z/download-result-button.tsx`, `pages/api/result-share-image.tsx` | export is now proven across server, Chrome, and WebKit/Safari-engine paths | server API, Chrome server-button download, Chrome forced fallback, WebKit server-button download, and WebKit forced fallback all produce valid `1080x1350` PNGs |
| `NEXT-07` Figma checkpoint refresh | `Done` | docs only + FigJam artifact | closed after responsive, home compression, and export proof were stable | existing FigJam delivery map has the historical `MBTI Z UI QA Checkpoint 2026-06-26`; route/asset closure is now backed by the 2026-06-29 sweep and asset guards |

### Current packet recommendation

If work starts from this board right now, execute in this order:

1. Keep current route/UI gates locked with `npm run ui:completion` unless a future regression appears in browser proof.
2. Keep animal-poster recognizability as a focused asset-refinement backlog, not a blocker for current layout/export QA.
3. Start cloud/auth reconnect work only after env/runtime isolation is ready, without breaking guest-local routes.

---

## 5. Detailed Sprint Breakdown

This section is retained as execution history. Current UI completion is proven by the `Done` board above, `NEXT-01` through `NEXT-07`, the 2026-06-29 route sweep, reconnect controls compact proof, and `npm run ui:completion`.

### Sprint 1 — Copy and shell truth

Priority: `P0`

Tasks:

1. keep `MBTIZ-0301`, `MBTIZ-0304`, `MBTIZ-0501`, and `MBTIZ-0502` locked unless new UI surfaces introduce shell/copy drift
2. preserve the current guest-local route proof before reconnecting cloud/auth surfaces
3. keep future primitive adoption evidence-led: add components only when they remove duplicated page complexity

Files:

- `lib/mbti-z-copy.ts`
- `pages/*.tsx`
- `components/cyber/*`
- `components/mbti-z/*`
- `styles/globals.css`

Exit:

- primary routes have no meaningful stray copy
- the product keeps the English whitelist only where intended

### Sprint 2 — Support primitives only where earned

Priority: `P0`

Tasks:

1. evaluate `MBTIZ-0304` page by page
2. add `Progress` only if score rails or completion bars are still duplicated
3. add `Tabs` only if house/type navigation becomes cleaner than stacked sections
4. add `ScrollArea` only if dense history or encyclopedia sections break on tablet
5. add `Tooltip` only for icon-only controls or terse explanations

Rules:

- no primitive without removing local complexity
- no new dependency that overlaps with Motion or Tailwind

### Sprint 3 — `/types` mobile/tablet polish

Priority: `P0`

Tasks:

1. keep `MBTIZ-0406` locked on the existing mobile/tablet proof
2. preserve hero, house overview cards, and type grid wrapping in future edits
3. use layout and card behavior first if the route changes later
4. keep `embla-carousel-react` deferred unless a new browser proof shows native scroll-snap is insufficient

Exit:

- `types` works as a true encyclopedia on mobile/tablet, not only desktop; this is currently closed by route matrix evidence

### Sprint 4 — Chrome QA and accessibility

Priority: `P0`

Tasks:

1. `MBTIZ-0602` completed on `375x812`, `768x1024`, `1024x768`, and `1440x900`
2. `/`, `/quiz`, `/result/[id]`, `/dashboard`, `/login`, and `/types` pass the automated gate with `issues: 0`
3. `MBTIZ-0603` is finished with manual keyboard, reduced-motion, and alt/name coverage evidence
4. apply only the fixes proven by observed browser issues

Why here:

- desktop proof already exists
- smaller viewport and accessibility risk is currently covered by the closed route matrix and accessibility evidence

### Sprint 5 — Export fidelity and Figma checkpoint

Priority: `P0`

Tasks:

1. keep `MBTIZ-0605` locked with the current server, Chrome, and WebKit/Safari-engine PNG proof
2. keep `MBTIZ-0604` locked with the existing FigJam checkpoint and route/asset closure evidence

Why last:

- Figma captures are only valuable after the browser surface is stable
- export QA should validate the real share artifact, not a pre-polish snapshot

### Sprint 6 — Creative-production contingency

Priority: `P1`

Tasks:

1. use `Creative Production` mood-board exploration only if the current 4-house scenes or 16-animal assets still feel generic after layout QA
2. turn that board into an asset-refinement brief, not open-ended image generation

Trigger condition:

- visual direction remains the problem after layout, copy, and export are already stable

---

## 6. File-Level Work Map

### Highest priority files

- `components/marketing/premium-home.tsx`
- `pages/index.tsx`
- `components/cyber/account-hold.tsx`
- `pages/login.tsx`
- `pages/quiz.tsx`
- `pages/result/[id].tsx`
- `pages/dashboard.tsx`
- `pages/types.tsx`

### Supporting files

- `data/mbti/mbti-z-data.mjs`
- `lib/mbti-guest.ts`
- `lib/reconnect-bundle.ts`
- `styles/globals.css`

### Files likely to be added next

- `lib/mbti-z-copy.ts`
- `components/mbti-z/quiz/*`
- `components/mbti-z/result/*`
- `components/mbti-z/dashboard/*`
- `components/mbti-z/result-share-card.tsx`
- `components/mbti-z/download-result-button.tsx`

---

## 7. Acceptance Gates

ก่อนปิด redesign รอบนี้ ต้องผ่าน gate ต่อไปนี้:

1. ไม่มี `Nocturne` หรือ `48 prompts` ค้างบน primary routes ที่ผู้ใช้เจอจริง
2. quiz ตอบตรงกลางและมี motion feedback ชัด
3. result export PNG ได้จริงใน browser
4. dashboard ไม่มี panel ว่างที่กินพื้นที่ฟรี
5. login/hold อ่านแล้วเข้าใจใน 5 วินาทีว่าระบบใดพร้อม/ไม่พร้อม
6. TH/EN toggle ทำงานครบในหน้าหลัก
7. Chrome QA ผ่านบน 4 viewport
8. `npm run data:validate`, `npm run typecheck`, `npm run lint`, `npm run build`
