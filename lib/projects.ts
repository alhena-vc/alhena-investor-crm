import { supabaseRest } from "@/lib/supabase-server";

export type Project = {
  id: string;
  name: string;
  sector: string;
  stage: string;
  geography: string;
  raise_target_usd: number | null;
  summary: string;
  created_at: string | null;
};

export type NewProjectInput = {
  name: string;
  sector: string;
  stage: string;
  geography: string;
  raise_target_usd?: number;
  summary: string;
};

const projectFields = "id,name,sector,stage,geography,raise_target_usd,summary,created_at";

export async function listProjects() {
  const query = `projects?select=${projectFields}&order=created_at.desc.nullslast`;
  return await supabaseRest<Project[]>(query);
}

export async function createProject(input: NewProjectInput) {
  const payload = {
    name: input.name.trim(),
    sector: input.sector.trim(),
    stage: input.stage.trim(),
    geography: input.geography.trim(),
    raise_target_usd: input.raise_target_usd ?? null,
    summary: input.summary.trim(),
  };

  const rows = await supabaseRest<Project[]>(
    `projects?select=${projectFields}`,
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    },
  );

  const row = rows[0];
  if (!row) {
    throw new Error("Supabase insert did not return a row.");
  }

  return row;
}
