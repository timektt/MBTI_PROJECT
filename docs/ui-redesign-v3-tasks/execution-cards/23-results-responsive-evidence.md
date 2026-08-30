# Card 23 - My Results Responsive And Regression Evidence

Task IDs: `V3-RESULTS-010`, `V3-RESULTS-011`
Owner: `My Results Agent`
Status: `DONE`
Depends on: Cards 21 and 22

## Deliverable

ตรวจ state matrix ทุกขนาดและพิสูจน์ guest-local result/history/export/reconnect workflow

## Checklist

- Test all primary and Advanced states at 320, 390, 768, 1024, and 1440px.
- Test TH/EN, long dates, long history, no history, and storage unavailable.
- Verify heading order, focus, disclosures, confirmations, tooltips, and touch targets.
- Verify PNG export, reconnect import, resume, retake, and reset confirmation.
- Capture completed, pending, and empty states on mobile and desktop.
- Record `/dashboard` deep-link behavior.

## Acceptance

- Zero result/history/control overlap or unintended overflow.
- Guest-local workflows pass without cloud/auth.
- At least six fresh state screenshots exist.
- Reconnect verification remains green.

## Evidence

- State-by-viewport matrix.
- Focus/confirmation test log.
- Runtime regression and residual-risk report.
