# Card 25 - Result Content And Export

Owner: A5 Core Journey Agent
Status: `PENDING`
Tasks: `V4-RESULT-007..010`
Depends on: Card 24

## Objective

Improve dimensions/narrative layout while preserving independent 1080x1350 export rendering.

## Writable Files

Result page, share-card component and export-safe styles only when required.

## Checklist

- make dimension labels responsive and accessible
- use progressive disclosure only for truly long secondary content
- isolate export DOM from live layout
- verify server PNG and forced fallback download

## Acceptance And Evidence

Both export paths produce valid 1080x1350 PNG and live page changes do not alter artifact content.
