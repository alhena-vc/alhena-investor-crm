import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/crm/project-form';
import { getProjectDetails } from '@/lib/crm';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getProjectDetails(id);

  if (!data.project) notFound();

  return (
    <div className="space-y-6">
      <Link href="/projects" className="text-sm text-blue-700">
        ← Back to projects
      </Link>

      <header>
        <h2 className="text-2xl font-semibold">{data.project.name}</h2>
        <p className="text-sm text-slate-600">
          {data.project.status} · {data.project.sector ?? 'No sector'} · {data.project.stage ?? 'No stage'}
        </p>
      </header>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Edit project</h3>
        <ProjectForm project={data.project} submitLabel="Save project" />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-lg font-semibold">Matching investors</h3>
        {data.matches.length === 0 ? (
          <p className="text-sm text-slate-500">No investors matched yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {data.matches.map((match) => (
              <li key={match.id} className="rounded-md border border-slate-200 p-2">
                <p className="font-medium">{match.investor.name}</p>
                <p className="text-slate-600">
                  Fit: {match.fit_status} ({match.fit_score ?? 'n/a'}) · Outreach: {match.outreach_status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
