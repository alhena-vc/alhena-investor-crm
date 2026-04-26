import { AddCommunicationModal } from "@/components/add-communication-modal";
import { listCommunications } from "@/lib/communications";
import { listDeals } from "@/lib/deals";

export const dynamic = "force-dynamic";

export default async function FollowupsPage() {
  let communications = [] as Awaited<ReturnType<typeof listCommunications>>;
  let deals = [] as Awaited<ReturnType<typeof listDeals>>;
  let error: string | null = null;

  try {
    [communications, deals] = await Promise.all([listCommunications(), listDeals()]);
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : "Unknown error";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Follow-ups / Communications</h2>
          <p className="text-sm text-slate-600">Full timeline of investor communications and next actions.</p>
        </div>
        <AddCommunicationModal deals={deals} />
      </div>

      {error ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Supabase error: {error}
        </p>
      ) : null}

      <div className="space-y-3">
        {communications.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded bg-slate-100 px-2 py-1">{item.channel}</span>
              <span className="rounded bg-slate-100 px-2 py-1">{item.direction}</span>
              <span>{new Date(item.happened_at).toLocaleString()}</span>
            </div>
            <p className="mt-2 text-sm text-slate-900">{item.summary}</p>
            {item.next_action ? (
              <p className="mt-2 text-xs text-blue-700">
                Next action: {item.next_action}
                {item.next_action_at ? ` (${new Date(item.next_action_at).toLocaleString()})` : ""}
              </p>
            ) : null}
          </div>
        ))}

        {communications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
            No communication history yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
