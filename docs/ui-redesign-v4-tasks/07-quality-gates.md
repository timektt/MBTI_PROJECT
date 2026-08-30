# Packet 07 - Quality Gates

Owner: A8 QA Evidence Agent
Dependencies: all implementation cards in VERIFY
Output: reproducible V4 evidence and final release recommendation

## Tasks

- `V4-QA-001`: extend route-state manifest for V4 core/held tiers without removing V3 history.
- `V4-QA-002`: refresh deterministic quiz/result/dashboard fixtures from current runtime shape.
- `V4-QA-003`: add source/asset/evidence freshness fingerprint.
- `V4-QA-004`: verify 320, 390, 768, 1024 and 1440 viewport matrix.
- `V4-QA-005`: detect horizontal overflow, element collision and incoherent overlap.
- `V4-QA-006`: test Navbar/menu at 200% zoom, safe area, Escape and focus return.
- `V4-QA-007`: test keyboard route through all core interactive controls.
- `V4-QA-008`: test reduced-motion behavior and no essential hover-only information.
- `V4-QA-009`: test TH/EN content fit, longest labels and dynamic result/type strings.
- `V4-QA-010`: test loading, empty, missing, error, recovery and hold states.
- `V4-QA-011`: verify all 16 Type routes, metadata and unknown-code 404.
- `V4-QA-012`: verify image decode, crop, `sizes`, lazy/priority policy, bytes and layout shift.
- `V4-QA-013`: verify server PNG and browser fallback fidelity.
- `V4-QA-014`: run full Home -> Quiz -> Result -> My Results flow.
- `V4-QA-015`: run held-route sweep and auth-session request isolation proof.
- `V4-QA-016`: run data, type, asset, lint, typecheck and build gates.
- `V4-QA-017`: run V3 contract/quality regression gates alongside V4 evidence.
- `V4-QA-018`: publish final audit report, residual risks, rollback notes and UAT checklist.

## Required Final Commands

```bash
npm run data:validate
npm run types:validate
npm run assets:verify
npm run ui:v3:contract
npm run ui:v3:quality
npm run lint
npm run typecheck
npm run build
```

V4-specific commands are added by QA only after scripts exist; planned names are not reported as passing commands.

## Release Acceptance

- zero unexplained overlap/overflow findings
- zero broken core routes/assets
- core keyboard path and visible focus pass
- all generated production assets are manifest-backed and fresh
- current V3 contract still passes
- all final evidence comes from one source fingerprint
- cloud/auth remain blocked and untouched
