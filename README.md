# ALHENA VC — Investor CRM MVP

Next.js App Router MVP for managing investors, projects, matches, activities, and Telegram chat references.

## Stack

- Next.js 16 App Router + TypeScript
- Supabase Postgres (`@supabase/supabase-js`)
- Vercel-ready deployment

## Required environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
# Optional for server-only admin scripts (never expose to browser)
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
# Optional AI generation
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-4o-mini
```

The app throws explicit runtime errors if the required public Supabase variables are missing.

## Database setup

Run in Supabase SQL editor in order:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

Seed includes 5 investors, 3 projects, and linked matches/activities/telegram chats.

## Core routes

- `/` — Dashboard with summary cards + upcoming follow-ups
- `/investors` — investors table + search/filter + create form
- `/investors/[id]` — investor detail, edit form, related matches/activities/chats
- `/projects` — projects table + create form
- `/projects/[id]` — project detail, edit form, related matches
- `/matches` — manual match creation + table
- `/activities` — manual activity creation + table

## AI placeholder functionality

Server actions implemented in `app/actions.ts` + `lib/ai.ts`:

1. Generate investor-project fit summary
2. Generate outreach message
3. Generate investor summary

If `OPENAI_API_KEY` is missing, deterministic template text is returned instead of failing.

## Local development

```bash
npm install
npm run dev
npm run lint
```

## Out of scope in this MVP

- Full auth + production-grade RLS policies
- File uploads / data room integration
- Automated Telegram ingestion
- Advanced analytics and workflow automation
