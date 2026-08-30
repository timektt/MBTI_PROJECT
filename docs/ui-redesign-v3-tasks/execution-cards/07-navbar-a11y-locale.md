# Card 07 - Navbar Accessibility And Locale Ownership

Task IDs: `V3-NAV-005`, `V3-NAV-006`
Owner: `Shell Agent`
Status: `DONE`
Depends on: Cards 02 and 06

## Deliverable

ทำให้ menu ใช้ keyboard ได้ครบและเป็น visible locale control เพียงตำแหน่งเดียวบนหน้าที่มี Navbar

## Checklist

- Move focus into the menu when required by the chosen pattern.
- Restore focus to the trigger after close.
- Define Tab, Shift+Tab, Enter, Space, and Escape behavior.
- Expose expanded/collapsed state correctly.
- Render the locale control only inside Navbar menu for shared-shell routes.
- Keep provider persistence and translated page updates unchanged.
- Publish the removal list for page-local locale toggles.

## Acceptance

- No keyboard trap exists.
- Focus is visible and returns predictably.
- Shared-shell pages expose one visible locale switch at most.
- Switching locale does not close navigation unexpectedly unless specified.

## Evidence

- Keyboard sequence log.
- Source scan of `LocaleToggle` renders.
- TH/EN screenshots for Types and My Results.
