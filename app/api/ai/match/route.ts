// app/api/ai/match/route.ts
// POST /api/ai/match
// Body: { startup: Startup, filters?: { status?, geography? } }

import { NextRequest, NextResponse } from 'next/server'
import { claudeJSON } from '@/lib/claude'
import { getAllInvestors, saveMatchResults, logAIRequest } from '@/lib/supabase-ai'
import type { Startup, MatchResult, Investor } from '@/types/investor'

const SYSTEM_PROMPT = `You are an expert venture capital analyst and dealflow manager at ALHENA VC.
Your task is to match startups with the most suitable investors from the provided database.

Scoring criteria (total 100 points):
- Sector match: 35 pts (exact match = 35, adjacent = 15, unrelated = 0)
- Stage match: 25 pts (exact = 25, adjacent stage = 10, mismatch = 0)
- Geography match: 20 pts (exact = 20, partial = 10, mismatch = 0)
- Check size fit: 10 pts
- Status warmth: 10 pts (Теплый = 10, Горячий = 10, Холодный = 3)

For each matched investor, generate:
1. Personalized intro message in Russian (3-4 sentences, warm, specific to their portfolio)
2. Next best action with type (email/telegram/call/intro/wait)
3. Priority level (high/medium/low) based on score + status

Only return investors with score >= 30.`

export async function POST(req: NextRequest) {
  const t0 = Date.now()

  try {
    const body = await req.json()
    const { startup, filters } = body as {
      startup: Startup
      filters?: { status?: string; geography?: string }
    }

    if (!startup?.name || !startup?.sector || !startup?.stage) {
      return NextResponse.json(
        { error: 'startup.name, startup.sector, startup.stage are required' },
        { status: 400 }
      )
    }

    // 1. Pull investors from Supabase
    let investors = await getAllInvestors()

    // Pre-filter to reduce Claude context (keep top candidates)
    if (filters?.status) {
      investors = investors.filter((i) => i.status === filters.status)
    }

    // Take max 50 investors per request to stay within context
    const investorSlice = investors.slice(0, 50)

    // 2. Ask Claude to score and match
    const userMessage = `
STARTUP TO MATCH:
${JSON.stringify(startup, null, 2)}

INVESTOR DATABASE (${investorSlice.length} investors):
${JSON.stringify(investorSlice.map(investorToContext), null, 2)}

Return a JSON array of MatchResult objects. Schema:
{
  "investor_id": string,
  "investor_name": string,
  "score": number (0-100),
  "reasons": string[] (2-4 specific reasons),
  "intro_message": string (Russian, personalized),
  "next_action": string (concrete step),
  "next_action_type": "email" | "telegram" | "call" | "intro" | "wait",
  "priority": "high" | "medium" | "low"
}

Sort by score descending. Return top 10 matches minimum.`

    type RawMatch = {
      investor_id: string
      investor_name: string
      score: number
      reasons: string[]
      intro_message: string
      next_action: string
      next_action_type: MatchResult['next_action_type']
      priority: MatchResult['priority']
    }

    const raw = await claudeJSON<RawMatch[]>(SYSTEM_PROMPT, userMessage, {
      maxTokens: 6000,
    })

    // 3. Enrich with full investor objects
    const investorMap = new Map(investorSlice.map((i) => [i.id, i]))
    const matches: MatchResult[] = raw.map((r) => ({
      investor: (investorMap.get(r.investor_id) ?? {
        id: r.investor_id,
        name: r.investor_name,
      }) as Investor,
      score: r.score,
      reasons: r.reasons,
      intro_message: r.intro_message,
      next_action: r.next_action,
      next_action_type: r.next_action_type,
      priority: r.priority,
    }))

    // 4. Persist
    const [resultId] = await Promise.all([
      saveMatchResults(startup.name, matches),
      logAIRequest({
        type: 'match',
        input: { startup, filters },
        output: { count: matches.length },
        tokens_input: 0,  // track from claudeJSON if needed
        tokens_output: 0,
        duration_ms: Date.now() - t0,
      }),
    ])

    return NextResponse.json({
      id: resultId,
      matches,
      total: matches.length,
      high_priority: matches.filter((m) => m.priority === 'high').length,
    })
  } catch (err) {
    console.error('[/api/ai/match]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    )
  }
}

// Slim investor object for Claude context (saves tokens)
function investorToContext(i: Investor) {
  return {
    id: i.id,
    name: i.name,
    status: i.status,
    sectors: i.sectors,
    stages: i.stages,
    geography: i.geography,
    check_size: i.check_size,
    description: i.description?.slice(0, 300),  // truncate
    contact: i.contact,
    invest_phase: i.invest_phase,
  }
}
