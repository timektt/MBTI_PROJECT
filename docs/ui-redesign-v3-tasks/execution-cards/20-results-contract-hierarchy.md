# Card 20 - My Results Behavior Contract And Hierarchy

Task IDs: `V3-RESULTS-001`, `V3-RESULTS-002`, `V3-RESULTS-003`
Owner: `My Results Agent`
Status: `DONE`
Depends on: Cards 01, 02, and 04

## Deliverable

ทำ behavior inventory แล้ว reframe `/dashboard` เป็น My Results โดยไม่ลบ runtime capability

## Checklist

- Map completed, pending, history, empty, storage unavailable, reconnect, export, error, and reset states.
- Identify local APIs and protected persistence contracts.
- Rename visible Dashboard copy while preserving route path.
- Remove Account wording that does not represent real auth.
- Define hierarchy: latest result, next action, history, recovery/export, Advanced.
- Keep system/runtime mechanics below the first viewport.
- Add baseline regression coverage before markup changes.

## Acceptance

- Every existing capability has a V3 destination.
- Latest result dominates when present.
- No fake authenticated state or account queue remains.
- `/dashboard` deep links stay valid.

## Evidence

- Before/after capability map.
- State fixture inventory.
- Hierarchy wire outline and copy request.
