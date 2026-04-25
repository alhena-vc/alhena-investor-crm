import { AddDealModal } from "@/components/add-deal-modal";
import { listDealStages } from "@/lib/deal-stages";
import { listDeals } from "@/lib/deals";
import { listInvestors } from "@/lib/investors";
import { listProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function OutreachPage() {
  let deals = [] as Awaited<ReturnType<typeof listDeals>>;
  let investors = [] as Awaited<ReturnType<typeof listInvestors>>;
  let projects = [] as Awaited<ReturnType<typeof listProjects>>;
  let stages = [] as Awaited<ReturnType<typeof listDealStages>>;
  let error: string | null = null;

  try {
    [deals, investors, projects, stages] = await Promise.all([
      listDeals(),
      listInvestors(),
      listProjects(),
      listDealStages(),
    ]);
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : "Unknown error";
  }

  const investorById = new Map(investors.map((investor) => [investor.id, investor.name]));
  const projectById = new Map(projects.map((project) => [project.id, project.name]));
  const stageById = new Map(stages.map((stage) => [stage.id, stage.title]));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Deals / Outreach</h2>
          <p className="text-sm text-slate-600">Track investor-project deal pipeline and statuses.</p>
        </div>
        <AddDealModal investors={investors} projects={projects} stages={stages} />
      </div>

      {error ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Supabase error: {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3">Investor</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{investorById.get(deal.investor_id) ?? deal.investor_id}</td>
                <td className="px-4 py-3">{projectById.get(deal.project_id) ?? deal.project_id}</td>
                <td className="px-4 py-3">{stageById.get(deal.stage_id) ?? deal.stage_id}</td>
                <td className="px-4 py-3">{deal.deal_type}</td>
                <td className="px-4 py-3">
                  {deal.amount_usd ? `$${Math.round(deal.amount_usd).toLocaleString()}` : "—"}
                </td>
              </tr>
            ))}
            {deals.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={5}>
                  No deals yet. Add at least one investor and one project first.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
