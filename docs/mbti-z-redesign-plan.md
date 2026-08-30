# MBTI Z Redesign Plan

เอกสารนี้คือ implementation plan สำหรับเปลี่ยน `MBTI Nocturne` เป็น `MBTI Z` ตาม requirement ล่าสุด:

- premium cinematic psychology lab
- Thai-first Gen Z product
- fantasy animal system 16 MBTI types
- 4 color houses
- movie taste analysis
- richer quiz interaction
- responsive home, quiz, result, dashboard, login/hold, and type encyclopedia
- result artifact download as PNG size `1080x1350`

สถานะเอกสาร: active execution plan, updated `2026-06-05`

สถานะปัจจุบันใน repo:

- data foundation สำหรับ `MBTI Z`, 4 houses, 16 animals, และ movie module ถูกเพิ่มแล้ว
- guest runtime/scoring ถูกขยายให้รองรับ weighted answers, `house`, `animal`, `movieProfile`, และ export-ready result shape แล้ว
- `/`, `/quiz`, `/result/[id]`, `/dashboard`, `/login`, และ `/types` ถูกย้ายมาอยู่บน visual direction ของ `MBTI Z` แล้ว
- งานที่ยังค้างหลัก ๆ ไม่ใช่ page skeleton แล้ว แต่เป็น `types` mobile/tablet polish, copy/i18n cleanup, support primitives บางจุด, cross-viewport QA, accessibility pass, PNG export fidelity, และ Figma capture milestone

---

## 1. Current Repo Baseline

ตรวจจาก repo จริงที่ `/Users/time/Desktop/Projects/MBTI_PROJECT`:

- Framework: `Next.js 15.3.1` with Pages Router
- Package manager: `npm` because `package-lock.json` exists
- Styling: `Tailwind CSS v3`, global cyber theme in `styles/globals.css`
- UI base: local `components/ui/*`, `shadcn`, `Radix UI`, `lucide-react`
- Motion: `framer-motion` already installed
- PNG export candidate: `html2canvas` already installed
- Persistence: guest runtime currently uses browser `localStorage`
- Canonical MBTI data: `data/mbti/mbti-z-data.mjs`
- Guest scoring/runtime: `lib/mbti-guest.ts`, `lib/assessment-runtime*`
- Existing primary flow: `/ -> /quiz -> /result/[id] -> /dashboard`
- Login is currently an intentional account hold page via `components/cyber/account-hold.tsx`

Important constraint:

- Current repo truth on `2026-06-05` is already beyond the old 2-option model. Validation, runtime, and UI now support the richer `MBTI Z` structure, so future planning must not assume the old `Nocturne` schema is still the active baseline.
- Avoid destructive database migration in the first redesign pass. Prefer canonical data + guest runtime first, then adapt Prisma/cloud flow later.

---

## 2. Product Direction

### Brand

`MBTI Z`

### Positioning

`MBTI Z` is a premium fantasy-personality lab for Thai Gen Z users. It combines MBTI-style self-discovery, house identity, fantasy animal symbolism, and movie taste profiling into one cinematic artifact.

### Default Language

- Default: `TH`
- Required support: `TH/EN`
- Terms allowed to stay English: `Dashboard`, `Artifact`, `Result`, `Movie Profile`

### Primary User Flow

1. User lands on home page.
2. User starts quiz without login.
3. User answers MBTI scale questions plus movie taste module.
4. Result page reveals type, house, animal, movie profile, scores, and Thai summary.
5. User downloads share PNG `1080x1350`.
6. Dashboard keeps latest result and history locally.
7. Login page remains a clean account/cloud hold page.

---

## 3. House System

Use the 4 classic temperament groups, mapped to house color and visual energy:

| House | Types | Color Role | Personality Frame | Visual Direction |
| --- | --- | --- | --- | --- |
| Purple House | `INTJ`, `INTP`, `ENTJ`, `ENTP` | violet, obsidian, arcane blue | strategy, systems, invention | arcane geometry, celestial metal, sharp silhouettes |
| Green House | `INFJ`, `INFP`, `ENFJ`, `ENFP` | emerald, mint, aurora | empathy, meaning, imagination | forest light, luminous flora, soft magical aura |
| Yellow House | `ISTJ`, `ISFJ`, `ESTJ`, `ESFJ` | gold, amber, ivory | stability, duty, order | heraldic emblems, warm lantern light, structured armor |
| Blue House | `ISTP`, `ISFP`, `ESTP`, `ESFP` | cyan, sapphire, electric blue | action, craft, instinct | kinetic light trails, crystal water, dynamic motion |

---

## 4. Fantasy Animal Map

These names are product copy starters. Final artwork can use Thai display names while keeping English animal labels for export.

| Type | House | Animal | Thai Name Direction | Personality Hook |
| --- | --- | --- | --- | --- |
| INTJ | Purple | Obsidian Raven | อีกาออบซิเดียน | silent strategy, future pattern, hidden plan |
| INTP | Purple | Arcane Owl | นกฮูกอาร์เคน | concept depth, puzzle mind, quiet curiosity |
| ENTJ | Purple | Crowned Lion | สิงโตมงกุฎ | command, execution, strategic authority |
| ENTP | Purple | Storm Fox | จิ้งจอกพายุ | debate, invention, chaotic spark |
| INFJ | Green | Moon Deer | กวางจันทร์ | meaning, intuition, protective vision |
| INFP | Green | Dream Swan | หงส์ความฝัน | inner world, values, poetic sensitivity |
| ENFJ | Green | Solar Phoenix | ฟีนิกซ์สุริยะ | guidance, people growth, inspiring warmth |
| ENFP | Green | Aurora Rabbit | กระต่ายออโรรา | possibility, play, emotional color |
| ISTJ | Yellow | Iron Wolf | หมาป่าเหล็ก | duty, memory, dependable structure |
| ISFJ | Yellow | Guardian Bear | หมีผู้พิทักษ์ | care, steadiness, quiet protection |
| ESTJ | Yellow | Golden Eagle | อินทรีทอง | leadership, order, direct action |
| ESFJ | Yellow | Hearth Stag | กวางเขาแสง | harmony, community, social warmth |
| ISTP | Blue | Steel Panther | เสือดำเหล็ก | precision, tools, calm reaction |
| ISFP | Blue | Crystal Lynx | ลิงซ์คริสตัล | aesthetic instinct, private artistry |
| ESTP | Blue | Thunder Tiger | เสือพายุ | risk, speed, tactical presence |
| ESFP | Blue | Neon Peacock | นกยูงนีออน | performance, energy, sensory joy |

Asset rule:

- All animal images must be fantasy, premium, non-cartoony, and color-linked to their house.
- Avoid generic AI mascot style.
- Each image must work in both UI cards and `1080x1350` PNG export.

---

## 5. Internet Research Summary

Only use libraries that fit the current stack and reduce implementation risk.

### Keep and Reuse

| Area | Library / Tool | Source | Decision |
| --- | --- | --- | --- |
| Layout and micro-animation | `framer-motion` / Motion | https://motion.dev/docs/react-layout-animations | Keep. Existing dependency. Use `layout`, `layoutId`, `AnimatePresence`, and reduced-motion support for answer selection, card reveals, and dashboard reflow. |
| Accessible controls | Radix primitives via current UI layer | https://www.radix-ui.com/primitives/docs/components/radio-group | Keep. Use `RadioGroup` for the 5-level quiz scale so selection remains single-choice, keyboard-friendly, and screen-reader safe. |
| 5-level quiz control | Radix `RadioGroup` or `ToggleGroup` | https://www.radix-ui.com/primitives/docs/components/radio-group and https://www.radix-ui.com/primitives/docs/components/toggle-group | Prefer `RadioGroup` for single-answer scale semantics. `ToggleGroup` can be used for movie taste tags if visual toggle behavior is stronger. |
| Support primitives for dense UI | `shadcn/ui` wrappers around Radix `Tabs`, `Progress`, `ScrollArea`, `Tooltip` | https://ui.shadcn.com/docs/components/tabs , https://ui.shadcn.com/docs/components/progress , https://ui.shadcn.com/docs/components/scroll-area , https://ui.shadcn.com/docs/components/tooltip | Use on demand. The repo already has local `components/ui/*`, so house switches, dimension bars, history rails, and icon-only explanations should come from the same UI system instead of page-local one-offs. |
| Responsive layout | Tailwind CSS responsive and container queries | https://tailwindcss.com/docs/responsive-design | Keep. Use mobile-first breakpoints, `max-*` ranges, and `@container` for cards that resize based on panel width. |
| Image rendering | `next/image` | https://nextjs.org/docs/pages/api-reference/components/image | Use for fantasy animal assets and hero imagery. It provides image optimization props, `sizes`, `fill`, and static imports. |
| Font delivery | `next/font` | https://nextjs.org/docs/pages/building-your-application/optimizing/fonts | Use if the font stack changes. It keeps Thai/English fonts self-hosted, reduces layout shift, and is safer than scattering `@import` statements once typography is locked. |
| PNG export | `html2canvas` | https://html2canvas.hertzen.com/documentation and https://html2canvas.hertzen.com/configuration | Use first because it is already installed. Build export component with controlled CSS and same-origin assets because DOM-to-canvas fidelity depends on supported CSS and same-origin image rules. |
| Icons | `lucide-react` | https://lucide.dev/guide/react | Keep. Use only for UI actions and state icons, not as fantasy animal substitutes. |
| Local persistence | `localStorage`, possibly `zustand/persist` later | https://zustand.docs.pmnd.rs/reference/middlewares/persist | Keep current local runtime first. Consider Zustand persist only if state logic becomes hard to reason about. |

### Consider Adding Later

| Candidate | Source | When to Add | Reason |
| --- | --- | --- | --- |
| `@tailwindcss/container-queries` | https://tailwindcss.com/blog/tailwindcss-v3-2 | If current Tailwind `3.3.3` shell needs card-level responsiveness beyond viewport breakpoints | Repo is still on Tailwind v3, so container queries are not built into the framework yet. Use the first-party plugin only if the dashboard/result cards cannot be stabilized with current breakpoints alone. |
| `next-i18next` | https://github.com/i18next/next-i18next | If copy grows beyond page-level local dictionaries | Official docs still preserve the Pages Router API under `next-i18next/pages`, which matches this repo architecture. |
| `embla-carousel-react` | https://www.embla-carousel.com/docs/v8/get-started/react | If type encyclopedia needs mobile swipe carousel | Lightweight carousel with full markup control. Avoid unless native scroll snap is not enough. |
| `modern-screenshot` or `html-to-image` | npm/GitHub docs | If `html2canvas` fails fidelity on gradients/images | Keep as fallback only because adding another DOM-to-image library increases test surface. |
| dotLottie/Rive | https://docs.lottiefiles.com/en and Rive runtime docs | If animal assets later require designer-authored interactive animation | Not needed for MVP. Static PNG/WebP + Motion wrappers are safer. |

### Library Decisions Locked For This Repo

Given the current codebase and dependency graph:

1. Do not add a second animation engine.
2. Do not add a heavy design framework on top of Tailwind.
3. Prefer `RadioGroup + Motion + Tailwind` before introducing new quiz UI packages.
4. Prefer local static assets + `next/image` before remote fantasy images in the runtime UI.
5. Keep `html2canvas` as the first export path and only add a fallback library if real export QA fails.

### Layout and Interaction Decisions Locked From Research

1. Use layered near-black surfaces instead of flat pure black on every panel. The current product direction fits a dark cinema shell better than a terminal-only `#000000` treatment, and it leaves room for the four house accents to read clearly.
2. Keep micro-interactions in the `150-300ms` band, use `transform` and `opacity` as the main animated properties, and avoid decorative infinite loops. Motion docs plus the UX guidance both support this as the lowest-risk path for a premium feel without hurting responsiveness.
3. Use accessible primitives before custom visual tricks:
   - `RadioGroup` for quiz answer selection
   - `Tabs` for house or section switches
   - `Progress` for completion and dimension bars
   - `ScrollArea` for dense history/reconnect rails
   - `Tooltip` only for icon-only actions and terse score explanations
4. Keep Thai-readable sans text for body copy and controls. If an editorial display font is introduced, use it only for short brand or section headings and never for long Thai body paragraphs.
5. Drive dashboard density with layout first, not more libraries: target a `12-column` desktop grid, `6-column` tablet grid, and `1-column` mobile stack. Add container queries only if the current breakpoint grid still wastes space after the panel hierarchy is fixed.

### 2026-06-05 Refresh From Official Docs

- Motion docs still cover the interaction surface we need with `layout`, `layoutId`, `AnimatePresence`, `whileTap`, and `useReducedMotion`, so there is still no justification for a second animation engine.
- Next.js image docs still support `priority` in the current repo version (`15.3.1`). When this repo eventually moves to Next `16`, the same above-the-fold intent should migrate to `preload`.
- `html2canvas` docs continue to confirm the same operational constraints: control `scale`, `windowWidth`, and `windowHeight`, keep export assets same-origin, and avoid relying on unsupported CSS as if it were pixel-perfect screenshot tooling.
- Embla docs remain a valid fallback for mobile swipe rails and its accessibility plugin can be paired with reduced-motion breakpoints, but it should stay optional until native grid plus scroll-snap fails the `/types` or dashboard UX.
- `next-i18next` still preserves the Pages Router API under `next-i18next/pages`, so the decision remains: finish typed local dictionaries first, and only adopt it if page copy grows past what the current architecture can manage safely.
- `next/font` pages-router docs still support moving optimized font setup into `pages/_app.tsx`, so any typography upgrade should stay self-hosted and not reintroduce network font jitter.
- reduced-motion guidance from Motion and `web.dev` still aligns with the product goal here: keep animation meaningful, respect `prefers-reduced-motion`, and remove non-essential motion instead of merely slowing everything down.

### 2026-06-05 Plugin-Assisted Audit

This planning pass used repo inspection plus three live plugin surfaces:

| Plugin / surface | Output | Planning impact |
| --- | --- | --- |
| `Chrome` | live route audit on `/`, `/quiz`, `/dashboard`, `/login`, and `/types` on the current local build | confirmed that the remaining risk is not brand direction, but TH-first copy leaks, route height, and responsive density |
| `Figma` | new FigJam delivery map: [MBTI Z Redesign Delivery Map](https://www.figma.com/board/MvriLNNZ9JX4S1rGlnwL8o) | locked execution order for route packets, export QA, and the final capture checkpoint |
| `Creative Production` | `MBTI Z Style Route` widget locked to cinematic dark + fantasy editorial + 4-house palette + Thai-first typography | locked the surface tone so future page work does not drift back into generic cyber or one-hue layouts |

### Current Live Route Audit On `2026-06-05`

Chrome inspection on the current local build at roughly `979px` width reported:

| Route | Title | Visible headline signal | Approx. body height | Planning implication |
| --- | --- | --- | --- | --- |
| `/` | `MBTI Z | ห้องทดลองบุคลิกแฟนตาซี` | headline is still English | `5929px` | home keeps the right brand shell, but TH-first hero copy and vertical compression are still the biggest remaining route risks |
| `/quiz` | `แบบทดสอบ MBTI Z | MBTI Z` | question-first flow, no static hero H1 | `3901px` | quiz structure is closer to correct; the next pass is mobile proof and support-chrome trimming, not a UI rewrite |
| `/dashboard` | `Dashboard | MBTI Z` | headline is still English | `3504px` | dashboard density improved, but the top narrative block still needs TH-first copy and tighter hierarchy |
| `/login` | `พัก Account ชั่วคราว | MBTI Z` | headline is still English | `2477px` | login/hold is shorter and clearer, but the main explanation is still not aligned with TH default |
| `/types` | `16 Types | MBTI Z` | `MBTI Z Type Atlas` | `2695px` | type encyclopedia is much denser now; the remaining work is tablet/mobile polish and language consistency |

Interpretation from the current live audit:

1. the next execution slice should start with TH-first copy cleanup on `home`, `dashboard`, and `login`
2. `home` still carries the heaviest layout budget and should be compressed before adding any new decorative section
3. `types` is no longer the most urgent structural route, but it still needs final tablet/mobile proof
4. `quiz` should keep its current center-of-gravity and avoid drifting into another redesign cycle
5. `dashboard` and `result` should be treated as polish surfaces after copy and responsive proof are locked

### Route Compression Budgets From Live Mobile Audit

Chrome inspection at width `430px` reported these approximate page heights:

| Route | Current height | Primary risk | What the next pass should do |
| --- | --- | --- | --- |
| `/` | `10086px` | story stack is too tall on mobile | compress hero and repeated explainer bands |
| `/quiz` | `4849px` | support chrome may still be too heavy | keep question-first center and trim secondary framing |
| `/login` | `4171px` | hold page is cleaner than before but still long | merge recovery/help sections and tighten rhythm |
| `/types` | `6182px` | encyclopedia density is still the main risk | reduce repeated metadata and tighten card rhythm |

Interpretation:

1. the next pass should reduce vertical waste before adding more widgets
2. `home` and `types` are the first routes where layout budget matters most
3. `quiz` already has the right center of gravity, so the work there is mostly trimming support chrome

### Avoid for MVP

| Library | Reason |
| --- | --- |
| GSAP | Motion is already installed and sufficient. Adding another animation engine creates overlap. |
| Three.js | No real 3D use case yet. The product needs strong 2D fantasy art and layout first. |
| Heavy chart libraries | Dimension scores can be rendered with CSS bars and semantic labels. No need for Recharts/Nivo for MVP. |

---

## 5A. Detailed Execution Plan From Current Repo State

สิ่งสำคัญคือรอบนี้ไม่ใช่ "เริ่ม redesign ใหม่" แต่เป็น "ปิดช่องว่างที่เหลือให้จบแบบ ship-ready" บนของที่มีอยู่แล้วใน repo

### Phase P-1 — Reset design-system truth before more UI changes

Tasks: `MBTIZ-0004`, `MBTIZ-0002`

Goal:

- แก้ design-system master ที่ยังหลง direction เก่า
- ทำให้ docs ใช้ส่งงานต่อได้จริง
- ใช้ plugin artifacts เป็น checkpoint ของแผนนี้

Files:

- `design-system/mbti-z/MASTER.md`
- `design-system/mbti-z/pages/*`
- `docs/mbti-z-redesign-plan.md`
- `docs/mbti-z-execution-board.md`

Execution:

1. replace stale premium-pink / newsletter-like rules with fantasy-dark MBTI Z rules
2. record mobile route-height budgets and where compression is required
3. link the current FigJam delivery map and Creative Production territory board
4. treat stale page override docs as follow-up work, not as trusted design truth

Validation:

- master design system reads like current product, not a generic template
- plan and board point to real route risks and live artifacts

Exit:

- future UI work can trust the docs again

### Phase P0 — Sync design truth and copy boundary

Tasks: `MBTIZ-0001`, `MBTIZ-0501`

Goal:

- ทำให้ docs, design rules, และ localized copy พูดเรื่องเดียวกัน
- ปิดปัญหา TH/EN ที่ยังสลับไม่ครบ
- กำหนด whitelist คำ English ที่ต้องคงไว้ให้ชัด

Files:

- `design-system/mbti-z/MASTER.md`
- `design-system/mbti-z/pages/*`
- `lib/mbti-z-copy.ts`
- `pages/*.tsx`
- `components/cyber/*`
- `components/mbti-z/*`

Execution:

1. sweep primary routes หา page-local strings ที่ยังไม่ผ่าน `lib/mbti-z-copy.ts`
2. lock English whitelist เป็น `Dashboard`, `Artifact`, `Result`, `Movie Profile`
3. sync page-level docs ให้ตรงกับ visual hierarchy ปัจจุบันของแต่ละ route
4. mark any intentional English UI tokens ใน copy model แทนการ hardcode ใน component

Validation:

- `rg -n "\"[A-Za-z][^\"]*\"" pages components | head` ใช้เป็น spot-check หลัง cleanup
- manual TH/EN toggle pass บน `/`, `/quiz`, `/dashboard`, `/login`, `/types`, `/result/[id]`

Exit:

- ไม่มี stray copy สำคัญบน primary routes
- docs และ board อธิบายของจริงใน repo ไม่ใช่ state เก่า

### Phase P0A — Reduce mobile height before adding more surface complexity

Tasks: `MBTIZ-0607`, `MBTIZ-0401`, `MBTIZ-0405`, `MBTIZ-0406`

Goal:

- ลด vertical waste บน mobile
- ทำให้ first viewport ของแต่ละ route บอกหน้าที่ของมันเร็วขึ้น
- ไม่เพิ่ม library เพื่อแก้ปัญหาที่แก้ได้ด้วย hierarchy และ spacing

Execution:

1. `/` home:
   - collapse repeated proof and explainer rows
   - keep CTA + artifact promise in the first viewport
   - let the next section peek without forcing a huge hero stack
2. `/login`:
   - merge recovery/help/support content into fewer bands
   - keep the hold explanation and next action in the top two sections
3. `/types`:
   - reduce per-card repetition
   - move long support text below the primary type identity only when needed
4. `/quiz`:
   - preserve question-centered layout
   - demote non-essential meta chrome on small screens

Validation:

- no horizontal overflow
- lower total mobile page height without losing core meaning
- core CTA or answer surface stays inside the first viewport

Exit:

- route height budgets trend down before any new component primitive is added

### Phase P1 — Shell cleanup and support primitives only where earned

Tasks: `MBTIZ-0301`, `MBTIZ-0304`

Goal:

- เก็บ shell ให้สม่ำเสมอขึ้นทั้ง spacing, density, panel depth, focus states
- เติม component primitives เฉพาะจุดที่ลด complexity จริง

Libraries:

- Keep `framer-motion`
- Add via current `shadcn/ui` layer only if the route benefits:
  - `Tabs`
  - `Progress`
  - `ScrollArea`
  - `Tooltip`

Files:

- `styles/globals.css`
- `components/cyber/ambient-stage.tsx`
- `components/cyber/motion/*`
- `components/ui/*`
- `pages/dashboard.tsx`
- `pages/types.tsx`
- `pages/result/[id].tsx`

Execution:

1. normalize panel padding, gap rhythm, and card radius against `design-system/mbti-z/*`
2. introduce `Progress` only if score rails or completion bars are still duplicated
3. introduce `Tabs` only if house/type navigation becomes easier to scan than stacked sections
4. introduce `ScrollArea` only if history/reconnect/content rails become too tall on tablet
5. introduce `Tooltip` only for icon-only affordances or short score explanations

Validation:

- no new primitive without deleting duplicated page-local UI logic
- no nested-card regression
- keyboard focus visible after primitive insertion

Exit:

- shell feels like one product surface
- primitives reduce code and UX ambiguity instead of adding decoration

### Phase P2 — `/types` encyclopedia polish

Task: `MBTIZ-0406`

Goal:

- ทำให้หน้า `types` เป็น encyclopedia ที่อ่านง่ายบน mobile/tablet
- house grouping ต้องชัด แต่ไม่กินพื้นที่เกิน

Files:

- `pages/types.tsx`
- `components/mbti-z/type-card.tsx`
- `components/mbti-z/house-badge.tsx`
- `lib/mbti-z-visuals.ts`

Execution:

1. verify hero, house overview cards, and type grid at `375x812`, `768x1024`, `1024x768`
2. trim long chips or turn them into wrap-safe rows
3. if current 2-column card grid breaks on tablet, prefer container-aware card behavior before adding a carousel
4. add `embla-carousel-react` only if swipe ergonomics are materially better than scroll-snap for the house overview section
5. confirm each house section still signals `house`, `movie lens`, and `type cluster` without dead space

Validation:

- no clipped Thai text
- no impossible tap target
- image/background layers do not bury the type metadata

Exit:

- `types` works as a real browse/read surface on phone and tablet, not only desktop

### Phase P3 — Chrome QA and accessibility pass

Tasks: `MBTIZ-0602`, `MBTIZ-0603`

Goal:

- validate the actual UI in browser across core viewports
- close focus, reduced-motion, alt, and keyboard gaps with evidence

Plugin workflow:

- `@chrome`: inspect the live app, run route-by-route responsive QA, and keep only deliverable tabs

Viewport matrix:

- `375x812`
- `768x1024`
- `1024x768`
- `1440x900`

Route matrix:

- `/`
- `/quiz`
- `/result/[id]`
- `/dashboard`
- `/login`
- `/types`

Checks:

1. no horizontal scroll
2. no clipped Thai text
3. primary CTA remains obvious
4. quiz answer control stays centered and readable
5. focus ring visible on keyboard navigation
6. reduced-motion mode preserves comprehension
7. image `alt` text is meaningful where the image carries meaning

Exit:

- all six routes pass the viewport matrix
- fixes are based on observed browser issues, not speculation

### Phase P4 — Export fidelity and Figma capture

Tasks: `MBTIZ-0605`, `MBTIZ-0604`

Goal:

- prove the `1080x1350` share PNG is stable
- capture stable milestone surfaces into Figma after QA is clean

Libraries:

- keep `html2canvas` as the first export engine
- do not add a second DOM-to-image library unless real export QA fails

Plugin workflow:

- `@figma`: create/update the roadmap artifact and capture stable milestone pages after QA

Execution:

1. export at least one stable guest result from dashboard and result page
2. verify same-origin images, gradients, shadows, and typography on the exported PNG
3. if export glitches come from unsupported CSS, simplify the export surface before adding another library
4. once browser QA and export QA pass, capture milestone pages into Figma for spacing/reference review

Exit:

- PNG export looks intentional in the target browsers
- Figma has the stable reference surfaces, not half-finished captures

### Phase P5 — Creative-production contingency only if art direction still has a real gap

Task owner: future enhancement, not default execution

Goal:

- use image-first exploration only if current 4-house scenes or 16-animal assets fail product quality after QA

Plugin workflow:

- `@creative-production`: produce a mood-board stream for house environments, animal rendering tone, crop behavior, and fantasy premium texture language

When to trigger:

1. house scenes feel too generic or repetitive
2. animal posters crop badly across dashboard/result/export surfaces
3. the current visual system lacks one clear premium territory

When not to trigger:

1. layout is the actual problem
2. copy hierarchy is the actual problem
3. export fidelity is the actual problem

Exit:

- moodboard leads to a concrete asset refinement brief, not open-ended image generation

---

## 5B. Verified Live Audit Delta On `2026-06-05`

This section comes from the live Chrome pass on `http://localhost:3000` plus repo grep in the same planning round. It is the bridge between the internet-backed strategy above and the next code-edit packets.

### What is already true in the live app

- the product has already moved to `MBTI Z`
- the home page already signals `4 houses`, `Movie Profile`, and `Result Artifact`
- quiz, dashboard, login/hold, types, and result routes already exist on the new visual direction
- this is now a ship-readiness pass, not a greenfield redesign

### What is still visibly incomplete

| Route | Verified issue | File anchor | Planning implication |
| --- | --- | --- | --- |
| `/` | locale-aware meta/title still not centralized | `pages/index.tsx` | home work is now mostly head/meta and hierarchy polish, not structure rewrite |
| `/quiz` | document title still falls back to URL; `% complete` and `Local memory` are still hardcoded | `pages/quiz.tsx:246`, `pages/quiz.tsx:378` | `MBTIZ-0501` must finish before responsive QA is considered complete |
| `/dashboard` | content hierarchy is strong enough to keep, but head metadata still falls back to URL and mixed EN labels need one more pass | live Chrome route | dashboard is a density/polish task, not a rebuild task |
| `/login` | hardcoded title remains and advanced recovery actions need clearer grouping | `pages/login.tsx:4` | hold page should separate primary guest actions from advanced recovery actions more clearly |
| `/types` | hardcoded title remains and this route is still the main responsive risk surface | `pages/types.tsx:71` | finish mobile/tablet work before touching secondary embellishments |
| `/result/[id]` | live result title still falls back to URL; not-found title is hardcoded | `pages/result/[id].tsx:68` | result page needs head cleanup and export-state QA more than layout rethinking |

### Planning conclusion from the audit

1. The next implementation round should optimize for finishing, not reinvention.
2. The highest-value remaining work is shared copy/head cleanup plus `/types` responsive polish.
3. No new visual library is justified yet.
4. `Chrome` remains the primary proof tool, `Figma` is now useful for milestone capture, and `Creative Production` should stay contingency-only until layout QA says the remaining gap is really art direction.

---

## 6. Design System Plan

Create a new design system namespace instead of mutating Nocturne in place:

- `design-system/mbti-z/MASTER.md`
- `design-system/mbti-z/pages/home.md`
- `design-system/mbti-z/pages/quiz.md`
- `design-system/mbti-z/pages/result-artifact.md`
- `design-system/mbti-z/pages/dashboard.md`
- `design-system/mbti-z/pages/login-hold.md`
- `design-system/mbti-z/pages/types-encyclopedia.md`

### Visual Language

- Dark cinematic base, not pure cyber terminal.
- Fantasy houses are the primary color system.
- Cards should feel like artifacts, not generic dashboard cards.
- Use dense but organized sections; avoid blank panels that do not carry content.
- Hero must show product signal in first viewport: MBTI Z, house system, fantasy animal artifact, movie taste.
- No INTJ-only hero sample. Use multi-type orbit or house preview instead.

### Layout Rules

- Mobile-first. No desktop-only layout assumptions.
- Use stable aspect ratios for result cards, animal tiles, quiz control, and export card.
- Avoid cards inside cards except repeated items, modals, and framed tools.
- Keep primary quiz answer area centered.
- Side panels should be secondary, not where the answer action lives.
- Dashboard must use compact grids with clear hierarchy:
  1. latest result
  2. dimension/movie summary
  3. download/share
  4. history
  5. account/cloud state

### Typography

Keep current Thai readability strengths but make display more distinctive:

- Thai body: keep `Bai Jamjuree` or equivalent Thai-readable UI font.
- Interface/code labels: keep `Space Mono` carefully.
- Display: keep or refine `Chakra Petch` for technical headings; use a fantasy/editorial display font sparingly for `MBTI Z` and type titles.
- Avoid making all Thai hero text huge. Thai long lines need tighter hierarchy and shorter headline copy.

---

## 7. Information Architecture

### Existing Pages to Redesign

| Route | New Role |
| --- | --- |
| `/` | MBTI Z home with cinematic hero, house preview, quiz CTA, movie profile teaser, type system overview |
| `/quiz` | Center-first assessment chamber with 5-level scale and movie module |
| `/result/[id]` | Result artifact, animal reveal, movie profile, scores, and PNG download |
| `/dashboard` | Local result archive, latest artifact, scores, history, account queue |
| `/login` | Clean account/cloud hold state |

### New Page

| Route | Role |
| --- | --- |
| `/types` | Encyclopedia of all 16 MBTI types grouped by 4 houses |

### Future Pages, Not MVP

| Route | Why Deferred |
| --- | --- |
| `/profile` | Auth is not being restored in this redesign pass |
| `/share/[slug]` | Needs cloud/share persistence |
| `/premium` | Needs payment and account restore |

---

## 8. Quiz Model Plan

### Current Problem

Current `assessmentQuestions` generate 2 options per question. The UI therefore feels like binary personality forcing and cannot express intensity.

### Target Interaction

Use a 5-level scale per MBTI question:

1. Strongly A
2. Lean A
3. Neutral / depends
4. Lean B
5. Strongly B

Scoring example:

| Choice | Left Trait Weight | Right Trait Weight |
| --- | ---: | ---: |
| Strongly A | 2 | 0 |
| Lean A | 1 | 0 |
| Neutral | 0.5 | 0.5 |
| Lean B | 0 | 1 |
| Strongly B | 0 | 2 |

Implementation detail:

- Keep question poles as `optionA` and `optionB` in canonical data.
- UI derives five choices from the two poles.
- Store answer as `{ questionKey, selectedValue, leftTrait, rightTrait, leftWeight, rightWeight }`.
- This avoids writing 5 static labels for every MBTI question while still producing more nuanced scoring.

### Movie Taste Module

Add 8-12 movie preference prompts after the core MBTI phases.

Movie axes:

- `genre_pull`: fantasy/sci-fi, drama, thriller, romance, action, documentary
- `story_pace`: slow burn vs fast cut
- `world_focus`: character-driven vs world-building
- `emotional_tone`: hopeful vs dark
- `conflict_style`: psychological vs physical/action
- `ending_preference`: closure vs open-ended
- `visual_style`: realistic vs stylized
- `rewatch_reason`: comfort, mystery, adrenaline, beauty, meaning

Output `movieProfile`:

- primary taste label in TH/EN
- 3 taste tags
- one-liner explanation
- recommended viewing mood

---

## 9. Result Artifact PNG Plan

### Required Export Content

PNG size: `1080x1350`

Must include:

- `MBTI type`
- house name and house color
- fantasy animal
- `Movie Profile`
- dimension scores
- short Thai summary
- date
- MBTI Z branding

### Export Implementation

Use a dedicated component:

- `components/mbti-z/result-share-card.tsx`
- fixed internal artboard size `1080x1350`
- render hidden/offscreen for export and responsive preview for UI
- use same-origin local images under `public/mbti-z/animals/`
- use `html2canvas(cardRef, { width: 1080, height: 1350, scale: 1 or 2, backgroundColor: null })`
- download with filename `mbti-z-${type}-${date}.png`

Risk controls:

- Avoid unsupported CSS in export card.
- Avoid remote image URLs unless proxied or converted.
- Test Chrome and Safari.
- Keep export card simpler than live UI if needed.

---

## 10. Asset Production Plan

### Asset Folders

Proposed:

- `public/mbti-z/animals/intj-obsidian-raven.webp`
- `public/mbti-z/animals/intp-arcane-owl.webp`
- `public/mbti-z/houses/purple-house.webp`
- `public/mbti-z/houses/green-house.webp`
- `public/mbti-z/houses/yellow-house.webp`
- `public/mbti-z/houses/blue-house.webp`

### Creative Production Workflow

Use Creative Production for moodboard/intake when asset generation starts:

1. Create style keywords:
   - cinematic fantasy
   - dark premium
   - luminous house color
   - mythical animal emblem
   - social-share-ready composition
2. Generate or curate 4 house-level visual routes first.
3. Lock one route.
4. Generate 16 animal prompts from that route.
5. Export consistent aspect ratios:
   - UI tile: `1:1`
   - result hero: `4:5`
   - PNG card: safe crop inside `1080x1350`

### Prompt Skeleton

```text
Fantasy animal emblem for MBTI Z, {animalName}, representing {mbtiType}, premium cinematic psychology lab, {houseColor} aura, dark magical background, sharp silhouette, highly detailed but clean composition, no text, no letters, no logo, suitable for web UI card and social result poster, polished fantasy art, high contrast, centered subject
```

### Plugin Workflow Locked

#### Chrome QA

- Use Chrome for milestone QA on `375x812`, `768x1024`, `1024x768`, `1440x900`
- Routes:
  - `/`
  - `/quiz`
  - `/result/[id]`
  - `/dashboard`
  - `/login`
  - `/types`
- Checkpoints:
  - hero above-the-fold quality
  - centered answer control on quiz
  - no text overflow in TH
  - no dead empty space on dashboard
  - download/export path after result generation

#### Figma

- Active team key available: `team::1321209061414145667`
- FigJam roadmap generated:
  - https://www.figma.com/board/DfPP91oom6lWBTMwGyeHKl?utm_source=chatgpt&utm_content=edit_in_figjam&oai_id=&request_id=c48ff572-ff96-41e7-939a-c083539428e3
- Recommended usage order:
  1. finish home/login structural redesign in code
  2. capture stable local pages into Figma
  3. refine spacing and visual hierarchy in Figma
  4. sync final adjustments back into repo

#### Creative Production

- First asset pass should not generate all 16 animals immediately
- Sequence:
  1. generate 4 house-level visual territories
  2. lock 1 shared style route
  3. generate 16 animal portraits inside that locked route
  4. generate 4 house background plates for hero/result/share card use

### Current Implementation Snapshot

| Area | Status | Notes |
| --- | --- | --- |
| MBTI Z metadata | Done | `data/mbti/mbti-z-data.mjs` already holds houses, animals, movie module, and localized summaries |
| Validation script | Done | `npm run data:validate` already passes against the MBTI Z model |
| Guest runtime scoring | Done | runtime produces `house`, `animal`, `movieProfile`, weighted dimensions, and export-ready result fields |
| Result/dashboard data shape | Done | reconnect schema and localized result flow were expanded for MBTI Z |
| `/` home | Done | MBTI Z hero, 4-house signal, movie teaser, and no INTJ-only framing are already live |
| `/quiz` page | Done | centered answer flow, 5-level scale, motion feedback, and movie module are already live |
| `/result/[id]` | Done | house/animal/movie hierarchy and `1080x1350` share surface already exist |
| `/dashboard` | Done | latest artifact dominates and the guest vault is denser than the original Nocturne layout |
| `/login` hold | Done | account hold now explains the guest-first strategy, reconnect path, and local package state clearly |
| `/types` page | Done | house grouping, asset-backed type cards, and mobile/tablet behavior are covered by the responsive proof set |
| i18n unification | Done | typed dictionaries in `lib/mbti-z-copy.ts` now cover active page UI copy, relaunch scenarios, quiz labels, hold copy, and result/account queue copy |
| Responsive / accessibility QA | Done | primary route matrix, relaunch route proof, reduced-motion keyboard proof, and export-fidelity proof are all closed with `issueCount: 0` evidence |

### Remaining Execution Work From Real Repo State

The page UI/UX execution list is closed for the current `guest-local` MBTI Z scope.

- `MBTIZ-0501` and `MBTIZ-0502` are closed by the typed local copy model and keep-local dictionary decision.
- `MBTIZ-0406` is closed by `/types` responsive proof.
- `MBTIZ-0602` is closed by the 6-route primary viewport gate and the 30-route full matrix.
- `MBTIZ-0603` is closed by keyboard, focus, reduced-motion, alt/name, and document-language evidence.
- `MBTIZ-0604` is closed by the stable Figma milestone capture set.
- `MBTIZ-0605` is closed by server PNG, Chrome fallback, and WebKit/Safari-engine export proof.

Current non-page-UI follow-up: focused animal-poster recognizability refinement remains optional asset work, and cloud/auth/deploy work remains outside this UI page gate.

---

## 11. Detailed Task Backlog

### Phase A: Planning and Design System

#### MBTIZ-0001: Create MBTI Z design system docs

- Priority: P0
- Files:
  - `design-system/mbti-z/MASTER.md`
  - `design-system/mbti-z/pages/*.md`
- Work:
  - Convert product direction into design tokens, layout rules, motion rules, asset rules, and page overrides.
  - Preserve useful Nocturne runtime constraints.
  - Mark Nocturne docs as previous design, not current target.
- Acceptance Criteria:
  - All MBTI Z pages have design rules.
  - House colors and animal asset rules are documented.
  - Responsive rules include 375px, 768px, 1024px, 1440px.

#### MBTIZ-0002: Create implementation source map

- Priority: P0
- Files:
  - `docs/mbti-z-redesign-plan.md`
- Work:
  - Keep this plan updated as implementation evolves.
  - Add task status markers later if user wants task tracking in repo.
- Acceptance Criteria:
  - Every major page has a task ID.
  - Every task has output and acceptance criteria.

#### MBTIZ-0003: Generate FigJam roadmap after plan selection

- Priority: P2
- Tool: Figma
- Status: Done
- Work:
  - Generate FigJam flowchart for MBTI Z redesign roadmap.
  - Link the FigJam file from this doc.
- Acceptance Criteria:
  - FigJam shows phases from design system to QA.
  - Diagram is editable in Figma.

### Phase B: Data Foundation

#### MBTIZ-0101: Add MBTI Z type metadata

- Priority: P0
- Files:
  - `data/mbti/foundation-data.mjs`
  - new `lib/mbti-z-types.ts` or `data/mbti/mbti-z-profiles.ts`
- Work:
  - Add house, house color, animal, Thai animal name, short summary, strengths, suitable work/life contexts, and movie profile seed for 16 types.
  - Keep data serializable and importable from both scripts and client runtime.
- Acceptance Criteria:
  - All 16 MBTI types have complete metadata.
  - No duplicate type codes.
  - Data can be imported without Next/browser APIs.

#### MBTIZ-0102: Extend validation script

- Priority: P0
- Files:
  - `scripts/validate-mbti-data.mjs`
- Work:
  - Validate 16 type metadata.
  - Validate 4 houses.
  - Validate animal names and image paths.
  - Change option validation so MBTI pole data can support derived 5-level scale.
- Acceptance Criteria:
  - `npm run data:validate` passes.
  - Validation fails clearly if a type misses house/animal/movie metadata.

#### MBTIZ-0103: Add movie taste question data

- Priority: P0
- Files:
  - `data/mbti/foundation-data.mjs`
  - or new `data/mbti/movie-taste-data.mjs`
- Work:
  - Add 8-12 bilingual movie prompts.
  - Define scoring vectors and output labels.
  - Keep movie scoring separate from MBTI trait scoring.
- Acceptance Criteria:
  - Movie prompts appear after MBTI questions.
  - Result contains `movieProfile`.
  - Movie module can be translated TH/EN.

### Phase C: Runtime and Scoring

#### MBTIZ-0201: Refactor guest answer model

- Priority: P0
- Files:
  - `lib/mbti-guest.ts`
  - `lib/assessment-runtime-types.ts`
- Work:
  - Support weighted MBTI answers.
  - Support movie taste answers.
  - Add backward compatibility for old localStorage results where possible.
- Acceptance Criteria:
  - Existing old result does not crash result/dashboard.
  - New quiz result computes MBTI type, dimensions, confidence, house, animal, and movie profile.

#### MBTIZ-0202: Implement 5-level scale scoring

- Priority: P0
- Files:
  - `lib/mbti-guest.ts`
  - `lib/mbti-assessment.ts` later if cloud API is restored
- Work:
  - Convert selected scale value into trait weights.
  - Calculate dimension scores as percentages.
  - Preserve confidence calculation but make it weight-aware.
- Acceptance Criteria:
  - Neutral answers affect both poles evenly.
  - Strong answers carry more weight than lean answers.
  - Dimension result is stable and explainable.

#### MBTIZ-0203: Add result share card data shape

- Priority: P0
- Files:
  - `lib/assessment-runtime-types.ts`
  - `lib/mbti-guest.ts`
- Work:
  - Add export-friendly result fields.
  - Include display-safe TH summary and date.
- Acceptance Criteria:
  - Result page can render share card without recomputing copy in the component.

### Phase D: Shared Components

#### MBTIZ-0301: Create MBTI Z layout shell

- Priority: P0
- Status: Done
- Files:
  - `components/mbti-z/mbti-z-stage.tsx`
  - `styles/globals.css`
- Work:
  - Build cinematic dark base with house-aware accent variables.
  - Reuse `AmbientStage` ideas but reduce cyber terminal feel.
- Acceptance Criteria:
  - All MBTI Z pages share consistent background and spacing.
  - House accent can change by type/result.
- Evidence:
  - `components/cyber/ambient-stage.tsx`
  - `components/cyber/motion/*`
  - `output/ui-skills-router/2026-06-26/mbtiz-0301-0304-shell-primitives/summary.md`

#### MBTIZ-0302: Create house and animal visual components

- Priority: P0
- Status: Done
- Files:
  - `components/mbti-z/house-badge.tsx`
  - `components/mbti-z/animal-portrait.tsx`
  - `components/mbti-z/type-card.tsx`
- Work:
  - Render house color, animal art, type code, and short label.
  - Use `next/image`.
- Acceptance Criteria:
  - Components work in home, result, dashboard, and types page.
  - No layout shift from image loading.

#### MBTIZ-0303: Create `ResultShareCard`

- Priority: P0
- Status: Done
- Files:
  - `components/mbti-z/result-share-card.tsx`
  - `components/mbti-z/download-result-button.tsx`
- Work:
  - Fixed `1080x1350` render target.
  - Export PNG using `html2canvas`.
  - Show loading and error state.
- Acceptance Criteria:
  - Button downloads PNG in browser.
  - PNG includes required fields.
  - Export does not include UI button itself.

#### MBTIZ-0304: Add support primitives only where the page earns them

- Priority: P1
- Status: Done
- Files:
  - `components/ui/tabs.tsx`
  - `components/ui/progress.tsx`
  - `components/ui/scroll-area.tsx`
  - `components/ui/tooltip.tsx`
- Work:
  - Generate local `shadcn/ui` wrappers only for the primitives that reduce current page complexity.
  - Use them for house switching, score bars, dense history rails, and icon-only helper actions instead of custom one-off markup.
- Acceptance Criteria:
  - No page-local faux-tabs or faux-progress bars remain on primary routes where a standard primitive is clearly better.
  - Added primitives follow the existing `components/ui/*` pattern and do not create a second UI system.
- Evidence:
  - `components/ui/tabs.tsx`
  - `components/ui/scroll-area.tsx`
  - `output/ui-skills-router/2026-06-26/mbtiz-0301-0304-shell-primitives/summary.md`

### Phase E: Page Redesigns

#### MBTIZ-0401: Redesign home page

- Priority: P0
- Status: Done
- Files:
  - `components/marketing/premium-home.tsx`
  - possibly new `components/mbti-z/home/*`
- Work:
  - Rename copy to `MBTI Z`.
  - Replace INTJ-only preview with 4-house / 16-animal system preview.
  - Add movie taste teaser.
  - Add `/types` link.
  - Make first viewport visually premium and product-specific.
- Acceptance Criteria:
  - No hero INTJ artifact as the main visual.
  - CTA is visible on mobile without awkward wrapping.
  - TH/EN toggle changes all visible page copy.

#### MBTIZ-0402: Redesign quiz page

- Priority: P0
- Status: Done
- Files:
  - `pages/quiz.tsx`
  - new `components/mbti-z/quiz/*`
- Work:
  - Center the active question and answer control.
  - Move side info to compact supporting rail.
  - Add 5-level scale control.
  - Add selected-click animation and progression feedback.
  - Add movie module phase.
- Acceptance Criteria:
  - Answer control is central on desktop and mobile.
  - Tap/click feedback is obvious within 150-300ms.
  - Keyboard navigation works.
  - Layout does not waste large empty left/right areas.

#### MBTIZ-0403: Redesign result page

- Priority: P0
- Status: Done
- Files:
  - `pages/result/[id].tsx`
  - `components/mbti-z/result/*`
- Work:
  - Add house reveal and fantasy animal.
  - Add movie profile block.
  - Add share PNG preview and download button.
  - Keep dimension score bars but make them more readable.
- Acceptance Criteria:
  - Required PNG fields are visible.
  - Result can be understood in 5-8 seconds.
  - Download works after result generation.

#### MBTIZ-0404: Redesign dashboard

- Priority: P1
- Status: Done
- Files:
  - `pages/dashboard.tsx`
  - `components/mbti-z/dashboard/*`
- Work:
  - Reorganize into compact archive layout.
  - Latest result dominates.
  - History and account queue are secondary.
  - Add download/share entry for latest result.
- Acceptance Criteria:
  - No large empty decorative panels.
  - Latest result, house, animal, and movie profile are visible above fold on desktop.
  - Mobile order is useful: latest, actions, scores, history, account state.

#### MBTIZ-0405: Redesign login/hold page

- Priority: P1
- Status: Done
- Files:
  - `pages/login.tsx`
  - `components/cyber/account-hold.tsx` or new `components/mbti-z/account-hold.tsx`
- Work:
  - Keep account/cloud hold truth.
  - Make layout structured: status, why held, what works, reconnect/export, CTA.
  - Remove confusing mixed messaging.
- Acceptance Criteria:
  - User understands login is not restored yet.
  - Primary CTA returns to quiz.
  - Page is responsive and not cluttered.

#### MBTIZ-0406: Build `/types` encyclopedia

- Priority: P1
- Status: Done
- Files:
  - `pages/types.tsx`
  - `components/mbti-z/types/*`
- Work:
  - Group by 4 houses.
  - Show each type meaning, suitable work/life contexts, animal, and movie tendency.
  - Add filter tabs for houses and searchable type grid if needed.
- Acceptance Criteria:
  - All 16 types are present.
  - House colors are consistent.
  - Mobile grid is readable and scannable.
- Evidence:
  - `output/ui-skills-router/2026-06-25/primary-viewport-audit/audit-report.json`
  - `output/ui-skills-router/2026-06-26/figma-captures/capture-manifest.json`

### Phase F: i18n

#### MBTIZ-0501: Centralize page copy dictionaries

- Priority: P0
- Status: Done
- Files:
  - new `lib/mbti-z-copy.ts`
  - pages/components that currently own local `copy`
- Work:
  - Move TH/EN copy into typed dictionaries.
  - Keep domain data copy in MBTI data modules.
  - Avoid scattered hardcoded English strings.
- Acceptance Criteria:
  - Language toggle changes all important copy.
  - TypeScript catches missing locale keys.
- Evidence:
  - `lib/mbti-z-copy.ts`
  - `output/ui-skills-router/2026-06-26/mbtiz-0501-quiz-copy/manifest.json`
  - `output/ui-skills-router/2026-06-26/mbtiz-0501-relaunch-copy/manifest.json`

#### MBTIZ-0502: Decide whether to add `next-i18next`

- Priority: P2
- Status: Done
- Dependency: MBTIZ-0501
- Work:
  - Document the decision explicitly instead of leaving i18n half-open.
  - Current decision: keep typed local dictionaries in `lib/mbti-z-copy.ts` and do not add `next-i18next` yet.
  - Re-open this only if copy grows beyond what one shared module plus page data can manage safely.
- Acceptance Criteria:
  - Decision is documented.
  - No mixed partial translation state remains.

### Phase G: QA and Validation

#### MBTIZ-0601: Static validation

- Priority: P0
- Status: Done
- Commands:
  - `npm run data:validate`
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
- Acceptance Criteria:
  - Commands pass or failures are documented with root cause.

#### MBTIZ-0602: Responsive browser QA

- Priority: P0
- Status: Done
- Tool:
  - Chrome or in-app browser
- Viewports:
  - `375x812`
  - `768x1024`
  - `1024x768`
  - `1440x900`
- Routes:
  - `/`
  - `/quiz`
  - `/result/[id]`
  - `/dashboard`
  - `/login`
  - `/types`
- Acceptance Criteria:
  - No text overflow.
  - No incoherent overlap.
  - Touch targets are at least 44px.
  - PNG export button works after quiz completion.
- Evidence:
  - `output/ui-skills-router/2026-06-25/primary-viewport-audit/audit-report.json`
  - `output/ui-skills-router/2026-06-25/audit-after/audit-report.json`
  - `output/ui-skills-router/2026-06-26/dashboard-result-responsive/responsive-proof-report.json`

#### MBTIZ-0603: Reduced motion and accessibility pass

- Priority: P1
- Status: Done
- Work:
  - Verify `prefers-reduced-motion`.
  - Verify focus states for quiz scale controls.
  - Verify meaningful image alt text.
  - Verify color is not the only indicator for selected answers.
- Acceptance Criteria:
  - Quiz can be completed with keyboard.
  - Reduced motion path still communicates hierarchy.
- Evidence:
  - `output/ui-skills-router/2026-06-26/accessibility-audit/audit-report.json`
  - `output/ui-skills-router/2026-06-26/accessibility-audit/quiz-keyboard-reduced-motion-proof.json`

#### MBTIZ-0604: Capture stable milestone pages into Figma

- Priority: P1
- Status: Done
- Tool:
  - Figma
- Work:
  - Capture `/`, `/quiz`, `/result/[id]`, `/dashboard`, `/login`, and `/types` into one editable Figma checkpoint after responsive QA is clean.
  - Use the captured screens to annotate spacing, rhythm, and hierarchy deltas before any last visual pass.
- Acceptance Criteria:
  - A single Figma checkpoint exists for the six primary routes.
  - Final spacing notes live beside the captures instead of being guessed from memory.
- Evidence:
  - `output/ui-skills-router/2026-06-26/figma-captures/capture-manifest.json`
  - `output/ui-skills-router/2026-06-26/figma-checkpoint/summary.md`

#### MBTIZ-0605: PNG export fidelity pass

- Priority: P1
- Status: Done
- Work:
  - Verify `html2canvas` output in Chrome and Safari on the real `1080x1350` card.
  - Check same-origin asset rendering, Thai text wrapping, date formatting, and crop safety around the fantasy animal image.
- Acceptance Criteria:
  - Exported PNG matches the intended card hierarchy closely enough for social sharing.
  - No clipped text, broken image, or locale-specific filename/date issue appears in the tested browsers.
- Evidence:
  - `output/ui-skills-router/2026-06-26/export-fidelity/export-fidelity-report.json`

---

## 12. Implementation Order

Recommended order from the current repo state:

1. Keep the page UI/UX gate locked unless new browser proof shows a regression.
2. Treat animal-poster recognizability as a focused asset refinement backlog, not a page UX blocker.
3. Move the next engineering effort to cloud/auth/deploy isolation only after preserving the current `guest-local` route proof.

Reason:

- The data/runtime and page UI phases are already complete for the current guest-local product surface.
- The old surface-consistency and QA tasks have evidence-backed closure in the route matrix, accessibility proof, export proof, and Figma checkpoint.
- Future work should not reopen a visual redesign unless fresh evidence shows a real route-level regression.

---

## 13. Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| 5-level scale breaks old result shape | Result/dashboard crash | Add backward compatibility in `localizeGuestResult` and result rendering fallback. |
| `html2canvas` misses gradients/images | PNG looks wrong | Use controlled export card CSS, same-origin assets, and test. Add fallback library only if necessary. |
| Generated animal images look inconsistent | Product feels cheap | Lock 4 house-level style routes first, then generate 16 animals from one route system. |
| i18n copy remains scattered | Language toggle incomplete | Centralize copy in typed dictionaries. |
| Dashboard remains visually heavy | User sees clutter | Force latest-result-first layout and remove non-informative panels. |
| Added libraries bloat bundle | Slower first load | Prefer existing dependencies and CSS/native patterns. |

---

## 14. Definition of Done

The redesign is complete when:

- Home clearly presents `MBTI Z` and no longer depends on INTJ sample.
- Quiz uses central 5-level scale and includes movie taste module.
- Result includes type, house, animal, movie profile, scores, Thai summary, date, and PNG download.
- `/types` explains all 16 types grouped by 4 houses.
- Dashboard uses space efficiently and shows latest artifact first.
- Login/hold page is clean and honest.
- TH/EN toggle is complete across all new surfaces.
- `npm run data:validate`, `npm run typecheck`, `npm run lint`, and `npm run build` are run.
- Browser QA covers mobile and desktop.
