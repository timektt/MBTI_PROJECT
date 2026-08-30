# Fantasy Art And Motion V2 Execution Evidence

Date: 2026-08-31
Branch: `codex/vercel-delivery`
Runtime: `guest-local`
Source fingerprint: `c6d7eee2790d45a2caf1028186e2d0003235895762818139286573b8cf5ce76a`
Status: `PREVIEW ACCEPTED - PRODUCTION BLOCKED`

## Implemented

- generated and accepted one neutral Home Hero, four House environments and 16 Animal portraits
- built immutable WebP runtime assets under `public/mbti-z/v4/fantasy-v2/`
- added SHA-256, dimensions, byte budgets, focal positions and rights note to the asset manifest
- connected V2 assets to Home, Result, share card, Atlas, all 16 Type Detail routes and Dashboard
- removed animated AmbientOrb runtime and decorative orb CSS
- reused reduced-motion-aware reveal primitives and added transform-based `ProgressScale`
- added an asset-fallback browser assertion after visual QA found the Atlas V1 whitelist regression
- kept Quiz scoring, local persistence, reconnect bundle, PNG export and held cloud/auth routes unchanged

## Validation

| Gate | Result |
| --- | --- |
| `npm run assets:verify` | 21 assets decode; hash, dimensions and budgets pass |
| Runtime asset bytes | Animals 2,928,728; Houses 885,384; Hero 125,146; total 3,939,258 |
| Browser route sweep | 31 route patterns, 16 concrete type paths, 130 samples, 0 failures |
| Asset fallback assertion | 0 visible fallbacks across all browser samples |
| Locale and viewport matrix | TH/EN at 320, 390, 768, 1024 and 1440 where assigned by route family |
| `npm run verify` | passed from the same source fingerprint |
| Production build | 48/48 pages generated |
| Bundle snapshot | shared 183 kB; Home 197 kB; Quiz 222 kB; Result 229 kB; Types 205 kB; Type Detail 243 kB |
| Lighthouse Home | performance 81; accessibility/best-practices/SEO 100; observed LCP 145ms; CLS 0; TBT 0ms |
| Lighthouse Types | performance 82; accessibility/best-practices/SEO 100; observed LCP 121ms; CLS 0; TBT 3ms |

Browser report: `output/ui-redesign-v3/audit/browser-audit-report.json`

Performance reports:

- `output/ui-redesign-v4/2026-08-30/fantasy-v2/performance/home-lighthouse.json`
- `output/ui-redesign-v4/2026-08-30/fantasy-v2/performance/types-lighthouse.json`

## Preview Acceptance

- deployment: `dpl_6PD1JaArssfsGLhQAXQEcbj7MNb6`
- runtime SHA: `4895b2e9ea89b44bb13732661fd40a5069d96bca`
- URL: `https://mbti-project-mogpbevy2-superbears-projects-c668412a.vercel.app`
- direct route smoke: 46/46 returned `200`
- protected browser matrix: 31 patterns, 16 Type routes, 130 samples, 0 failures
- result image runtime: valid payload `200 image/png`; SSRF payload `400`

## Motion Decision

`framer-motion` remains because the app already has `MotionConfig`, reduced-motion
context, route transitions and selection feedback. A partial `LazyMotion`
migration was rejected: `_app` still owns the shared motion provider and partial
conversion would retain that shared cost while splitting the implementation
between `motion` and `m`. The measured build snapshot is the baseline for a
future all-consumer migration, not justification for a speculative partial one.

## Residual Risks

- Lighthouse simulated localhost LCP remains 5.27s on Home and 4.82s on Types
  under its Lantern model even though observed local production LCP is below
  150ms. Preview must be tested over its real CDN before any p75 claim.
- INP p75 requires field data; local TBT is only a lab responsiveness proxy.
- Historical interaction, My Results and WebKit PNG reports remain local artifacts;
  the protected Preview route/image/API matrix is current to runtime SHA `4895b2e`.
- Production is blocked by 2 critical and 12 high production-tree audit findings.
- No healthy Production predecessor exists, so rollback rehearsal cannot yet be truthful.

## Rollback Map

- runtime V2 namespace: `public/mbti-z/v4/fantasy-v2/`
- canonical path mapping: `lib/mbti-z-visuals.ts` and `data/mbti/mbti-z-data.mjs`
- manifest: `data/ui/fantasy-art-v2-assets.json`
- rollback approach after first safe Production release: restore the previous path mapping and redeploy the recorded healthy Vercel deployment; do not delete V2 assets during rollback
