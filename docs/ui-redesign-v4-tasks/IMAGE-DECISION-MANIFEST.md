# V4 Need-Based Image Decision Manifest

Status: `ACTIVE - HOME HERO ACCEPTED; QUIZ/HELD GENERATION DEFERRED`
Decision owner: A2 Visual Direction Agent
Production owner: A3 Image Generation Agent

## 1. Current Asset Decisions

| Slot | Decision | Evidence | Runtime path/action |
| --- | --- | --- | --- |
| Home first viewport | `GENERATE - ACCEPTED` | the previous four-Animal composition cost about 3 MiB above fold and privileged representative Types; a neutral environment creates one product-level brand signal | use `public/mbti-z/v4/home/living-archive-hero-v1.webp` |
| Home Four Houses band | `REUSE` | four verified House scenes already match identity and dimensions | reuse `public/mbti-z/houses/{purple,green,yellow,blue}.png` |
| Home result anatomy | `CODE-COMPOSE` | approved animal/type assets and real result fields are more truthful than a new illustration | compose existing portraits and DOM labels |
| Home process band | `SKIP` new image | three-step content needs clarity; new atmosphere would duplicate hero | use icons/lines and spacing only |
| Quiz masthead | `SKIP` | the Quiz is task-focused; an atmospheric masthead adds vertical pressure and distracts from the active question | use typography, progress and restrained CSS only |
| Result hero | `REUSE` | current result animal portrait is the actual personalized output | dynamic existing animal path |
| Result deep sections | `SKIP` new image | meaning is in scores and narrative | use data visualization and typography |
| Type Atlas intro | `CODE-COMPOSE` | existing 20 assets represent the catalog truthfully | responsive coded collage, no raster collage generation |
| Type cards | `REUSE` | each card already has canonical animal identity | existing animal portrait thumbnail |
| Type Detail hero | `REUSE` | House scene + animal portrait encode exact type identity | dynamic existing House and Animal paths |
| My Results | `REUSE` | real stored result artifact is the product | render actual latest/history artifacts |
| Account/held routes | `SKIP` | copy, status icon and primary guest action explain the held state; an image would over-emphasize an unavailable route | use the shared compact held template without generated art |
| Navbar, menus, filters, buttons | `SKIP` | functional controls should use Lucide icons/CSS | no generated imagery |
| Loading/error/empty states | `SKIP` by default | illustrations can slow recovery and add false emphasis | use concise copy, icon and action unless audit proves a gap |

## 2. Generation Queue

| Order | Asset ID | State | Blocking evidence |
| ---: | --- | --- | --- |
| 1 | `ASSET-V4-HOME-HERO` | `ACCEPTED` | source, optimized runtime file, crop proof and verifier are complete |
| 2 | `ASSET-V4-QUIZ-CHAMBER` | `DEFERRED - SKIP` | task-focus audit rejects a non-functional image |
| 3 | `ASSET-V4-HOLD-DOOR` | `DEFERRED - SKIP` | compact held-template review rejects extra imagery |

No additional V4 production image may enter this queue without a new row containing route, semantic purpose, existing assets considered, crop contract and accepting page owner.

## 3. Rejection Rules

Reject an image request when:

- it duplicates an existing House/Animal/result asset
- it exists only to fill empty space
- the same result can be built responsively from existing assets and DOM
- it sits behind task-critical text or controls
- it requires baked text, fake UI or uncontrolled responsive cropping
- it increases first-load cost without improving first-viewport comprehension

## 4. Approval Record

Each accepted generation records:

```text
Asset ID:
Decision date:
Approver:
Need evidence:
Existing assets considered:
System prompt version:
Task prompt:
Generated candidate:
Accepted workspace path:
Crop evidence:
Byte evidence:
Consuming card:
```

## 5. Accepted Asset Record

```text
Asset ID: ASSET-V4-HOME-HERO
Decision date: 2026-08-30
Approver: Lead Integrator, based on the user's project-wide implementation instruction
Need evidence: Home audit found seven first-viewport targets, a four-Animal payload of about 3 MiB, and no neutral product-level brand environment
Existing assets considered: public/mbti-z/houses/*.png and public/mbti-z/animals/*.png
System prompt version: V4-IMG-SYS-1.0
Task prompt: Create one text-free 16:9 Living Archive environment for the MBTI Z Home first viewport. Use near-black charcoal stone, smoked glass, aged metal and restrained antique-gold light. Build one broad celestial archive/observatory with the main architecture centered slightly right, calm dark negative space on the lower-left for real DOM copy, and meaningful detail that survives a mobile center-right crop. Keep the scene neutral across all four Houses: no House color dominance, no Type, animal, person, logo, rune, fake UI, portal, floating card, bokeh or gradient blob. Maintain readable shadow detail under a dark left-to-right overlay.
Generated candidate: /Users/time/.codex/generated_images/019eff2a-2250-7330-87d1-994258382392/exec-af00dbf0-1170-47b0-a1f8-41712489cb64.png
Evidence source: output/ui-redesign-v4/2026-08-30/home/assets/living-archive-hero-source-v1.png
Accepted workspace path: public/mbti-z/v4/home/living-archive-hero-v1.webp
Source dimensions/bytes/SHA-256: 1672x941, 1,998,422 bytes, d0253d28dbbc8ec6cd33a1d2316cdaac018559567618a459a108afb671f4107c
Runtime dimensions/bytes/SHA-256: 1672x941, 106,168 bytes, ff67161877272e81c90fbfebd9e734cada9f988863fc7c3eefa8f59c9640572d
Crop evidence: TH/EN passed at 320x568, 390x844, 768x1024, 1024x768 and 1440x1000
Placement: Home first viewport; object-position 64% center on mobile, 60% center on small/tablet and center on desktop
Alt policy: empty alt because the image is atmospheric and all product meaning is present in DOM copy
Consuming card: Card 17
```
