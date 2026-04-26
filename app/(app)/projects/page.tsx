import { AddProjectModal } from "@/components/add-project-modal";
import { listProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let projects = [] as Awaited<ReturnType<typeof listProjects>>;
  let error: string | null = null;

  try {
    projects = await listProjects();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : "Unknown error";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Projects</h2>
          <p className="text-sm text-slate-600">Project pipeline source for matching.</p>
        </div>
        <AddProjectModal />
      </div>

      {error ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Supabase error: {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Geography</th>
              <th className="px-4 py-3">Raise target</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{project.name}</td>
                <td className="px-4 py-3">{project.sector}</td>
                <td className="px-4 py-3">{project.stage}</td>
                <td className="px-4 py-3">{project.geography}</td>
                <td className="px-4 py-3">
                  {project.raise_target_usd
                    ? `$${Math.round(project.raise_target_usd).toLocaleString()}`
                    : "—"}
                </td>
              </tr>
            ))}
            {projects.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={5}>
                  No projects yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
