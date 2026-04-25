import Link from 'next/link';
import { notFound } from 'next/navigation';
import { InvestorForm } from '@/components/crm/investor-form';
import { getInvestorDetails } from '@/lib/crm';

export const dynamic = 'force-dynamic';

export default async function InvestorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getInvestorDetails(id);

  if (!data.investor) notFound();

  const investor = data.investor;

  return (
    <div className="space-y-6">
      <Link href="/investors" className="text-sm text-blue-700">
        ← Back to investors
      </Link>

      <header>
        <h2 className="text-2xl font-semibold">{investor.name}</h2>
        <p className="text-sm text-slate-600">
          {investor.type ?? 'Investor'} · {investor.relationship_status} · owner: {investor.owner ?? 'unassigned'}
        </p>
      </header>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Edit investor</h3>
        <InvestorForm investor={investor} submitLabel="Save investor" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 text-lg font-semibold">Matching projects</h3>
          {data.matches.length === 0 ? (
            <p className="text-sm text-slate-500">No matches yet. Create one on the Matches page.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.matches.map((match) => (
                <li key={match.id} className="rounded-md border border-slate-200 p-2">
                  <p className="font-medium">{match.project.name}</p>
                  <p className="text-slate-600">
                    Fit: {match.fit_status} ({match.fit_score ?? 'n/a'}) · Outreach: {match.outreach_status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 text-lg font-semibold">Telegram chats</h3>
          {data.chats.length === 0 ? (
            <p className="text-sm text-slate-500">No Telegram chats linked for this investor yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.chats.map((chat) => (
                <li key={chat.id} className="rounded-md border border-slate-200 p-2">
                  <a href={chat.chat_link} className="font-medium text-blue-700 hover:underline" target="_blank" rel="noreferrer">
                    {chat.chat_type ?? 'Chat'}
                  </a>
                  <p className="text-slate-600">Last touch: {chat.last_meaningful_touch ?? '—'}</p>
                  <p className="text-slate-600">{chat.chat_summary ?? 'No summary'}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-lg font-semibold">Activities</h3>
        {data.activities.length === 0 ? (
          <p className="text-sm text-slate-500">No activities logged yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {data.activities.map((activity) => (
              <li key={activity.id} className="rounded-md border border-slate-200 p-2">
                <p className="font-medium">
                  {activity.activity_date} · {activity.activity_type}
                </p>
                <p>{activity.summary}</p>
                <p className="text-slate-600">Next: {activity.next_action ?? '—'} ({activity.next_action_date ?? 'n/a'})</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
