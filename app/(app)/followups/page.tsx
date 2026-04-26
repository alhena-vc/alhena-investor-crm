import { AddCommunicationModal } from "@/components/add-communication-modal";
import { listCommunications } from "@/lib/communications";
import { listDealStages } from "@/lib/deal-stages";
import { listDeals } from "@/lib/deals";
import { getInvestors } from "@/lib/queries/investors";
import { listProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function FollowupsPage() {
  let communications = [] as Awaited<ReturnType<typeof listCommunications>>;
  let deals = [] as Awaited<ReturnType<typeof listDeals>>;
  let investors = [] as Awaited<ReturnType<typeof getInvestors>>;
  let projects = [] as Awaited<ReturnType<typeof listProjects>>;
  let stages = [] as Awaited<ReturnType<typeof listDealStages>>;
  let error: string | null = null;

  try {
    [communications, deals, investors, projects, stages] = await Promise.all([
      listCommunications(),
      listDeals(),
      getInvestors(),
      listProjects(),
      listDealStages(),
    ]);
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : "Unknown error";
  }

  const dealById = new Map(deals.map((deal) => [deal.id, deal]));
  const investorById = new Map(
    investors.map((investor) => [investor.id, investor.fund_name ?? investor.name])
  );
  const projectById = new Map(projects.map((project) => [project.id, project.name]));
  const stageById = new Map(stages.map((stage) => [stage.id, stage.title]));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Follow-ups / Communications</h2>
          <p className="text-sm text-slate-600">
            Full timeline of investor communications and next actions.
          </p>
        </div>
        <AddCommunicationModal deals={deals} />
      </div>

      {error ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Supabase error: {error}
        </p>
      ) : null}

      <div className="space-y-3">
        {communications.map((item) => {
          const deal = dealById.get(item.deal_id);
          const dealInvestor = deal ? investorById.get(deal.investor_id) : null;
          const dealProject = deal ? projectById.get(deal.project_id) : null;
          const dealStage = deal ? stageById.get(deal.stage_id) : null;

          return (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded bg-slate-100 px-2 py-1">{item.channel}</span>
                <span className="rounded bg-slate-100 px-2 py-1">{item.direction}</span>
                <span>{new Date(item.happened_at).toLocaleString()}</span>
                {dealStage ? (
                  <span className="rounded bg-slate-100 px-2 py-1">{dealStage}</span>
                ) : null}
              </div>

              {(dealInvestor || dealProject) ? (
                <p className="mt-2 text-sm font-medium text-slate-800">
                  {dealInvestor ?? "Unknown investor"}
                  {" / "}
                  {dealProject ?? "Unknown project"}
                </p>
              ) : null}

              <p className="mt-2 text-sm text-slate-900">{item.summary}</p>

              {item.next_action ? (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-medium text-blue-700">Next action: {item.next_action}</span>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">
                    {item.next_action_at
                      ? `Due: ${new Date(item.next_action_at).toLocaleString()}`
                      : "No due date"}
                  </span>
                </div>
              ) : null}
            </div>
          );
        })}

        {communications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
            No communication history yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
