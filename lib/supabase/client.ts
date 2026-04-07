type QueryResult<T> = { data: T | null; error: { message: string } | null };

type OrderOptions = { ascending?: boolean; nullsFirst?: boolean };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

class QueryBuilder {
  private readonly table: string;
  private readonly params = new URLSearchParams();
  private method: 'GET' | 'POST' = 'GET';
  private body: string | null = null;
  private headers: HeadersInit = {};

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string) {
    this.params.set('select', columns);
    return this;
  }

  order(column: string, options?: OrderOptions) {
    const direction = options?.ascending === false ? 'desc' : 'asc';
    const nulls = options?.nullsFirst === false ? '.nullslast' : '';
    this.params.set('order', `${column}.${direction}${nulls}`);
    return this;
  }

  eq(column: string, value: string) {
    this.params.set(column, `eq.${value}`);
    return this;
  }

  insert(payload: unknown) {
    this.method = 'POST';
    this.body = JSON.stringify(payload);
    this.headers = {
      Prefer: 'return=representation',
      'Content-Type': 'application/json',
    };
    return this;
  }

  async maybeSingle<T>(): Promise<QueryResult<T>> {
    this.params.set('limit', '1');
    const result = await this.execute<T[]>();

    if (result.error) return { data: null, error: result.error };
    return { data: result.data?.[0] ?? null, error: null };
  }

  async single<T>(): Promise<QueryResult<T>> {
    const result = await this.execute<T[]>();

    if (result.error) return { data: null, error: result.error };

    const first = result.data?.[0];
    if (!first) {
      return { data: null, error: { message: 'No rows returned' } };
    }

    return { data: first, error: null };
  }

  async execute<T>(): Promise<QueryResult<T>> {
    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        data: null,
        error: { message: 'Supabase env vars NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required' },
      };
    }

    const baseUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1`;
    const url = `${baseUrl}/${this.table}?${this.params.toString()}`;

    const response = await fetch(url, {
      method: this.method,
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        ...this.headers,
      },
      body: this.body,
      cache: 'no-store',
    });

    if (!response.ok) {
      return { data: null, error: { message: `${response.status}` } };
    }

    return { data: (await response.json()) as T, error: null };
  }
}

export const supabase = {
  from(table: string) {
    return new QueryBuilder(table);
  },
};
