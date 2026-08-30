# Card 05 - Overlap And Layout Audit

Owner: A1 UX Audit Agent
Status: `IN PROGRESS - HOME AUDIT COMPLETE`
Tasks: `V4-AUD-004..005`, `V4-AUD-011`
Depends on: Card 04

## Objective

Trace every overlap/clipping/overflow symptom to layout, stacking, fixed geometry or content-fit causes.

## Writable Files

Audit report and annotated screenshots only.

## Checklist

- inspect bounding boxes and horizontal scroll width
- identify transforms/grid expansion/sticky/fixed/absolute causes
- run squint test and reading-order review
- rank findings Critical/High/Medium/Low per route/viewport

## Acceptance And Evidence

Every visual issue cites screenshot and DOM/source evidence; no fix is proposed as arbitrary pixel override.
