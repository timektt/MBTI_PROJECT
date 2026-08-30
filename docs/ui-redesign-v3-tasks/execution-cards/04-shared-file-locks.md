# Card 04 - Shared File Lock Setup

Task ID: `V3-SYS-006`
Owner: `Lead Integrator`
Status: `DONE`
Depends on: `V3-SYS-002`, `V3-SYS-003`, `V3-SYS-004`

## Deliverable

กำหนด ownership ที่ป้องกัน agents แก้ shared copy, global CSS, package และ manifest ชนกัน

## Checklist

- Claim `lib/mbti-z-copy.ts`, `styles/globals.css`, and package files for Lead.
- Assign shell ownership for `_app.tsx` and Navbar files.
- Assign type-data ownership to Type Profile.
- Assign route manifest and QA scripts to QA Integration.
- Define `copyRequest`, `tokenRequest`, and `packageRequest` handoff formats.
- Record active claims before Batch B starts.
- Define conflict escalation and claim release procedure.

## Acceptance

- No writable shared file has two concurrent owners.
- Feature agents know how to request copy/token changes.
- Lead can trace each shared edit back to a task ID.

## Evidence

- Ownership table with owner, task IDs, claim time, and release status.
- Empty conflict queue before parallel execution.

## Handoff

Publish the lock table and authorize Batch B only after every agent acknowledges its writable boundary.
