import { NextResponse } from "next/server";
import { createCommunication } from "@/lib/communications";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      deal_id?: string;
      channel?: "email" | "call" | "meeting" | "telegram" | "other";
      direction?: "inbound" | "outbound";
      happened_at?: string;
      summary?: string;
      next_action?: string;
      next_action_at?: string;
    };

    if (!body.deal_id || !body.channel || !body.direction || !body.happened_at) {
      return NextResponse.json(
        { error: "deal_id, channel, direction and happened_at are required" },
        { status: 400 },
      );
    }

    if (!body.summary?.trim()) {
      return NextResponse.json({ error: "summary is required" }, { status: 400 });
    }

    const communication = await createCommunication({
      deal_id: body.deal_id,
      channel: body.channel,
      direction: body.direction,
      happened_at: body.happened_at,
      summary: body.summary,
      next_action: body.next_action,
      next_action_at: body.next_action_at,
    });

    return NextResponse.json(communication, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
