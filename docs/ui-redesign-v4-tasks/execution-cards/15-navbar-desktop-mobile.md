# Card 15 - Navbar Desktop And Mobile

Owner: A4 Shared Shell Agent
Status: `DONE`
Tasks: `V4-SHELL-004..006`
Depends on: Card 14

## Objective

Implement the three-link desktop Navbar and one compact mobile menu sheet.

## Writable Files

`components/Navbar.tsx`, shell-local helpers, `_app` only if shell contract requires.

## Checklist

- Home/Quiz/16 Types only in primary desktop list
- Login command and menu trigger at right
- mobile sheet contains primary, secondary and one locale control
- support safe area, long TH/EN labels and stable hit targets

## Acceptance And Evidence

No duplicate language control or nav collision at 320 through 1440.

Evidence: three primary links, right-side Login/menu commands, icon-only accessible Login below 360px and one menu-owned locale control.
