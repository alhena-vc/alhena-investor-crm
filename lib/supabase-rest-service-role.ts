import 'server-only';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getServiceRoleHeaders(prefer?: string) {
  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  }

  const headers: HeadersInit = {
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
    'Content-Type': 'application/json',
  };

  if (prefer) {
    headers.Prefer = prefer;
  }

  return headers;
}

export async function supabaseServiceRoleRestFetch(path: string, init?: RequestInit) {
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL is missing');
  }

  const baseUrl = supabaseUrl.replace(/\/$/, '');

  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...getServiceRoleHeaders(),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  return response;
}

export function supabaseServiceRoleInsertHeaders() {
  return getServiceRoleHeaders('return=representation');
}
