import 'server-only';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { Activity, Investor, Match, Project, TelegramChat } from '@/lib/crm-types';

export async function listInvestors(search?: string, relationshipStatus?: string) {
  const supabase = createSupabaseServerClient();
  let query = supabase.from('investors').select('*').order('created_at', { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,contact_person.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (relationshipStatus) {
    query = query.eq('relationship_status', relationshipStatus);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load investors: ${error.message}`);
  return (data ?? []) as Investor[];
}

export async function getInvestorById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('investors').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`Failed to load investor ${id}: ${error.message}`);
  return data as Investor | null;
}

export async function listProjects() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to load projects: ${error.message}`);
  return (data ?? []) as Project[];
}

export async function getProjectById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`Failed to load project ${id}: ${error.message}`);
  return data as Project | null;
}

export async function listMatches() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('matches')
    .select('*, investor:investors(id,name), project:projects(id,name)')
    .order('updated_at', { ascending: false });

  if (error) throw new Error(`Failed to load matches: ${error.message}`);
  return (data ?? []) as (Match & { investor: Pick<Investor, 'id' | 'name'>; project: Pick<Project, 'id' | 'name'> })[];
}

export async function listActivities() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*, investor:investors(id,name), project:projects(id,name), match:matches(id,fit_status)')
    .order('activity_date', { ascending: false });

  if (error) throw new Error(`Failed to load activities: ${error.message}`);
  return (data ?? []) as (Activity & {
    investor: Pick<Investor, 'id' | 'name'> | null;
    project: Pick<Project, 'id' | 'name'> | null;
    match: Pick<Match, 'id' | 'fit_status'> | null;
  })[];
}

export async function getInvestorDetails(id: string) {
  const supabase = createSupabaseServerClient();
  const [investorResult, matchesResult, activitiesResult, chatsResult] = await Promise.all([
    supabase.from('investors').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('matches')
      .select('*, project:projects(id,name,status)')
      .eq('investor_id', id)
      .order('updated_at', { ascending: false }),
    supabase
      .from('activities')
      .select('*, project:projects(id,name), match:matches(id,fit_status)')
      .eq('investor_id', id)
      .order('activity_date', { ascending: false }),
    supabase.from('telegram_chats').select('*').eq('investor_id', id).order('updated_at', { ascending: false }),
  ]);

  if (investorResult.error) throw new Error(`Failed to load investor: ${investorResult.error.message}`);
  if (matchesResult.error) throw new Error(`Failed to load investor matches: ${matchesResult.error.message}`);
  if (activitiesResult.error) throw new Error(`Failed to load investor activities: ${activitiesResult.error.message}`);
  if (chatsResult.error) throw new Error(`Failed to load investor telegram chats: ${chatsResult.error.message}`);

  return {
    investor: (investorResult.data ?? null) as Investor | null,
    matches: (matchesResult.data ?? []) as (Match & { project: Pick<Project, 'id' | 'name' | 'status'> })[],
    activities: (activitiesResult.data ?? []) as (Activity & {
      project: Pick<Project, 'id' | 'name'> | null;
      match: Pick<Match, 'id' | 'fit_status'> | null;
    })[],
    chats: (chatsResult.data ?? []) as TelegramChat[],
  };
}

export async function getProjectDetails(id: string) {
  const supabase = createSupabaseServerClient();
  const [projectResult, matchesResult] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('matches')
      .select('*, investor:investors(id,name,priority,relationship_status)')
      .eq('project_id', id)
      .order('fit_score', { ascending: false }),
  ]);

  if (projectResult.error) throw new Error(`Failed to load project: ${projectResult.error.message}`);
  if (matchesResult.error) throw new Error(`Failed to load project matches: ${matchesResult.error.message}`);

  return {
    project: (projectResult.data ?? null) as Project | null,
    matches: (matchesResult.data ?? []) as (Match & {
      investor: Pick<Investor, 'id' | 'name' | 'priority' | 'relationship_status'>;
    })[],
  };
}

export async function getDashboardData() {
  const supabase = createSupabaseServerClient();

  const [investorsResult, projectsResult, matchesResult, activitiesResult] = await Promise.all([
    supabase.from('investors').select('id,next_action_date,relationship_status', { count: 'exact', head: false }),
    supabase.from('projects').select('id,status', { count: 'exact', head: false }),
    supabase.from('matches').select('id,fit_status,outreach_status', { count: 'exact', head: false }),
    supabase
      .from('activities')
      .select('id,activity_date,next_action_date,summary,investor:investors(id,name),project:projects(id,name)')
      .order('next_action_date', { ascending: true, nullsFirst: false })
      .limit(10),
  ]);

  if (investorsResult.error) throw new Error(`Failed to load dashboard investors: ${investorsResult.error.message}`);
  if (projectsResult.error) throw new Error(`Failed to load dashboard projects: ${projectsResult.error.message}`);
  if (matchesResult.error) throw new Error(`Failed to load dashboard matches: ${matchesResult.error.message}`);
  if (activitiesResult.error) throw new Error(`Failed to load dashboard activities: ${activitiesResult.error.message}`);

  return {
    investors: investorsResult.data ?? [],
    projects: projectsResult.data ?? [],
    matches: matchesResult.data ?? [],
    upcomingActivities: activitiesResult.data ?? [],
  };
}
