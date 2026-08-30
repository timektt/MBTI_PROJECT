# Card 17 - Static Type Routes, Metadata, Hero, And Section Navigation

Task IDs: `V3-TYPE-005`, `V3-TYPE-006`, `V3-TYPE-007`, `V3-TYPE-008`
Owner: `Type Profile Agent`
Status: `DONE`
Depends on: Cards 05, 07, and 16

## Deliverable

สร้าง shell ของ `/types/[code]` ที่ static, canonical, responsive และนำทาง long-form content ได้

## Checklist

- Generate exactly 16 lowercase paths with `fallback: false`.
- Set distinct localized title, description, canonical identity, and one H1.
- Build an unframed type hero with house identity and Back to Types action.
- Add section navigation with correct sticky-header offset.
- Define a mobile section-nav pattern without clipping labels.
- Keep Quiz action secondary.
- Verify unsupported code 404 and uppercase behavior.

## Acceptance

- All static paths build.
- Hero is correctly framed at mobile and desktop.
- Section links are keyboard/touch operable and headings remain visible.
- Type-detail route keeps 16 Types active in Navbar.

## Evidence

- 16-path generation report.
- Metadata/404 assertions.
- Representative hero and section-nav screenshots.
