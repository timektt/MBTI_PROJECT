# MBTI Project – Real-Time Social System

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It features real-time interaction powered by Pusher, Prisma, and a fully functional user system with authentication, activity logging, and notifications.

---

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Development Checklist

### ✅ Dev Checklist for Adding New Feature

1. อัปเดต schema ใน `prisma/schema.prisma` (ถ้าจำเป็น)
2. สร้าง migration และรัน `npx prisma generate`
3. เพิ่ม API ใหม่ใน `/api/...`
4. ใช้ Type ที่ตรงกันใน `/types/...`
5. อัปเดต `lib/activity.ts` และ `lib/notification.ts` (ถ้ามี trigger)
6. สร้าง UI component ใหม่ใหม่ใน `/components/...`
7. ตรวจสอบว่า component นั้น link ได้ (profile, card)
8. หากมี state → จัดการด้วย Zustand หรือ Context
9. ทดสอบ Pusher (ถ้ามีแจ้งเตือนหรือ feed)
10. ทดสอบ UX ทั้ง mobile และ desktop

---

### 🔁 Real-Time Event Flow

#### 1. User กด Like การ์ด

* → call `/api/card/like`
* → trigger `createActivity()` + `createNotification()`
* → Pusher ส่ง event → Notification dropdown + ActivityFeed

#### 2. User คอมเมนต์

* → call `/api/comment/post`
* → บันทึก comment
* → trigger `createActivity()` + `createNotification()`
* → Pusher ส่ง update → Feed + Notification

#### 3. User Follow คนอื่น

* → call `/api/follow/toggle`
* → trigger `createFollow()`, `createNotification()`
* → update followers count → NotificationBell

#### 🔁 ทุก Event:

* ✅ สร้าง Activity
* ✅ ส่ง Pusher
* ✅ Update UI แบบ real-time

---

## 🧠 Learn More

* [Next.js Documentation](https://nextjs.org/docs)
* [Learn Next.js](https://nextjs.org/learn)
* [Next.js GitHub](https://github.com/vercel/next.js)

---

## 🚢 Deploy

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

See: [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 🛆 Fonts

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load [Geist](https://vercel.com/font).

---

## 📁 Structure Overview

```
/pages
  ├─ /card/[id].tsx → ดูกการ์ด
  ├─ /profile/[id].tsx → โปรไฟล์
  ├─ /settings.tsx → แก้ไขโปรไฟล์
  ├─ /activity.tsx → Activity Feed
  ├─ /feed.tsx → (future) เฉพาะ follow
  └─ /leaderboard.tsx → (future) อันดับผู้ใช้

/components
  ├─ CardItem.tsx → แสดงการ์ด
  ├─ CommentSection.tsx → กล่องคอมเมนต์
  ├─ LikeButton.tsx → ปุ่ม Like
  ├─ NotificationBell.tsx → แจ้งเตือน
  └─ ProfileHeader.tsx → หัวโปรไฟล์

/lib
  ├─ prisma.ts → Prisma Client
  ├─ activity.ts → ฟังก์ชัน Activity
  ├─ notification.ts → ฟังก์ชัน Notification
  └─ pusher.ts → Config Pusher

/types
  ├─ user.ts → User types
  └─ activity.ts → Enum + Types

/api
  ├─ /card/like.ts → กด Like การ์ด
  ├─ /comment/post.ts → คอมเมนต์
  ├─ /follow/toggle.ts → Follow
  └─ /notification/get.ts → ดึงแจ้งเตือน
```

---

✅ ระบบนี้พร้อมขยายและรองรับ Production-grade interaction แล้ว
