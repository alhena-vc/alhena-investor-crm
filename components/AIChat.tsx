'use client'
// components/AIChat.tsx — Universal AI interface with streaming + match + action

import { useState, useRef, useCallback } from 'react'
import type { Startup, MatchResult } from '@/types/investor'

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'chat' | 'match' | 'generate'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  matches?: MatchResult[]
  metadata?: Record<string, unknown>
}

// ─── Investor Match Card ──────────────────────────────────────────────────────

function MatchCard({ match, onAction }: { match: MatchResult; onAction: (m: MatchResult) => void }) {
  const priorityColor = {
    high: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-gray-100 text-gray-600 border-gray-200',
  }[match.priority]

  const actionIcon = {
    telegram: '✈️',
    email: '📧',
    call: '📞',
    intro: '🤝',
    wait: '⏳',
  }[match.next_action_type] ?? '▶️'

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{match.investor.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {match.investor.sectors?.split(',').slice(0, 2).join(' · ')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priorityColor}`}>
            {match.priority}
          </span>
          <span className="text-sm font-bold text-blue-600">{match.score}%</span>
        </div>
      </div>

      <div className="space-y-1 mb-3">
        {match.reasons.map((r, i) => (
          <p key={i} className="text-xs text-gray-600 flex gap-1">
            <span className="text-green-500 mt-0.5">✓</span> {r}
          </p>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-2.5 mb-3 text-xs text-gray-700 italic">
        "{match.intro_message}"
      </div>

      <button
        onClick={() => onAction(match)}
        className="w-full flex items-center justify-center gap-2 text-xs font-medium bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700 transition-colors"
      >
        {actionIcon} {match.next_action}
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIChat() {
  const [mode, setMode] = useState<Mode>('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [matchForm, setMatchForm] = useState<Partial<Startup>>({})
  const abortRef = useRef<AbortController | null>(null)

  const addMessage = useCallback((msg: Omit<Message, 'id'>) => {
    setMessages((prev) => [
      ...prev,
      { ...msg, id: crypto.randomUUID() },
    ])
  }, [])

  // ─── Streaming chat ─────────────────────────────────────────────────────────
  const sendChat = async () => {
    if (!input.trim() || loading) return
    const userText = input.trim()
    setInput('')
    addMessage({ role: 'user', content: userText })
    setLoading(true)

    abortRef.current = new AbortController()
    const msgId = crypto.randomUUID()
    setMessages((prev) => [...prev, { id: msgId, role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, type: 'general', stream: true }),
        signal: abortRef.current.signal,
      })

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, content: m.content + chunk } : m))
        )
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, content: 'Error: ' + (e as Error).message } : m
          )
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // ─── Investor matching ──────────────────────────────────────────────────────
  const runMatch = async () => {
    if (!matchForm.name || !matchForm.sector || !matchForm.stage) return
    setLoading(true)
    addMessage({
      role: 'user',
      content: `🔍 Матчинг для: **${matchForm.name}** (${matchForm.sector}, ${matchForm.stage})`,
    })

    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup: matchForm }),
      })
      const data = await res.json()

      addMessage({
        role: 'assistant',
        content: `Найдено **${data?.matches?.length}** подходящих инвесторов (${data?.matches?.filter\(\(m\) => m\.priority === .high.\)\.length} приоритетных)`,
        matches: data.matches,
      })
    } catch (e) {
      addMessage({ role: 'assistant', content: 'Ошибка матчинга: ' + (e as Error).message })
    } finally {
      setLoading(false)
    }
  }

  // ─── Next action for investor ───────────────────────────────────────────────
  const getAction = async (match: MatchResult) => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investor_id: match.investor.id,
          context: {
            startup_name: matchForm.name ?? 'Startup',
            startup_sector: matchForm.sector,
            startup_stage: matchForm.stage,
          },
        }),
      })
      const data = await res.json()
      addMessage({
        role: 'assistant',
        content: `**${match.investor.name}** → ${data.action}\n\n${data.draft_message ?? ''}\n\n_${data.reasoning}_`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-900">ALHENA AI</h1>
          <p className="text-xs text-gray-500">Investor matching · Code generation · Deal intelligence</p>
        </div>
        <div className="flex gap-2">
          {(['chat', 'match', 'generate'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {m === 'chat' ? '💬 Чат' : m === 'match' ? '🎯 Матчинг' : '⚡ Генерация'}
            </button>
          ))}
        </div>
      </div>

      {/* Match Form (visible when mode === 'match') */}
      {mode === 'match' && (
        <div className="bg-white border-b px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'name', placeholder: 'Название стартапа' },
              { key: 'sector', placeholder: 'Сектор (SaaS, AI...)' },
              { key: 'stage', placeholder: 'Стадия (Seed, A...)' },
              { key: 'check_needed', placeholder: 'Нужный чек ($500K...)' },
            ].map(({ key, placeholder }) => (
              <input
                key={key}
                placeholder={placeholder}
                value={(matchForm as Record<string, string>)[key] ?? ''}
                onChange={(e) =>
                  setMatchForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <textarea
            placeholder="Описание (traction, команда, проблема...)"
            value={matchForm.description ?? ''}
            onChange={(e) => setMatchForm((prev) => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="w-full mt-3 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={runMatch}
            disabled={loading || !matchForm.name}
            className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Анализирую...' : '🎯 Найти инвесторов'}
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3">🚀</div>
            <p className="text-gray-500 text-sm max-w-sm">
              {mode === 'chat'
                ? 'Задайте любой вопрос или попросите сгенерировать код'
                : mode === 'match'
                ? 'Заполните форму выше и запустите матчинг'
                : 'Опишите что нужно сгенерировать'}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl ${msg.role === 'user' ? 'w-auto' : 'w-full'}`}>
              <div
                className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white border text-gray-800 rounded-bl-sm shadow-sm'
                }`}
                dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/_(.*?)_/g, '<em class="text-gray-500">$1</em>'),
                }}
              />

              {/* Match results grid */}
              {msg.matches && msg.matches.length > 0 && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {msg.matches.map((match, i) => (
                    <MatchCard key={i} match={match} onAction={getAction} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      {mode !== 'match' && (
        <div className="bg-white border-t px-6 py-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendChat()}
              placeholder={
                mode === 'generate'
                  ? 'Что сгенерировать? (лендинг, компонент, API route...)'
                  : 'Спросите что-нибудь...'
              }
              disabled={loading}
              className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              onClick={sendChat}
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '...' : '→'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
