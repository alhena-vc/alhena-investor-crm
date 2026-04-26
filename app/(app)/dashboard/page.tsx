import Link from "next/link";
import { listCommunications } from "@/lib/communications";
import { listDeals } from "@/lib/deals";
import { getInvestors } from "@/lib/queries/investors";
import { listProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let investors = [] as Awaited<ReturnType<typeof getInvestors>>;
  let projects = [] as Awaited<ReturnType<typeof listProjects>>;
  let deals = [] as Awaited<ReturnType<typeof listDeals>>;
  let communications = [] as Awaited<ReturnType<typeof listCommunications>>;
  let error: string | null = null;

  try {
    [investors, projects, deals, communications] = await Promise.all([
      getInvestors(),
      listProjects(),
      listDeals(),
      listCommunications(),
    ]);
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : "Unknown error";
  }

  const latestInvestor = investors[0] ?? null;
  const nextActions = communications.filter((item) => item.next_action);
  const scheduledFollowups = communications.filter((item) => item.next_action_at);

  return (
    <div className="space-y-6 p-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-slate-600">
          Operational snapshot for investors, projects, deals, and follow-ups.
        </p>
      </header>

      {error ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Supabase error: {error}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Investors" value={investors.length} hint="Active CRM records" />
        <MetricCard label="Projects" value={projects.length} hint="Companies in pipeline" />
        <MetricCard label="Deals" value={deals.length} hint="Investor-project relationships" />
        <MetricCard
          label="Open follow-ups"
          value={nextActions.length}
          hint={`${scheduledFollowups.length} scheduled`}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Latest investor added</p>
              <p className="text-sm text-slate-500">
                Quick sanity check that the investor pipeline is flowing into the app.
              </p>
            </div>
            <Link href="/investors" className="text-sm font-medium text-blue-600">
              Open investors →
            </Link>
          </div>

          {latestInvestor ? (
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-lg font-semibold text-slate-900">{latestInvestor.name}</p>
              <p className="mt-1 text-sm text-slate-500">
                {latestInvestor.fund_name ?? latestInvestor.relationship_status ?? "No metadata yet"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(latestInvestor.sector_tags ?? []).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200"
                  >
                    {tag}
                  </span>
                ))}
                {!latestInvestor.sector_tags?.length ? (
                  <span className="text-xs text-slate-400">No sector tags yet</span>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              No investor data yet.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Immediate actions</p>
              <p className="text-sm text-slate-500">Follow-up queue from communications.</p>
            </div>
            <Link href="/followups" className="text-sm font-medium text-blue-600">
              Open follow-ups →
            </Link>
          </div>

          <div className="space-y-3">
            {nextActions.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-800">{item.next_action}</p>
                  <span
                    className="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-medium text-blue-700"
                  >
                    {item.next_action_at ? formatDate(item.next_action_at) : "No due date"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{item.summary}</p>
              </div>
            ))}

            {nextActions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                No follow-up actions yet.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}
