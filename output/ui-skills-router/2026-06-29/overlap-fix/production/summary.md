# Home + Types Overlap Fix Proof

Date: 2026-06-29

Runtime: `next start` at `http://127.0.0.1:3023` after `npm run build`.

## Scope

- `/` at `390x844` and `1440x1000`
- `/types` at `390x844` and `1440x1000`

## Result

- All sampled routes returned HTTP `200`.
- Browser console/page error count: `0`.
- Horizontal overflow: `0` samples.
- Home result preview cards are no longer clipped:
  - mobile share card: `clipped: false`
  - desktop share card: `clipped: false`
- Types card image/text overlap area:
  - mobile: `[0, 0, 0, 0]`
  - desktop: `[0, 0, 0, 0]`

Detailed machine-readable evidence: `output/ui-skills-router/2026-06-29/overlap-fix/production/report.json`.
