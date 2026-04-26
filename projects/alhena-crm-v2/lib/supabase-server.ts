const rawUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getConfig() {
  if (!rawUrl || !serviceRoleKey) {
    throw new Error("Supabase env vars are missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return {
    url: rawUrl.replace(/\/rest\/v1\/?$/, ""),
    key: serviceRoleKey,
  };
}

export async function supabaseRest<T>(path: string, init?: RequestInit): Promise<T> {
  const { url, key } = getConfig();

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Supabase request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
