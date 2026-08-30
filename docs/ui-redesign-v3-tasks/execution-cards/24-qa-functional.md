# Card 24 - Functional Route And State Audit

Task IDs: `V3-QA-001`, `V3-QA-002`, `V3-QA-003`, `V3-QA-004`, `V3-QA-005`, `V3-QA-006`, `V3-QA-007`
Owner: `QA Integration Agent`
Status: `DONE`
Depends on: Cards 08, 12, 15, 19, and 23

## Deliverable

ตรวจ requirement หลักทุก feature จาก route/state จริงก่อนเริ่ม visual matrix รอบใหญ่

## Checklist

- Derive the current route manifest from `pages/**` and static paths.
- Classify primary, secondary, contextual, and hidden routes.
- Verify three primary Navbar links, Login, menu, and active states.
- Scan and render-check locale-control uniqueness.
- Verify Home Four-House identity and interaction contract.
- Verify 16 Atlas links, no disclosure, and Back behavior.
- Run 32-profile content validation plus invalid-route 404.
- Exercise the complete My Results state matrix.
- Return each failure to the owning card instead of silently patching it.

## Acceptance

- Manifest is current and has an owner/expected status for every route.
- All requested product decisions have binary pass/fail evidence.
- No High/Critical functional defect remains unassigned.

## Evidence

- Route/state manifest.
- Requirement pass/fail table.
- Defect list with owner card and reproduction.
