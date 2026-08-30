# MBTI Project Architecture Overview

## Snapshot

- Framework: Next.js 16 with Pages Router and one bounded App Route for Auth.js
- Language: TypeScript
- Styling: Tailwind CSS v3 with `shadcn/ui` primitives and premium marketing theme
- Auth: Auth.js v5 beta with Google, GitHub, and credentials providers; account runtime remains held
- Database layer: Prisma over PostgreSQL
- Deployment target: Vercel
- Production database target: Supabase Postgres

## Current Product Surfaces

### Marketing and onboarding

- `/` premium bilingual landing page
- `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`
- `/setup-username`, `/setup-profile`

### Core user experience

- `/quiz`
- `/result/[id]`
- `/dashboard`
- `/profile`, `/profile/[username]/*`
- `/explore`, `/leaderboard`

### Social and card features preserved from the existing product

- `/card/[id]`
- `/card/me`
- activity feed, likes, comments, follows, notifications

### Admin

- `/admin`
- `/admin/cards`
- `/admin/comments`
- `/admin/settings`
- `/admin/users`

## Routing and access control

- `pages/_app.tsx` supports per-page layout overrides through `getLayout`
- There is currently no active Next middleware. The old pass-through `/admin` middleware was removed because the route-level hold states already render directly.
- The active guest product path does not require auth redirects:
  - `/quiz`, `/result/[id]`, and `/dashboard` run through the guest-local runtime.
  - account, profile, social, share, and admin pages are intentional hold/relaunch states until cloud/auth persistence is reconnected.
  - server-side authorization still has to be enforced before reopening account, admin, social, upload, or cloud-backed endpoints.

## Backend layout

### Auth and session

- `auth.ts` owns the Auth.js configuration and exports the shared handlers/session helper
- `app/api/auth/[...nextauth]/route.ts` exposes the Auth.js handler only when an auth secret exists; otherwise it returns `503 account_runtime_held`
- `lib/server-auth.ts` adapts Auth.js to protected Pages API routes and returns no session when auth is not configured
- providers:
  - Google OAuth
  - GitHub OAuth
  - email/password credentials
- session strategy: JWT
- register, verification, password reset, and username availability endpoints intentionally return `503 account_runtime_held` until the account/email persistence slice is rebuilt and verified

### Database access

- `lib/prisma.ts` exposes the Prisma client singleton
- `prisma/schema.prisma` is the schema source of truth
- `prisma/migrations/*` contains historical migrations from the legacy app

### API route groups

- Auth and account:
  - `pages/api/register.ts`
  - `pages/api/forgot-password.ts`
  - `pages/api/reset-password.ts`
  - `pages/api/check-username.ts`
  - `pages/api/user/set-username.ts`
  - `pages/api/settings/*`
- Quiz and MBTI:
  - `pages/api/quiz/submit.ts`
- Social:
  - `pages/api/cards/*`
  - `pages/api/comment/*`
  - `pages/api/follow*`
  - `pages/api/activity*`
  - `pages/api/notifications/index.ts`
  - `pages/api/leaderboard.ts`
- Profile and media:
  - `pages/api/profile/updateBio.ts`
  - `pages/api/upload-image.ts`

## UI component structure

- `components/marketing/*` contains the premium landing system
- `components/ui/*` contains shared `shadcn/ui` primitives
- `components/admin/*` contains admin layouts and sections
- legacy social UI remains under `components/*`

## Current technical debt to keep in mind

- The repo was moved from `mbti_test/` to root, so Git history currently looks like large delete/add operations until staged carefully
- Next.js 16 production builds are pinned to Webpack because the default Turbopack collector intermittently failed to resolve generated admin page modules; source/type compilation itself passed
- The active guest quiz runtime currently serves 60 localized questions: 48 core MBTI questions and 12 Movie Profile questions.
- `QuizResult` and the authenticated APIs still represent the next cloud persistence phase; keep guest-local behavior independent while reconnecting them.
- existing social/card features should be preserved or intentionally retired while the MBTI product becomes database-driven

## Recommended near-term source-of-truth split

- Product scope and copy: Notion
- Tasks, PRs, release workflow: GitHub
- Runtime deployment: Vercel
- Runtime database: Supabase
- Schema and migrations: Prisma in this repo
