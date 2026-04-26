# Alhena CRM v2 (New Clean Project)

This is an independent clean-slate Next.js app created in `projects/alhena-crm-v2`.

## Run

```bash
cd projects/alhena-crm-v2
npm install
npm run dev
```

App will be available on `http://localhost:3010`.

## Why this folder exists

Previous work reused legacy structure. This folder is a fully separate project space to avoid layering old CRM logic.

## Environment

Copy `.env.example` to `.env.local` and set:

- `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`)
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Implemented in this iteration

- Live investors page with server-side Supabase read + API create.
- Live projects page with server-side Supabase read + API create.
- Separate clean project workspace to avoid legacy CRM layering.
