# UI V3 Execution Cards

โฟลเดอร์นี้แตก 76 stable tasks จาก workstream packets ให้เป็น execution cards ขนาดเล็กสำหรับส่งต่อให้ agent ทีละงาน โดย task definition หลักยังอยู่ใน `../00-shared-contract.md` ถึง `../06-quality-gates.md`

## How To Use

1. Lead เลือก card ที่ dependencies เป็น `DONE`.
2. Assign agent เพียงหนึ่ง owner และบันทึก task IDs ที่รับไป.
3. Agent อ่าน master plan, workstream packet และ card นี้เท่านั้นก่อน inspect source.
4. Agent แก้เฉพาะ writable files และส่ง shared-file request แทนการแก้ไฟล์ที่ถูก lock.
5. งานเข้าสถานะ `VERIFY` เมื่อ implementation เสร็จ และเป็น `DONE` หลัง acceptance/evidence ผ่าน.
6. QA ต้องตรวจจาก source revision ปัจจุบัน ไม่ใช้ screenshot เก่า.

## Card Inventory

| Card | Task IDs | Owner | Status |
| --- | --- | --- | --- |
| `01-baseline-audit.md` | `SYS-001`, `SYS-007` | Lead | DONE |
| `02-ia-locale-contract.md` | `SYS-002`, `SYS-003` | Lead | DONE |
| `03-type-route-contract.md` | `SYS-004`, `SYS-005` | Lead + Type Profile | DONE |
| `04-shared-file-locks.md` | `SYS-006` | Lead | DONE |
| `05-navbar-primary-login.md` | `NAV-001..002` | Shell | DONE |
| `06-navbar-menus.md` | `NAV-003..004` | Shell | DONE |
| `07-navbar-a11y-locale.md` | `NAV-005..006` | Shell | DONE |
| `08-navbar-responsive-evidence.md` | `NAV-007..009` | Shell | DONE |
| `09-home-constellation.md` | `HOME-001..002` | Home | DONE |
| `10-home-input-motion.md` | `HOME-003..005` | Home | DONE |
| `11-home-content-bands.md` | `HOME-006..009` | Home | DONE |
| `12-home-copy-evidence.md` | `HOME-010..011` | Home + Lead | DONE |
| `13-atlas-routing.md` | `ATLAS-001..003` | Atlas | DONE |
| `14-atlas-cards-filters.md` | `ATLAS-004..006` | Atlas | DONE |
| `15-atlas-responsive-evidence.md` | `ATLAS-007..010` | Atlas | DONE |
| `16-type-content-data.md` | `TYPE-001..004` | Type Profile | DONE |
| `17-type-route-shell.md` | `TYPE-005..008` | Type Profile | DONE |
| `18-type-content-sections.md` | `TYPE-009..012` | Type Profile | DONE |
| `19-type-responsive-evidence.md` | `TYPE-013..014` | Type Profile | DONE |
| `20-results-contract-hierarchy.md` | `RESULTS-001..003` | My Results | DONE |
| `21-results-primary-states.md` | `RESULTS-004..007` | My Results | DONE |
| `22-results-advanced-locale.md` | `RESULTS-008..009` | My Results | DONE |
| `23-results-responsive-evidence.md` | `RESULTS-010..011` | My Results | DONE |
| `24-qa-functional.md` | `QA-001..007` | QA | DONE |
| `25-qa-responsive-accessibility.md` | `QA-008..010` | QA | DONE |
| `26-qa-build-evidence.md` | `QA-011..014` | QA + Lead | DONE |
| `27-integration-release-checklist.md` | orchestration | Lead | DONE |

Cards 02 through 26 are also `DONE`; each card carries its own completion status. Current evidence is under `output/ui-redesign-v3/`.

## Card Status Template

```text
Card:
Owner:
Task IDs:
Status: READY | IN PROGRESS | VERIFY | DONE | BLOCKED
Started from SHA:
Files claimed:
Evidence directory:
Blockers:
Next owner:
```

## Global Stop Conditions

- required shared file is already claimed;
- cloud/auth activation becomes necessary;
- route/data contract differs from the locked contract;
- implementation needs a new dependency;
- screenshot passes only by hiding required content;
- responsive fix needs repeated arbitrary viewport overrides;
- current source cannot reproduce the baseline state.
