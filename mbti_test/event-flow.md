# Real-Time Event Flow

## 1. User กด Like การ์ด
→ call `/api/card/like`
→ trigger createActivity() + createNotification()
→ Pusher ส่ง event → Notification dropdown + ActivityFeed

## 2. User คอมเมนต์
→ call `/api/comment/post`
→ บันทึก comment
→ trigger createActivity() + createNotification()
→ Pusher ส่ง update → Feed + Notification

## 3. User Follow คนอื่น
→ call `/api/follow/toggle`
→ trigger createFollow(), createNotification()
→ update followers count → NotificationBell

## ทุก Event:
✅ สร้าง Activity
✅ ส่ง Pusher
✅ Update UI แบบ real-time
