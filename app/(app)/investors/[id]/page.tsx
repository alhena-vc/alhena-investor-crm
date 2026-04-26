import Link from "next/link";
import { notFound } from "next/navigation";
import { getInvestorById } from "@/lib/queries/investors";

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
    <div className="space-y-4 p-6">
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
          {investor?.fund_name ? (
            <p className="mt-1 text-sm text-slate-500">{investor.fund_name}</p>
          ) : null}

          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Contact</dt>
              <dd className="text-sm">{investor?.contact_name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Role</dt>
              <dd className="text-sm">{investor?.contact_role ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Relationship</dt>
              <dd className="text-sm">{investor?.relationship_status ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Created</dt>
              <dd className="text-sm">{formatDate(investor?.created_at) ?? "—"}</dd>
            </div>
          </dl>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <TagGroup title="Sectors" tags={investor?.sector_tags} />
            <TagGroup title="Stages" tags={investor?.stage_tags} />
            <TagGroup title="Geography" tags={investor?.geo_tags} />
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Preferred angle</p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{investor?.preferred_angle ?? "—"}</p>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Next action</p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{investor?.next_action ?? "—"}</p>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">AI summary</p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{investor?.ai_summary ?? "—"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function TagGroup({
  title,
  tags,
}: {
  title: string;
  tags: string[] | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags?.length ? (
          tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-400">—</span>
        )}
      </div>
    </div>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
