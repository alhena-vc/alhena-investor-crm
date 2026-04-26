# Deploy Playbook

## Current status

- Local dev UI is available at `http://localhost:3000`
- `npm run build` passes
- `npm run check:readiness` passes for required env vars
- Missing optional deploy automation env: `VERCEL_DEPLOY_HOOK`

## Before pushing

1. Confirm the latest migration is applied to the real Supabase project:
   - `supabase/migrations/20260426_000002_crm_app_alignment.sql`
2. Confirm Vercel project env vars match `.env.local`
3. Review the changed routes in the browser:
   - `/dashboard`
   - `/investors`
   - `/outreach`
   - `/followups`

## Git flow

Current branch:

- `codex-test`

Safe sequence:

1. Commit local changes
2. Push `codex-test`
3. Open or update a PR into `main`
4. Let Vercel create a preview deploy from GitHub integration, or trigger deploy manually

## Manual deploy options

### Option A: GitHub-integrated Vercel

Push the branch and let Vercel create a preview deployment automatically if the repository is connected.

### Option B: Deploy hook

Set `VERCEL_DEPLOY_HOOK` in `.env.local` and in Vercel so app routes that support deploy triggering can call it.

## Recommended next action

Apply the Supabase migration first, then commit and push `codex-test`.
