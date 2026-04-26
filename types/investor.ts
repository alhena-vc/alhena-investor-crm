export type InvestorStatus = "Теплый" | "Холодный" | "Горячий" | "Партнер";
export type InvestorCategory = "fund" | "corporate" | "angel" | "foreign";

export interface Investor {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string | null;

  category?: InvestorCategory | null;
  status?: InvestorStatus | null;
  description?: string | null;
  invest_phase?: string | null;
  sectors?: string | null;
  stages?: string | null;
  geography?: string | null;
  portfolio_examples?: string | null;
  check_size?: string | null;
  contact?: string | null;
  comment?: string | null;
  legal_name?: string | null;
  inn?: string | null;

  fund_name?: string | null;
  contact_name?: string | null;
  contact_role?: string | null;
  relationship_status?: string | null;
  interaction_status?: string | null;
  chat_status?: string | null;
  telegram_chat_name?: string | null;
  telegram_chat_link?: string | null;
  sector_tags?: string[] | null;
  stage_tags?: string[] | null;
  geo_tags?: string[] | null;
  anti_focus?: string | null;
  preferred_angle?: string | null;
  ai_summary?: string | null;
  last_contact_date?: string | null;
  next_action?: string | null;
  next_action_date?: string | null;
}

export interface Startup {
  name: string;
  description: string;
  sector: string;
  stage: string;
  geography: string;
  check_needed: string;
  traction?: string;
  team?: string;
}

export interface MatchResult {
  investor: Investor;
  score: number;
  reasons: string[];
  intro_message: string;
  next_action: string;
  next_action_type: "email" | "telegram" | "call" | "intro" | "wait";
  priority: "high" | "medium" | "low";
}

export interface AIRequest {
  type: "match" | "generate" | "action";
  payload: Record<string, unknown>;
  user_id?: string;
}

export interface AIResponse {
  id: string;
  type: AIRequest["type"];
  result: unknown;
  tokens_used: number;
  created_at: string;
}

export interface CreateInvestorPayload {
  name: string;
  fund_name?: string;
  contact_name?: string;
  contact_role?: string;
  relationship_status?: string;
  interaction_status?: string;
  chat_status?: string;
  telegram_chat_name?: string;
  telegram_chat_link?: string;
  sector_tags?: string[];
  stage_tags?: string[];
  geo_tags?: string[];
  anti_focus?: string;
  preferred_angle?: string;
  ai_summary?: string;
  last_contact_date?: string;
  next_action?: string;
  next_action_date?: string;
}
