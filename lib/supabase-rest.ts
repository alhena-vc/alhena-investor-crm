const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
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

  const requestUrl = `${supabaseUrl}/rest/v1/${path}`;

  try {
    const response = await fetch(requestUrl, {
      ...init,
      headers: {
        ...getHeaders(),
        ...(init?.headers ?? {}),
      },
      cache: 'no-store',
    });

    return response;
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown fetch error';
    throw new Error(`Supabase fetch failed for ${requestUrl}: ${reason}`);
  }
}

export function supabaseInsertHeaders() {
  return getHeaders('return=representation');
}
