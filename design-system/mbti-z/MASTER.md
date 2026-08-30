# MBTI Z Design System Master

> Read `design-system/mbti-z/pages/[page-name].md` first when it exists.
> Page files override this master.

---

**Project:** MBTI Z

**Updated:** 2026-06-05

**Status:** active source of truth after live repo + Chrome audit

---

## 1. Product Intent

`MBTI Z` is a Thai-first fantasy personality lab.

The product should feel:

- dark cinematic, not terminal-only
- premium and structured, not decorative-empty
- youthful but serious enough to feel collectible
- content-dense where the user needs meaning
- fast to scan on mobile, tablet, and desktop

The surface must answer three things quickly:

1. what this product analyzes
2. what the user gets after the quiz
3. where identity, meaning, and shareable output live

---

## 2. Core Visual Direction

### Brand route

- fantasy premium
- near-black layered shell
- four-house accent system
- Thai editorial hierarchy
- minimal chrome noise
- no page-sized empty bands

### Mood keywords

- celestial lab
- arcane archive
- luminous heraldry
- cinematic contrast
- collectible artifact

### Anti-direction

Do not drift into:

- pink luxury marketing
- newsletter/blog landing patterns
- monospaced terminal UI across long Thai copy
- generic cyberpunk neon overload
- placeholder AI-filler hero art

---

## 3. Color System

### Global neutrals

| Role | Hex | Notes |
| --- | --- | --- |
| Base background | `#07080D` | main page shell |
| Elevated background | `#10131D` | large panels and hero blocks |
| Surface | `#171B29` | cards and control trays |
| Surface alt | `#1D2233` | subtle contrast step |
| Border | `rgba(255,255,255,0.10)` | hairline framing |
| Foreground | `#F4F7FF` | main text |
| Foreground muted | `#9DA7BF` | support copy |
| Accent gold | `#D7A94B` | CTA glow, artifact highlight |
| Danger | `#F36A6A` | destructive/error |

### House accents

| House | Accent | Support | Usage |
| --- | --- | --- | --- |
| Purple | `#7C5CFF` | `#B49CFF` | NT houses, strategic sections |
| Green | `#39C987` | `#8BE2B7` | NF houses, empathy/story sections |
| Yellow | `#F0C35B` | `#FFE19B` | SJ houses, order/support sections |
| Blue | `#4EA8FF` | `#98D0FF` | SP houses, action/motion sections |

Rules:

1. neutrals dominate the layout
2. house accents should guide identity, not repaint the whole page
3. use gold for artifact importance, not as a fifth house
4. never let accent text fail contrast on dark surfaces

---

## 4. Typography

### Priority

- Body: Thai-first readable sans
- Display: stylized headline font only for short hero labels, type codes, or artifact headings
- Support data: compact sans or restrained mono only for tiny labels and numeric rails

### Recommended implementation path

- Keep current runtime stable first
- Preferred future upgrade: move Thai body stack to `next/font` in `pages/_app.tsx`
- Safe body candidate from current research: `Noto Sans Thai`

### Rules

1. long Thai paragraphs must use readable sans, not futuristic display faces
2. hero-scale display type is reserved for short lines only
3. type code, badge, and system labels may use tighter tracking, but paragraphs must not
4. do not scale font size with viewport width

---

## 5. Layout Rules

### Grid targets

| Viewport | Layout target |
| --- | --- |
| mobile | 1-column stack |
| tablet | 6-column planning grid |
| desktop | 12-column grid |

### Density rules

1. every route needs a clear first-viewport purpose
2. right rail only when it removes vertical waste
3. page sections should be bands or clean grids, not floating nested cards
4. text blocks should stay within readable line length
5. reserve image space up front to avoid layout shift

### Route-specific hierarchy

- `/`: hero + quick proof + clear start action; next section should peek into first viewport
- `/quiz`: question and answers are the center of gravity; support info becomes secondary
- `/dashboard`: latest result first, summary second, archive third
- `/login`: one clean hold/recovery explanation, not a scattered tool wall
- `/types`: house overview first, per-type depth second
- `/result/[id]`: type identity first, meaning second, share/download third

---

## 6. Interaction Rules

### Motion

- use `framer-motion` only
- preferred animation band: `150-300ms`
- preferred properties: `transform`, `opacity`
- use `layout`, `layoutId`, `AnimatePresence`, `whileTap`, `useReducedMotion`
- no decorative infinite loops unless they are extremely subtle

### Selection and controls

- quiz single answer: `RadioGroup`
- progress or score rails: `Progress` only if it replaces duplicated local bars
- dense supporting rails: `ScrollArea` only when a panel becomes too tall
- icon-only help text: `Tooltip`
- house switch or filtered encyclopedia: `Tabs` only if QA proves stacked layout is not enough

### Accessibility

1. keyboard focus must stay visible
2. reduced-motion users should still understand reveal order
3. meaning must never depend on hover alone
4. click targets must remain stable across breakpoints

---

## 7. Asset Rules

### House and animal art

- use project-specific fantasy art only
- keep house scene and animal portrait color-linked
- avoid cartoony mascot treatment
- avoid stock-photo mood drift
- art should reinforce meaning, not replace copy

### Runtime rendering

- prefer local assets via `next/image`
- always define dimensions or aspect ratio
- when using `fill`, always provide `sizes`
- do not introduce remote runtime image dependencies unless unavoidable

---

## 8. Export Rules

Result share output is a first-class deliverable.

### Export target

- size: `1080x1350`
- content: `MBTI type`, `house`, `animal`, `Movie Profile`, dimension scores, Thai summary, date

### Technical rules

1. server-side OG path is preferred when available
2. `html2canvas` stays as fallback only
3. keep export assets same-origin
4. exclude UI-only controls with `data-html2canvas-ignore` where needed
5. do not rely on unsupported CSS tricks for the export surface

---

## 9. Forbidden Patterns

- INTJ-only default framing on home
- empty hero padding that pushes meaning below the fold
- answer choices stuck to one side while the question floats alone
- large page sections styled as cards inside cards
- random hardcoded English outside the approved whitelist
- `100vh`/`h-screen` traps on mobile where `dvh` is safer
- hover-only disclosure for critical meaning
- adding a new library when layout cleanup would solve the problem

---

## 10. Delivery Checklist

Before shipping any primary route:

- [ ] no horizontal overflow at `375`, `768`, `1024`, `1440`
- [ ] first viewport clearly communicates the route purpose
- [ ] no major Thai copy remains hardcoded outside centralized copy model
- [ ] house accents are visible but do not overwhelm the page shell
- [ ] images have reserved dimensions and do not cause content jumping
- [ ] reduced-motion path is still coherent
- [ ] focus states are visible
- [ ] no page-local one-off component exists where the shared UI layer already solves it
- [ ] export path stays visually consistent with the live result artifact
