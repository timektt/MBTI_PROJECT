# MBTI Z UI Fixtures

Deterministic, local-only browser QA fixtures for the active `guest-local` runtime.
The generator imports the production guest scoring helper, replaces only generated ids and
timestamps, validates the resulting storage contracts, and never reads environment variables
or connects to a database.

## Commands

Validate payload shape, required scenarios, house coverage, deterministic ids, and repeatability:

```bash
npx --yes tsx scripts/ui-fixtures/generate.ts --check
```

Generate the ignored manifest and browser init scripts:

```bash
npx --yes tsx scripts/ui-fixtures/generate.ts
```

Generated output:

```text
scripts/ui-fixtures/generated/manifest.json
scripts/ui-fixtures/generated/init/<fixture-id>.js
```

Each init script removes only the MBTI Z managed localStorage keys, seeds one scenario, and
exposes its metadata at `window.__MBTI_Z_UI_FIXTURE__`. For Playwright, install a fixture before
navigating to the route recorded in `manifest.json`:

```ts
await context.addInitScript({
  path: "scripts/ui-fixtures/generated/init/quiz-first-movie.js",
});
await page.goto("http://localhost:3000/quiz?lang=th");
```

Do not use these fixtures against production origins. They are intended only for local or
isolated preview browser QA and do not contain database, auth, or cloud-runtime state.
