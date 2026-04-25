import { createActivityAction } from '@/app/actions';
import { listActivities, listInvestors, listMatches, listProjects } from '@/lib/crm';

export const dynamic = 'force-dynamic';

export default async function ActivitiesPage() {
  const [activities, investors, projects, matches] = await Promise.all([
    listActivities(),
    listInvestors(),
    listProjects(),
    listMatches(),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Activities</h2>
        <p className="text-sm text-slate-600">Manually capture investor interactions and follow-ups.</p>
      </header>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Log activity</h3>
        <form action={createActivityAction} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <select name="investor_id" className="input">
              <option value="">Optional investor</option>
              {investors.map((investor) => (
                <option key={investor.id} value={investor.id}>
                  {investor.name}
                </option>
              ))}
            </select>
            <select name="project_id" className="input">
              <option value="">Optional project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <select name="match_id" className="input">
              <option value="">Optional match</option>
              {matches.map((match) => (
                <option key={match.id} value={match.id}>
                  {(match.investor?.name ?? 'Unknown investor') + ' ↔ ' + (match.project?.name ?? 'Unknown project')}
                </option>
              ))}
            </select>
            <select name="activity_type" className="input">
              {['telegram', 'whatsapp', 'email', 'call', 'meeting', 'intro', 'follow_up', 'materials_sent', 'note'].map(
                (item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ),
              )}
            </select>
            <input name="activity_date" type="date" className="input" />
            <input name="next_action_date" type="date" className="input" />
            <input name="created_by" placeholder="Created by" className="input" />
          </div>
          <textarea required name="summary" rows={2} placeholder="Summary" className="input w-full" />
          <textarea name="outcome" rows={2} placeholder="Outcome" className="input w-full" />
          <textarea name="next_action" rows={2} placeholder="Next action" className="input w-full" />
          <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Add activity
          </button>
        </form>
      </section>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">All activities</h3>
        {activities.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
            No activities yet. Use the form above to create one.
          </p>
        ) : (
          <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Summary</th>
                  <th className="px-3 py-2">Context</th>
                  <th className="px-3 py-2">Next action</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{activity.activity_date}</td>
                    <td className="px-3 py-2">{activity.activity_type}</td>
                    <td className="px-3 py-2">{activity.summary}</td>
                    <td className="px-3 py-2">
                      {(activity.investor?.name ?? '—') + ' / ' + (activity.project?.name ?? '—')}
                    </td>
                    <td className="px-3 py-2">{activity.next_action_date ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
