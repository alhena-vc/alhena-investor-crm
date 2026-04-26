'use client'

import { useCallback, useRef, useState } from 'react'
import type { MatchResult, Startup } from '@/types/investor'

type Mode = 'chat' | 'match' | 'generate'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  matches?: MatchResult[]
}

function MatchCard({
  match,
  onAction,
}: {
  match: MatchResult
  onAction: (match: MatchResult) => void
}) {
  const priorityColor = {
    high: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-gray-100 text-gray-600 border-gray-200',
  }[match.priority]

  const actionLabel = {
    telegram: 'Telegram',
    email: 'Email',
    call: 'Call',
    intro: 'Intro',
    wait: 'Wait',
  }[match.next_action_type] ?? 'Next step'

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">{match.investor.name}</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            {getInvestorSubtitle(match)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${priorityColor}`}>
            {match.priority}
          </span>
          <span className="text-sm font-bold text-blue-600">{match.score}%</span>
        </div>
      </div>

      <div className="mb-3 space-y-1">
        {match.reasons.map((reason, index) => (
          <p key={index} className="flex gap-1 text-xs text-gray-600">
            <span className="mt-0.5 text-green-500">+</span>
            <span>{reason}</span>
          </p>
        ))}
      </div>

      <div className="mb-3 rounded-lg bg-blue-50 p-2.5 text-xs italic text-gray-700">
        &quot;{match.intro_message}&quot;
      </div>

      <button
        onClick={() => onAction(match)}
        className="w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700"
      >
        {actionLabel}: {match.next_action}
      </button>
    </div>
  )
}

export default function AIChat() {
  const [mode, setMode] = useState<Mode>('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [matchForm, setMatchForm] = useState<Partial<Startup>>({})
  const abortRef = useRef<AbortController | null>(null)

  const addMessage = useCallback((message: Omit<Message, 'id'>) => {
    setMessages((prev) => [...prev, { ...message, id: crypto.randomUUID() }])
  }, [])

  const sendChat = async () => {
    if (!input.trim() || loading) return

    const userText = input.trim()
    setInput('')
    addMessage({ role: 'user', content: userText })
    setLoading(true)

    abortRef.current = new AbortController()
    const messageId = crypto.randomUUID()
    setMessages((prev) => [...prev, { id: messageId, role: 'assistant', content: '' }])

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          type: mode === 'generate' ? 'component' : 'general',
          stream: true,
        }),
        signal: abortRef.current.signal,
      })

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body returned from AI endpoint')
      }

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((message) =>
            message.id === messageId
              ? { ...message, content: message.content + chunk }
              : message
          )
        )
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === messageId
              ? { ...message, content: `Error: ${(error as Error).message}` }
              : message
          )
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const runMatch = async () => {
    if (!matchForm.name || !matchForm.sector || !matchForm.stage) return

    setLoading(true)
    addMessage({
      role: 'user',
      content: `Run investor matching for ${matchForm.name} (${matchForm.sector}, ${matchForm.stage})`,
    })

    try {
      const response = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup: matchForm }),
      })

      const data = await response.json()

      if (!response.ok) {
        addMessage({
          role: 'assistant',
          content: `Matching error: ${data?.error ?? response.statusText}`,
        })
        return
      }

      const highPriority = data?.matches?.filter(
        (match: MatchResult) => match.priority === 'high'
      ).length ?? 0

      addMessage({
        role: 'assistant',
        content: `Found ${data?.matches?.length ?? 0} matches. High priority: ${highPriority}.`,
        matches: data.matches,
      })
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: `Matching error: ${(error as Error).message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const getAction = async (match: MatchResult) => {
    setLoading(true)

    try {
      const response = await fetch('/api/ai/action', {
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

      const data = await response.json()
      addMessage({
        role: 'assistant',
        content: `**${match.investor.name}** -> ${data.action}\n\n${data.draft_message ?? ''}\n\n_${data.reasoning ?? ''}_`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex h-screen max-w-4xl flex-col bg-gray-50">
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <h1 className="font-bold text-gray-900">ALHENA AI</h1>
          <p className="text-xs text-gray-500">
            Investor matching, drafting, and general AI assistance
          </p>
        </div>
        <div className="flex gap-2">
          {(['chat', 'match', 'generate'] as Mode[]).map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === item
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {mode === 'match' ? (
        <div className="border-b bg-white px-6 py-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { key: 'name', placeholder: 'Startup name' },
              { key: 'sector', placeholder: 'Sector' },
              { key: 'stage', placeholder: 'Stage' },
              { key: 'check_needed', placeholder: 'Check needed' },
            ].map(({ key, placeholder }) => (
              <input
                key={key}
                placeholder={placeholder}
                value={(matchForm as Record<string, string | undefined>)[key] ?? ''}
                onChange={(event) =>
                  setMatchForm((prev) => ({ ...prev, [key]: event.target.value }))
                }
                className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <textarea
            placeholder="Description, traction, team, and context"
            value={matchForm.description ?? ''}
            onChange={(event) =>
              setMatchForm((prev) => ({ ...prev, description: event.target.value }))
            }
            rows={2}
            className="mt-3 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={runMatch}
            disabled={loading || !matchForm.name || !matchForm.sector || !matchForm.stage}
            className="mt-3 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Run matching'}
          </button>
        </div>
      ) : null}

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 text-4xl">AI</div>
            <p className="max-w-sm text-sm text-gray-500">
              {mode === 'chat'
                ? 'Ask a question about the CRM or request a draft.'
                : mode === 'match'
                  ? 'Fill in the startup details above to generate investor matches.'
                  : 'Describe what you want to generate.'}
            </p>
          </div>
        ) : null}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-2xl ${message.role === 'user' ? 'w-auto' : 'w-full'}`}>
              <div
                className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                  message.role === 'user'
                    ? 'rounded-br-sm bg-blue-600 text-white'
                    : 'rounded-bl-sm border bg-white text-gray-800 shadow-sm'
                }`}
                dangerouslySetInnerHTML={{
                  __html: message.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/_(.*?)_/g, '<em class="text-gray-500">$1</em>'),
                }}
              />

              {message.matches?.length ? (
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {message.matches.map((match) => (
                    <MatchCard key={match.investor.id} match={match} onAction={getAction} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role !== 'assistant' ? (
          <div className="flex justify-start">
            <div className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {mode !== 'match' ? (
        <div className="border-t bg-white px-6 py-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  void sendChat()
                }
              }}
              placeholder={
                mode === 'generate'
                  ? 'Describe what to generate'
                  : 'Ask anything about the CRM'
              }
              disabled={loading}
              className="flex-1 rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              onClick={sendChat}
              disabled={loading || !input.trim()}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function getInvestorSubtitle(match: MatchResult) {
  if (match.investor.fund_name) return match.investor.fund_name
  if (match.investor.sector_tags?.length) return match.investor.sector_tags.slice(0, 2).join(' / ')
  if (match.investor.sectors) return match.investor.sectors.split(',').slice(0, 2).join(' / ')
  return 'Investor profile'
}
