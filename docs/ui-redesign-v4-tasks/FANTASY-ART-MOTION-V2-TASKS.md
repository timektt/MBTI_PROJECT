# Fantasy Art And Motion V2 Stable Tasks

Status: `LOCAL VERIFIED - PREVIEW REVALIDATION PENDING`
Total: 136 stable tasks
Cards: 28
Parent plan: `docs/mbti-z-fantasy-art-motion-v2-plan.md`

## 1. Inventory

| Workstream | IDs | Count | Owner |
| --- | --- | ---: | --- |
| Research | `FAM-RES-001..008` | 8 | A2 Visual Research |
| Direction | `FAM-DIR-001..012` | 12 | A3 Art Director |
| Pilot | `FAM-PIL-001..012` | 12 | A3 + A3B |
| Production assets | `FAM-AST-001..028` | 28 | A3B Image Production |
| Motion system | `FAM-MOT-001..016` | 16 | A9 Motion Systems |
| Route integration | `FAM-INT-001..018` | 18 | A5/A6/A7 |
| Quality gates | `FAM-QA-001..014` | 14 | A8 QA/Performance |
| Delivery and Vercel | `FAM-DEL-001..028` | 28 | A11 Release Operations |
| Total |  | 136 | A0 integrates |

### Execution Checkpoint

| Workstream | Status | Evidence |
| --- | --- | --- |
| Research `001..008` | `DONE` | reference synthesis and no-copy boundary published |
| Direction `001..012` | `DONE` | System Prompt `FANTASY-ART-SYS-2.0`, House rules and rejection rubric locked |
| Pilot `001..012` | `DONE` | four Animals, Home Hero and Purple House reviewed; one Hero revision accepted |
| Assets `001..028` | `DONE` | 21 WebP runtime assets, manifest hashes and byte budgets pass |
| Motion `001..016` | `DONE WITH DECISION` | ambient loops removed, shared `ProgressScale` added, reduced motion passes; partial `LazyMotion` migration rejected because it does not remove the shared `MotionConfig` cost |
| Integration `001..018` | `DONE` | Home, Quiz, Result, Atlas, 16 detail routes, Dashboard and held routes pass current-source browser evidence |
| QA `001..014` | `DONE WITH RESIDUAL` | 130 samples pass; Lighthouse observed LCP 145/121ms, CLS 0, TBT 0/3ms; simulated localhost LCP remains above target and must be rechecked on Preview |
| Delivery `001..025` | `DONE` | protected baseline, PR workflow, Vercel binding and Preview acceptance evidence pass |
| Delivery `026..028` | `BLOCKED` | local production audit is clean; dependency-remediated Preview acceptance and a healthy Production rollback predecessor are still missing |

Detailed evidence: `docs/ui-redesign-v4-tasks/FANTASY-ART-MOTION-V2-EXECUTION.md`

## 2. Research Tasks

- `FAM-RES-001`: fingerprint current V4 source, asset manifest and active route evidence without staging files.
- `FAM-RES-002`: inventory dimensions, bytes, format and consuming routes for Home, 4 Houses and 16 Animals.
- `FAM-RES-003`: capture current desktop/mobile crops for each asset family.
- `FAM-RES-004`: document style gaps in silhouette, lighting, detail, crop and narrative consistency.
- `FAM-RES-005`: synthesize D&D Beyond immersion versus builder-utility pattern.
- `FAM-RES-006`: synthesize Baldur's Gate 3 character narrative pattern without copying IP.
- `FAM-RES-007`: synthesize Riot media-hero/content-density pattern.
- `FAM-RES-008`: record Motion, Next Image and web.dev performance constraints with official links.

## 3. Direction Tasks

- `FAM-DIR-001`: lock `stylized realistic fantasy` definition and anti-direction.
- `FAM-DIR-002`: lock originality/IP boundary and named-style prohibition.
- `FAM-DIR-003`: define global palette, material, black point and light rules.
- `FAM-DIR-004`: define Purple House world and forbidden cues.
- `FAM-DIR-005`: define Green House world and forbidden cues.
- `FAM-DIR-006`: define Yellow House world and forbidden cues.
- `FAM-DIR-007`: define Blue House world and forbidden cues.
- `FAM-DIR-008`: lock Animal portrait camera, pose, focal-safe and detail contract.
- `FAM-DIR-009`: lock House environment composition and responsive crop contract.
- `FAM-DIR-010`: lock neutral Home Hero composition and DOM copy-safe contract.
- `FAM-DIR-011`: publish candidate scoring rubric and rejection conditions.
- `FAM-DIR-012`: publish System Prompt V2 and task-prompt template.

## 4. Pilot Tasks

- `FAM-PIL-001`: write INTJ Obsidian Raven pilot brief.
- `FAM-PIL-002`: generate INTJ Raven candidates and record prompts.
- `FAM-PIL-003`: write INFJ Moon Deer pilot brief.
- `FAM-PIL-004`: generate INFJ Deer candidates and record prompts.
- `FAM-PIL-005`: write ISTJ Iron Wolf pilot brief.
- `FAM-PIL-006`: generate ISTJ Wolf candidates and record prompts.
- `FAM-PIL-007`: write ISTP Steel Panther pilot brief.
- `FAM-PIL-008`: generate ISTP Panther candidates and record prompts.
- `FAM-PIL-009`: generate Home Hero V2 pilot with desktop/mobile safe areas.
- `FAM-PIL-010`: generate Purple House environment pilot.
- `FAM-PIL-011`: inspect all pilots at 320/390/768/1024/1440 crops and score rubric.
- `FAM-PIL-012`: approve style lock or issue one bounded revision brief before batch.

## 5. Production Asset Tasks

- `FAM-AST-001`: create versioned V2 asset namespace and immutable filename policy.
- `FAM-AST-002`: extend image ledger with prompt/version/source/hash/rights/crop fields.
- `FAM-AST-003`: define source-to-WebP/AVIF optimization pipeline and quality comparison.
- `FAM-AST-004`: extend asset verifier for dimensions, bytes, existence and manifest consumers.
- `FAM-AST-005`: generate/select Home Hero V2 production source.
- `FAM-AST-006`: produce Hero desktop/mobile crops or prove one-source crop suffices.
- `FAM-AST-007`: optimize Hero variants within byte budget and record hashes.
- `FAM-AST-008`: accept Hero V2 after route crop proof.
- `FAM-AST-009`: produce Purple House environment V2.
- `FAM-AST-010`: produce Green House environment V2.
- `FAM-AST-011`: produce Yellow House environment V2.
- `FAM-AST-012`: produce Blue House environment V2.
- `FAM-AST-013`: produce INTJ Obsidian Raven V2.
- `FAM-AST-014`: produce INTP Arcane Owl V2.
- `FAM-AST-015`: produce ENTJ Crowned Lion V2.
- `FAM-AST-016`: produce ENTP Storm Fox V2.
- `FAM-AST-017`: produce INFJ Moon Deer V2.
- `FAM-AST-018`: produce INFP Dream Swan V2.
- `FAM-AST-019`: produce ENFJ Solar Phoenix V2.
- `FAM-AST-020`: produce ENFP Aurora Rabbit V2.
- `FAM-AST-021`: produce ISTJ Iron Wolf V2.
- `FAM-AST-022`: produce ISFJ Guardian Bear V2.
- `FAM-AST-023`: produce ESTJ Golden Eagle V2 as a catalog identity only, never Home brand lead.
- `FAM-AST-024`: produce ESFJ Hearth Stag V2.
- `FAM-AST-025`: produce ISTP Steel Panther V2.
- `FAM-AST-026`: produce ISFP Crystal Lynx V2.
- `FAM-AST-027`: produce ESTP Thunder Tiger V2.
- `FAM-AST-028`: produce ESFP Neon Peacock V2 and close 16-image consistency sheet.

## 6. Motion System Tasks

- `FAM-MOT-001`: inventory all direct Framer Motion imports and existing primitives.
- `FAM-MOT-002`: inventory CSS transitions/keyframes and detect large paint/filter effects.
- `FAM-MOT-003`: map motion purpose per route: hierarchy, selection, state or feedback.
- `FAM-MOT-004`: lock durations, easing, distance, scale and concurrent-node budgets.
- `FAM-MOT-005`: preserve and test global reduced-motion policy.
- `FAM-MOT-006`: identify/remove runtime usage of AmbientOrb and mark primitive deprecated.
- `FAM-MOT-007`: measure current motion bundle/build output.
- `FAM-MOT-008`: prototype `LazyMotion` migration in a bounded branch/diff and compare output.
- `FAM-MOT-009`: accept/reject LazyMotion based on evidence; avoid speculative migration.
- `FAM-MOT-010`: define `FantasyMediaFrame` fixed-geometry contract.
- `FAM-MOT-011`: define `NarrativeReveal` only if existing `Reveal` cannot express the need.
- `FAM-MOT-012`: implement or refine transform-based `ScoreBarMotion`.
- `FAM-MOT-013`: implement or refine layout-safe `FilterResultTransition`.
- `FAM-MOT-014`: add focus-visible/tap equivalent for every hover treatment.
- `FAM-MOT-015`: audit hydration, exit transition and rapid-click behavior.
- `FAM-MOT-016`: publish motion usage examples and forbidden-property checklist.

## 7. Route Integration Tasks

- `FAM-INT-001`: integrate Home Hero V2 without changing CTA/section geometry.
- `FAM-INT-002`: integrate 4 House environments with overflow-contained media transforms.
- `FAM-INT-003`: add one-shot Home Hero/copy reveal and section reveals.
- `FAM-INT-004`: verify Home hover/focus/tap parity and no overlap.
- `FAM-INT-005`: refine Quiz question enter/exit using existing runtime state.
- `FAM-INT-006`: add answer press/selected feedback without shifting answer deck.
- `FAM-INT-007`: add progress state transition with reduced-motion fallback.
- `FAM-INT-008`: integrate active Animal V2 into Result hero.
- `FAM-INT-009`: stage Result identity, score bars and export feedback once.
- `FAM-INT-010`: preserve server PNG and html2canvas fallback output geometry.
- `FAM-INT-011`: integrate Animal V2 thumbnails into Type Atlas with correct `sizes`.
- `FAM-INT-012`: add Atlas filter/list transition without nested dropdown detail.
- `FAM-INT-013`: integrate House + Animal V2 into all 16 Type Detail routes.
- `FAM-INT-014`: add Type Detail portrait/section/index motion with fixed geometry.
- `FAM-INT-015`: integrate latest/history artifact motion into My Results.
- `FAM-INT-016`: keep reconnect/import controls stable during Dashboard transitions.
- `FAM-INT-017`: apply soft mount only to shared held routes; add no images.
- `FAM-INT-018`: remove dead decorative motion/styles only after import and route proof.

## 8. Quality Tasks

- `FAM-QA-001`: validate all 21 accepted production assets decode and match manifest.
- `FAM-QA-002`: enforce Hero, House, Animal per-file and aggregate byte budgets.
- `FAM-QA-003`: capture crop matrix at 320/390/768/1024/1440 for TH/EN.
- `FAM-QA-004`: verify every image container reserves dimensions before load.
- `FAM-QA-005`: verify only route LCP image is eager and below-fold assets are lazy.
- `FAM-QA-006`: audit horizontal overflow, overlap, text clipping and z-index collisions.
- `FAM-QA-007`: run keyboard/focus/escape/return-focus interactions.
- `FAM-QA-008`: run reduced-motion browser evidence and compare geometry.
- `FAM-QA-009`: inspect animation properties, long tasks, dropped frames and concurrent layers.
- `FAM-QA-010`: verify LCP/INP/CLS lab evidence and record environment limits.
- `FAM-QA-011`: verify Quiz scoring, local persistence, Result routing and history are unchanged.
- `FAM-QA-012`: verify PNG server export and client fallback remain 1080x1350.
- `FAM-QA-013`: run data, type, asset, lint, typecheck, V3 regression and build gates.
- `FAM-QA-014`: publish source fingerprint, evidence index, residual risks and rollback asset map.

## 9. Delivery And Vercel Tasks

- `FAM-DEL-001`: capture current GitHub repository, remote SHA, branches, visibility, PR, Actions, ruleset and branch-protection evidence.
- `FAM-DEL-002`: capture current Vercel CLI identity, team, project list, local binding and target-manifest evidence without printing tokens or env values.
- `FAM-DEL-003`: lock trunk-based `main + codex/*` branch model and explicitly reject long-lived `dev/staging/prod` branches.
- `FAM-DEL-004`: define merge authority, AI advisory review, UI screenshot requirements, rollback fields and secret-handling rules.
- `FAM-DEL-005`: classify all staged, unstaged and untracked files in the current root-move worktree by ownership and intended baseline inclusion.
- `FAM-DEL-006`: audit the proposed baseline for secrets, `.env` files, tracked database data, temporary browser profiles, generated evidence and oversized unintended binaries.
- `FAM-DEL-007`: create `codex/repo-stabilization` from the current source state without discarding or overwriting user changes.
- `FAM-DEL-008`: rebuild the Git index into reviewable root-move, runtime, UI/assets and docs/evidence groups using explicit path ownership.
- `FAM-DEL-009`: prepare reviewable baseline commits with clear messages and no unrelated production/cloud activation.
- `FAM-DEL-010`: run `npm run verify`; fix current-source failures without weakening historical V3/V4 freshness gates.
- `FAM-DEL-011`: push only `codex/repo-stabilization` to GitHub after local baseline verification passes.
- `FAM-DEL-012`: open the Baseline Adoption PR with root-move explanation, changed-area map, UI evidence, risk, rollback and exact validation output.
- `FAM-DEL-013`: confirm the landed `.github/workflows/ci.yml` runs on the PR and publishes the deterministic `verify` status.
- `FAM-DEL-014`: run AI review against the PR diff for correctness, security, responsive UI, missing tests and unintended root-move deletions.
- `FAM-DEL-015`: resolve CI/AI findings or document evidence-backed dismissals; rerun affected checks.
- `FAM-DEL-016`: configure GitHub merge policy and protected `main`: PR required, `verify` required, conversations resolved, force push disabled and squash merge preferred.
- `FAM-DEL-017`: squash-merge the accepted baseline PR, delete its branch and verify remote `main` contains the root app and CI workflow.
- `FAM-DEL-018`: create the next bounded `codex/*` PR and prove the workflow works after baseline adoption.
- `FAM-DEL-019`: create dedicated Vercel project `mbti-project` in `SuperBear's projects` with GitHub repo, root `.`, Next.js framework and npm contract.
- `FAM-DEL-020`: link the workspace to the approved Vercel project and update `vercel-target-readiness.json` with observed project/org ids only.
- `FAM-DEL-021`: configure Preview/Production variables required by the guest-local surface, keep `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=guest-local`, and leave unavailable auth/cloud features held.
- `FAM-DEL-022`: add or refine a guest-local deployment preflight that rejects unsafe env/target drift without requiring fake Supabase/auth readiness.
- `FAM-DEL-023`: deploy a Vercel Preview from the accepted branch/source revision and record deployment id, URL and source SHA.
- `FAM-DEL-024`: smoke Preview core routes, TH/EN, mobile/desktop, assets, console, network and direct URL refresh behavior.
- `FAM-DEL-025`: attach Preview URL and smoke evidence to the PR; resolve deployment-specific findings before merge/promotion.
- `FAM-DEL-026`: deploy protected `main` to Vercel Production only after FAM-GATE-01..09 pass from the accepted revision.
- `FAM-DEL-027`: verify the Production URL, canonical metadata, Home/Quiz/Result/Types/Dashboard routes, PNG export and guest-local runtime boundary.
- `FAM-DEL-028`: rehearse rollback to the previous healthy Vercel deployment, record the command/UI path and publish final delivery evidence.

## 10. Dependency Chain

```text
RES -> DIR -> PIL -> pilot approval
pilot approval -> AST batches
RES -> MOT audit -> motion lock
AST + MOT -> INT by route
INT -> QA -> final acceptance
DEL-001..018 -> protected remote baseline
protected remote baseline + QA -> DEL-019..025 Preview
Preview acceptance + all FAM gates -> DEL-026..028 Production
```

Hard stops:

- no batch generation before `FAM-PIL-012`
- no runtime asset import before manifest/hash/crop acceptance
- no shared motion primitive before actual second consumer exists
- no full gate before all route owners hand off current-source evidence
- no branch push before secret/database/large-file audit and `npm run verify`
- no required `verify` ruleset before the workflow status exists on GitHub
- no Preview deploy before the dedicated Vercel target is linked and verified
- no Production deploy before protected-main source, Preview evidence and rollback target are recorded
