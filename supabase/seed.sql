insert into investors (
  id, name, type, contact_person, telegram, email, website, geography, sectors, stages,
  check_min, check_max, currency, investment_focus, relationship_status, priority, notes,
  last_contact_date, next_action_date, owner
) values
  ('11111111-1111-1111-1111-111111111111', 'North Star Ventures', 'VC Fund', 'Emily Chen', '@northstar_emily', 'emily@northstar.vc', 'https://northstar.vc', 'US, EU', 'fintech, b2b saas, ai', 'seed, series a', 250000, 2000000, 'USD', 'B2B software in regulated industries', 'warm', 'high', 'Strong response rate, asked for updated metrics.', '2026-04-20', '2026-04-30', 'Alex'),
  ('22222222-2222-2222-2222-222222222222', 'Atlas Family Office', 'Family Office', 'Michael Torres', '@atlas_mike', 'mike@atlasfo.com', 'https://atlasfo.com', 'US', 'climate, industrial tech', 'seed, series a', 500000, 5000000, 'USD', 'Climate resilience and energy infrastructure', 'known', 'medium', 'Needs clearer exit comps.', '2026-04-15', '2026-05-02', 'Sofia'),
  ('33333333-3333-3333-3333-333333333333', 'Orion Angels', 'Angel Syndicate', 'Lena Volkova', '@orion_lena', 'lena@orionangels.com', 'https://orionangels.com', 'EU, MENA', 'marketplaces, ai', 'pre-seed, seed', 100000, 750000, 'USD', 'AI-led workflow automation', 'active', 'high', 'Happy to co-lead if velocity continues.', '2026-04-22', '2026-04-28', 'Alex'),
  ('44444444-4444-4444-4444-444444444444', 'Blue Delta Capital', 'VC Fund', 'David Park', '@bluedelta_david', 'david@bluedelta.capital', 'https://bluedelta.capital', 'US, LATAM', 'logistics, mobility', 'series a, series b', 1000000, 10000000, 'USD', 'Logistics infrastructure and mobility software', 'new', 'low', 'Added from referral list.', null, '2026-05-10', 'Sofia'),
  ('55555555-5555-5555-5555-555555555555', 'Helios Strategic', 'Corporate VC', 'Nora Ahmed', '@helios_nora', 'nora@helios.vc', 'https://helios.vc', 'MENA, EU', 'healthtech, ai', 'seed, series a', 300000, 3000000, 'USD', 'Clinical workflow tooling and health infra', 'partner', 'high', 'Existing LP relationship with ALHENA.', '2026-04-23', '2026-04-29', 'Alex')
on conflict (id) do update set name = excluded.name;

insert into projects (
  id, name, sector, stage, geography, round_size, valuation, currency, instrument,
  short_description, investment_thesis, key_metrics, materials_link, status, notes
) values
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'PulseLedger', 'fintech', 'seed', 'US', 2500000, 12000000, 'USD', 'SAFE', 'Treasury automation for SMB finance teams.', 'Strong retention and embedded payments upside.', 'MRR $120k, 8% MoM growth, 3.5% logo churn', 'https://example.com/pulseledger', 'active', 'Preparing updated deck for May outreach.'),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'GridFoundry', 'climate', 'series a', 'EU', 8000000, 45000000, 'USD', 'Equity', 'Grid analytics platform for industrial operators.', 'Large enterprise contracts and policy tailwinds.', 'ARR $2.4m, 9 pilots converting this quarter', 'https://example.com/gridfoundry', 'active', 'Need stronger unit economics slide.'),
  ('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'ClinicFlow AI', 'healthtech', 'seed', 'MENA', 3500000, 18000000, 'USD', 'SAFE', 'AI copilot for clinic operations and scheduling.', 'High demand in under-digitized private clinics.', 'MRR $90k, NPS 62, CAC payback 5 months', 'https://example.com/clinicflow', 'paused', 'Founders revising pricing model.')
on conflict (id) do update set name = excluded.name;

insert into matches (
  id, investor_id, project_id, fit_score, fit_status, why_match, risks_objections, suggested_angle, recommended_next_step, outreach_status
) values
  ('m1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 88, 'good_fit', 'Fintech focus and appropriate check size.', 'Wants more proof on expansion channels.', 'Lead with retention + payment attach rate.', 'Send updated growth cohort chart.', 'follow_up'),
  ('m2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 82, 'good_fit', 'Climate thesis alignment and Series A appetite.', 'Concerns about sales cycle duration.', 'Highlight signed LOIs and expansion pipeline.', 'Schedule partner call next week.', 'interested'),
  ('m3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 75, 'maybe', 'Strategic overlap in healthtech workflows.', 'Waiting for revised pricing model.', 'Share product roadmap and gross margin trend.', 'Re-engage after pricing update.', 'not_contacted')
on conflict (investor_id, project_id) do update set fit_score = excluded.fit_score;

insert into activities (
  id, investor_id, project_id, match_id, activity_type, activity_date, summary, outcome, next_action, next_action_date, created_by
) values
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'm1111111-1111-1111-1111-111111111111', 'email', '2026-04-20', 'Sent PulseLedger KPI refresh.', 'Investor requested updated expansion metrics.', 'Prepare channel-level cohort table.', '2026-04-30', 'Alex'),
  ('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'm2222222-2222-2222-2222-222222222222', 'call', '2026-04-18', 'Intro call with Atlas partner.', 'Positive; requested customer references.', 'Share 3 reference contacts.', '2026-05-02', 'Sofia'),
  ('a3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'm3333333-3333-3333-3333-333333333333', 'telegram', '2026-04-23', 'Brief sync in Telegram.', 'Will revisit after pricing revision.', 'Nudge in one week with revised plan.', '2026-04-29', 'Alex')
on conflict (id) do update set summary = excluded.summary;

insert into telegram_chats (
  id, investor_id, chat_link, chat_type, members, last_meaningful_touch, chat_summary, next_best_action
) values
  ('t1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'https://t.me/+northstar-alhena', 'group', 'Emily Chen, Alex', '2026-04-20', 'Discussed PulseLedger growth update.', 'Share April retention chart.'),
  ('t2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'https://t.me/+helios-clinicflow', 'group', 'Nora Ahmed, Alex', '2026-04-23', 'Awaiting pricing model revision.', 'Ping once pricing memo is ready.')
on conflict (id) do update set chat_summary = excluded.chat_summary;
