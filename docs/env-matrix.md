# Environment Matrix

เอกสารนี้เป็น source-of-truth สำหรับการตั้งค่า environment variables ของ MBTI product ระหว่าง local development, Vercel preview, และ production

## Environment targets

| Target | Typical source | Notes |
| --- | --- | --- |
| `development` | `.env.local` | ใช้สำหรับ local dev และ local verification |
| `preview` | Vercel Preview Environment | ใช้กับ branch previews และ QA |
| `production` | Vercel Production Environment | ใช้กับ domain จริง |

## Variable matrix

| Variable | Group | Required | Used by | Expected source |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | App URLs | development, preview, production | email links, share links, card/result URLs | local file or Vercel env |
| `AUTH_URL` | App URLs | when account runtime is enabled | canonical Auth.js callback/session URL | local file or Vercel env |
| `NEXTAUTH_URL` | App URLs | compatibility alias when account runtime is enabled | legacy Auth.js callback/session URL | local file or Vercel env |
| `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME` | Runtime | optional in development, preview, production | selects assessment runtime adapter (`guest-local` now, `cloud` later) | local file or Vercel env |
| `AUTH_SECRET` | Auth | when account runtime is enabled | canonical Auth.js JWT/session signing secret | local file or Vercel env |
| `NEXTAUTH_SECRET` | Auth | compatibility alias when account runtime is enabled | legacy Auth.js JWT/session signing secret | local file or Vercel env |
| `GOOGLE_CLIENT_ID` | Auth | development, preview, production | Google OAuth provider | local file or Vercel env |
| `GOOGLE_CLIENT_SECRET` | Auth | development, preview, production | Google OAuth provider | local file or Vercel env |
| `GITHUB_ID` | Auth | development, preview, production | GitHub OAuth provider | local file or Vercel env |
| `GITHUB_SECRET` | Auth | development, preview, production | GitHub OAuth provider | local file or Vercel env |
| `DATABASE_URL` | Database | development, preview, production | Prisma runtime connection | local file, Supabase, Vercel env |
| `DIRECT_URL` | Database | preview, production strongly recommended | Prisma migrations/direct connection | local file, Supabase, Vercel env |
| `EMAIL_SERVER_HOST` | Email | future account runtime only | verification/reset email transport; no active transport is installed | local file or Vercel env |
| `EMAIL_SERVER_PORT` | Email | future account runtime only | verification/reset email transport | local file or Vercel env |
| `EMAIL_SERVER_SECURE` | Email | future account runtime only | verification/reset email transport | local file or Vercel env |
| `EMAIL_SERVER_USER` | Email | future account runtime only | verification/reset email transport | local file or Vercel env |
| `EMAIL_SERVER_PASSWORD` | Email | future account runtime only | verification/reset email transport | local file or Vercel env |
| `EMAIL_FROM` | Email | future account runtime only | sender identity for transactional email | local file or Vercel env |
| `PUSHER_APP_ID` | Realtime | development, preview, production | server-side realtime notifications | local file or Vercel env |
| `PUSHER_KEY` | Realtime | development, preview, production | server-side realtime notifications | local file or Vercel env |
| `PUSHER_SECRET` | Realtime | development, preview, production | server-side realtime notifications | local file or Vercel env |
| `PUSHER_CLUSTER` | Realtime | development, preview, production | server-side realtime notifications | local file or Vercel env |
| `NEXT_PUBLIC_PUSHER_KEY` | Realtime | development, preview, production | client-side realtime subscription | local file or Vercel env |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Realtime | development, preview, production | client-side realtime subscription | local file or Vercel env |
| `CLOUDINARY_CLOUD_NAME` | Media | development, preview, production | uploads and media delivery | local file or Vercel env |
| `CLOUDINARY_API_KEY` | Media | development, preview, production | uploads and media delivery | local file or Vercel env |
| `CLOUDINARY_API_SECRET` | Media | development, preview, production | uploads and media delivery | local file or Vercel env |

## Expected values by target

### Development

- `NEXT_PUBLIC_SITE_URL` และ `NEXTAUTH_URL` สามารถเป็น `http://localhost:3000`
- `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME` ควรเป็น `guest-local` ใน state ปัจจุบันของ repo นี้
- `DATABASE_URL` และ `DIRECT_URL` สามารถชี้ local Postgres หรือ temporary Supabase project ได้
- placeholder values ใช้ได้เฉพาะใน `.env.example` ไม่ควรใช้ใน `.env.local`

### Preview

- `NEXT_PUBLIC_SITE_URL` ควรเป็น preview deployment URL
- `NEXTAUTH_URL` ควรตรงกับ preview deployment URL
- `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME` ควรยังเป็น `guest-local` จนกว่า cloud adapter จะถูกเชื่อมกับ Supabase target จริง
- `DATABASE_URL` และ `DIRECT_URL` ควรเป็นค่าจาก Supabase project จริง
- ห้ามใช้ `localhost`, `127.0.0.1`, หรือ placeholder values

### Production

- `NEXT_PUBLIC_SITE_URL` ควรเป็น domain จริง
- `NEXTAUTH_URL` ควรเป็น domain จริงเดียวกัน
- `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME` เปลี่ยนเป็น `cloud` ได้ก็ต่อเมื่อ cloud adapter และ live persistence path ถูก verify แล้วเท่านั้น
- `DATABASE_URL` และ `DIRECT_URL` ควรเป็นค่าจาก Supabase project production
- ทุก secret ต้องเป็นค่าจริง ไม่ใช่ placeholder

## Verification commands

ใช้คำสั่งนี้สำหรับ local env:

```bash
node scripts/check-env.mjs --target=development --file=.env.local
```

ใช้คำสั่งนี้ก่อนผูก preview/prod:

```bash
node scripts/launch-preflight.mjs --target=preview --file=.env.local
```

`launch-preflight` ตรวจทั้ง repo hygiene, auth surface isolation, Supabase target readiness, required Supabase migration summary, Vercel target readiness, cloud runtime readiness, required docs/scaffolds, และ env deploy blockers ในรอบเดียว.
Vercel target readiness รวม local deploy contract ด้วย: `npm`, `package-lock.json`, `npm run build`, และ scripts ที่ต้องมีสำหรับ verify/preflight.

ใช้คำสั่งนี้เพื่อสร้าง launch handoff packet แบบไม่พิมพ์ secret สำหรับส่งต่อขั้น external setup:

```bash
npm run launch:handoff -- --target=preview --file=.env.example
```

ใช้คำสั่งนี้เพื่อตรวจ Supabase project ref จาก `DATABASE_URL` และ `DIRECT_URL` โดยไม่พิมพ์ secret และยืนยันว่า required migration dirs สำหรับ fresh target ยังอยู่ครบ:

```bash
node scripts/supabase-target-readiness.mjs --target=preview --file=.env.local
```

ใช้คำสั่งนี้เพื่อตรวจ `.vercel/project.json` เทียบกับ approved Vercel project/org target โดยไม่ต้อง deploy:

```bash
node scripts/vercel-target-readiness.mjs --target=preview
```

คำสั่งเดียวกันจะตรวจ repo deploy contract สำหรับ Vercel ด้วย เพื่อกันการ bind project ผิด root/package manager/build command ก่อนเริ่ม deploy จริง.

ใช้คำสั่งนี้เพื่อตรวจว่า legacy auth/admin/social surface ยังถูก isolate ไว้ก่อน reconnect จริง:

```bash
npm run auth:surface
npm run auth:runtime
```

ใช้คำสั่งนี้เพื่อแยก cloud runtime blocker ออกจาก env/Vercel blocker:

```bash
node scripts/cloud-runtime-readiness.mjs --target=preview --file=.env.local
```

ใช้คำสั่งนี้เพื่อตรวจ runtime fallback guard โดยไม่ต้องพึ่ง secret:

```bash
npm run runtime:guards
npm run runtime:guards:cloud
```

## Deploy blocking env rules

สำหรับ `preview` และ `production`, env validation ต้อง fail ถ้าเจอสิ่งเหล่านี้:

- placeholder values เช่น `replace-with-*`, `example.com`, `your-api-key`, หรือ `ci-secret`
- URL หรือ database connection ที่ยังชี้ `localhost` หรือ `127.0.0.1`
- `NEXT_PUBLIC_SITE_URL` หรือ `NEXTAUTH_URL` ที่ไม่ใช่ `http/https`
- `NEXT_PUBLIC_SITE_URL` และ `NEXTAUTH_URL` คนละ origin หรือใช้ non-HTTPS deploy URL
- `DATABASE_URL` หรือ `DIRECT_URL` ที่ไม่ใช่ connection string
- `DATABASE_URL` หรือ `DIRECT_URL` ที่ไม่ได้ใช้ `postgres://` หรือ `postgresql://`
- `DATABASE_URL` หรือ `DIRECT_URL` ที่ไม่ได้ชี้ Supabase host/ref ที่ approved สำหรับ target นั้น
- `.vercel/project.json` ไม่มีอยู่, parse ไม่ได้, หรือไม่ได้ชี้ Vercel project/org ที่ approved สำหรับ target นั้น
- `EMAIL_SERVER_PORT` ไม่ใช่ integer port, `EMAIL_SERVER_SECURE` ไม่ใช่ `true/false`, หรือ `EMAIL_FROM` ไม่ใช่อีเมลที่ parse ได้
- `NEXTAUTH_SECRET` สั้นกว่า 32 ตัวอักษร, `PUSHER_KEY` ไม่ตรงกับ `NEXT_PUBLIC_PUSHER_KEY`, หรือ `PUSHER_CLUSTER` ไม่ตรงกับ `NEXT_PUBLIC_PUSHER_CLUSTER`
- `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud` ก่อนที่ Supabase-backed adapter จะถูก implement และ verify จริง

สำหรับ `development`, ค่าเหล่านี้ยังถูก report เป็น warning เพื่อช่วย debug แต่ preview/production ต้องถือเป็น blocker.
