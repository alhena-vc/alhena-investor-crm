import Link from 'next/link';
import { InvestorForm } from '@/components/crm/investor-form';
import { listInvestors } from '@/lib/crm';

type Props = { searchParams: Promise<{ q?: string; relationship_status?: string }> };

export const dynamic = 'force-dynamic';

export default async function InvestorsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.trim() || '';
  const relationshipStatus = params.relationship_status?.trim() || '';
  const investors = await listInvestors(q || undefined, relationshipStatus || undefined);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Investors</h2>
        <p className="text-sm text-slate-600">Search, filter, and maintain investor records.</p>
      </header>

      <form className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px_auto]">
        <input name="q" defaultValue={q} placeholder="Search name, contact, email" className="input" />
        <select name="relationship_status" defaultValue={relationshipStatus} className="input">
          <option value="">All relationship statuses</option>
          {['new', 'known', 'warm', 'active', 'partner', 'inactive', 'blacklist'].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Filter
        </button>
      </form>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">All investors</h3>
        {investors.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
            No investors found. Create your first investor below.
          </p>
        ) : (
          <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Relationship</th>
                  <th className="px-3 py-2">Priority</th>
                  <th className="px-3 py-2">Next action</th>
                </tr>
              </thead>
              <tbody>
                {investors.map((investor) => (
                  <tr key={investor.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">
                      <Link href={`/investors/${investor.id}`} className="text-blue-700 hover:underline">
                        {investor.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{investor.type ?? '—'}</td>
                    <td className="px-3 py-2">{investor.relationship_status}</td>
                    <td className="px-3 py-2">{investor.priority}</td>
                    <td className="px-3 py-2">{investor.next_action_date ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Add investor</h3>
        <InvestorForm submitLabel="Create investor" />
      </section>
    </div>
  );
}
