export const INVESTOR_RELATIONSHIP_STATUS = [
  'new',
  'known',
  'warm',
  'active',
  'partner',
  'inactive',
  'blacklist',
] as const;

export const INVESTOR_PRIORITY = ['high', 'medium', 'low'] as const;

export const PROJECT_STATUS = ['draft', 'active', 'paused', 'closed', 'archived'] as const;

export const MATCH_FIT_STATUS = [
  'not_reviewed',
  'good_fit',
  'maybe',
  'poor_fit',
  'do_not_contact',
] as const;

export const MATCH_OUTREACH_STATUS = [
  'not_contacted',
  'intro_sent',
  'follow_up',
  'interested',
  'materials_sent',
  'call_scheduled',
  'due_diligence',
  'declined',
  'committed',
] as const;

export const ACTIVITY_TYPES = [
  'telegram',
  'whatsapp',
  'email',
  'call',
  'meeting',
  'intro',
  'follow_up',
  'materials_sent',
  'note',
] as const;

export type Investor = {
  id: string;
  name: string;
  type: string | null;
  contact_person: string | null;
  telegram: string | null;
  email: string | null;
  website: string | null;
  geography: string | null;
  sectors: string | null;
  stages: string | null;
  check_min: number | null;
  check_max: number | null;
  currency: string | null;
  investment_focus: string | null;
  relationship_status: (typeof INVESTOR_RELATIONSHIP_STATUS)[number];
  priority: (typeof INVESTOR_PRIORITY)[number];
  notes: string | null;
  last_contact_date: string | null;
  next_action_date: string | null;
  owner: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  name: string;
  sector: string | null;
  stage: string | null;
  geography: string | null;
  round_size: number | null;
  valuation: number | null;
  currency: string | null;
  instrument: string | null;
  short_description: string | null;
  investment_thesis: string | null;
  key_metrics: string | null;
  materials_link: string | null;
  status: (typeof PROJECT_STATUS)[number];
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Match = {
  id: string;
  investor_id: string;
  project_id: string;
  fit_score: number | null;
  fit_status: (typeof MATCH_FIT_STATUS)[number];
  why_match: string | null;
  risks_objections: string | null;
  suggested_angle: string | null;
  recommended_next_step: string | null;
  outreach_status: (typeof MATCH_OUTREACH_STATUS)[number];
  created_at: string;
  updated_at: string;
};

export type Activity = {
  id: string;
  investor_id: string | null;
  project_id: string | null;
  match_id: string | null;
  activity_type: (typeof ACTIVITY_TYPES)[number];
  activity_date: string;
  summary: string;
  outcome: string | null;
  next_action: string | null;
  next_action_date: string | null;
  created_by: string | null;
  created_at: string;
};

export type TelegramChat = {
  id: string;
  investor_id: string;
  chat_link: string;
  chat_type: string | null;
  members: string | null;
  last_meaningful_touch: string | null;
  chat_summary: string | null;
  next_best_action: string | null;
  created_at: string;
  updated_at: string;
};
