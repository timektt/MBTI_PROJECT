# V3 Navbar And Locale Tasks

Owner: Shell Agent
Dependencies: `V3-SYS-002`, `V3-SYS-003`, `V3-SYS-006`
Status: `DONE`

## V3-NAV-001 Split Primary And Secondary Destinations

- create typed primary/secondary item arrays
- primary contains exactly `/`, `/quiz`, `/types`
- secondary contains `/dashboard`
- active state handles `/types/[code]` as Types

## V3-NAV-002 Login Command

- replace `บัญชี / Account` with `เข้าสู่ระบบ / Log in`
- render as right-side button
- preserve `/login` hold behavior
- do not imply successful authentication

## V3-NAV-003 Desktop Menu

- add icon menu for My Results, locale and guest note
- use Lucide `Menu`/`X` or appropriate menu icon
- tooltip/accessible name present
- close on selection, outside click and route change

## V3-NAV-004 Mobile Sheet

- mobile header: logo, Login, Menu
- sheet includes primary then secondary navigation
- locale control in footer
- safe-area and max-height behavior
- prevent body/background confusion without destructive scroll lock

## V3-NAV-005 Keyboard Contract

- Escape closes and returns focus to trigger
- logical tab order
- focus does not enter closed menu
- active page exposed with `aria-current`
- no focus trap unless menu becomes a true modal dialog

## V3-NAV-006 Locale Single Source

- keep locale state in provider
- Navbar menu is control source
- remove page-local controls from Types, Dashboard, Result and held pages when shared shell exists
- verify custom layouts before removal

## V3-NAV-007 Responsive Density

- 320: labels/buttons fit without overlap
- 390: Login remains readable
- 768: compact shell decision verified
- 1024+: three primary links visible
- 1600: max-width remains stable

## V3-NAV-008 Motion And Visual State

- active underline/accent rail
- menu open/close 160-240ms
- hover/focus color transition without size shift
- reduced-motion disables translation

## V3-NAV-009 Evidence

States:

- desktop closed/open
- mobile closed/open
- active Home/Quiz/Types/Type Detail
- TH/EN
- 200% zoom

Acceptance:

- exactly 3 primary destinations on desktop
- Login is top-right command
- My Results reachable in one menu interaction
- exactly one locale control visible
- no overlap at all six viewports
- keyboard/Escape/focus return pass

Files likely to change:

- `components/Navbar.tsx`
- `components/cyber/locale-toggle.tsx`
- `pages/_app.tsx` only if layout contract requires it
- page files only for removing duplicate control imports/rendering
- shared copy via Lead handoff

Required checks:

- `npm run typecheck`
- `npm run lint`
- targeted browser matrix
- `git diff --check`
