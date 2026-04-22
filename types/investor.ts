// ─── Investor Types (based on ALHENA VC investor database schema) ─────────────

export type InvestorStatus = 'Теплый' | 'Холодный' | 'Горячий' | 'Партнер'
export type InvestorCategory = 'fund' | 'corporate' | 'angel' | 'foreign'

export interface Investor {
  id: string
  category: InvestorCategory
  name: string
  description: string | null
  status: InvestorStatus | null
  invest_phase: string | null        // "Инвест фаза" — активно инвестирует?
  sectors: string | null             // "Сферы инвестирования"
  stages: string | null              // "На какие стадии инвестирует"
  geography: string | null
  portfolio_examples: string | null
  check_size: string | null          // "Размер чека"
  contact: string | null
  comment: string | null
  legal_name: string | null          // "Название ЮЛ"
  inn: string | null
  created_at: string
  updated_at: string
}

export interface Startup {
  name: string
  description: string
  sector: string                     // e.g. "SaaS, AI"
  stage: string                      // e.g. "Seed", "Pre-Seed", "Series A"
  geography: string                  // e.g. "Россия", "СНГ"
  check_needed: string               // e.g. "$500K"
  traction?: string                  // optional: MRR, users, growth
  team?: string                      // optional: founders background
}

export interface MatchResult {
  investor: Investor
  score: number                      // 0–100
  reasons: string[]
  intro_message: string
  next_action: string
  next_action_type: 'email' | 'telegram' | 'call' | 'intro' | 'wait'
  priority: 'high' | 'medium' | 'low'
}

export interface AIRequest {
  type: 'match' | 'generate' | 'action'
  payload: Record<string, unknown>
  user_id?: string
}

export interface AIResponse {
  id: string
  type: AIRequest['type']
  result: unknown
  tokens_used: number
  created_at: string
}
