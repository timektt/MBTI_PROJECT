# V4 UI Pruning Matrix

## 1. Decision Vocabulary

- `KEEP`: required and already earns its place
- `REBUILD`: required but hierarchy/layout/interaction changes
- `DEMOTE`: capability remains but moves behind progressive disclosure
- `CONSOLIDATE`: multiple surfaces become one shared pattern
- `REMOVE`: visual/code element is redundant after import and route proof
- `HOLD`: truthful route remains but is not promoted as active product

## 2. Route Decisions

| Route/family | Decision | Why | V4 treatment |
| --- | --- | --- | --- |
| `/` | REBUILD | core entry but content rhythm and imagery need stronger role | image-led hero, four clear bands, one primary CTA |
| `/quiz` | REBUILD | core task; question must dominate | reduce chrome, stable answer geometry, compact progress |
| `/result/[id]` | REBUILD | core value; actions and meaning compete | identity/artifact first, deeper meaning second, actions grouped |
| `/types` | REBUILD | discovery route must scan quickly | filters + navigation cards; no long inline reading |
| `/types/[code]` | REBUILD | dedicated route exists but needs editorial hierarchy | hero, section index, deep content, related types |
| `/dashboard` | REBUILD | capability useful but reads like system console | latest result, history, advanced recovery collapsed |
| `/login`, register, recovery | CONSOLIDATE + HOLD | account not active | one compact Account Hold template |
| profile/social/settings/share | CONSOLIDATE + HOLD | not active product in guest-local | one Relaunch template and no primary nav exposure |
| admin routes | HOLD | authorization/runtime not active | truthful minimal operations hold, no decorative redesign |

## 3. Global Element Decisions

| Element | Decision | Rule |
| --- | --- | --- |
| Primary nav links beyond 3 | REMOVE from desktop nav | secondary links go into menu or remain unlinked hold routes |
| page-local locale toggles | REMOVE | Navbar menu is sole visual language control |
| repeated route header below Navbar | REMOVE/CONSOLIDATE | keep only when it carries route-specific action unavailable globally |
| nested cards | REMOVE | flatten with spacing, borders or bands |
| card used as section wrapper | REMOVE | sections are full-width bands/unframed grids |
| Ambient orbs/glow blobs | REMOVE by default | retain only if screenshot proves semantic/visual value without overlap |
| repeated badge piles | DEMOTE | maximum one identity badge row per major section |
| repeated CTA clusters | CONSOLIDATE | one primary action, at most two secondary actions per decision point |
| guest-local/runtime jargon | DEMOTE | only advanced recovery/status area may expose technical language |
| reconnect textarea | DEMOTE | closed by default, opened intentionally |
| multiple language/status controls | CONSOLIDATE | one menu footer control and one contextual status sentence |
| empty metric tiles | REMOVE | show only metrics that help user decide/open/download |
| decorative grids/scan lines | REMOVE unless approved | no default cyber decoration layer |
| icon + duplicated text label | REVIEW | icon supports action; do not repeat same word twice |

## 4. Page-Level Cuts

### Home

Keep: promise, quiz CTA, four-house breadth, result anatomy, how it works, final CTA.
Remove/demote: repeated result descriptors, repeated House explanations, more than one CTA style in hero, card wall, single ESTJ framing, technical local-storage language.

### Quiz

Keep: progress, current question, answers, previous/restart when relevant, error/recovery.
Remove/demote: decorative chrome around answer choices, repeated stage labels, background imagery behind readable choice text, helper copy that restates the question.

### Result

Keep: type, archetype, House, animal, dimension map, original narrative, PNG, retake, My Results.
Remove/demote: three equal primary CTAs, duplicated metadata in multiple panels, accordions for content short enough to read inline, export implementation language.

### Type Atlas

Keep: House grouping/filter, 16 types, animal thumbnail, one-sentence archetype, dedicated link.
Remove: inline dropdown/disclosure, long strengths/growth copy in list, duplicated language controls, card expansion that changes neighboring geometry.

### Type Detail

Keep: hero identity, section navigation, strengths, growth, work, relationships, stress, related types.
Demote: repeated House definition, repeated CTA after every section, sticky rail on narrow viewports.

### My Results

Keep: latest result, open/download, chronological history, clear empty state, reconnect capability.
Demote: runtime/coverage/queue terms, raw bundle controls, technical metrics. Remove decorative KPI cards without user meaning.

## 5. Removal Safety Gate

Before deleting any component/CSS/file:

1. search imports/usages with `rg`
2. map every route/state consuming it
3. provide replacement or verify no user-facing capability is lost
4. run typecheck and route sweep
5. record deletion reason and rollback path

No task in this plan authorizes deleting API, auth, database or runtime code.
