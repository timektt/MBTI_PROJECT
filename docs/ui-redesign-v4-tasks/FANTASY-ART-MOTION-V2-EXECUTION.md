# Fantasy Art And Motion V2 Execution Evidence

Date: 2026-08-31
Branch: `codex/dependency-remediation`
Runtime: `guest-local`
Source fingerprint: `5a418fc348a10eb35fb34f0e66ab1b92d6164cd9f903bf4896593ee34917823c`
Status: `RATE-LIMIT REMEDIATION LOCAL VERIFIED - PREVIEW PENDING`

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
| Production build | 49/49 pages generated on Next.js 16.3.3 with Webpack |
| Bundle snapshot | shared 183 kB; Home 197 kB; Quiz 222 kB; Result 229 kB; Types 205 kB; Type Detail 243 kB |
| Lighthouse Home | performance 81; accessibility/best-practices/SEO 100; observed LCP 145ms; CLS 0; TBT 0ms |
| Lighthouse Types | performance 82; accessibility/best-practices/SEO 100; observed LCP 121ms; CLS 0; TBT 3ms |

Browser report: `output/ui-redesign-v3/audit/browser-audit-report.json`

Performance reports:

- `output/ui-redesign-v4/2026-08-30/fantasy-v2/performance/home-lighthouse.json`
- `output/ui-redesign-v4/2026-08-30/fantasy-v2/performance/types-lighthouse.json`

## Preview Acceptance

- visual baseline deployment: `dpl_6PD1JaArssfsGLhQAXQEcbj7MNb6`
- dependency-remediation deployment: `dpl_9GTnTGZ2yaNxbuzEVA2vjheYkFin`
- runtime SHA: `4e5011364515089608eeacc313b64a8df73803e3`
- URL: `https://mbti-project-8jwln0q2p-superbears-projects-c668412a.vercel.app`
- direct route smoke: Home, Quiz, Types, INTJ Detail, Dashboard and Login returned `200`
- current-source local browser matrix: 31 patterns, 16 Type routes, 130 samples, 0 failures
- result image runtime: valid payload `200 image/png`; SSRF payload `400`
- protected-browser residual: latest Preview required a bypass secret not available to the isolated browser runner; direct Preview checks used authenticated Vercel CLI access

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
  the direct Preview route/image/API matrix is current to runtime SHA `4e50113`.
- The remediation branch has zero production audit findings; PR `#9`, GitHub CI
  and the dependency-remediated Preview pass. Merge and Production remain explicit
  approval gates.
- Route-scoped rate-limit keys, query-bypass regression coverage and same-IP HTTP
  isolation now pass locally. This source still needs GitHub and Vercel Preview
  acceptance before replacing the recorded runtime SHA.
- No healthy Production predecessor exists, so rollback rehearsal cannot yet be truthful.

## Rollback Map

- runtime V2 namespace: `public/mbti-z/v4/fantasy-v2/`
- canonical path mapping: `lib/mbti-z-visuals.ts` and `data/mbti/mbti-z-data.mjs`
- manifest: `data/ui/fantasy-art-v2-assets.json`
- rollback approach after first safe Production release: restore the previous path mapping and redeploy the recorded healthy Vercel deployment; do not delete V2 assets during rollback
