# Card 06 - Pruning Inventory

Owner: A1 UX Audit Agent
Status: `IN PROGRESS - HOME PRUNING COMPLETE`
Tasks: `V4-AUD-006..009`
Depends on: Card 04

## Objective

Classify visible UI and code candidates without deleting capability prematurely.

## Writable Files

`UI-PRUNING-MATRIX.md` status/evidence additions and audit artifacts.

## Checklist

- count nested cards, repeated CTAs, badges and metadata
- map duplicate locale/status/header controls
- classify KEEP/REBUILD/DEMOTE/CONSOLIDATE/REMOVE/HOLD
- run `rg` use-site map for every removal candidate

## Acceptance And Evidence

Every REMOVE has a replacement or verified no-use proof; runtime/API code is excluded.
