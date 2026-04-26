import { listProjects } from "@/lib/crm";
import { AddProjectForm } from "./add-project-form";

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
    <section className="card" style={{ display: "grid", gap: 12 }}>
      <h2>Projects</h2>
      <p className="muted">Live data from Supabase projects table.</p>
      <AddProjectForm />

      {error ? <p style={{ color: "#b91c1c" }}>Supabase error: {error}</p> : null}

      <div className="grid">
        {projects.map((project) => (
          <div key={project.id} className="card">
            <strong>{project.name}</strong>
            <p className="muted">{project.sector} / {project.stage}</p>
            <p className="muted">Geo: {project.geography}</p>
            <p>{project.summary}</p>
          </div>
        ))}
        {projects.length === 0 ? <p className="muted">No projects yet.</p> : null}
      </div>
    </section>
  );
}
