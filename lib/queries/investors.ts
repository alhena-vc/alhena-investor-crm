import { supabaseInsertHeaders, supabaseRestFetch } from '@/lib/supabase-rest';
import type { CreateInvestorPayload, Investor } from '@/types/investor';

const investorSelect =
  'id,name,fund_name,contact_name,contact_role,relationship_status,interaction_status,chat_status,telegram_chat_name,telegram_chat_link,sector_tags,stage_tags,geo_tags,anti_focus,preferred_angle,ai_summary,last_contact_date,next_action,next_action_date,created_at';

export async function getInvestors() {
  const response = await supabaseRestFetch(
    `investors?select=${investorSelect}&order=created_at.desc.nullslast`,
  );

  if (!response.ok) {
    throw new Error(`Failed to load investors: ${response.status}`);
  }

  return (await response.json()) as Investor[];
}

export async function getInvestorById(id: string) {
  const response = await supabaseRestFetch(
    `investors?select=${investorSelect}&id=eq.${encodeURIComponent(id)}&limit=1`,
  );

  if (!response.ok) {
    throw new Error(`Failed to load investor: ${response.status}`);
  }

  const investors = (await response.json()) as Investor[];
  return investors[0] ?? null;
}

export async function createInvestor(payload: CreateInvestorPayload) {
  const response = await supabaseRestFetch('investors', {
    method: 'POST',
    headers: supabaseInsertHeaders(),
    body: JSON.stringify([payload]),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to create investor: ${response.status} ${body}`);
  }

  const created = (await response.json()) as Investor[];
  return created[0];
}
