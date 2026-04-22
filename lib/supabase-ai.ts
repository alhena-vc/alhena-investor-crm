// lib/supabase-ai.ts — AI request/response logging + investor queries
// npm install @supabase/supabase-js

import { createClient } from '@supabase/supabase-js'
import type { Investor, MatchResult } from '@/types/investor'

// Use service role key server-side (never expose to client)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── AI Logs ─────────────────────────────────────────────────────────────────

export async function logAIRequest(data: {
  type: string
  input: Record<string, unknown>
  output: unknown
  tokens_input: number
  tokens_output: number
  user_id?: string
  duration_ms?: number
}): Promise<string> {
  const { data: row, error } = await supabase
    .from('ai_logs')
    .insert({
      type: data.type,
      input: data.input,
      output: data.output,
      tokens_input: data.tokens_input,
      tokens_output: data.tokens_output,
      user_id: data.user_id ?? null,
      duration_ms: data.duration_ms ?? null,
    })
    .select('id')
    .single()

  if (error) throw new Error(`Supabase log error: ${error.message}`)
  return row.id
}

// ─── Investor queries ─────────────────────────────────────────────────────────

export async function getAllInvestors(): Promise<Investor[]> {
  const { data, error } = await supabase
    .from('investors')
    .select('*')
    .order('status', { ascending: true }) // Теплый first

  if (error) throw new Error(`Supabase query error: ${error.message}`)
  return data ?? []
}

export async function getInvestorsByFilters(filters: {
  status?: string
  geography?: string
  stage?: string
  sector?: string
}): Promise<Investor[]> {
  let query = supabase.from('investors').select('*')

  if (filters.status) query = query.eq('status', filters.status)
  if (filters.geography) query = query.ilike('geography', `%${filters.geography}%`)
  if (filters.stage) query = query.ilike('stages', `%${filters.stage}%`)
  if (filters.sector) query = query.ilike('sectors', `%${filters.sector}%`)

  const { data, error } = await query
  if (error) throw new Error(`Supabase filter error: ${error.message}`)
  return data ?? []
}

// ─── Match results persistence ────────────────────────────────────────────────

export async function saveMatchResults(
  startupName: string,
  matches: MatchResult[],
  userId?: string
): Promise<string> {
  const { data, error } = await supabase
    .from('match_results')
    .insert({
      startup_name: startupName,
      matches: matches,
      user_id: userId ?? null,
      high_priority_count: matches.filter((m) => m.priority === 'high').length,
    })
    .select('id')
    .single()

  if (error) throw new Error(`Supabase save error: ${error.message}`)
  return data.id
}

// ─── Generated content persistence ───────────────────────────────────────────

export async function saveGeneratedContent(data: {
  type: 'landing' | 'intro_message' | 'code' | 'other'
  content: string
  metadata?: Record<string, unknown>
  user_id?: string
}): Promise<string> {
  const { data: row, error } = await supabase
    .from('generated_content')
    .insert({
      type: data.type,
      content: data.content,
      metadata: data.metadata ?? {},
      user_id: data.user_id ?? null,
    })
    .select('id')
    .single()

  if (error) throw new Error(`Supabase save error: ${error.message}`)
  return row.id
}
