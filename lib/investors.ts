import { supabaseRest } from "@/lib/supabase-server";
import type { Investor, NewInvestorInput } from "@/lib/types";

const investorFields = "id,name,email,firm,stage,notes,created_at";

export async function listInvestors() {
  const query = `investors?select=${investorFields}&order=created_at.desc.nullslast`;
  return await supabaseRest<Investor[]>(query);
}

export async function getInvestorById(id: string): Promise<Investor | null> {
  const query = `investors?select=${investorFields}&id=eq.${encodeURIComponent(id)}&limit=1`;
  const rows = await supabaseRest<Investor[]>(query);
  return rows[0] ?? null;
}

export async function createInvestor(input: NewInvestorInput) {
  const payload = [
    {
      name: input.name,
      email: input.email?.trim() || null,
      firm: input.firm?.trim() || null,
      stage: input.stage?.trim() || null,
      notes: input.notes?.trim() || null,
    },
  ];

  const rows = await supabaseRest<Investor[]>(
    `investors?select=${investorFields}`,
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    },
  );

  const created = rows[0];

  if (!created) {
    throw new Error("Supabase insert did not return a row.");
  }

  return created;
}
