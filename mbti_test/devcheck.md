# Dev Checklist for Adding New Feature

✅ 1. อัปเดต schema ใน `prisma/schema.prisma` (ถ้าจำเป็น)
✅ 2. สร้าง migration และ `npx prisma generate`
✅ 3. เพิ่ม API ใหม่ใน `/api/...`
✅ 4. ใช้ Type ที่ตรงกันใน `/types/...`
✅ 5. อัปเดต `lib/activity.ts` และ `lib/notification.ts` (ถ้า trigger ได้)
✅ 6. UI component ใหม่ → วางใน `/components/...`
✅ 7. ตรวจสอบว่า component นั้น link ได้ (profile, card)
✅ 8. หากมี state → จัดการด้วย Zustand หรือ Context
✅ 9. ทดสอบ Pusher (ถ้ามีแจ้งเตือนหรือ feed)
✅ 10. ทดสอบ UX โดยดูจาก mobile / desktop ทั้งคู่
