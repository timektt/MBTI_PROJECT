# Packet 02 - Image Art Direction

Owners: A2 Visual Direction Agent + A3 Image Generation Agent
Dependencies: `V4-AUD-005`, `V4-AUD-008`, route approval for production generation
Output: concept frames, production assets, manifest handoff and crop/performance evidence

## Tasks

- `V4-IMG-001`: inventory dimensions, format, bytes, palette and crop safety of existing 20 assets.
- `V4-IMG-002`: create route-by-route asset gap map and reject unneeded image slots.
- `V4-IMG-003`: lock Living Archive palette, material, lighting and no-text constraints.
- `V4-IMG-004`: run the need gate for every Home section and write concept briefs only for unresolved generated slots.
- `V4-IMG-005`: generate Home concept frames only where composition cannot be proven with existing assets/code; Home Hero is the initial required slot.
- `V4-IMG-006`: inspect concept continuity, hierarchy, implementation clarity and mobile-implied order.
- `V4-IMG-007`: write and approve Home Hero production prompt.
- `V4-IMG-008`: generate Home Hero candidates and one controlled revision only.
- `V4-IMG-009`: run Quiz need gate after baseline; write a chamber prompt only if the image improves focus without sitting behind task content.
- `V4-IMG-010`: generate Quiz Chamber only after conditional approval; otherwise mark `DEFERRED - SKIP` with evidence.
- `V4-IMG-011`: run held-template comparison without image first; write a Held Door prompt only when the visual improves comprehension.
- `V4-IMG-012`: generate Held Door only after conditional approval; otherwise mark `DEFERRED - SKIP` with evidence.
- `V4-IMG-013`: version, optimize and place accepted files under `public/mbti-z/v4/`.
- `V4-IMG-014`: write asset ledger with prompt, mode, dimensions, bytes, focal-safe zones and owner.
- `V4-IMG-015`: hand off exact `next/image` placement requirements to consuming agents.
- `V4-IMG-016`: extend asset verification and capture crop/layout-shift evidence.

## Acceptance

- no runtime page imports concept frames
- no generated asset duplicates an adequate existing House/Animal asset
- all generated production files are no-text, versioned, optimized and registered
- every asset passes route-specific mobile/desktop crop proof before consumption is DONE
