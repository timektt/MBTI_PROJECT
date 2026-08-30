# Card 16 - Type Detail Schema, Content, Validator, And Read API

Task IDs: `V3-TYPE-001`, `V3-TYPE-002`, `V3-TYPE-003`, `V3-TYPE-004`
Owner: `Type Profile Agent`
Status: `DONE`
Depends on: Cards 03 and 04

## Deliverable

สร้าง structured bilingual dataset ครบ 16 type พร้อม validator และ read contract ที่ Home/Atlas/route ใช้ร่วมกัน

## Checklist

- Implement the approved structured schema.
- Author original Thai and English content for every required field.
- Keep profile depth consistent across all 16 types.
- Reuse authoritative existing summaries without duplicating storage unnecessarily.
- Validate codes, locales, sections, arrays, and related links.
- Return `null` for unsupported codes.
- Emit errors with code, locale, and field path.
- Add a focused malformed-data failure test.

## Acceptance

- 16 records and 32 complete localized profiles pass.
- No placeholder, copied prose, unsupported guarantee, or silent fallback remains.
- Read API is documented and stable for dependent agents.

## Evidence

- Validator success output.
- Intentional malformed fixture failure.
- Field-coverage report by type and locale.
