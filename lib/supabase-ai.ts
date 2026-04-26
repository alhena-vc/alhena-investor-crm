import { createClient } from '@supabase/supabase-js'
import type { Investor, MatchResult } from '@/types/investor'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

export async function getAllInvestors(): Promise<Investor[]> {
  const { data, error } = await supabase
    .from('investors')
    .select('*')

  if (error) throw new Error(`Supabase query error: ${error.message}`)

  return sortInvestorsForMatching(data ?? [])
}

export async function getInvestorsByFilters(filters: {
  status?: string
  geography?: string
  stage?: string
  sector?: string
}): Promise<Investor[]> {
  const investors = await getAllInvestors()

  return investors.filter((investor) => {
    if (filters.status) {
      const status = normalizeText(investor.relationship_status ?? investor.status)
      if (status !== normalizeText(filters.status)) return false
    }

    if (filters.geography) {
      const geoSource = [
        investor.geography,
        ...(investor.geo_tags ?? []),
      ]
        .filter(Boolean)
        .join(' ')
      if (!normalizeText(geoSource).includes(normalizeText(filters.geography))) {
        return false
      }
    }

    if (filters.stage) {
      const stageSource = [
        investor.stages,
        ...(investor.stage_tags ?? []),
      ]
        .filter(Boolean)
        .join(' ')
      if (!normalizeText(stageSource).includes(normalizeText(filters.stage))) {
        return false
      }
    }

    if (filters.sector) {
      const sectorSource = [
        investor.sectors,
        ...(investor.sector_tags ?? []),
      ]
        .filter(Boolean)
        .join(' ')
      if (!normalizeText(sectorSource).includes(normalizeText(filters.sector))) {
        return false
      }
    }

    return true
  })
}

export async function saveMatchResults(
  startupName: string,
  matches: MatchResult[],
  userId?: string
): Promise<string> {
  const { data, error } = await supabase
    .from('match_results')
    .insert({
      startup_name: startupName,
      matches,
      user_id: userId ?? null,
      high_priority_count: matches.filter((m) => m.priority === 'high').length,
    })
    .select('id')
    .single()

  if (error) throw new Error(`Supabase save error: ${error.message}`)
  return data.id
}

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

function sortInvestorsForMatching(investors: Investor[]) {
  return [...investors].sort((a, b) => {
    const scoreDiff = warmthScore(b) - warmthScore(a)
    if (scoreDiff !== 0) return scoreDiff

    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateB - dateA
  })
}

function warmthScore(investor: Investor) {
  const status = normalizeText(investor.relationship_status ?? investor.status)

  if (status.includes('гор')) return 3
  if (status.includes('теп')) return 2
  if (status.includes('парт')) return 2
  if (status.includes('warm')) return 2
  if (status.includes('hot')) return 3
  if (status.includes('cold') || status.includes('хол')) return 1

  return 0
}

function normalizeText(value: string | null | undefined) {
  return (value ?? '').trim().toLowerCase()
}
