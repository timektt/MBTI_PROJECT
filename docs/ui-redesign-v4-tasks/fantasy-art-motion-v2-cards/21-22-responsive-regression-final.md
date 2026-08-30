# Cards 21-22 - Responsive, Regression And Final Gate

## Card 21 - Responsive, Accessibility And Motion Evidence

Owner: A8 QA And Performance Agent
Status: `PENDING`
Tasks: `FAM-QA-006..010`
Depends on: Cards 16-20

### Writable Files

V4 QA fixtures/reports/evidence only.

### Checklist

- TH/EN at 320/390/768/1024/1440 and 200% zoom/reflow
- overlap, overflow, clipping and z-index audit
- keyboard, focus-visible, Escape and focus return
- reduced-motion geometry comparison
- animation property/layer/long-task inspection
- record lab LCP/INP/CLS with environment caveat

### Acceptance

No route has overlap/horizontal scroll/focus loss; reduced motion retains state feedback and identical content geometry.

## Card 22 - Runtime Regression And Final Acceptance

Owner: A0 Lead Integrator
QA owner: A8
Status: `PENDING`
Tasks: `FAM-QA-011..014`
Depends on: Card 21

### Checklist

- guest quiz scoring/persistence/result/history regression
- PNG server export and client fallback at 1080x1350
- data/types/assets/lint/typecheck/V3 regression/build
- source fingerprint and evidence index
- rollback map from V2 assets to V1 paths
- residual risks and deferred items

### Acceptance

All seven FAM gates pass from one source fingerprint. No claim of cloud/auth/deploy completion is made, and V1 assets remain available for rollback until acceptance.
