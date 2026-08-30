# Cards 17-18 - Core Result And Type Integration

## Card 17 - Quiz And Result Motion/Art

Owner: A5 Core Journey Agent
Status: `PENDING`
Tasks: `FAM-INT-005..010`
Depends on: Cards 13, 15 and required accepted Animal assets

### Writable Files

Quiz/Result route-local components only.

### Checklist

- do not add Quiz decorative imagery
- refine question/answer/progress transitions with fixed geometry
- use canonical active Animal V2 on Result
- stage identity and score bars once
- preserve download, server PNG and html2canvas fallback contracts
- test rapid answer navigation and reduced motion

### Acceptance

Quiz scoring/session/result routing unchanged; Result renders and exports 1080x1350; no interaction creates layout shift.

## Card 18 - Type Atlas And 16 Details

Owner: A6 Type Discovery Agent
Status: `PENDING`
Tasks: `FAM-INT-011..014`
Depends on: Cards 09-13, 15

### Writable Files

`pages/types.tsx`, `pages/types/**`, Type-local components/data only.

### Checklist

- register 16 portrait thumbnails with accurate `sizes`
- keep filter/scan/open-route behavior; no dropdown detail panel
- integrate House + Animal V2 in every dedicated Type route
- add crop/section/index motion without animating layout geometry
- test all 16 lowercase paths and TH/EN copy

### Acceptance

All 16 routes resolve correct identity/assets; filter and keyboard navigation pass; no duplicate locale control or card overlap.
