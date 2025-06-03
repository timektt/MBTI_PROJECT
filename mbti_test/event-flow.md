# Real-Time Event Flow

## 1. User กด Like การ์ด
→ call `POST /api/card/like`  
→ ✅ validate `cardId` ด้วย Zod (`ToggleCardLikeSchema`)  
→ trigger `createActivity()` + `createNotification()`  
→ 🔄 Pusher ส่ง event → Notification dropdown + ActivityFeed

## 2. User คอมเมนต์
→ call `POST /api/comment/post`  
→ ✅ validate `cardId`, `content` ด้วย Zod (`PostCommentSchema`)  
→ บันทึก comment  
→ trigger `createActivity()` + `createNotification()`  
→ 🔄 Pusher ส่ง update → Feed + Notification

## 3. User Follow คนอื่น
→ call `POST /api/follow/toggle`  
→ ✅ validate `followingId` ด้วย Zod (`ToggleFollowSchema`)  
→ trigger `createFollow()`, `createNotification()`  
→ update followers count → NotificationBell

## 4. User Like คอมเมนต์
→ call `POST /api/comment/like-toggle`  
→ ✅ validate `commentId` ด้วย Zod (`ToggleCommentLikeSchema`)  
→ create / delete Like  
→ trigger `createActivity()`  
→ 🔄 Pusher → ActivityFeed

## 5. User Register
→ call `POST /api/register`  
→ ✅ validate `email`, `password`, `name` ด้วย Zod (`RegisterUserSchema`)  
→ สร้าง user + log activity

## 6. User อัปเดตโปรไฟล์
→ call `POST /api/settings/update` หรือ `/api/profile/updateBio`  
→ ✅ validate `username`, `bio`, `image` ด้วย Zod (`UpdateProfileSchema`)  
→ update user → feed/หน้าโปรไฟล์อัปเดตทันที

## 7. User อัปโหลดภาพ
→ call `POST /api/upload-image`  
→ ✅ validate `imageBase64` ด้วย Zod (`UploadImageSchema`)  
→ อัปโหลดขึ้น Cloudinary → คืน URL

## 8. User ทำแบบทดสอบ MBTI
→ call `POST /api/quiz/submit`  
→ ✅ validate `answers.q1–q4` ด้วย Zod (`QuizAnswersSchema`)  
→ generate result + สร้างการ์ด  
→ trigger `createActivity()`  

---

## ✅ ทุก Event:
- validate input ด้วย Zod ก่อนประมวลผล
- สร้าง Activity เสมอ (เช่น Like, Follow, Register)
- ส่งข้อมูลผ่าน Pusher → UI real-time
- ป้องกัน invalid request โดย schema ที่ชัดเจน

