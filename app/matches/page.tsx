import { createMatchAction } from '@/app/actions';
import { listInvestors, listMatches, listProjects } from '@/lib/crm';

export const dynamic = 'force-dynamic';

export default async function MatchesPage() {
  const [matches, investors, projects] = await Promise.all([listMatches(), listInvestors(), listProjects()]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Matches</h2>
        <p className="text-sm text-slate-600">Create and review investor-project matching decisions.</p>
      </header>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Create match</h3>
        <form action={createMatchAction} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <select name="investor_id" required className="input">
              <option value="">Select investor</option>
              {investors.map((investor) => (
                <option key={investor.id} value={investor.id}>
                  {investor.name}
                </option>
              ))}
            </select>
            <select name="project_id" required className="input">
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <input name="fit_score" type="number" placeholder="Fit score (0-100)" className="input" />
            <select name="fit_status" className="input">
              {['not_reviewed', 'good_fit', 'maybe', 'poor_fit', 'do_not_contact'].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select name="outreach_status" className="input">
              {[
                'not_contacted',
                'intro_sent',
                'follow_up',
                'interested',
                'materials_sent',
                'call_scheduled',
                'due_diligence',
                'declined',
                'committed',
              ].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <textarea name="why_match" rows={2} placeholder="Why match" className="input w-full" />
          <textarea name="risks_objections" rows={2} placeholder="Risks / objections" className="input w-full" />
          <textarea name="suggested_angle" rows={2} placeholder="Suggested angle" className="input w-full" />
          <textarea name="recommended_next_step" rows={2} placeholder="Recommended next step" className="input w-full" />
          <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Create match
          </button>
        </form>
      </section>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">All matches</h3>
        {matches.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
            No matches yet. Add one with the form above.
          </p>
        ) : (
          <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Investor</th>
                  <th className="px-3 py-2">Project</th>
                  <th className="px-3 py-2">Fit</th>
                  <th className="px-3 py-2">Outreach</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{match.investor?.name ?? '—'}</td>
                    <td className="px-3 py-2">{match.project?.name ?? '—'}</td>
                    <td className="px-3 py-2">
                      {match.fit_status} ({match.fit_score ?? 'n/a'})
                    </td>
                    <td className="px-3 py-2">{match.outreach_status}</td>
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
