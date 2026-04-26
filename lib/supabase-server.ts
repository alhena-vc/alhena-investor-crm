type SupabaseConfig = {
  url: string;
  key: string;
};

function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const normalizedUrl = url.replace(/\/rest\/v1\/?$/, "");

  return { url: normalizedUrl, key };
}

export async function supabaseRest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const { url, key } = getSupabaseConfig();
  const requestUrl = `${url}/rest/v1/${path}`;

  let response: Response;
  try {
    response = await fetch(requestUrl, {
      ...init,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown fetch error";
    throw new Error(`Supabase fetch failed for ${requestUrl}: ${reason}`);
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Supabase request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
