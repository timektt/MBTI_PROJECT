# Content Operations

เอกสารนี้กำหนด source-of-truth และ workflow สำหรับ MBTI content/data ก่อนเชื่อมสู่ Supabase production จริง

## Canonical repo data

ตอนนี้ canonical source ใน repo อยู่ที่:

- [data/mbti/foundation-data.mjs](/Users/time/Desktop/Projects/MBTI_PROJECT/data/mbti/foundation-data.mjs:1)

ไฟล์นี้เก็บ:

- 16 personality profiles
- starter assessment question bank
- content builder สำหรับ `summary`, `strengths`, `blind_spots`, `growth_map`

## Why this exists

ก่อนหน้านี้ data พื้นฐานกระจายอยู่ใน [prisma/seed.ts](/Users/time/Desktop/Projects/MBTI_PROJECT/prisma/seed.ts:1) อย่างเดียว ทำให้มีความเสี่ยง 3 อย่าง:

- ขยาย question bank ยาก
- Notion กับ repo drift กันง่าย
- ไม่มีจุดเดียวสำหรับ validate คุณภาพของ content structure

การแยกไฟล์นี้ออกมาช่วยให้:

- seed ใช้ canonical data เดียวกัน
- scripts สามารถ validate ได้ก่อนค่อย seed
- future export/import ระหว่าง Notion และ repo ชัดขึ้น

## Seed flow

[prisma/seed.ts](/Users/time/Desktop/Projects/MBTI_PROJECT/prisma/seed.ts:1) ตอนนี้อ่านจาก canonical data module แล้ว

ผลคือ:

- ถ้าแก้ MBTI foundation data ในไฟล์ canonical
- seed และ Notion starter workflow จะมีแหล่งอ้างอิงเดียวกัน

## Validation

ใช้คำสั่งนี้เพื่อตรวจ data structure:

```bash
node scripts/validate-mbti-data.mjs
```

สิ่งที่ validator ตรวจ:

- มี 16 personality profiles ครบ
- personality code ไม่ซ้ำ
- starter content มีทั้ง `th` และ `en`
- premium sections ขั้นต่ำมี `strengths`, `blind_spots`, `growth_map`
- starter question bank มี 2 คำถามขึ้นไปต่อ dimension
- ทุกคำถามมี 2 options และ trait direction ถูกต้อง

## Notion relationship

Notion ใช้สำหรับ editorial workspace ส่วน repo ใช้เป็น canonical engineering source

Current pattern:

- Notion databases
  - `Quiz Question Bank DB`
  - `Result Content Matrix DB`
- Repo canonical file
- `data/mbti/foundation-data.mjs`

ตอนนี้ starter rows ใน Notion ถูก populate จาก canonical content เดียวกับ repo แล้ว แต่ยังไม่มี automated sync กลับจาก Notion เข้า repo

## Recommended next step

หลังสร้าง Supabase project ใหม่แล้ว ให้ทำต่อเป็น phase ถัดไป:

1. เพิ่ม export workflow จาก Notion ไปเป็น JSON/JS canonical file
2. ขยาย question bank จาก 8 starter questions ไปอย่างน้อย 40 questions
3. เพิ่ม premium sections `relationship`, `career`, `stress_pattern`
4. รัน validator ก่อนทุก seed/update รอบใหญ่
