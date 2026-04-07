import { supabaseInsertHeaders, supabaseRestFetch } from '@/lib/supabase-rest';
import type { CreateInvestorPayload, Investor } from '@/types/investor';

export async function getInvestors() {
  const response = await supabaseRestFetch('investors?select=*&order=created_at.desc');

  if (!response.ok) {
    throw new Error(`Failed to load investors: ${response.status}`);
  }

  return (await response.json()) as Investor[];
}

export async function getInvestorById(id: string) {
  const response = await supabaseRestFetch(`investors?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);

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
