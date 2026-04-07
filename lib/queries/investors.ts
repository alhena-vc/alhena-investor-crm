import { supabase } from '@/lib/supabase/client';
import type { CreateInvestorPayload, Investor } from '@/types/investor';

const investorSelect = '*';

export async function getInvestors() {
  const { data, error } = await supabase
    .from('investors')
    .select(investorSelect)
    .order('created_at', { ascending: false, nullsFirst: false })
    .execute<Investor[]>();

  if (error) {
    throw new Error(`Failed to load investors: ${error.message}`);
  }

  return data ?? [];
}

export async function getInvestorById(id: string) {
  const { data, error } = await supabase.from('investors').select(investorSelect).eq('id', id).maybeSingle<Investor>();

  if (error) {
    throw new Error(`Failed to load investor: ${error.message}`);
  }

  return data;
}

export async function createInvestor(payload: CreateInvestorPayload) {
  const { data, error } = await supabase.from('investors').insert(payload).select(investorSelect).single<Investor>();

  if (error) {
    throw new Error(`Failed to create investor: ${error.message}`);
  }

  return data;
}
