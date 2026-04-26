import { supabaseRest } from "@/lib/supabase-server";

export type Deal = {
  id: string;
  investor_id: string;
  project_id: string;
  stage_id: string;
  deal_type: "equity" | "debt" | "venture_loan" | "other";
  amount_usd: number | null;
  status_note: string | null;
  created_at: string | null;
};

export type NewDealInput = {
  investor_id: string;
  project_id: string;
  stage_id: string;
  deal_type: "equity" | "debt" | "venture_loan" | "other";
  amount_usd?: number;
  status_note?: string;
};

const dealFields = "id,investor_id,project_id,stage_id,deal_type,amount_usd,status_note,created_at";

export async function listDeals() {
  return await supabaseRest<Deal[]>(
    `deals?select=${dealFields}&order=created_at.desc.nullslast`,
  );
}

export async function createDeal(input: NewDealInput) {
  const rows = await supabaseRest<Deal[]>(`deals?select=${dealFields}`, {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      investor_id: input.investor_id,
      project_id: input.project_id,
      stage_id: input.stage_id,
      deal_type: input.deal_type,
      amount_usd: input.amount_usd ?? null,
      status_note: input.status_note?.trim() || null,
    }),
  });

  const row = rows[0];
  if (!row) {
    throw new Error("Supabase insert did not return a row.");
  }

  return row;
}
