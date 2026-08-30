# Card 08 - Existing Asset Audit

Owner: A2 Visual Direction Agent
Contributor: A3 Image Generation Agent
Status: `DONE`
Tasks: `V4-IMG-001..003`
Depends on: Card 06

## Objective

Measure current 20 assets and identify only genuine production gaps.

## Writable Files

Asset audit/brief docs. Existing images are read-only.

## Checklist

- record path, format, dimensions, bytes and decode status
- inspect focal safety and palette continuity
- map each existing asset to routes/sections
- lock no-text/material/palette generation constraints

## Acceptance And Evidence

Gap map explains why each proposed generation is necessary and does not replace adequate House/Animal art.

Evidence: `npm run assets:verify` passed 4 House and 16 Animal assets; decisions are recorded in `IMAGE-DECISION-MANIFEST.md`.
