import { supabaseRest } from '@/lib/supabase-server';
import type { CreateInvestorPayload, Investor } from '@/types/investor';

const investorSelect =
  'id,name,fund_name,contact_role,relationship_status,interaction_status,chat_status,telegram_chat_name,telegram_chat_link,sector_tags,stage_tags,geo_tags,anti_focus,preferred_angle,ai_summary,last_contact_date,next_action,next_action_date,created_at';

export async function getInvestors() {
  return await supabaseRest<Investor[]>(
    `investors?select=${investorSelect}&order=created_at.desc.nullslast`,
  );
}

export async function getInvestorById(id: string): Promise<Investor | null> {
  const investors = await supabaseRest<Investor[]>(
    `investors?select=${investorSelect}&id=eq.${encodeURIComponent(id)}&limit=1`,
  );
  return investors[0] ?? null;
}

export async function createInvestor(payload: CreateInvestorPayload) {
  const insertPayload = {
    category: 'fund',
    ...payload,
  };

  const created = await supabaseRest<Investor[]>(
    `investors?select=${investorSelect}`,
    {
    method: 'POST',
    headers: supabaseInsertHeaders(),
      body: JSON.stringify(insertPayload),
    },
  );

  return created[0];
}

function supabaseInsertHeaders() {
  return {
    Prefer: 'return=representation',
  };
}
