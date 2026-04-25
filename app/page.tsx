import Link from 'next/link';
import { getDashboardData } from '@/lib/crm';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getDashboardData();

  const upcoming = data.upcomingActivities.filter((item) => item.next_action_date);
  const activeProjects = data.projects.filter((p) => p.status === 'active').length;
  const warmInvestors = data.investors.filter((i) => ['warm', 'active', 'partner'].includes(i.relationship_status)).length;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-slate-600">MVP summary and upcoming follow-ups.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Investors" value={String(data.investors.length)} />
        <Card title="Warm/Active Investors" value={String(warmInvestors)} />
        <Card title="Active Projects" value={String(activeProjects)} />
        <Card title="Matches" value={String(data.matches.length)} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Upcoming follow-ups</h3>
          <Link href="/activities" className="text-sm text-blue-700">
            Open activities →
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500">No follow-ups scheduled. Add one from the Activities page.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((item) => (
              <li key={item.id} className="rounded-md border border-slate-200 p-3 text-sm">
                <p className="font-medium">{item.summary}</p>
                <p className="text-slate-600">
                  Due {item.next_action_date} · Investor: {item.investor?.name ?? '—'} · Project: {item.project?.name ?? '—'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
