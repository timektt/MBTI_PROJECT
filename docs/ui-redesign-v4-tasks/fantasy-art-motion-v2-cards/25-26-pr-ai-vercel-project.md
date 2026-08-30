# Cards 25-26 - PR/AI Governance And Vercel Project

## Card 25 - Baseline PR, CI And AI Review

Owner: A11 Release Operations Agent
Reviewer: A0 Lead Integrator
Status: `PENDING`
Tasks: `FAM-DEL-011..018`
Depends on: Card 24 PASS

### Objective

นำ baseline ขึ้น GitHub ผ่าน PR จริง เปิด CI/AI review และป้องกัน `main` ก่อนเริ่ม feature PR รอบใหม่

### Writable State

`codex/repo-stabilization`, its PR, GitHub Actions/ruleset/settings and delivery evidence only.

### Checklist

- push only the stabilization branch
- open PR with root-move map, screenshots, risk and rollback
- confirm remote CI exposes required `verify` status
- run AI diff review for correctness/security/UI/test gaps
- resolve or evidence-dismiss every finding
- configure PR-required protected `main`, required `verify`, conversation resolution, no force push and squash preference
- squash merge, delete branch and verify remote root app/CI
- prove one subsequent bounded `codex/*` PR can use the workflow

### Acceptance

Remote `main` is current and protected, Actions is green, no direct push is required, and AI review evidence is attached without becoming the sole merge authority.

## Card 26 - Dedicated Vercel Project And Guest Deploy Gate

Owner: A11 Release Operations Agent
Reviewers: A0, A8
Status: `PENDING`
Tasks: `FAM-DEL-019..022`
Depends on: Card 25 PASS

### Objective

สร้างและ bind `mbti-project` อย่างถูก team/root/package manager พร้อม preflight ที่ deploy guest-local ได้โดยไม่ปลอม cloud readiness

### Writable State

Vercel project settings, `.vercel/project.json`, target-readiness manifest, deployment runbook and secret-safe evidence.

### Checklist

- create/import `timektt/MBTI_PROJECT` under `SuperBear's projects`
- framework Next.js, root `.`, package manager npm, build `npm run build`
- link local workspace and verify observed project/org ids
- update target manifest only with actual ids
- set `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=guest-local`
- configure only required guest-local URLs/variables; no fake auth/Supabase secrets
- add/refine guest-local preflight while keeping full cloud gate blocked

### Acceptance

`npm run vercel:target` passes for the observed project binding, guest-local deploy preflight is explicit, and unavailable account/cloud surfaces remain held.
