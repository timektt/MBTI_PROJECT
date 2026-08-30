# Cards 15-16 - Motion Primitives And Home Integration

## Card 15 - Lightweight Motion Foundation

Owner: A9 Motion Systems Agent
Status: `PENDING`
Tasks: `FAM-MOT-010..016`
Depends on: Card 14

### Objective

ล็อก fixed-geometry media/motion primitives และ interaction parity ก่อน page agents เริ่มใช้

### Writable Files

`components/cyber/motion/**` and approved shared media component files only.

### Checklist

- reuse existing `Reveal` when sufficient
- add `FantasyMediaFrame` only with at least two consumers
- score bar uses transform-origin + scaleX
- filter transition does not animate container width/height
- hover has focus-visible/tap equivalent
- reduced motion sets distance 0/scale 1
- deprecate AmbientOrb after import proof

### Acceptance

Primitive demos/tests show stable geometry, rapid-click safety and reduced-motion alternative; typecheck/lint pass for touched scope.

## Card 16 - Home Fantasy V2 Integration

Owner: A5 Core Journey Agent
Status: `PENDING`
Tasks: `FAM-INT-001..004`
Depends on: Cards 08, 09, 15

### Writable Files

Home route/components and route-local styles; global/shared changes by A0 only.

### Checklist

- swap Hero using manifest contract, not filename guess
- retain one CTA and first-viewport next-section hint
- swap four House scenes with contained child-media scale <=1.05
- add one-shot Hero/copy/section reveals
- test hover/focus/tap and reduced motion

### Acceptance

TH/EN pass 320/390/768/1024/1440 with no overlap/overflow/CLS; Home behavior and route links unchanged.
