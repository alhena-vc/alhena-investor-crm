'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AddInvestorModal } from '@/components/add-investor-modal'
import type { Investor, MatchResult, Startup } from '@/types/investor'

function StatusBadge({ status }: { status: string | null | undefined }) {
  if (!status) return null

  const map: Record<string, string> = {
    hot: 'bg-red-500/15 text-red-400 border-red-500/20',
    warm: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    cold: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    partner: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  }

  const cls = map[status.toLowerCase()] ?? 'bg-white/5 text-slate-400 border-white/10'

  return (
    <span className={`inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium ${cls}`}>
      {status}
    </span>
  )
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-emerald-500' : score >= 45 ? 'bg-amber-500' : 'bg-slate-500'

  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[11px] font-semibold text-white/70">{score}</span>
    </div>
  )
}

function MatchCard({ match, rank, onClick }: { match: MatchResult; rank: number; onClick: () => void }) {
  const priorityColor = {
    high: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    low: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  }[match.priority]

  const actionIcon = {
    telegram: 'Send',
    email: 'Email',
    call: 'Call',
    intro: 'Intro',
    wait: 'Wait',
  }[match.next_action_type] ?? 'Next'

  return (
    <div className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-sm" onClick={onClick}>
      <div className="mb-2 flex items-start justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <span className="w-4 flex-shrink-0 text-xs font-bold text-slate-400">#{rank}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{match.investor.name}</p>
            <p className="truncate text-xs text-slate-500">{match.investor.fund_name ?? ''}</p>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${priorityColor}`}>{match.priority}</span>
          <span className="text-sm font-bold text-blue-600">{match.score}%</span>
        </div>
      </div>

      <div className="mb-3 space-y-1">
        {match.reasons.slice(0, 2).map((reason, index) => (
          <p key={index} className="flex gap-1 text-xs text-slate-600">
            <span className="flex-shrink-0 text-emerald-500">+</span>
            <span className="truncate">{reason}</span>
          </p>
        ))}
      </div>

      <p className="mb-3 line-clamp-2 text-[11px] italic text-slate-500">&quot;{match.intro_message}&quot;</p>

      <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
        <span>{actionIcon}</span>
        <span className="truncate">{match.next_action}</span>
      </div>
    </div>
  )
}

function InvestorDetail({ investor, onClose }: { investor: Investor; onClose: () => void }) {
  const fields = [
    { label: 'Fund', value: investor.fund_name },
    { label: 'Contact', value: investor.contact_name },
    { label: 'Role', value: investor.contact_role },
    { label: 'Status', value: investor.relationship_status },
    { label: 'Telegram', value: investor.telegram_chat_name },
    { label: 'Last contact', value: investor.last_contact_date },
    { label: 'Next step', value: investor.next_action },
  ]

  const tags = [
    ...(investor.sector_tags ?? []),
    ...(investor.stage_tags ?? []),
    ...(investor.geo_tags ?? []),
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">{investor.name}</h2>
          {investor.fund_name ? <p className="mt-0.5 text-xs text-slate-500">{investor.fund_name}</p> : null}
        </div>
        <button onClick={onClose} className="px-1 text-lg leading-none text-slate-400 hover:text-slate-600">x</button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-3">
          {fields.filter((field) => field.value).map((field) => (
            <div key={field.label}>
              <p className="mb-0.5 text-[10px] uppercase tracking-wide text-slate-400">{field.label}</p>
              <p className="text-sm text-slate-800">{field.value}</p>
            </div>
          ))}
        </div>

        {tags.length > 0 ? (
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-wide text-slate-400">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, index) => (
                <span key={`${tag}-${index}`} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{tag}</span>
              ))}
            </div>
          </div>
        ) : null}

        {investor.ai_summary ? (
          <div>
            <p className="mb-1.5 text-[10px] uppercase tracking-wide text-slate-400">AI summary</p>
            <p className="rounded-lg bg-blue-50 p-3 text-sm leading-relaxed text-slate-700">{investor.ai_summary}</p>
          </div>
        ) : null}

        {investor.preferred_angle ? (
          <div>
            <p className="mb-1.5 text-[10px] uppercase tracking-wide text-slate-400">Preferred angle</p>
            <p className="text-sm text-slate-700">{investor.preferred_angle}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function MatchForm({ onResults }: { onResults: (results: MatchResult[], total: number, high: number) => void }) {
  const [form, setForm] = useState<Partial<Startup>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setField = (key: keyof Startup, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const run = async () => {
    if (!form.name || !form.sector || !form.stage) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup: form }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data?.error ?? res.statusText)
        return
      }

      onResults(data.matches ?? [], data.total ?? 0, data.high_priority ?? 0)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const fields: Array<{ key: keyof Startup; placeholder: string }> = [
    { key: 'name', placeholder: 'Startup name *' },
    { key: 'sector', placeholder: 'Sector *' },
    { key: 'stage', placeholder: 'Stage *' },
    { key: 'check_needed', placeholder: 'Check size' },
    { key: 'geography', placeholder: 'Geography' },
    { key: 'traction', placeholder: 'Traction' },
  ]

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Run matching</h2>
        <p className="mt-0.5 text-xs text-slate-500">Enter startup details and generate the best investor matches.</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {fields.map((field) => (
          <input
            key={field.key}
            placeholder={field.placeholder}
            value={(form as Record<string, string | undefined>)[field.key] ?? ''}
            onChange={(event) => setField(field.key, event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      <textarea
        placeholder="Description"
        value={form.description ?? ''}
        onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        rows={2}
        className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p> : null}

      <button
        onClick={run}
        disabled={loading || !form.name || !form.sector || !form.stage}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
      >
        {loading ? 'Analyzing...' : 'Run matching'}
      </button>
    </div>
  )
}

export default function InvestorsWorkspace({ investors }: { investors: Investor[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Investor | null>(null)
  const [matchResults, setMatchResults] = useState<MatchResult[]>([])
  const [matchSummary, setMatchSummary] = useState<{ total: number; high: number } | null>(null)
  const [rightTab, setRightTab] = useState<'match' | 'detail'>('match')

  const matchedIds = new Set(matchResults.map((match) => match.investor.id))

  const filtered = investors.filter((investor) => {
    if (!search) return true
    const q = search.toLowerCase()

    return (
      investor.name.toLowerCase().includes(q) ||
      investor.fund_name?.toLowerCase().includes(q) ||
      investor.contact_name?.toLowerCase().includes(q) ||
      false
    )
  })

  const handleSelect = (investor: Investor) => {
    setSelected(investor)
    setRightTab('detail')
  }

  const handleMatchResults = (results: MatchResult[], total: number, high: number) => {
    setMatchResults(results)
    setMatchSummary({ total, high })
  }

  const matchScoreFor = (investor: Investor) => {
    const match = matchResults.find((result) => result.investor.id === investor.id)
    return match?.score ?? null
  }

  return (
    <div className="flex h-full bg-[#0d1117]">
      <div className="flex w-72 flex-shrink-0 flex-col border-r border-white/[0.06]">
        <div className="px-4 pb-3 pt-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white">Investors</h1>
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[11px] text-slate-400">{investors.length}</span>
            </div>
            <div onClick={() => router.refresh()}>
              <AddInvestorModal />
            </div>
          </div>

          <input
            placeholder="Search..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 placeholder:text-slate-600 transition-colors focus:bg-white/8 focus:outline-none focus:border-white/20"
          />
        </div>

        {matchSummary ? (
          <div className="mx-4 mb-2 rounded-lg border border-blue-500/20 bg-blue-600/15 px-3 py-2">
            <p className="text-xs font-medium text-blue-300">
              Matches: {matchSummary.total} results | {matchSummary.high} high priority
            </p>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-600">No investors found.</p>
          ) : (
            filtered.map((investor) => {
              const score = matchScoreFor(investor)
              const isActive = selected?.id === investor.id
              const isMatched = matchedIds.has(investor.id)

              return (
                <button
                  key={investor.id}
                  onClick={() => handleSelect(investor)}
                  className={`mb-0.5 w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? 'border-white/15 bg-white/12'
                      : isMatched
                        ? 'border-blue-500/15 bg-blue-500/8 hover:bg-blue-500/12'
                        : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-medium ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {investor.name}
                      </p>
                      {investor.fund_name ? <p className="mt-0.5 truncate text-[11px] text-slate-500">{investor.fund_name}</p> : null}
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-end gap-1">
                      <StatusBadge status={investor.relationship_status ?? investor.interaction_status} />
                      {score !== null ? <ScoreBar score={score} /> : null}
                    </div>
                  </div>

                  {investor.sector_tags && investor.sector_tags.length > 0 ? (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {investor.sector_tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-600">{tag}</span>
                      ))}
                    </div>
                  ) : null}
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col bg-gray-50">
        <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-5 pb-0 pt-4">
          {[
            { id: 'match' as const, label: 'Matching' },
            { id: 'detail' as const, label: selected ? selected.name : 'Profile', disabled: !selected },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setRightTab(tab.id)}
              disabled={tab.disabled}
              className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                rightTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : tab.disabled
                    ? 'cursor-default border-transparent text-slate-300'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {rightTab === 'match' ? (
            <div>
              <MatchForm onResults={handleMatchResults} />

              {matchResults.length > 0 ? (
                <div className="px-6 pb-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Top {Math.min(matchResults.length, 5)} matches
                  </p>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {matchResults.slice(0, 5).map((match, index) => (
                      <MatchCard
                        key={match.investor.id}
                        match={match}
                        rank={index + 1}
                        onClick={() => {
                          const found = investors.find((investor) => investor.id === match.investor.id)
                          if (found) {
                            setSelected(found)
                            setRightTab('detail')
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                  <div className="mb-4 text-5xl">Search</div>
                  <p className="mb-1 text-sm font-medium text-slate-700">Find the strongest investor matches</p>
                  <p className="max-w-xs text-xs text-slate-400">
                    Enter startup details above and review the top investor matches with quick rationale.
                  </p>
                </div>
              )}
            </div>
          ) : selected ? (
            <InvestorDetail investor={selected} onClose={() => {
              setSelected(null)
              setRightTab('match')
            }} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
