# UI V2 Page Tasks: Quiz `/quiz`

Primary files:

- `pages/quiz.tsx`
- `components/mbti-z/quiz/answer-deck.tsx`
- `components/ui/radio-group.tsx`
- `components/cyber/motion/question-transition.tsx`
- `lib/mbti-z-copy.ts`

Current status: core flow, Movie Profile redesign และ state/edge hardening complete

## Completed Implementation

### QUIZ-001: In-Flow Quiz Shell

- Status: `DONE`
- Result: fixed footer ถูกแทนด้วย in-flow action region และไม่ทับ answer controls

### QUIZ-002: Core Five-Point Response Scale

- Status: `DONE`
- Result: 5 accessible radio options, endpoint labels และ stable 48-64px controls

### QUIZ-003: Movie Profile Choice Rows

- Status: `DONE`
- Result: mobile single-column, tablet/desktop 2x2, full answer labels

### QUIZ-004: Interaction Regression

- Status: `DONE`
- Evidence: `output/ui-skills-router/2026-07-15/v2-03-quiz/after/`
- Result: select, next, previous, persisted answer, keyboard focus/space และ console checks ผ่าน

## Hardening Status

### QUIZ-HARD-001: Deterministic State Matrix

- Status: `DONE`
- Priority: `P1`
- Parallel group: `P1-QUIZ`
- Dependencies: `SYS-004`

States:

- first core question
- selected core answer
- middle core question with previous answer
- first Movie Profile question
- selected Movie Profile answer
- final question and submitting state
- resumed session

Acceptance:

- every state reproducible without manual answering 60 questions
- no fixture changes runtime/scoring contract

Evidence:

- fixtures: `quiz-first-core`, `quiz-middle-core`, `quiz-first-movie`, `quiz-final-question`
- screenshots: `output/ui-skills-router/2026-07-15/v2-04-quiz/after/`
- `npm run ui:fixtures:check` passed with 14 deterministic fixtures

### QUIZ-HARD-002: Final Question And Submit Transition

- Status: `DONE`
- Priority: `P1`
- Dependencies: `QUIZ-HARD-001`

Tasks:

- verify `Reveal Result` copy and disabled/enabled states
- ensure processing label fits 320px
- prevent double submit
- verify navigation arrives at valid result id
- verify submit error path does not leave controls permanently disabled

Acceptance:

- one result generated per submit action
- no clipped processing state or blank transition

Evidence:

- rapid double activation generated one result id and one history row
- persisted session was removed only after valid result navigation
- forced `localStorage` write failure kept the final-question session, restored the enabled action and announced a retryable error
- rapid double activation generated one result id and one history row
- evidence: `output/ui-skills-router/2026-07-15/v2-08-full-quality/quiz-submit-report.json`

### QUIZ-HARD-003: Locale Reset Flow

- Status: `DONE`
- Priority: `P1`
- Dependencies: `QUIZ-HARD-001`

Tasks:

- switch locale before answering
- switch after answers exist: accept and cancel confirmation
- inspect dialog wording and resumed state
- verify 40-44px locale controls and keyboard access

Acceptance:

- cancel preserves session and selected language
- accept resets session deterministically

Evidence:

- cancel kept `lang=en`, session index `24` and stored locale `en`
- accept reset to index `0` and synchronized URL/provider/session to `lang=th`
- a fresh page restored the Thai session without query drift

### QUIZ-HARD-004: Short Viewport, Landscape And 200% Zoom

- Status: `DONE`
- Priority: `P1`
- Dependencies: `SYS-005`

Tasks:

- test `320x700`, `844x390`, `1024x768`
- test browser zoom 200%
- check action visibility after content reflow
- ensure no sticky/fixed overlap

Acceptance:

- every answer and action remains reachable
- no horizontal overflow

Evidence:

- `320x700`, `390x844`, `844x390` and `1440x1000` passed overflow/touch-target checks
- native Chrome 200% ผ่านที่ effective viewport `600x450`; question, answers และ action path ไม่มี horizontal overflow หรือ framework overlay
- zoom evidence: `output/ui-skills-router/2026-07-16/native-zoom-current/quiz-200.png`

### QUIZ-HARD-005: Reduced Motion And Keyboard Completion

- Status: `DONE`
- Priority: `P1`
- Dependencies: `QUIZ-HARD-001`

Tasks:

- Arrow navigation, Space select, Tab to Next, Enter advance
- previous answer restoration
- `prefers-reduced-motion: reduce`
- no running decorative animation after settle

Acceptance:

- complete one core and one movie step keyboard-only
- focus remains visible and moves predictably after question transition

Evidence:

- Space selected the focused semantic radio and enabled Next
- advancing moved focus to the first radio of the next question
- reduced-motion behavior is implemented through the shared motion provider

### QUIZ-HARD-006: Loading And Recovery State

- Status: `DONE`
- Priority: `P2`
- Dependencies: `SYS-007`

Tasks:

- align loading geometry with quiz shell
- provide explicit recovery if bootstrap cannot return a current question
- avoid internal runtime jargon in primary message

Acceptance:

- no blank page or permanent spinner

Evidence:

- explicit `loading`, `ready` and `recovery` boot states are implemented
- recovery retries a validated guest-local session without cloud access

## Validation

- `npm run data:validate`
- `npm run reconnect:verify`
- `npm run runtime:guards`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- browser screenshots for core/movie/final states

Latest evidence: `output/ui-skills-router/2026-07-15/v2-04-quiz/after/`

## Non-Scope

- question wording/scoring changes, cloud submission, auth gate, new question bank
