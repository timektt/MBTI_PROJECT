# Card 16 - Navbar Behavior And Evidence

Owner: A4 Shared Shell Agent
Reviewer: A8 QA Evidence Agent
Status: `DONE`
Tasks: `V4-SHELL-007..010`
Depends on: Card 15

## Objective

Complete accessible menu behavior, remove proven duplicate locale controls and freeze shell geometry.

## Writable Files

Navbar/shell files; page-local locale removal only with route proof; shell evidence.

## Checklist

- active state, Escape, click outside, focus containment/return
- close on route change and preserve current route on locale change
- test 200% zoom and keyboard order
- publish shell dimensions and consumer handoff

## Acceptance And Evidence

Shell passes all viewports/locales and no core page needs a page-local language control.

Evidence: `output/ui-redesign-v4/2026-08-30/shell/audit-report.json` passes entry focus, forward/backward trap, Escape return, locale route preservation and geometry.
