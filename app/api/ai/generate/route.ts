// app/api/ai/generate/route.ts
// POST /api/ai/generate
// Body: { prompt, type, publish?: { filePath, commitMessage, deploy } }

import { NextRequest, NextResponse } from 'next/server'
import { claudeComplete, claudeStream } from '@/lib/claude'
import { saveGeneratedContent, logAIRequest } from '@/lib/supabase-ai'
import { publishGeneratedCode } from '@/lib/github'

type GenerateType = 'landing' | 'component' | 'api_route' | 'email' | 'general'

const SYSTEM_BY_TYPE: Record<GenerateType, string> = {
  landing: `You are a senior Next.js developer. Generate complete, production-ready landing page components using Tailwind CSS. Use TypeScript. Export default. Include all sections in one file unless asked otherwise.`,
  component: `You are a senior React/Next.js developer. Generate clean, typed React components with Tailwind. Follow app router conventions. No placeholder comments — write real code.`,
  api_route: `You are a senior Next.js developer. Generate Next.js App Router API routes (route.ts). Include proper error handling, type safety, and input validation.`,
  email: `You are a B2B sales expert. Write personalized, concise cold outreach emails in Russian. Focus on value, be specific, avoid generic phrases. Max 150 words.`,
  general: `You are a senior full-stack developer. Write clean, production-ready code. No boilerplate comments. Real implementations only.`,
}

export async function POST(req: NextRequest) {
  const t0 = Date.now()

  try {
    const body = await req.json()
    const {
      prompt,
      type = 'general',
      stream = false,
      publish,
    } = body as {
      prompt: string
      type?: GenerateType
      stream?: boolean
      publish?: {
        filePath: string
        commitMessage: string
        deploy?: boolean
      }
    }

    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
    }

    const system = SYSTEM_BY_TYPE[type] ?? SYSTEM_BY_TYPE.general

    // ─── Streaming response ───────────────────────────────────────────────────
    if (stream && !publish) {
      const readable = await claudeStream(system, prompt)
      return new Response(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    // ─── Non-streaming (required for publish flow) ────────────────────────────
    const { text, inputTokens, outputTokens } = await claudeComplete(system, prompt)

    // Save to Supabase
    const contentId = await saveGeneratedContent({
      type: type === 'email' ? 'intro_message' : type === 'landing' ? 'landing' : 'code',
      content: text,
      metadata: { prompt, type, publish },
    })

    await logAIRequest({
      type: `generate:${type}`,
      input: { prompt: prompt.slice(0, 500), type },
      output: { contentId, length: text.length },
      tokens_input: inputTokens,
      tokens_output: outputTokens,
      duration_ms: Date.now() - t0,
    })

    // ─── Optional: push to GitHub + trigger deploy ────────────────────────────
    let publishResult = null
    if (publish?.filePath) {
      // Extract code block if Claude wrapped in ```
      const code = extractCode(text)
      publishResult = await publishGeneratedCode({
        filePath: publish.filePath,
        code,
        commitMessage: publish.commitMessage ?? `feat: AI-generated ${type}`,
        triggerDeploy: publish.deploy ?? false,
      })
    }

    return NextResponse.json({
      id: contentId,
      content: text,
      type,
      publish: publishResult,
      usage: { input: inputTokens, output: outputTokens },
    })
  } catch (err) {
    console.error('[/api/ai/generate]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    )
  }
}

function extractCode(text: string): string {
  const match = text.match(/```(?:\w+)?\n([\s\S]*?)```/)
  return match ? match[1].trim() : text.trim()
}
