const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getHeaders(prefer?: string) {
  if (!supabaseAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  }

  const headers: HeadersInit = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
  };

  if (prefer) {
    headers.Prefer = prefer;
  }

  return headers;
}

export async function supabaseRestFetch(path: string, init?: RequestInit) {
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...getHeaders(),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  return response;
}

export function supabaseInsertHeaders() {
  return getHeaders('return=representation');
}
