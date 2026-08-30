# Card 06 - Desktop Menu And Mobile Sheet

Task IDs: `V3-NAV-003`, `V3-NAV-004`
Owner: `Shell Agent`
Status: `DONE`
Depends on: Card 05

## Deliverable

สร้าง secondary menu สำหรับ My Results, language และรายการรอง พร้อม mobile sheet ที่ไม่ชน logo หรือ Login

## Checklist

- Use the existing icon library for the menu button.
- Add tooltip/accessible name to the icon button.
- Place My Results, locale, guest note, and secondary routes in the menu.
- Use a compact anchored menu on desktop and a stable sheet/popover on mobile.
- Close on route change, outside click, Escape, and explicit close action.
- Prevent background interaction only when the mobile pattern is modal.
- Keep menu content within viewport height and safe areas.

## Acceptance

- Menu never covers required Login or traps content off-screen.
- Mobile header remains stable at 320px.
- Secondary destinations are reachable in two interactions or fewer.
- Opening/closing does not resize the header.

## Evidence

- Open and closed screenshots at 320, 390, 768, and 1440.
- Touch and route-change recordings or assertions.
