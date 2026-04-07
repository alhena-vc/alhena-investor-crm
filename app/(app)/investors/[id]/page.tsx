import Link from "next/link";
import { notFound } from "next/navigation";
import { getInvestorById } from "@/lib/investors";

export const dynamic = "force-dynamic";

export default async function InvestorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let investor: Awaited<ReturnType<typeof getInvestorById>> = null;
  let error: string | null = null;

  try {
    investor = await getInvestorById(id);
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : "Unknown error";
  }

  if (!error && !investor) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <Link href="/investors" className="text-sm text-blue-600">
        ← Back to investors
      </Link>

      {error ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Supabase error: {error}
        </p>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-semibold">{investor?.name}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Firm</dt>
              <dd className="text-sm">{investor?.firm ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Email</dt>
              <dd className="text-sm">{investor?.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Stage</dt>
              <dd className="text-sm">{investor?.stage ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Created
              </dt>
              <dd className="text-sm">{investor?.created_at ?? "—"}</dd>
            </div>
          </dl>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Notes</p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{investor?.notes ?? "—"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
