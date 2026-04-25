import { supabaseRest } from "@/lib/supabase-server";

export type Communication = {
  id: string;
  deal_id: string;
  channel: "email" | "call" | "meeting" | "telegram" | "other";
  direction: "inbound" | "outbound";
  happened_at: string;
  summary: string;
  next_action: string | null;
  next_action_at: string | null;
  created_at: string | null;
};

export type NewCommunicationInput = {
  deal_id: string;
  channel: Communication["channel"];
  direction: Communication["direction"];
  happened_at: string;
  summary: string;
  next_action?: string;
  next_action_at?: string;
};

const communicationFields =
  "id,deal_id,channel,direction,happened_at,summary,next_action,next_action_at,created_at";

export async function listCommunications() {
  return await supabaseRest<Communication[]>(
    `communications?select=${communicationFields}&order=happened_at.desc.nullslast`,
  );
}

export async function createCommunication(input: NewCommunicationInput) {
  const rows = await supabaseRest<Communication[]>(
    `communications?select=${communicationFields}`,
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        deal_id: input.deal_id,
        channel: input.channel,
        direction: input.direction,
        happened_at: input.happened_at,
        summary: input.summary.trim(),
        next_action: input.next_action?.trim() || null,
        next_action_at: input.next_action_at || null,
      }),
    },
  );

  const row = rows[0];
  if (!row) {
    throw new Error("Supabase insert did not return a row.");
  }

  return row;
}
