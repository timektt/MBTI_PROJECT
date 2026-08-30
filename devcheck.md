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

---

### ✅ Validation Checklist (Zod Schema Integration)

🧩 A. เพิ่ม schema ใหม่ใน `lib/schema.ts` สำหรับ:
- ✅ CreateCardSchema
- ✅ PostCommentSchema
- ✅ SetUsernameSchema
- ✅ UpdateProfileSchema
- ✅ ChangePasswordSchema
- ✅ QuizAnswersSchema
- ✅ UploadImageSchema
- ✅ RegisterUserSchema
- ✅ ToggleCommentLikeSchema
- ✅ ToggleFollowSchema

🛠 B. ใน API ที่ใช้ `req.body` → ต้องใช้ `safeParse()` เสมอ:
- ✅ Validate ด้วย Zod ก่อนใช้ข้อมูลจริง
- ✅ คืน `flatten()` error หากไม่ผ่าน
- ✅ ไม่ใช้ manual `if (!xxx || typeof xxx !== ...)` อีกต่อไป

🧪 C. ตรวจสอบว่า API ทุกจุดใช้ schema ที่ตรงกับ logic:
- `/api/card/create.ts`
- `/api/comment/post.ts`
- `/api/user/set-username.ts`
- `/api/user/change-password.ts`
- `/api/settings/update.ts`
- `/api/profile/updateBio.ts`
- `/api/upload-image.ts`
- `/api/register.ts`
- `/api/follow/toggle.ts`
- `/api/comment/like-toggle.ts` (ถ้ามี)

📦 D. ไม่ต้องใช้ `schema.ts` สำหรับ:
- ✅ API ที่ใช้ `GET` และรับข้อมูลจาก `req.query`
- ✅ ไฟล์ `.tsx` ยกเว้นต้อง validate ฟอร์มฝั่ง client

