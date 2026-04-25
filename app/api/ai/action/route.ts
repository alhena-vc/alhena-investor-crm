import { NextRequest, NextResponse } from "next/server"
import { claudeJSON } from "@/lib/claude"
import { logAIRequest } from "@/lib/supabase-ai"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
export async function POST(req: NextRequest) { try { const { investor_id, context } = await req.json(); const { data: investor, error } = await supabase.from("investors").select("*").eq("id", investor_id).single(); if (error || !investor) return NextResponse.json({ error: "Not found" }, { status: 404 }); const result = await claudeJSON(`You are a VC dealflow manager. Suggest next action for investor ${investor.name} (${investor.status}). Startup: ${context.startup_name}. Return JSON: {action, action_type, urgency, draft_message, reasoning, fallback_action}`, "Analyze and respond"); await logAIRequest({ type: "action", input: { investor_id, context }, output: result, tokens_input: 0, tokens_output: 0 }); return NextResponse.json({ investor_id, ...result }); } catch(err) { return NextResponse.json({ error: String(err) }, { status: 500 }) } }
