# Assessment Flow Overrides

Override นี้ครอบคลุม flow:

- `/quiz`
- `/result/[id]`
- `/dashboard`

ถ้ากฎข้อนี้ขัดกับ `MASTER.md` ให้ถือไฟล์นี้เป็นหลักสำหรับ assessment surfaces

## Narrative

assessment flow ต้องรู้สึกเหมือน “เดินเข้าไปในระบบอ่านตัวตน”

- quiz = chamber
- result = reveal artifact
- dashboard = memory archive

ไม่ควรใช้ language แบบ marketing page เดียวกันหมดทุกหน้า

## Quiz-specific rules

- ซ้ายเป็น control / context panel, ขวาเป็น active question surface บน desktop
- บน mobile ทุกอย่าง stack ลงมาโดยยังเห็น progress ก่อนตัวเลือก
- progress ต้องชัดตลอดเวลา
- locale switch ต้องมี และถ้าเปลี่ยนภาษาหลังตอบไปแล้วต้องสื่อสารผลกระทบตรง ๆ
- phase pacing ต้องเห็นทั้งใน copy และใน structure ไม่ใช่แค่ label บรรทัดเดียว
- phase map ควรอ่านได้ว่า user อยู่ chapter ไหนของ assessment ตอนนี้

### Answer cards

- card ใหญ่
- กดง่าย
- มี state `selected`
- option key และ trait code เป็น metadata รอง ไม่ใช่ content หลัก

## Result-specific rules

- type code ต้องเป็น visual anchor ที่ใหญ่ที่สุดบนหน้า
- summary card ต้องอ่านง่ายใน 5-8 วินาที
- dimension balance ต้องแสดงเป็น bar/comparison ไม่ใช่ text อย่างเดียว
- premium teaser ต้องดูเหมือน unlockable module ไม่ใช่ ad banner
- result ควรมี artifact layer map ที่บอกลำดับการอ่านข้อมูลก่อนลงไปใน detail modules
- signal summary ด้านบนของ dimension block ควรบอก winner ของแต่ละแกนแบบสแกนเร็วได้

## Dashboard-specific rules

- latest artifact ต้องอยู่เหนือ history
- history เป็น archive feel ไม่ใช่ social feed feel
- offline modules ต้องชัดว่าเป็น `relaunch queue`

## Motion overrides

- quiz question switch: opacity + y + slight scale
- result section reveal: staggered blocks
- dashboard cards: gentle reveal, no exaggerated parallax
- landing / quiz / result / dashboard ควรใช้ reusable motion primitives กลาง ไม่ฝัง transition object ใหม่ในทุกหน้า
- ambient scene ต้องเปลี่ยนตาม route context:
  - quiz = more focused, narrower glow
  - result = brighter gold/violet payoff
  - dashboard = calmer archive mood
- reduced motion path ต้องยังคง fade + hierarchy ได้ แม้ปิด drift motion

## Interaction pacing

- quiz ควรแบ่ง perception ออกเป็น phases ไม่ใช่ไหลเป็นคำถาม 48 ข้อติดกันแบบ flat
- result ควร reveal เป็นลำดับ:
  1. type anchor
  2. artifact layer map
  3. signal map
  4. deep modules
  5. answer trail
- dashboard ควรให้ latest artifact มาก่อน stats และ history อย่างชัดเจน

## Runtime messaging

ทุกหน้าต้องย้ำความจริงเดียวกัน:

- primary flow พร้อมทดสอบแล้ว
- account/cloud/share ยัง offline
- guest data อยู่ใน browser นี้
