# Relaunch State Overrides

Override นี้ครอบคลุมหน้าในกลุ่ม:

- `/profile`
- `/settings`
- `/settings/password`
- `/setup-profile`
- `/setup-username`
- `/verify-email`
- `/reset-password`
- `/explore`
- `/leaderboard`
- `/share/[slug]`
- `/card/[id]`
- `/card/me`
- `/profile/[username]/*`
- `/u/[username]`
- `/admin`
- `/admin/cards`
- `/admin/comments`
- `/admin/settings`
- `/admin/users`

ถ้ากฎข้อนี้ขัดกับ `MASTER.md` ให้ถือไฟล์นี้เป็นหลักสำหรับ relaunch surfaces

## Purpose

หน้ากลุ่มนี้มีไว้เพื่อ:

- ปิด broken runtime ที่ยังพึ่ง `next-auth` หรือ `prisma`
- รักษา visual continuity ของ MBTI Z ให้ user ไม่หลุดไปเจอ UI คนละโลก
- สื่อสาร roadmap อย่างตรงไปตรงมา ว่าอะไรพร้อมแล้วและอะไรยังรอ cloud relaunch

## Narrative

relaunch state ต้องไม่รู้สึกเหมือน error page หรือ empty placeholder

มันควรให้ความรู้สึกว่า:

- ทีมกำลัง curate ระบบชั้นถัดไป
- flow หลักพร้อมใช้งานแล้ว
- module ที่ยังไม่กลับมาถูกพักไว้ด้วยเหตุผลที่ deliberate

## Experience Rules

- ทุกหน้าต้องมี `Guest Mode Active` state ที่เห็นได้ชัด
- ต้องมี CTA อย่างน้อย 2 ทางเสมอ:
  - กลับไปเส้นทางหลัก เช่น `/quiz` หรือ `/dashboard`
  - กลับหน้า `/`
- headline ต้องอธิบายชัดว่าหน้าอะไรถูกพักไว้
- body copy ต้องอธิบาย “เพราะอะไร” ไม่ใช่แค่บอกว่า coming soon
- queue chips ต้องบอก route/module ที่อยู่ใน relaunch scope จริง

## Layout Rules

- ใช้ 2-column desktop shell:
  - ซ้าย = narrative + CTA
  - ขวา = relaunch status + queue chips
- บน mobile ต้อง stack โดยยังให้ CTA อยู่ก่อน fold แรกถ้าเป็นไปได้
- card sections ทั้งหมดใช้ `cyber-panel` หรือ `cyber-panel-strong`

## Copy Rules

- tone ต้อง calm, premium, direct
- หลีกเลี่ยงคำว่า `error`, `broken`, `failed` ใน body หลัก
- ใช้คำว่า `relaunch`, `queue`, `hold`, `offline`, `guest-first`
- ถ้าเป็นหน้า account/security ให้ชี้กลับไปที่ assessment flow เป็นหลัก
- ถ้าเป็นหน้า community/share ให้ย้ำว่าต้องรอ cloud-backed identity และ persistence

## Scenario Mapping

### `profile`

- ใช้กับ profile identity และ social graph
- CTA หลักควรพาไป `/dashboard`

### `settings`

- ใช้กับ settings, password, onboarding setup
- CTA หลักควรพาไป `/quiz`

### `community`

- ใช้กับ explore, leaderboard, cards, creator discovery
- CTA หลักควรพาไป `/dashboard` หรือ `/quiz`

### `share`

- ใช้กับ public share preview และ share card runtime
- ต้องย้ำว่า public slug/premium artifact ยังไม่กลับมา

### `verification`

- ใช้กับ verify email, reset password และ token-based recovery surfaces
- ต้องย้ำว่าตอนนี้ user ไม่จำเป็นต้องรอ account flow เพื่อใช้ product core

### `operations`

- ใช้กับ admin, moderation และ operations console
- ต้องย้ำว่า operations layer จะกลับมาหลัง auth roles, cloud persistence และ audit trail พร้อม
- ถ้าหน้ากลุ่มนี้ยังไม่พร้อม ห้าม redirect ไป login hold แบบกำกวม ควรเข้า operations hold ตรง ๆ

## Motion Overrides

- ใช้ reveal เดียวกับ MBTI Z shell:
  - hero block: fade + y
  - supporting cards: staggered reveal
- หลีกเลี่ยง motion ที่ทำให้หน้าดูเหมือน loading state
- relaunch page ไม่ควรใช้ animation ที่ aggressive กว่า result page

## Implementation Reference

- core component: [components/cyber/relaunch-state.tsx](/Users/time/Desktop/Projects/MBTI_PROJECT/components/cyber/relaunch-state.tsx:1)
- current representative routes are implemented directly in `pages/*`

## Runtime Truth

หน้ากลุ่มนี้ไม่ใช่ “เสร็จแล้ว” แต่เป็น intentional product state

เป้าหมายคือ:

1. ไม่ให้ user ตกไปเจอ infra เก่าที่พัง
2. ไม่ให้ visual system แตกออกเป็นหลายโลก
3. เปิดทางให้ reconnect auth / cloud / share ทีหลังโดยไม่ต้องรื้อ UX ใหม่อีกครั้ง
