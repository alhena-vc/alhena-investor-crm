import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { getPublicSupabaseEnv, getServerSupabaseServiceRoleKey } from '@/lib/env';

export function createSupabaseServerClient() {
  const { url, anonKey } = getPublicSupabaseEnv();

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

export function createSupabaseAdminClient() {
  const { url } = getPublicSupabaseEnv();
  const serviceRoleKey = getServerSupabaseServiceRoleKey();

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
