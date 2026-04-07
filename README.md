# Alhena Investor CRM (MVP shell)

Clean Next.js app shell for investor tracking with Supabase-backed investor data.

## Tech stack

- Next.js (App Router)
- React
- Tailwind CSS
- Supabase REST API integration

## Environment

Set these vars in `.env.local` (and in Vercel):

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Routes

- `/dashboard` — overview
- `/investors` — list with add-investor modal
- `/investors/[id]` — detail page
- `/projects` — skeleton
- `/outreach` — skeleton
- `/followups` — skeleton

## Development

```bash
npm install
npm run dev
```

## Deploy

This repository is Vercel-ready. Add the same environment variables in Vercel project settings.
