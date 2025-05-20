# Project Structure Overview

## 📁 /pages
- `index.tsx` → หน้า Home
- `/card/[id].tsx` → ดูผลการ์ด MBTI
- `/profile/[id].tsx` → หน้าโปรไฟล์ผู้ใช้
- `/settings.tsx` → หน้าแก้ไขโปรไฟล์
- `/activity.tsx` → ดูกิจกรรมทั้งหมด
- `/feed.tsx` → (แผนทำ) ดูเฉพาะคนที่ follow
- `/leaderboard.tsx` → (แผนทำ) อันดับผู้ใช้ยอดนิยม

## 📁 /components
- `CardItem.tsx` → UI แสดงการ์ด MBTI
- `CommentSection.tsx` → กล่อง comment
- `LikeButton.tsx` → ปุ่มกด Like
- `NotificationBell.tsx` → Icon + dropdown แจ้งเตือน
- `ProfileHeader.tsx` → แสดงข้อมูลผู้ใช้ในโปรไฟล์

## 📁 /lib
- `pusher.ts` → Pusher server config
- `activity.ts` → ฟังก์ชันสร้าง activity
- `notification.ts` → ฟังก์ชันสร้างแจ้งเตือน
- `prisma.ts` → Client Prisma

## 📁 /types
- `activity.ts` → ENUM / Types ของกิจกรรม
- `user.ts` → User model type, interface

## 📁 /api
- `/api/card/like.ts` → Like การ์ด
- `/api/comment/post.ts` → คอมเมนต์
- `/api/follow/toggle.ts` → Follow / Unfollow
- `/api/notification/get.ts` → ดึงแจ้งเตือน
