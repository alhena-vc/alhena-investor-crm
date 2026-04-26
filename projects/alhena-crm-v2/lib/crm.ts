import { supabaseRest } from "@/lib/supabase-server";

export type Investor = {
  id: string;
  name: string;
  investor_type: string;
  stage_focus: string;
  sector_focus: string;
  geography_focus: string;
  created_at: string | null;
};

export type Project = {
  id: string;
  name: string;
  sector: string;
  stage: string;
  geography: string;
  summary: string;
  created_at: string | null;
};

const investorFields = "id,name,investor_type,stage_focus,sector_focus,geography_focus,created_at";
const projectFields = "id,name,sector,stage,geography,summary,created_at";

export async function listInvestors() {
  return await supabaseRest<Investor[]>(`investors?select=${investorFields}&order=created_at.desc.nullslast&limit=100`);
}

export async function createInvestor(input: {
  name: string;
  investor_type: string;
  stage_focus: string;
  sector_focus: string;
  geography_focus: string;
}) {
  const rows = await supabaseRest<Investor[]>(`investors?select=${investorFields}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(input),
  });

  return rows[0];
}

export async function listProjects() {
  return await supabaseRest<Project[]>(`projects?select=${projectFields}&order=created_at.desc.nullslast&limit=100`);
}

export async function createProject(input: {
  name: string;
  sector: string;
  stage: string;
  geography: string;
  summary: string;
}) {
  const rows = await supabaseRest<Project[]>(`projects?select=${projectFields}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(input),
  });

  return rows[0];
}
