-- Align current app expectations with Supabase schema.

alter table if exists public.investors
  add column if not exists fund_name text,
  add column if not exists contact_role text,
  add column if not exists relationship_status text,
  add column if not exists interaction_status text,
  add column if not exists chat_status text,
  add column if not exists telegram_chat_name text,
  add column if not exists telegram_chat_link text,
  add column if not exists sector_tags text[],
  add column if not exists stage_tags text[],
  add column if not exists geo_tags text[],
  add column if not exists anti_focus text,
  add column if not exists preferred_angle text,
  add column if not exists ai_summary text,
  add column if not exists last_contact_date timestamptz,
  add column if not exists next_action text,
  add column if not exists next_action_date timestamptz,
  add column if not exists description text,
  add column if not exists status text,
  add column if not exists invest_phase text,
  add column if not exists sectors text,
  add column if not exists stages text,
  add column if not exists geography text,
  add column if not exists portfolio_examples text,
  add column if not exists check_size text,
  add column if not exists contact text,
  add column if not exists comment text,
  add column if not exists legal_name text,
  add column if not exists inn text;

create table if not exists public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  tokens_input int not null default 0,
  tokens_output int not null default 0,
  user_id uuid,
  duration_ms int,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_logs_type_created_at
  on public.ai_logs(type, created_at desc);

create table if not exists public.match_results (
  id uuid primary key default gen_random_uuid(),
  startup_name text not null,
  matches jsonb not null,
  user_id uuid,
  high_priority_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_match_results_created_at
  on public.match_results(created_at desc);

create table if not exists public.generated_content (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  user_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_generated_content_type_created_at
  on public.generated_content(type, created_at desc);
