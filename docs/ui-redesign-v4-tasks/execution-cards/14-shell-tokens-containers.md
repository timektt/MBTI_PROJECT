# Card 14 - Shell Tokens And Containers

Owner: A4 Shared Shell Agent
Status: `DONE`
Tasks: `V4-SHELL-001..003`
Depends on: Cards 05 and 06

## Objective

Define minimal shared container, spacing and media primitives needed by V4 routes.

## Writable Files

`styles/globals.css` through Lead claim; small shared shell primitives if required.

## Checklist

- inventory existing `signal-*` utilities before adding tokens
- define page/content/reading/media roles
- reserve stable ratios and responsive gutters
- avoid theme rewrite and arbitrary breakpoint accumulation

## Acceptance And Evidence

Page agents can compose layouts without global one-off overrides and existing V3 routes still render.

Evidence: existing `signal-page`, `signal-container`, `signal-section`, button and media primitives cover V4; no global token rewrite was required.
