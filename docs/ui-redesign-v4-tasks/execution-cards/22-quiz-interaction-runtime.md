# Card 22 - Quiz Interaction And Runtime Safety

Owner: A5 Core Journey Agent
Status: `PENDING`
Tasks: `V4-QUIZ-005..008`
Depends on: Card 21

## Objective

Stabilize answer geometry and polish interaction without changing assessment behavior.

## Writable Files

Quiz page and answer-deck components only.

## Checklist

- support longest question/choice strings without shifting controls
- make selection/disabled/submitting feedback visible
- keep Previous/Restart tertiary
- verify locale reset, recovery, rapid click and submit lock paths

## Acceptance And Evidence

Keyboard/touch/reduced-motion paths pass and session/scoring/result ids match pre-change behavior.
