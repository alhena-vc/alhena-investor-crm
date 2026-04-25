import Link from 'next/link';
import { ProjectForm } from '@/components/crm/project-form';
import { listProjects } from '@/lib/crm';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="text-sm text-slate-600">Track ALHENA portfolio and fundraising opportunities.</p>
      </header>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">All projects</h3>
        {projects.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
            No projects yet. Add the first one below.
          </p>
        ) : (
          <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Sector</th>
                  <th className="px-3 py-2">Stage</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">
                      <Link href={`/projects/${project.id}`} className="text-blue-700 hover:underline">
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{project.sector ?? '—'}</td>
                    <td className="px-3 py-2">{project.stage ?? '—'}</td>
                    <td className="px-3 py-2">{project.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Add project</h3>
        <ProjectForm submitLabel="Create project" />
      </section>
    </div>
  );
}
