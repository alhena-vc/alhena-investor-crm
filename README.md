# Alhena Investor CRM

Investor CRM on Next.js with Supabase-backed data, AI matching, deals, and communications tracking.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Supabase REST access
- Anthropic API for AI routes

## Environment

Copy `.env.example` to `.env.local` and set the values.

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional but used by parts of the app:

- `ANTHROPIC_API_KEY`
- `SUPABASE_ACCESS_TOKEN`
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- `VERCEL_DEPLOY_HOOK`

## Main routes

- `/dashboard` - operational overview
- `/investors` - investor workspace and AI matching
- `/investors/[id]` - investor detail page
- `/projects` - project registry
- `/outreach` - deals pipeline
- `/followups` - communications timeline
- `/test-ai` - AI playground route

## Development

```bash
npm install
npm run dev
```

Local preview is currently available on `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm run build
npm run check:readiness
npm run supabase:version
npm run deploy:vercel-hook
```

`check:readiness` verifies required environment variables and confirms that the latest app-alignment migration file exists locally.
`deploy:vercel-hook` triggers a Vercel deployment when `VERCEL_DEPLOY_HOOK` is configured.

## Database

Important migrations:

- `supabase/migrations/20260425_000001_crm_v2_init.sql`
- `supabase/migrations/20260426_000002_crm_app_alignment.sql`

Before production deployment, apply the latest migration to the real Supabase project.

## Notes

- The legacy clean-slate reference app still exists in `projects/alhena-crm-v2`.
- The main active app is the root project in this repository.
