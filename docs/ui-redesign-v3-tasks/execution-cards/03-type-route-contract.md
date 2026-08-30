# Card 03 - Type Schema And Route Contract

Task IDs: `V3-SYS-004`, `V3-SYS-005`
Owner: `Lead Integrator` with `Type Profile Agent`
Status: `DONE`
Depends on: `V3-SYS-001`

## Deliverable

ล็อกโครงข้อมูลและ URL contract ที่ Home, Atlas, Type Detail และ QA ใช้ร่วมกัน

## Checklist

- Freeze 16 lowercase codes and `/types/[code]` route shape.
- Define unsupported-code behavior as 404.
- Decide uppercase behavior without duplicate canonical content.
- Define required localized profile fields and related-type references.
- Separate shared summary fields from detail-only fields.
- Define static-generation and metadata requirements.
- Publish a read contract that never falls back to ESTJ.

## Writable Files

- Contract documentation.
- Data implementation starts in Card 16 after approval.

## Acceptance

- All 16 codes have one canonical route.
- Atlas and Home can consume data without importing page components.
- Invalid data and invalid routes have deterministic failure behavior.

## Evidence

- Code list.
- Field schema table.
- Route matrix including valid, uppercase, and invalid examples.

## Handoff

Send the approved schema to Type Profile first; Atlas and Home consume it only after the read helper is released.
