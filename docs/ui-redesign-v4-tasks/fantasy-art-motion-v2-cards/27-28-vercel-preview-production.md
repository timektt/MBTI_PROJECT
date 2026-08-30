# Cards 27-28 - Vercel Preview And Production

## Card 27 - Preview Deployment And Browser Smoke

Owner: A11 Release Operations Agent
QA owner: A8
Status: `IN PROGRESS`
Tasks: `FAM-DEL-023..025`
Depends on: Card 26 and accepted source revision

### Objective

สร้าง public Vercel Preview ที่ผูกกับ source SHA เดียวกับ PR แล้วตรวจ runtime จริงก่อน merge/promotion

### Writable State

Vercel Preview deployment and evidence only. No Production alias change.

### Checklist

- deploy via connected Git branch/PR or `vercel deploy`
- record deployment id, commit SHA, branch and generated URL
- inspect build output/logs and runtime errors
- smoke Home, Quiz, Result fixture, Types, 16 Type routes and Dashboard
- test TH/EN, 320/390/768/1024/1440, refresh/direct URLs and assets
- verify guest routes do not require auth/session/cloud APIs
- attach URL/report/screenshots to PR and resolve findings

### Acceptance

Preview is READY and reproducible from the accepted SHA; browser/network/console smoke passes and no statement calls it production-ready.

## Card 28 - Production Promotion And Rollback Proof

Owner: A11 Release Operations Agent
Approver: A0 Lead Integrator
QA owner: A8
Status: `PENDING`
Tasks: `FAM-DEL-026..028`
Depends on: FAM-GATE-01..09 PASS and Card 27 PASS

### Objective

Promote the verified revision from protected `main` to Vercel Production, prove the public guest-local product and retain a tested rollback path.

### Writable State

Vercel Production deployment/alias, logs and delivery evidence. No cloud/auth/Supabase activation.

### Checklist

- confirm protected-main SHA equals accepted Preview/source evidence
- deploy/promote to Production and record deployment id/URL
- verify canonical metadata and direct route refresh
- smoke Home, Quiz, Result, Types, Type Detail, Dashboard and PNG export
- verify runtime remains `guest-local` and held routes remain truthful
- inspect production logs/errors after promotion
- identify previous healthy deployment and run/document `vercel rollback` plus recovery smoke

### Acceptance

Production URL serves the accepted SHA, core guest product passes, rollback restores the prior healthy deployment when rehearsed, and final evidence records both forward and rollback paths.
