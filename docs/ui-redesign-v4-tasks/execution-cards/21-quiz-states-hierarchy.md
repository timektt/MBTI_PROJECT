# Card 21 - Quiz States And Hierarchy

Owner: A5 Core Journey Agent
Status: `PENDING`
Tasks: `V4-QUIZ-001..004`
Depends on: Cards 11, 16 and 20 plus Quiz approval

## Objective

Audit all Quiz states and establish progress -> question -> answer reading order.

## Writable Files

`pages/quiz.tsx`, `components/mbti-z/quiz/**`, Quiz-local copy via Lead request.

## Checklist

- preserve runtime/session logic while changing composition
- place chamber strip outside answer reading surface
- simplify duplicated stage labels
- keep recovery/error state explicit

## Acceptance And Evidence

Question and choices remain the center of gravity in every state and viewport.
