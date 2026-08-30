# Code Review Checklist

## Correctness

- Does the change preserve the guest-first `/quiz -> /result/[id] -> /dashboard` flow?
- Are `GuestSession`, `GuestResult`, history, and reconnect bundle shapes kept compatible?
- Are empty, invalid, missing result, and stale localStorage states handled explicitly?
- Are TH/EN locale paths still deterministic?

## Security

- Are auth, admin, upload, profile, email, and cloud-backed routes protected server-side?
- Are request payloads validated with existing schemas or `zod` before use?
- Are errors user-safe and free of secrets, connection strings, tokens, and provider responses?
- Are `.env` files still ignored while `.env.example` remains commit-safe?

## Data

- Does the change avoid destructive migrations and production data writes?
- If Prisma changes are included, are migration impact and rollback documented?
- Are guest-local storage changes backward-compatible or covered by an import/recovery path?
- Are tracked database data files excluded from future PRs?

## UI/UX

- Does the target route work on mobile, tablet, and desktop without horizontal overflow?
- Are result/export surfaces visually stable before being marked ready?
- Is `Nocturne` avoided in primary MBTI Z product copy unless the page is intentionally legacy/hold-state?
- Are keyboard, focus, and reduced-motion behavior preserved for quiz interactions?

## Testing

- Has the smallest relevant command run first?
- For data/runtime work: `npm run data:validate` and `npx --yes tsx scripts/verify-reconnect-import.ts`.
- For TypeScript behavior: `npm run typecheck`.
- For route/build changes: `npm run lint` and `npm run build`.
- For UI changes: browser proof or screenshots for the changed route and at least one mobile viewport.

## Operations

- Is the release status clear: `ready-for-implementation`, `ready-for-pr`, `ready-for-staging`, `blocked`, or `not-production-ready`?
- Are env variable names documented without values?
- Is rollback explicit for cloud runtime, migrations, deploys, and external integrations?
- Are unresolved production blockers listed before merge or deploy?
