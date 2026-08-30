# Card 22 - My Results Advanced Recovery And Locale Cleanup

Task IDs: `V3-RESULTS-008`, `V3-RESULTS-009`
Owner: `My Results Agent`
Status: `DONE`
Depends on: Cards 07 and 20

## Deliverable

เก็บ recovery/export utilities ไว้ครบแต่ย้ายศัพท์เทคนิคออกจาก primary flow และลบ locale/account UI ที่ซ้ำ

## Checklist

- Move reconnect import/export and diagnostics into Advanced.
- Explain overwrite/reset impact before confirmation.
- Preserve reconnect bundle format and verification behavior.
- Remove page-local locale toggle under shared Navbar.
- Remove guest-inapplicable account queue/status surfaces.
- Keep Login exclusively in Navbar.
- Verify expanding Advanced does not shift or overlap fixed UI.

## Acceptance

- Primary result use needs no runtime terminology.
- Advanced recovery remains complete and keyboard operable.
- Exactly one visible locale control exists.
- No persistence or bundle contract changes.

## Evidence

- Collapsed/expanded Advanced screenshots.
- Reconnect verification result.
- Locale-control source/render audit.
