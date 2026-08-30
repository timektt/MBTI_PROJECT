# Card 02 - Information Architecture And Locale Contract

Task IDs: `V3-SYS-002`, `V3-SYS-003`
Owner: `Lead Integrator`
Status: `DONE`
Depends on: `V3-SYS-001`

## Deliverable

ล็อก navigation hierarchy และเจ้าของ locale state ก่อน Shell, Atlas และ My Results แก้ markup

## Checklist

- Freeze primary links as Home, Quiz, and 16 Types.
- Freeze top-right command as Login without enabling real auth.
- Place My Results, language, guest note, and secondary destinations in the menu.
- Declare Navbar menu as the visible locale-control owner on routes using shared Navbar.
- Declare the existing locale provider as state owner.
- List exceptional screens that intentionally have no Navbar and therefore need local locale access.
- Define active-route, menu close, and locale persistence behavior.

## Writable Files

- Planning contract and copy request only.
- Application edits belong to the Shell Agent.

## Acceptance

- Each destination has exactly one navigation tier.
- Each route has at most one intended visible locale control.
- Login wording and guest-local limitations are explicit.

## Evidence

- Navigation table by desktop/mobile.
- Locale ownership table by route.
- Approved exception list.

## Handoff

Send Shell, Atlas, and My Results agents the locked labels, placement rules, exception list, and active-state contract.
