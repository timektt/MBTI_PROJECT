# MBTI Data Foundation

เอกสารนี้สรุป schema รอบใหม่ที่เพิ่มเข้ามาเพื่อให้ MBTI product ขยับจาก quiz แบบ hardcoded ไปเป็น product ที่เก็บข้อมูลจริงและต่อยอดได้

## Design goals

- ไม่พัง social/auth flow เดิม
- เพิ่ม schema แบบ additive ก่อน
- ให้ Prisma เป็น source of truth
- พร้อมต่อกับ Supabase Postgres และ Vercel environment

## Core models

### Existing models kept as-is

- `User`
- `QuizResult`
- `Card`
- `Comment`
- `Activity`
- `Notification`
- `Follow`
- `Account`
- `Session`

### New models added

- `AssessmentQuestion`
  - question bank สองภาษา
  - เก็บ `kind`, `module`, `dimension`, `poles`, version, active state
- `AssessmentOption`
  - ตัวเลือกต่อข้อ
  - ผูกกับ trait code เช่น `E`, `I`, `S`, `N` เมื่อเป็น core MBTI option
  - เก็บ `metaLabel`, weighted trait scores, และ movie score metadata สำหรับ MBTI Z
- `AssessmentSession`
  - session การทำ quiz
  - เก็บ progress, locale, status, completion state
- `AssessmentAnswer`
  - คำตอบรายข้อของ user
- `PersonalityProfile`
  - master data ของ 16 MBTI types
- `PersonalityContent`
  - content matrix TH/EN
  - แยก free vs premium
- `PremiumReport`
  - scaffold ของ report แบบล็อก/ปลดล็อก
- `ShareCard`
  - scaffold สำหรับ public share experience
- `EventLog`
  - analytics/event capture ระดับ product

## Key relations

- `User -> AssessmentSession`
- `AssessmentSession -> AssessmentAnswer`
- `AssessmentSession -> QuizResult`
- `QuizResult -> PremiumReport`
- `QuizResult -> ShareCard`
- `QuizResult -> PersonalityProfile`
- `PersonalityProfile -> PersonalityContent`

## Seed strategy

`prisma/seed.ts` ตอนนี้ถูกปรับให้ seed เฉพาะ domain data:

- 16 personality profiles
- bilingual summary content
- premium placeholder content
- MBTI Z question bank 60 ข้อ
  - core MBTI module 48 ข้อ
  - Movie Profile module 12 ข้อ
- 288 assessment options พร้อม metadata สำหรับ weighted MBTI + movie scoring

ไม่ได้ seed test user หรือ dummy social data แล้ว เพื่อไม่ให้ปนกับ production-like environments

## Bootstrap verification

ใช้คำสั่งนี้เพื่อตรวจ readiness ของ schema/migration/seed โดยไม่ต่อ database:

```bash
npm run db:bootstrap:verify
```

gate นี้ตรวจว่า:

- `data/runtime/cloud-runtime-readiness.json` required data models มีอยู่ใน `prisma/schema.prisma`
- foundation migration `20260604190000_add_premium_mbti_foundation` มี table/index/foreign-key สำคัญครบ
- metadata migration `20260629040000_add_mbti_z_question_metadata` มี MBTI Z question/option metadata และทำให้ movie options ไม่ต้องมี `traitCode`
- `prisma/seed.ts` ใช้ idempotent `upsert` กับ unique selectors ที่ schema รองรับ
- seed ไม่มี destructive markers เช่น `deleteMany`, `drop`, หรือ `truncate`
- canonical data มี 16 profiles, 60 questions, 288 options, 48 core questions, 12 movie questions, และ 4 core MBTI dimensions

ข้อสำคัญ: migration นี้ถูกเพิ่มเป็น artifact ใน repo แล้ว แต่ยังไม่ได้ apply ไปยัง live Supabase และยังไม่ได้เปิด `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud`
