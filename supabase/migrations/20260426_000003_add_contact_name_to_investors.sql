alter table if exists public.investors
  add column if not exists contact_name text;
