# Cards 13-14 - Blue Animals And Motion Audit

## Card 13 - Blue Animal Batch

Owner: A3B Image Production Agent
Status: `PENDING`
Tasks: `FAM-AST-025..028`
Depends on: Card 07 PASS

### Subjects

ISTP Panther, ISFP Lynx, ESTP Tiger, ESFP Peacock.

### Writable Files

Blue V2 animal files plus ledger/evidence only.

### Checklist

- use water/weather/steel/glass cues without cyberpunk implants
- preserve feline distinction among Panther/Lynx/Tiger
- preserve Peacock feather crop and readability
- close 16-image consistency contact sheet against all batches

### Acceptance

Blue batch passes individual rubric; all 16 portraits pass aggregate consistency and <=5.6MB target.

## Card 14 - Motion Architecture Audit

Owner: A9 Motion Systems Agent
Status: `PENDING`
Tasks: `FAM-MOT-001..009`
Depends on: Card 01; may run parallel with Cards 08-13

### Objective

พิสูจน์ว่าจะขยายระบบ motion เดิมอย่างไรโดยไม่เพิ่ม dependency และตัดสิน LazyMotion จาก build evidence

### Writable Files

Motion audit docs/evidence; bounded motion source prototype only after A0 claim.

### Checklist

- map direct Framer Motion and CSS consumers
- classify every motion by purpose
- detect AmbientOrb runtime usage
- measure baseline bundle/build output
- prototype LazyMotion without broad route rewrite
- accept/reject migration with numbers

### Acceptance

Motion architecture decision includes exact imports/files, measured delta, reduced-motion policy and rollback; no speculative dependency change.
