import Link from "next/link";
import { listInvestors } from "@/lib/investors";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let investors = [] as Awaited<ReturnType<typeof listInvestors>>;
  let error: string | null = null;

  try {
    investors = await listInvestors();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : "Unknown error";
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-slate-600">Minimal CRM overview.</p>
      </header>

      {error ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Supabase error: {error}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Total investors</p>
          <p className="mt-2 text-3xl font-semibold">{investors.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Latest record</p>
          <p className="mt-2 text-lg font-medium">
            {investors[0]?.name ?? "No data yet"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Quick action</p>
          <Link href="/investors" className="mt-2 inline-block text-blue-600">
            Open investors →
          </Link>
        </div>
      </section>
    </div>
  );
}
