# Card 05 - Navbar Primary Links And Login

Task IDs: `V3-NAV-001`, `V3-NAV-002`
Owner: `Shell Agent`
Status: `DONE`
Depends on: Cards 01, 02, and 04

## Deliverable

ลด persistent navigation เหลือ 3 destinations และทำ Login เป็น command ที่มุมขวาโดยไม่เปิด auth runtime

## Checklist

- Inspect current Navbar labels, routes, breakpoints, and active-state logic.
- Keep Home, Quiz, and 16 Types as the only primary links.
- Remove Dashboard and Account from the primary row.
- Add localized Login button at the right edge.
- Route Login to the existing account/login entry without pretending the guest is authenticated.
- Preserve logo/home behavior and current keyboard semantics.
- Add exact active state for Home, Quiz, Atlas, and type-detail descendants.

## Writable Files

- Shared Navbar component and Navbar-focused tests.
- Request shared copy through Lead.

## Acceptance

- Three primary links appear at desktop widths.
- Login is visually a command, not a navigation label named Account.
- `/types/[code]` keeps 16 Types active.
- No auth/cloud runtime changes occur.

## Evidence

- Desktop screenshots at 1024 and 1440.
- Route active-state assertions.
- Login destination smoke check.
