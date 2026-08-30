# MBTI Product Task Backlog

เอกสารนี้คือ task backlog สำหรับต่อยอด MBTI Project จากสถานะปัจจุบันไปเป็น full product ที่มี `Landing`, `Login`, `Profile`, `Dashboard`, `Saved Results`, `Quiz`, `Result`, `Premium Report`, `Share Card`, production database, deployment pipeline และ workflow ที่ใช้ Notion + GitHub + Supabase + Vercel อย่างเป็นระบบ

## Current Baseline

- Stack: Next.js Pages Router, TypeScript, Tailwind CSS v3, NextAuth, Prisma
- UI foundation: guest-first `MBTI Z` cyber-dark shell, shadcn/ui base components, design system docs
- Existing product surface: guest-first landing/quiz/result/dashboard, account hold pages, legacy auth/profile/card/social/admin pages
- Known cleanup items: root move diff still large, tracked `mbti_test/db_data/*` files, legacy tracked `/reset-password` duplicates under old `mbti_test/` history until root move is normalized

## Operating Rules

- GitHub is the engineering source of truth for tasks, PRs, branches, and release checks.
- Notion is the product source of truth for PRD, copy, question bank, roadmap, and release planning.
- Supabase is the production Postgres host. Prisma remains the schema and migration source of truth.
- Vercel is the hosting and preview deployment surface.
- Do not introduce payment or Supabase Auth until the database-driven quiz/result loop is stable.

## Task Fields

Use these fields in Notion and GitHub:

| Field | Meaning |
| --- | --- |
| ID | Stable task ID |
| Phase | Work phase |
| Tool | Main tool/system involved |
| Priority | P0, P1, P2 |
| Dependency | Must be done before this task |
| Output | Concrete deliverable |
| Acceptance Criteria | How we know it is done |

## Phase 0: Repo Stabilization

### MBTI-0001: Normalize moved root project state

- Phase: Repo Stabilization
- Tool: GitHub
- Priority: P0
- Dependency: none
- Output: Clean Git diff that clearly represents the project move from `mbti_test/` to repo root
- Work:
  - Run `npm run repo:hygiene`
  - Run `git status --short`
  - Confirm all moved files exist at root
  - Confirm no real source files are stranded under `mbti_test/`
  - Remove tracked `mbti_test/db_data/*` paths from the index in the same dedicated hygiene PR
  - Keep `node_modules`, `.next`, `.env.local`, and generated data uncommitted
  - Prepare a clean staging strategy using explicit pathspecs rather than a broad `git add -A`
- Acceptance Criteria:
  - `mbti_test/` no longer contains source files
  - tracked `mbti_test/db_data/*` paths are gone from the index
  - source move audit has no unreviewed old-root source files missing root counterparts
  - root has `package.json`, `pages`, `components`, `prisma`, `styles`
  - GitHub PR shows moves/renames as clearly as possible
  - `npm run repo:hygiene:strict` passes

### MBTI-0002: Verify reset-password route after root move

- Phase: Repo Stabilization
- Tool: GitHub
- Priority: P0
- Dependency: MBTI-0001
- Output: Confirm only one active `/reset-password` page remains after the moved root app is staged
- Latest evidence: 2026-06-26 root app has only `pages/reset-password.tsx`; `npm run build` passes with one `/reset-password` page and `/api/reset-password` as an API route.
- Work:
  - Inspect `pages/reset-password.tsx`
  - Confirm `pages/reset-password.ts` does not exist in the root app
  - Confirm any duplicate tracked files are only old `mbti_test/` paths being removed by MBTI-0001
  - Remove or rename any real duplicate route only if it still exists after MBTI-0001
  - Run `npm run build`
- Acceptance Criteria:
  - root app has only one page file for `/reset-password`
  - Dev server no longer warns about duplicate `/reset-password`
  - `/reset-password` still loads correctly
  - `npm run build` passes

### MBTI-0003: Add missing script hygiene

- Phase: Repo Stabilization
- Tool: GitHub
- Priority: P1
- Dependency: MBTI-0001
- Output: `package.json` has consistent verification scripts
- Latest evidence: 2026-06-26 `npm run verify` now covers repo hygiene, data validation, reconnect import verification, runtime fallback guards, cloud API client contract verification, cloud adapter lifecycle verification, lint, typecheck, and production build.
- Work:
  - Add `typecheck`: `tsc --noEmit`
  - Add `verify`: run lint + typecheck + build
  - Add focused verification scripts for reconnect import and runtime fallback
  - Add mock-fetch cloud API client contract verification
  - Add mock-fetch cloud service adapter lifecycle verification
  - Keep existing `dev`, `build`, `start`, `lint`
  - Avoid changing package manager
- Acceptance Criteria:
  - `npm run typecheck` works
  - `npm run reconnect:verify` works
  - `npm run runtime:guards:all` works
  - `npm run cloud:contracts` works
  - `npm run cloud:adapter` works
  - `npm run verify` works or fails only on known existing issues that are documented

### MBTI-0004: Create `.env.example`

- Phase: Repo Stabilization
- Tool: GitHub, Vercel, Supabase
- Priority: P0
- Dependency: MBTI-0001
- Output: Safe `.env.example` with env key names only
- Work:
  - Inspect env usage in `lib`, `pages/api`, `prisma`, auth config
  - Add names only, no secret values
  - Group env vars by Auth, Database, OAuth, Email, Media, App URL
- Acceptance Criteria:
  - `.env.example` exists
  - no real secret is committed
  - Vercel env setup can be done from the file

### MBTI-0005: Document current product architecture

- Phase: Repo Stabilization
- Tool: Notion, GitHub
- Priority: P1
- Dependency: MBTI-0001
- Output: `docs/architecture-overview.md`
- Work:
  - Map current pages
  - Map API routes
  - Map auth/session flow
  - Map Prisma models
  - Identify legacy social/card features to preserve
- Acceptance Criteria:
  - A new engineer can understand the repo in 10 minutes
  - Conflicts between docs and code are marked clearly

## Phase 1: Notion Product Workspace

### MBTI-0101: Create Notion Product HQ

- Phase: Product Planning
- Tool: Notion
- Priority: P0
- Dependency: MBTI-0005
- Output: Main Notion page named `MBTI Product HQ`
- Work:
  - Create top-level sections: Vision, Roadmap, PRD, Design, Data, Launch
  - Link GitHub repo
  - Link Vercel project when available
  - Link Supabase project when available
- Acceptance Criteria:
  - One Notion page becomes the product command center
  - All important product docs are linked from this page

### MBTI-0102: Create PRD in Notion

- Phase: Product Planning
- Tool: Notion
- Priority: P0
- Dependency: MBTI-0101
- Output: `PRD - Premium MBTI Platform`
- Work:
  - Define target audience: Thai Gen Z first, bilingual expansion
  - Define core promise: premium self-discovery + psychology lab trust
  - Define primary conversion: start quiz
  - Define secondary conversion: login/save/unlock premium report
  - Define user flows
  - Define out-of-scope items for MVP
- Acceptance Criteria:
  - PRD has clear MVP scope
  - PRD distinguishes free vs premium value
  - PRD includes success metrics

### MBTI-0103: Create Notion Roadmap database

- Phase: Product Planning
- Tool: Notion, GitHub
- Priority: P0
- Dependency: MBTI-0101
- Output: Roadmap database
- Work:
  - Fields: Task ID, Title, Phase, Status, Priority, GitHub Issue, Release, Owner
  - Add phases from this document
  - Add status options: Backlog, Ready, In Progress, Review, Blocked, Done
- Acceptance Criteria:
  - Every task in this document can be imported into the database
  - GitHub issue links can be pasted into each row

### MBTI-0104: Create Quiz Question Bank database

- Phase: Product Planning
- Tool: Notion, Supabase
- Priority: P0
- Dependency: MBTI-0102
- Output: Editable bilingual question bank
- Work:
  - Fields: Question ID, Dimension, Text TH, Text EN, Option A TH, Option A EN, Option B TH, Option B EN, Weight, Version, Active
  - Add starter dimensions: `E/I`, `S/N`, `T/F`, `J/P`
  - Add quality status: Draft, Reviewed, Approved
- Acceptance Criteria:
  - The database can export to seed data later
  - Questions are versioned
  - Both Thai and English fields exist

### MBTI-0105: Create Result Content Matrix

- Phase: Product Planning
- Tool: Notion, Supabase
- Priority: P0
- Dependency: MBTI-0102
- Output: Content matrix for 16 MBTI types
- Work:
  - Fields: Type, Locale, Section, Free/Premium, Copy, Status
  - Sections: Summary, Strengths, Blind Spots, Growth Map, Relationship, Career, Stress Pattern
  - Add placeholder rows for all 16 types
- Acceptance Criteria:
  - All 16 MBTI types have Thai and English placeholders
  - Free content and premium content are separated

### MBTI-0106: Create Data Dictionary

- Phase: Product Planning
- Tool: Notion, Supabase, GitHub
- Priority: P1
- Dependency: MBTI-0201
- Output: Database documentation page
- Work:
  - Document table name, field name, type, owner, privacy level
  - Document sensitive fields
  - Document retention assumptions
  - Document user data deletion behavior
- Acceptance Criteria:
  - Every new model has an entry
  - Sensitive data is clearly marked

## Phase 2: GitHub Workflow

### MBTI-0201: Create GitHub milestones

- Phase: Engineering Workflow
- Tool: GitHub
- Priority: P0
- Dependency: MBTI-0103
- Output: GitHub milestones
- Work:
  - Create milestone `M0 Repo Stabilization`
  - Create milestone `M1 Data Foundation`
  - Create milestone `M2 Quiz Engine`
  - Create milestone `M3 Result Experience`
  - Create milestone `M4 Dashboard`
  - Create milestone `M5 Share Card`
  - Create milestone `M6 Production Launch`
- Acceptance Criteria:
  - Each milestone exists in GitHub
  - Each milestone has a short goal statement

### MBTI-0202: Create GitHub issue templates

- Phase: Engineering Workflow
- Tool: GitHub
- Priority: P1
- Dependency: MBTI-0201
- Output: `.github/ISSUE_TEMPLATE`
- Work:
  - Add feature template
  - Add bug template
  - Add design task template
  - Add infrastructure template
  - Include acceptance criteria field
- Acceptance Criteria:
  - New issues are consistently structured
  - Every issue requires expected output and validation

### MBTI-0203: Create PR template

- Phase: Engineering Workflow
- Tool: GitHub, Vercel
- Priority: P1
- Dependency: MBTI-0201
- Output: `.github/pull_request_template.md`
- Work:
  - Add summary
  - Add changed areas
  - Add screenshots section for UI changes
  - Add database migration section
  - Add validation commands
  - Add rollback notes
- Acceptance Criteria:
  - Every PR has enough context for review
  - UI PRs include screenshots or say why not
  - Migration PRs include impact notes

### MBTI-0204: Create first GitHub issue batch

- Phase: Engineering Workflow
- Tool: GitHub, Notion
- Priority: P0
- Dependency: MBTI-0201
- Output: First batch of GitHub issues linked to Notion
- Work:
  - Create issues for Phase 0 tasks
  - Create issues for Supabase setup
  - Create issues for Prisma models
  - Create issues for quiz engine
  - Link each issue back to Notion roadmap row
- Acceptance Criteria:
  - At least 15 issues created
  - Each issue has phase, priority, acceptance criteria

## Phase 3: Supabase and Data Foundation

### MBTI-0301: Create Supabase project

- Phase: Data Foundation
- Tool: Supabase
- Priority: P0
- Dependency: MBTI-0004
- Output: Supabase project with Postgres database
- Work:
  - Create project
  - Store project reference in Notion Product HQ
  - Copy database connection strings
  - Do not paste secrets into repo
- Acceptance Criteria:
  - Supabase project exists
  - `DATABASE_URL` and optional `DIRECT_URL` are available for local/Vercel env setup

### MBTI-0302: Connect local Prisma to Supabase

- Phase: Data Foundation
- Tool: Supabase, Prisma
- Priority: P0
- Dependency: MBTI-0301
- Output: Local app can connect to Supabase Postgres
- Work:
  - Add `DATABASE_URL` locally
  - Run non-destructive Prisma command
  - Verify connection with a read-only query
  - Avoid resetting database
- Acceptance Criteria:
  - Prisma can connect to Supabase
  - No destructive migration is run

### MBTI-0303: Design assessment schema

- Phase: Data Foundation
- Tool: Prisma, Supabase, Notion
- Priority: P0
- Dependency: MBTI-0106
- Output: proposed Prisma models for assessment system
- Work:
  - Add `QuizQuestion`
  - Add `QuizOption`
  - Add `AssessmentSession`
  - Add `AssessmentAnswer`
  - Add `PersonalityType`
  - Add `AssessmentResult`
  - Add `PremiumReport`
  - Add `ShareCard`
  - Add `EventLog`
- Acceptance Criteria:
  - Schema supports bilingual questions and results
  - Schema supports saved history
  - Schema supports premium report lock/unlock
  - Schema supports public share card slug

### MBTI-0304: Add Prisma migration for assessment schema

- Phase: Data Foundation
- Tool: Prisma, Supabase
- Priority: P0
- Dependency: MBTI-0303
- Output: migration files
- Work:
  - Generate Prisma migration locally
  - Review SQL
  - Check indexes for `userId`, `resultId`, `sessionId`, `slug`
  - Run migration against local/dev database first
- Acceptance Criteria:
  - Migration reviewed before production
  - `npm run build` still passes
  - Prisma client generated successfully

### MBTI-0305: Seed 16 personality types

- Phase: Data Foundation
- Tool: Prisma, Notion
- Priority: P0
- Dependency: MBTI-0304
- Output: seed data for all 16 MBTI types
- Work:
  - Add canonical type codes
  - Add Thai title
  - Add English title
  - Add free summary placeholder
  - Add premium placeholder sections
- Acceptance Criteria:
  - All 16 types exist
  - Thai and English fields exist
  - Seed is idempotent

### MBTI-0306: Seed first quiz question set

- Phase: Data Foundation
- Tool: Prisma, Notion
- Priority: P0
- Dependency: MBTI-0304
- Output: 40-80 bilingual quiz questions
- Work:
  - Export approved questions from Notion
  - Convert to seed data
  - Each question maps to one dimension
  - Each option maps to score direction
  - Add `version`
- Acceptance Criteria:
  - At least 40 active questions
  - All questions have Thai and English copy
  - Scoring direction is testable

### MBTI-0307: Add database health API

- Phase: Data Foundation
- Tool: Next.js, Supabase, Prisma
- Priority: P1
- Dependency: MBTI-0302
- Output: `/api/health/db`
- Latest evidence: 2026-06-26 route exists and passes cloud readiness static contract checks for method guard and safe response keys. It is also covered by `npm run cloud:contracts` with mock `fetch`. Live DB connectivity still requires a real Supabase target.
- Work:
  - Add authenticated or safe public health endpoint
  - Query database without returning sensitive data
  - Return status, timestamp, and app environment
- Acceptance Criteria:
  - Endpoint confirms database connectivity
  - No secrets or raw connection data are exposed

## Phase 4: Quiz Engine

### MBTI-0401: Replace hardcoded quiz question source

- Phase: Quiz Engine
- Tool: Next.js, Prisma, Supabase
- Priority: P0
- Dependency: MBTI-0306
- Output: quiz page loads questions from database
- Work:
  - Replace static question array in `pages/quiz.tsx`
  - Fetch active question set from API
  - Support `locale=th|en`
  - Add loading and error states
- Acceptance Criteria:
  - Quiz questions come from database
  - Thai and English display correctly
  - Existing auth requirement still works

### MBTI-0402: Implement quiz session start API

- Phase: Quiz Engine
- Tool: Next.js API, Prisma
- Priority: P0
- Dependency: MBTI-0304
- Output: `POST /api/quiz/start`
- Latest evidence: 2026-06-26 route exists and passes cloud readiness static contract checks for method guard, server-session auth, rate limiting, request schema, user-scoped Prisma access, and response keys. It is also covered by `npm run cloud:contracts` with mock `fetch`.
- Work:
  - Require authenticated user
  - Create `AssessmentSession`
  - Set status `IN_PROGRESS`
  - Return session ID and first question metadata
- Acceptance Criteria:
  - Session is created once per quiz attempt
  - User ID is linked
  - API rejects unauthenticated requests

### MBTI-0403: Implement answer save API

- Phase: Quiz Engine
- Tool: Next.js API, Prisma
- Priority: P0
- Dependency: MBTI-0402
- Output: `POST /api/quiz/answer`
- Latest evidence: 2026-06-26 route exists and passes cloud readiness static contract checks for method guard, server-session auth, rate limiting, request schema, user-scoped Prisma access, and response keys. It is also covered by `npm run cloud:contracts` with mock `fetch`.
- Work:
  - Validate session ownership
  - Validate question exists
  - Save or update answer
  - Update session progress
- Acceptance Criteria:
  - Duplicate answer updates existing row
  - User cannot write to another user's session
  - Invalid question/session returns clean error

### MBTI-0404: Implement quiz submit and scoring

- Phase: Quiz Engine
- Tool: Next.js API, Prisma
- Priority: P0
- Dependency: MBTI-0403
- Output: `POST /api/quiz/submit`
- Latest evidence: 2026-06-26 route exists and passes cloud readiness static contract checks for method guard, server-session auth, rate limiting, request schema, user-scoped Prisma access, and response keys. It is also covered by `npm run cloud:contracts` with mock `fetch`.
- Work:
  - Validate all required answers
  - Compute E/I, S/N, T/F, J/P scores
  - Determine MBTI type
  - Create `AssessmentResult`
  - Mark session `COMPLETED`
- Acceptance Criteria:
  - Result is deterministic
  - Scores are stored
  - API returns result ID

### MBTI-0405: Redesign quiz UI with premium system

- Phase: Quiz Engine
- Tool: Next.js, shadcn/ui
- Priority: P1
- Dependency: MBTI-0401
- Output: premium quiz page
- Work:
  - Apply design-system typography and semantic colors
  - Add progress indicator
  - Add answer transition
  - Add previous/next behavior
  - Add mobile sticky action
  - Respect reduced motion
- Acceptance Criteria:
  - Desktop and mobile layouts are polished
  - Text does not overflow
  - Keyboard focus is visible
  - `npm run build` passes

## Phase 5: Result and Premium Report

### MBTI-0501: Build result data API

- Phase: Result Experience
- Tool: Next.js API, Prisma
- Priority: P0
- Dependency: MBTI-0404
- Output: `GET /api/results/[id]`
- Latest evidence: 2026-06-26 current cloud readiness manifest covers `GET /api/me/results`, not `GET /api/results/[id]`; that route passes static contract checks for method guard, server-session auth, rate limiting, user-scoped Prisma access, and response keys. It is also covered by `npm run cloud:contracts` with mock `fetch`. The single-result API shape still needs a deliberate scope decision.
- Work:
  - Validate result ownership or public share permissions
  - Return type, scores, summary, premium lock state
  - Support locale
- Acceptance Criteria:
  - Owner can read full free result
  - Non-owner cannot access private result
  - Locale changes returned copy

### MBTI-0502: Redesign result page

- Phase: Result Experience
- Tool: Next.js, shadcn/ui
- Priority: P0
- Dependency: MBTI-0501
- Output: premium `/result/[id]` page
- Work:
  - Show MBTI type
  - Show free summary
  - Show strengths and blind spots teaser
  - Show score visualization
  - Show CTA to unlock premium report
  - Show CTA to share card
- Acceptance Criteria:
  - Page loads real result data
  - Free/premium separation is clear
  - Works on mobile
  - Build passes

### MBTI-0503: Create premium report scaffold

- Phase: Result Experience
- Tool: Prisma, Next.js
- Priority: P1
- Dependency: MBTI-0502
- Output: premium report data and UI placeholder
- Work:
  - Add locked sections
  - Add `premiumUnlocked` state
  - Add placeholder payment gate
  - Avoid adding Stripe until later phase
- Acceptance Criteria:
  - Premium report can be locked/unlocked in data
  - UI supports future payment integration

### MBTI-0504: Add result save behavior

- Phase: Result Experience
- Tool: Prisma, Next.js
- Priority: P0
- Dependency: MBTI-0502
- Output: completed results appear in user history
- Work:
  - Link result to user
  - Update user `hasMbtiCard`
  - Add latest result pointer if needed
- Acceptance Criteria:
  - User can revisit result from dashboard
  - Auth session updates after result creation

## Phase 6: Dashboard and History

### MBTI-0601: Build dashboard data API

- Phase: Dashboard
- Tool: Next.js API, Prisma
- Priority: P0
- Dependency: MBTI-0504
- Output: `GET /api/me/dashboard`
- Work:
  - Return latest result
  - Return result history
  - Return premium report state
  - Return share card count
- Acceptance Criteria:
  - Only current user data is returned
  - Empty state works for new users

### MBTI-0602: Redesign dashboard

- Phase: Dashboard
- Tool: Next.js, shadcn/ui
- Priority: P1
- Dependency: MBTI-0601
- Output: premium dashboard page
- Work:
  - Show latest type
  - Show saved history
  - Show next recommended action
  - Show premium report card
  - Show share card entry
- Acceptance Criteria:
  - Dashboard is useful after first result
  - Dashboard has clean empty state before result
  - Build passes

### MBTI-0603: Add result history view

- Phase: Dashboard
- Tool: Next.js, Prisma
- Priority: P1
- Dependency: MBTI-0601
- Output: result history list
- Work:
  - List past results
  - Show type, date, confidence, locale
  - Link to result detail
- Acceptance Criteria:
  - History is sorted newest first
  - Works with many results

## Phase 7: Share Card

### MBTI-0701: Add ShareCard model and API

- Phase: Share Card
- Tool: Prisma, Next.js API
- Priority: P1
- Dependency: MBTI-0502
- Output: `POST /api/share-card`
- Work:
  - Generate unique slug
  - Link to result
  - Store locale
  - Store public/private state
- Acceptance Criteria:
  - User can create a share card record
  - Slug is unique
  - Card is linked to result and user

### MBTI-0702: Build public share page

- Phase: Share Card
- Tool: Next.js
- Priority: P1
- Dependency: MBTI-0701
- Output: `/s/[slug]`
- Work:
  - Display public personality card
  - Hide private/premium details
  - Add Open Graph metadata
  - Add CTA back to start quiz
- Acceptance Criteria:
  - Public link works without login
  - No private data leaks
  - Social preview metadata exists

### MBTI-0703: Add image generation scaffold

- Phase: Share Card
- Tool: Next.js, HTML/CSS
- Priority: P2
- Dependency: MBTI-0702
- Output: share image generation plan or prototype
- Work:
  - Decide between client-side `html2canvas` and server-side image generation
  - Create static card layout first
  - Defer production image storage until storage choice is clear
- Acceptance Criteria:
  - Card layout is stable at fixed dimensions
  - Future image generation path is documented

## Phase 8: Vercel Deployment

### MBTI-0801: Create Vercel project

- Phase: Deployment
- Tool: Vercel, GitHub
- Priority: P0
- Dependency: MBTI-0201
- Output: Vercel project connected to GitHub
- Work:
  - Import repository into Vercel
  - Set framework to Next.js
  - Configure preview deploys for PRs
  - Configure production deploy from `main`
- Acceptance Criteria:
  - PR preview deployments work
  - Production deployment target exists

### MBTI-0802: Configure Vercel env vars

- Phase: Deployment
- Tool: Vercel, Supabase
- Priority: P0
- Dependency: MBTI-0301, MBTI-0004
- Output: Vercel env configured
- Work:
  - Add `DATABASE_URL`
  - Add `DIRECT_URL` if needed
  - Add `NEXTAUTH_SECRET`
  - Add `NEXTAUTH_URL`
  - Add OAuth keys
  - Add email/media envs if used
- Acceptance Criteria:
  - Preview env works
  - Production env works
  - No secret appears in GitHub

### MBTI-0803: Add production readiness checklist

- Phase: Deployment
- Tool: Notion, GitHub, Vercel
- Priority: P1
- Dependency: MBTI-0801
- Output: launch checklist
- Work:
  - Add build checklist
  - Add env checklist
  - Add migration checklist
  - Add auth checklist
  - Add rollback checklist
- Acceptance Criteria:
  - Release can be reviewed before deploy
  - Checklist is linked in Notion Product HQ

### MBTI-0804: Enable Vercel analytics and monitoring

- Phase: Deployment
- Tool: Vercel
- Priority: P2
- Dependency: MBTI-0801
- Output: basic analytics enabled
- Work:
  - Enable Vercel Analytics if available
  - Enable Speed Insights if available
  - Track landing and quiz performance
- Acceptance Criteria:
  - Basic page performance can be monitored

## Phase 9: Analytics and Event Logging

### MBTI-0901: Define event taxonomy

- Phase: Analytics
- Tool: Notion, Supabase
- Priority: P1
- Dependency: MBTI-0102
- Output: event tracking spec
- Work:
  - Define `landing_view`
  - Define `quiz_start`
  - Define `question_answered`
  - Define `quiz_submit`
  - Define `result_view`
  - Define `premium_cta_click`
  - Define `share_card_created`
  - Define `share_page_view`
- Acceptance Criteria:
  - Event names are documented
  - Properties are documented
  - No unnecessary PII is tracked

### MBTI-0902: Implement EventLog write helper

- Phase: Analytics
- Tool: Prisma, Next.js
- Priority: P1
- Dependency: MBTI-0901
- Output: `lib/eventLog.ts`
- Work:
  - Add helper to write events
  - Make helper fail silently or safely
  - Avoid blocking primary user flows
- Acceptance Criteria:
  - Events are stored for core actions
  - Event logging failure does not break quiz submit

### MBTI-0903: Add basic admin analytics view

- Phase: Analytics
- Tool: Next.js, Prisma
- Priority: P2
- Dependency: MBTI-0902
- Output: admin analytics page
- Work:
  - Show quiz starts
  - Show quiz completions
  - Show conversion rate
  - Show result views
  - Show share card count
- Acceptance Criteria:
  - Admin can inspect funnel health
  - No private answer details are exposed unnecessarily

## Phase 10: Content and Quality

### MBTI-1001: Write first approved question set

- Phase: Content
- Tool: Notion
- Priority: P0
- Dependency: MBTI-0104
- Output: approved question bank v1
- Work:
  - Draft at least 10 questions per dimension
  - Review Thai clarity
  - Review English clarity
  - Avoid leading questions
  - Mark approved rows
- Acceptance Criteria:
  - At least 40 approved questions
  - Every question has bilingual copy

### MBTI-1002: Write 16 free result summaries

- Phase: Content
- Tool: Notion
- Priority: P0
- Dependency: MBTI-0105
- Output: free result copy v1
- Work:
  - Add summary per type
  - Add strengths per type
  - Add blind spot teaser per type
  - Add Thai and English versions
- Acceptance Criteria:
  - All 16 types have free result copy
  - Copy is polished and not generic

### MBTI-1003: Write premium report placeholder content

- Phase: Content
- Tool: Notion
- Priority: P1
- Dependency: MBTI-1002
- Output: premium sections v1
- Work:
  - Write core identity
  - Write growth map
  - Write relationship language
  - Write career/work style
  - Write stress pattern
- Acceptance Criteria:
  - Premium report has meaningful scaffold for all types
  - Content can be improved without schema changes

## Phase 11: Security and Privacy

### MBTI-1101: Review auth boundaries

- Phase: Security
- Tool: GitHub, NextAuth
- Priority: P0
- Dependency: MBTI-0501
- Output: auth boundary review notes
- Work:
  - Check dashboard route protection
  - Check result ownership
  - Check API authorization
  - Check admin route protection
- Acceptance Criteria:
  - User cannot access another user's private result
  - Admin pages remain admin-only

### MBTI-1102: Define data privacy policy draft

- Phase: Security
- Tool: Notion
- Priority: P1
- Dependency: MBTI-0106
- Output: privacy policy draft
- Work:
  - Explain stored data
  - Explain saved results
  - Explain share card public behavior
  - Explain account deletion assumption
- Acceptance Criteria:
  - Draft is ready for legal/product review

### MBTI-1103: Add safe error handling for quiz APIs

- Phase: Security
- Tool: Next.js API
- Priority: P1
- Dependency: MBTI-0404
- Output: sanitized API errors
- Work:
  - Avoid leaking internal error messages
  - Return clear status codes
  - Log server-side detail only
- Acceptance Criteria:
  - API errors are user-safe
  - Debug info is not exposed to browser

## Phase 12: Production Launch

### MBTI-1201: Create MVP release checklist

- Phase: Launch
- Tool: Notion, GitHub, Vercel
- Priority: P0
- Dependency: MBTI-0803
- Output: release checklist
- Work:
  - Confirm build
  - Confirm env vars
  - Confirm database migrations
  - Confirm auth
  - Confirm quiz flow
  - Confirm result flow
  - Confirm dashboard
  - Confirm public share page
- Acceptance Criteria:
  - Release can be approved or blocked with evidence

### MBTI-1202: Run production smoke test

- Phase: Launch
- Tool: Vercel, Supabase
- Priority: P0
- Dependency: MBTI-1201
- Output: smoke test report
- Work:
  - Open production URL
  - Register/login
  - Start quiz
  - Submit answers
  - View result
  - Open dashboard
  - Create share card
  - Open public share link
- Acceptance Criteria:
  - Core flow works in production
  - Any blocker is logged as GitHub issue

### MBTI-1203: Create rollback plan

- Phase: Launch
- Tool: Vercel, GitHub, Supabase
- Priority: P1
- Dependency: MBTI-1201
- Output: rollback instructions
- Work:
  - Identify previous stable Vercel deployment
  - Document rollback steps
  - Document database migration rollback limitations
  - Add owner and decision rule
- Acceptance Criteria:
  - Team knows how to revert deployment
  - Database risks are explicit

## Recommended First Sprint

Sprint goal: make the project ready for database-driven quiz work.

### Sprint 1 Tasks

1. MBTI-0001: Normalize moved root project state
2. MBTI-0002: Verify reset-password route after root move
3. MBTI-0003: Add script hygiene
4. MBTI-0004: Create `.env.example`
5. MBTI-0005: Document architecture overview
6. MBTI-0101: Create Notion Product HQ
7. MBTI-0102: Create PRD in Notion
8. MBTI-0103: Create Roadmap database
9. MBTI-0201: Create GitHub milestones
10. MBTI-0202: Create issue templates
11. MBTI-0203: Create PR template

### Sprint 1 Exit Criteria

- Repo has no duplicate route warning
- `npm run build` passes
- Notion Product HQ exists
- GitHub milestones exist
- `.env.example` exists
- Product scope is clear enough to start Supabase schema work

## Recommended Second Sprint

Sprint goal: connect Supabase and build the data foundation.

### Sprint 2 Tasks

1. MBTI-0301: Create Supabase project
2. MBTI-0302: Connect local Prisma to Supabase
3. MBTI-0303: Design assessment schema
4. MBTI-0304: Add Prisma migration
5. MBTI-0305: Seed 16 personality types
6. MBTI-0306: Seed first quiz question set
7. MBTI-0307: Add database health API

### Sprint 2 Exit Criteria

- Supabase database is connected
- Prisma schema supports quiz/result/report/share-card
- Seed data exists
- Health endpoint confirms database connectivity
- Build passes

## Recommended Third Sprint

Sprint goal: make the quiz real.

### Sprint 3 Tasks

1. MBTI-0401: Replace hardcoded question source
2. MBTI-0402: Implement quiz session start API
3. MBTI-0403: Implement answer save API
4. MBTI-0404: Implement quiz submit and scoring
5. MBTI-0405: Redesign quiz UI with premium system

### Sprint 3 Exit Criteria

- Logged-in user can start quiz
- Answers are saved
- Submit creates real result
- Result ID is returned
- Quiz UI matches premium direction

## Definition of Done

Every engineering task is done only when:

- Code is implemented
- Types are valid
- `npm run lint` passes or known warnings are documented
- `npm run build` passes
- Auth/permission behavior is checked for user-facing or API tasks
- Relevant Notion/GitHub status is updated
- Any remaining risk is written in the task
