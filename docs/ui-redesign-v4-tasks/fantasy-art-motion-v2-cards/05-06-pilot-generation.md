# Cards 05-06 - Pilot Generation

## Card 05 - Four Animal Style Pilots

Owner: A3B Image Production Agent
Reviewer: A3 Art Director
Status: `PENDING`
Tasks: `FAM-PIL-001..008`
Depends on: Card 04

### Objective

สร้างตัวแทน House ละหนึ่ง type เพื่อทดสอบ style consistency ก่อน batch 16 ภาพ

### Writable Files

`output/ui-redesign-v4/<date>/fantasy-v2/pilots/animals/**` only. No runtime assets yet.

### Subjects

- INTJ Obsidian Raven
- INFJ Moon Deer
- ISTJ Iron Wolf
- ISTP Steel Panther

### Checklist

- use System Prompt V2 and task template
- record complete prompt/model/mode/version
- inspect anatomy, silhouette, eyes, environment and accidental glyphs
- create crop previews at 320/390 and 4:5 card/result frame
- do not overwrite rejected candidates

### Acceptance

At least one candidate per subject scores >=18/21 with no criterion below 2, or the card returns a bounded revision brief.

## Card 06 - Home Hero And House Pilot

Owner: A3B Image Production Agent
Reviewer: A3 Art Director
Status: `PENDING`
Tasks: `FAM-PIL-009..010`
Depends on: Card 04

### Objective

พิสูจน์ว่า environment-scale art ใช้ style เดียวกับ Animal portraits และยังรองรับ DOM copy/crop จริง

### Writable Files

`output/ui-redesign-v4/<date>/fantasy-v2/pilots/environments/**` only.

### Checklist

- Hero is neutral across all Types/Houses
- Purple House is a navigable environment, not abstract symbol art
- produce desktop/mobile crop boards using actual Home geometry
- record copy-safe area and focal subject coordinates

### Acceptance

Hero survives desktop/mobile crop without a single-Type lead; Purple House reads as the same world as INTJ pilot.
