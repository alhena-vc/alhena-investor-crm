-- CRM v2 initial schema
-- PostgreSQL / Supabase

create extension if not exists pgcrypto;

-- 1) Deal stages (configurable pipeline)
create table if not exists public.deal_stages (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  sort_order int not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Investors
create table if not exists public.investors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  investor_type text not null,
  stage_focus text not null,
  sector_focus text not null,
  geography_focus text not null,
  check_size_min numeric(18,2),
  check_size_max numeric(18,2),
  source text not null default 'manual',
  email text,
  contact_name text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_investors_name on public.investors(name);
create index if not exists idx_investors_type on public.investors(investor_type);

-- 3) Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text not null,
  stage text not null,
  geography text not null,
  raise_target_usd numeric(18,2),
  summary text not null,
  founder_name text,
  founder_contact text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_name on public.projects(name);

-- 4) Deals
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references public.investors(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  stage_id uuid not null references public.deal_stages(id),
  deal_type text not null check (deal_type in ('equity', 'debt', 'venture_loan', 'other')),
  amount_usd numeric(18,2),
  owner_user_id uuid,
  status_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (investor_id, project_id)
);

create index if not exists idx_deals_stage on public.deals(stage_id);
create index if not exists idx_deals_project on public.deals(project_id);
create index if not exists idx_deals_investor on public.deals(investor_id);

-- 5) Communications timeline
create table if not exists public.communications (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  channel text not null check (channel in ('email', 'call', 'meeting', 'telegram', 'other')),
  direction text not null check (direction in ('inbound', 'outbound')),
  happened_at timestamptz not null,
  summary text not null,
  next_action text,
  next_action_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_communications_deal on public.communications(deal_id, happened_at desc);

-- 6) Matching run results
create table if not exists public.matching_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  algorithm_version text not null,
  model_name text,
  input_payload jsonb not null,
  result_payload jsonb not null,
  created_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_matching_runs_project on public.matching_runs(project_id, created_at desc);

-- 7) Feedback loop for training
create table if not exists public.matching_feedback (
  id uuid primary key default gen_random_uuid(),
  matching_run_id uuid not null references public.matching_runs(id) on delete cascade,
  investor_id uuid not null references public.investors(id) on delete cascade,
  verdict text not null check (verdict in ('accepted', 'rejected', 'uncertain')),
  comment text,
  created_by uuid,
  created_at timestamptz not null default now(),
  unique (matching_run_id, investor_id)
);

-- 8) Message templates
create table if not exists public.message_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  channel text not null check (channel in ('email', 'telegram', 'other')),
  body text not null,
  is_active boolean not null default true,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9) Audit log
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  actor_role text,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  before_state jsonb,
  after_state jsonb,
  meta jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_entity on public.audit_log(entity_type, entity_id, created_at desc);

-- Seed default stages (idempotent)
insert into public.deal_stages (code, title, sort_order)
values
  ('new', 'New', 10),
  ('screening', 'Screening', 20),
  ('due_diligence', 'Due Diligence', 30),
  ('ic', 'Investment Committee', 40),
  ('term_sheet', 'Term Sheet', 50),
  ('closed_won', 'Closed Won', 60),
  ('closed_lost', 'Closed Lost', 70)
on conflict (code) do nothing;
