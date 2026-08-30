# V4 Image Asset Plan

## 1. Principle

Images must reveal the MBTI Z product world or the user's actual result. They are not filler. Existing 16 animal portraits and 4 house scenes are reused unless crop/quality evidence rejects a specific file.

## 2. Asset Tiers

| Tier | Location | Runtime use |
| --- | --- | --- |
| concept reference | `output/ui-redesign-v4/.../concepts/` | never imported |
| candidate generation | `$CODEX_HOME/generated_images/...` then workspace review folder | never imported before acceptance |
| accepted production | `public/mbti-z/v4/**` | may be referenced by `next/image` after manifest registration |
| existing verified | `public/mbti-z/animals/**`, `public/mbti-z/houses/**` | reuse directly |

## 3. Production Asset Map

| ID | Asset | Route and placement | Ratio | Source | Text rule |
| --- | --- | --- | --- | --- | --- |
| `ASSET-V4-HOME-HERO` | Living Archive observatory | `/`, first viewport full-bleed media behind restrained overlay copy | 16:9 desktop, center-safe mobile crop | generate | no text/logo |
| `ASSET-V4-HOME-HOUSES` | four house scene set | `/`, House band, one image per house | existing 1600x960 | reuse | existing no text |
| `ASSET-V4-HOME-ANIMALS` | selected animal portraits | `/`, result anatomy/constellation | existing 1080x1350 | reuse | existing no text |
| `ASSET-V4-QUIZ-CHAMBER` | quiet assessment chamber | `/quiz`, optional shallow masthead above answer deck | 21:9 crop-safe | conditional; default skip until Quiz audit | no text/UI |
| `ASSET-V4-RESULT-ANIMAL` | current result animal | `/result/[id]`, identity media | existing portrait | dynamic reuse | existing no text |
| `ASSET-V4-ATLAS-COLLAGE` | coded composition of existing assets | `/types`, intro band | responsive CSS composition | code composition | no generated fake collage |
| `ASSET-V4-TYPE-HOUSE` | current type House scene | `/types/[code]`, wide hero layer | existing landscape | dynamic reuse | existing no text |
| `ASSET-V4-TYPE-ANIMAL` | current type animal | `/types/[code]`, portrait identity | existing portrait | dynamic reuse | existing no text |
| `ASSET-V4-DASH-ARTIFACT` | latest stored result | `/dashboard`, latest result | runtime artifact | real user data | no decorative replacement |
| `ASSET-V4-HOLD-DOOR` | closed archive doorway | optional shared account/secondary held template | 3:2 with wide safe crop | conditional; compare compact template without image first | no text/logo |

## 4. Image Generation Agent Workflow

1. run the `NEED GATE` from `IMAGE-MODEL-SYSTEM-PROMPT.md`
2. stop when the decision is `REUSE`, `CODE-COMPOSE` or `SKIP`; record the decision in `IMAGE-DECISION-MANIFEST.md`
3. read the approved route packet and exact placement contract when the decision is `GENERATE`
4. create a section concept only when composition is still unresolved; concept count follows actual need, not page section count
5. select a direction based on hierarchy/crop, not mood alone
6. write a production brief using the system prompt task contract
7. generate one asset/variant per call; do not use one prompt for unrelated assets
8. inspect candidates visually; reject baked text, malformed subjects, unsafe crop and off-brand palette
9. version accepted candidate, move it into workspace, record prompt/mode/dimensions
10. optimize with existing `sharp` tooling without changing focal content
11. hand off to page owner; page owner places image with reserved aspect ratio and `sizes`
12. QA verifies mobile/desktop crop, layout shift, bytes and fallback behavior

## 5. Prompt Contracts

### Home Hero

```text
Use case: stylized-concept
Asset type: MBTI Z home full-bleed hero background
Primary request: a cinematic editorial observatory containing four distinct personality-house territories connected into one living archive, no single type dominates
Style/medium: premium fantasy editorial environment, realistic material depth, collectible archive atmosphere
Composition/framing: landscape 16:9, strong central world signal, safe dark negative space for short copy, mobile center crop remains meaningful
Color palette: near-black neutral, bone highlights, restrained gold, four controlled house accents
Constraints: no text, no letters, no logos, no UI cards, no people close-up, no orb decoration, no purple-blue gradient
```

### Quiz Chamber

```text
Use case: stylized-concept
Asset type: shallow quiz masthead background
Primary request: a quiet focused assessment chamber in the same Living Archive world
Composition/framing: very wide 21:9, low visual density, center and edges crop-safe, no important detail behind controls
Constraints: no text, no question marks, no UI, no characters, no bright hotspot, no distracting glow
```

### Held Route Door

```text
Use case: stylized-concept
Asset type: shared account and relaunch hold visual
Primary request: a closed but illuminated archive doorway that communicates unavailable now, preserved for later
Composition/framing: 3:2, subject readable at 320px, negative space for adjacent or overlaid message
Constraints: calm and truthful, no lock icon, no text, no warning sign, no fake login UI
```

## 6. Placement Rules

- Home hero uses image as full-bleed background with copy over it, not a split card/media layout.
- Quiz image ends before the answer deck; answers remain on solid high-contrast surface.
- Result/Type pages prefer real existing identity images over generated atmospherics.
- Dashboard never uses a generic generated hero; stored result is the product image.
- Held routes share one visual to reduce maintenance and prevent false feature differentiation.
- Image containers never overlap adjacent copy; use explicit `aspect-ratio`, `min-height`, `overflow-hidden` and bounded `object-position`.

## 7. Technical Acceptance

- no baked text, watermark or third-party mark
- source dimensions recorded and decode succeeds
- desktop primary hero target <= 450 KB optimized; supporting wide images <= 300 KB; thumbnails use existing optimized source
- `next/image` has width/height or `fill + sizes`
- LCP hero uses intentional priority; below-fold assets remain lazy
- meaningful image gets localized alt; decorative background gets empty alt or CSS treatment
- crop proof at 320, 390, 768, 1024 and 1440
- no layout shift and no text contrast regression before/after load
- asset manifest and `npm run assets:verify` are extended without weakening existing 20-asset checks
