# Cards 23-24 - Delivery Contract And Repository Stabilization

## Card 23 - GitHub And Vercel Delivery Contract

Owner: A11 Release Operations Agent
Reviewer: A0 Lead Integrator
Status: `READY`
Tasks: `FAM-DEL-001..004`
Depends on: current source and read-only account access

### Objective

ล็อกสถานะ GitHub/Vercel ปัจจุบัน, branch model, merge authority, AI review boundary และ deployment terminology ก่อนเปลี่ยน remote state

### Writable Files

Delivery plan/status/evidence only. GitHub/Vercel settings remain read-only during this card.

### Checklist

- record remote SHA/branches/PR/Actions/ruleset/protection
- record Vercel CLI identity/team/projects/local binding
- lock `main + codex/*`; no long-lived dev/staging/prod branches
- deterministic `verify` is merge authority; AI review is advisory
- define Preview versus Production claims and secret boundaries

### Acceptance

Current evidence is timestamped and no plan assumes CI, AI review, branch protection or Vercel project already exists.

## Card 24 - Baseline Adoption Branch

Owner: A11 Release Operations Agent
Reviewer: A0 Lead Integrator
Status: `PENDING`
Tasks: `FAM-DEL-005..010`
Depends on: Card 23

### Objective

เปลี่ยน dirty root-move worktree เป็น baseline ที่ review ได้บน `codex/repo-stabilization` โดยไม่ทำ user changes หาย

### Writable Files

Git index, delivery evidence and files explicitly accepted into baseline. No production/cloud configuration.

### Checklist

- classify staged/unstaged/untracked files by owner and purpose
- exclude secrets, local env, tracked DB data, browser profiles and unintended binaries
- create `codex/repo-stabilization` without reset/checkout discard
- group root move, runtime, UI/assets and docs/evidence intentionally
- prepare reviewable commits and exact diff summary
- run `npm run verify`; fix source failures without weakening gates

### Acceptance

Branch contains the intended root application, passes strict verification, preserves all excluded user work and has a documented rollback to the pre-branch worktree state.
