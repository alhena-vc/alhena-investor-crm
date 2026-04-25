'use client';

import { createClient } from '@supabase/supabase-js';
import { getPublicSupabaseEnv } from '@/lib/env';

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getPublicSupabaseEnv();
  return createClient(url, anonKey);
}
