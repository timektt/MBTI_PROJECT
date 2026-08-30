# Card 21 - My Results Primary States

Task IDs: `V3-RESULTS-004`, `V3-RESULTS-005`, `V3-RESULTS-006`, `V3-RESULTS-007`
Owner: `My Results Agent`
Status: `DONE`
Depends on: Card 20 and Type routes from Card 17

## Deliverable

ออกแบบ latest, pending, history, empty และ error states ให้ผู้ใช้เข้าใจ action ถัดไปทันที

## Checklist

- Latest: show code, localized name, date, supported score context, summary, detail link, PNG export, and retake.
- Pending: show progress, Resume, secondary confirmed reset.
- History: use compact chronological comparison with long-history behavior.
- Empty: lead to Quiz.
- Error/storage unavailable: retain navigation and a recoverable action.
- Avoid raw JSON, storage keys, stack traces, and false score precision.
- Use stable loading/pending dimensions.

## Acceptance

- Every state has one dominant next action.
- Detail action resolves to `/types/[code]`.
- History works with long Thai/English strings.
- No result image or button row overlaps adjacent content.

## Evidence

- Completed, pending, history, empty, and error screenshots.
- Action/state regression assertions.
