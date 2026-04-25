create extension if not exists "pgcrypto";

create table if not exists investors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  contact_person text,
  telegram text,
  email text,
  website text,
  geography text,
  sectors text,
  stages text,
  check_min numeric,
  check_max numeric,
  currency text,
  investment_focus text,
  relationship_status text not null default 'new' check (relationship_status in ('new','known','warm','active','partner','inactive','blacklist')),
  priority text not null default 'medium' check (priority in ('high','medium','low')),
  notes text,
  last_contact_date date,
  next_action_date date,
  owner text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text,
  stage text,
  geography text,
  round_size numeric,
  valuation numeric,
  currency text,
  instrument text,
  short_description text,
  investment_thesis text,
  key_metrics text,
  materials_link text,
  status text not null default 'draft' check (status in ('draft','active','paused','closed','archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references investors(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  fit_score numeric,
  fit_status text not null default 'not_reviewed' check (fit_status in ('not_reviewed','good_fit','maybe','poor_fit','do_not_contact')),
  why_match text,
  risks_objections text,
  suggested_angle text,
  recommended_next_step text,
  outreach_status text not null default 'not_contacted' check (outreach_status in ('not_contacted','intro_sent','follow_up','interested','materials_sent','call_scheduled','due_diligence','declined','committed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (investor_id, project_id)
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid references investors(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  match_id uuid references matches(id) on delete set null,
  activity_type text not null check (activity_type in ('telegram','whatsapp','email','call','meeting','intro','follow_up','materials_sent','note')),
  activity_date date not null,
  summary text not null,
  outcome text,
  next_action text,
  next_action_date date,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists telegram_chats (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references investors(id) on delete cascade,
  chat_link text not null,
  chat_type text,
  members text,
  last_meaningful_touch date,
  chat_summary text,
  next_best_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_investors_updated_at on investors;
create trigger trg_investors_updated_at before update on investors for each row execute function set_updated_at();

drop trigger if exists trg_projects_updated_at on projects;
create trigger trg_projects_updated_at before update on projects for each row execute function set_updated_at();

drop trigger if exists trg_matches_updated_at on matches;
create trigger trg_matches_updated_at before update on matches for each row execute function set_updated_at();

drop trigger if exists trg_telegram_chats_updated_at on telegram_chats;
create trigger trg_telegram_chats_updated_at before update on telegram_chats for each row execute function set_updated_at();

create index if not exists idx_investors_relationship_status on investors(relationship_status);
create index if not exists idx_investors_next_action_date on investors(next_action_date);
create index if not exists idx_projects_status on projects(status);
create index if not exists idx_matches_fit_status on matches(fit_status);
create index if not exists idx_activities_activity_date on activities(activity_date desc);
create index if not exists idx_activities_next_action_date on activities(next_action_date);

-- For MVP/dev convenience. Tighten policies for production.
alter table investors enable row level security;
alter table projects enable row level security;
alter table matches enable row level security;
alter table activities enable row level security;
alter table telegram_chats enable row level security;

drop policy if exists investors_dev_all on investors;
create policy investors_dev_all on investors for all using (true) with check (true);

drop policy if exists projects_dev_all on projects;
create policy projects_dev_all on projects for all using (true) with check (true);

drop policy if exists matches_dev_all on matches;
create policy matches_dev_all on matches for all using (true) with check (true);

drop policy if exists activities_dev_all on activities;
create policy activities_dev_all on activities for all using (true) with check (true);

drop policy if exists telegram_chats_dev_all on telegram_chats;
create policy telegram_chats_dev_all on telegram_chats for all using (true) with check (true);
