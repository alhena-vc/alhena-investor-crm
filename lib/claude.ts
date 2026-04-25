// lib/claude.ts — Claude API wrapper (Anthropic SDK v0.24+)
// npm install @anthropic-ai/sdk

import Anthropic from '@anthropic-ai/sdk'

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set')
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const CLAUDE_MODEL = 'claude-opus-4-5'  // swap to sonnet-4-5 for cost savings
export const MAX_TOKENS = 4096

// ─── Base: single completion ─────────────────────────────────────────────────

export async function claudeComplete(
  system: string,
  userMessage: string,
  opts?: { temperature?: number; maxTokens?: number }
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: opts?.maxTokens ?? MAX_TOKENS,
    system,
    messages: [{ role: 'user', content: userMessage }],
  })

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as Anthropic.TextBlock).text)
    .join('')

  return {
    text,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  }
}

// ─── Streaming: returns ReadableStream for Next.js Response ──────────────────

export async function claudeStream(
  system: string,
  userMessage: string
): Promise<ReadableStream> {
  const stream = await anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: MAX_TOKENS,
    system,
    messages: [{ role: 'user', content: userMessage }],
  })

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })
}

// ─── JSON mode: guaranteed parsed output ─────────────────────────────────────

export async function claudeJSON<T>(
  system: string,
  userMessage: string,
  opts?: { maxTokens?: number }
): Promise<T> {
  const { text } = await claudeComplete(
    system + '\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation.',
    userMessage,
    opts
  )

  // Strip markdown fences if model ignores instruction
  const clean = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

  try {
    return JSON.parse(clean) as T
  } catch {
    // Last resort: extract JSON object/array
    const match = clean.match(/(\{[\s\S]*\}|\[[\s\S]*\])/m)
    if (match) return JSON.parse(match[1]) as T
    throw new Error(`Claude returned non-JSON: ${clean.slice(0, 200)}`)
  }
}
