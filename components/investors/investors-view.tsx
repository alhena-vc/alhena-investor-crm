import Link from 'next/link';
import type { Investor } from '@/types/investor';
import { AddInvestorModal } from '@/components/investors/add-investor-modal';

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
}

export function InvestorsView({ investors }: { investors: Investor[] }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Investors</h2>
          <p className="mt-1 text-sm text-slate-600">Manage relationships and investor outreach pipeline.</p>
        </div>
        <AddInvestorModal />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {investors.map((investor) => (
          <article key={investor.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{investor.name || 'Unnamed investor'}</h3>
            <p className="text-sm text-slate-600">{investor.fund_name || 'No fund name'}</p>
            <dl className="mt-4 space-y-1 text-sm text-slate-700">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Relationship</dt>
                <dd>{investor.relationship_status || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Interaction</dt>
                <dd>{investor.interaction_status || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Next action date</dt>
                <dd>{formatDate(investor.next_action_date)}</dd>
              </div>
            </dl>
            <Link
              href={`/investors/${investor.id}`}
              className="mt-4 inline-block rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
            >
              Открыть карточку
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
