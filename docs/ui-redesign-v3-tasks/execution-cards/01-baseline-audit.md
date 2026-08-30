# Card 01 - Current UI Baseline Audit

Task IDs: `V3-SYS-001`, `V3-SYS-007`
Owner: `Lead Integrator`
Status: `DONE`
Depends on: none

## Deliverable

สร้าง baseline ที่ตรวจย้อนกลับได้ก่อนแก้ UI และสรุป decisions ที่ feature agents ใช้อ้างอิงร่วมกัน

## Checklist

- Record current branch, HEAD, dirty files, package manager, runtime mode, and dev command.
- Inventory Home, Navbar, `/types`, `/dashboard`, result, account, and shared locale components.
- Capture current 390px and 1440px screenshots for Home, Types, and Dashboard.
- Record the ESTJ hardcode location, duplicate locale renders, disclosure state, and dashboard capability list.
- Map existing browser evidence to its source SHA and mark stale artifacts.
- Produce a decision report for unchanged runtime and protected workflows.

## Writable Files

- V3 planning and evidence documentation only.
- Do not modify application source in this card.

## Acceptance

- Every reported UI defect has a source file and screenshot reference.
- Guest-local, history, PNG export, and reconnect are explicitly protected.
- Feature agents can start without rediscovering baseline ownership.

## Evidence

- `git status --short`
- route/source inventory
- six baseline screenshots
- baseline report containing source revision and viewport metadata

## Handoff

Return baseline path, source revision, known dirty files, protected contracts, and any stale evidence that QA must not reuse.
