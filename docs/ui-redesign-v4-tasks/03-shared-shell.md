# Packet 03 - Shared Shell

Owner: A4 Shared Shell Agent
Dependencies: `V4-AUD-003`, `V4-AUD-007`, `V4-SYS-004..006`
Output: stable global shell, responsive Navbar/menu, locale ownership and shared layout primitives

## Tasks

- `V4-SHELL-001`: audit current tokens/containers and identify V4 additions without theme replacement.
- `V4-SHELL-002`: define page, content, reading and media container roles.
- `V4-SHELL-003`: define spacing rhythm and media aspect-ratio primitives.
- `V4-SHELL-004`: rebuild desktop Navbar around three primary destinations.
- `V4-SHELL-005`: preserve right-side Login command and one secondary menu trigger.
- `V4-SHELL-006`: rebuild mobile menu as one safe-area-aware sheet with no duplicate locale control.
- `V4-SHELL-007`: implement active route, Escape, click-outside, focus trap/return and route-change close behavior.
- `V4-SHELL-008`: remove redundant page-local locale controls only after route coverage proof.
- `V4-SHELL-009`: validate Navbar at TH/EN, 320, 390, 768, 1024, 1440 and 200% zoom.
- `V4-SHELL-010`: publish shell handoff and freeze shared geometry before page waves.

## Acceptance

- desktop exposes only three primary links plus Login/menu commands
- no nav/control overlap at any required viewport or zoom state
- language remains reachable from every route through one source
- shared geometry is stable and page agents do not need global overrides
