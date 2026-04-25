'use server';

import { revalidatePath } from 'next/cache';
import {
  ACTIVITY_TYPES,
  INVESTOR_PRIORITY,
  INVESTOR_RELATIONSHIP_STATUS,
  MATCH_FIT_STATUS,
  MATCH_OUTREACH_STATUS,
  PROJECT_STATUS,
} from '@/lib/crm-types';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { generateFitSummary, generateInvestorSummary, generateOutreachMessage } from '@/lib/ai';

function nullable(value: FormDataEntryValue | null) {
  const v = value?.toString().trim();
  return v ? v : null;
}

function toNumber(value: FormDataEntryValue | null) {
  const v = value?.toString().trim();
  if (!v) return null;
  const parsed = Number(v);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function upsertInvestorAction(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const payload = {
    name: formData.get('name')?.toString().trim(),
    type: nullable(formData.get('type')),
    contact_person: nullable(formData.get('contact_person')),
    telegram: nullable(formData.get('telegram')),
    email: nullable(formData.get('email')),
    website: nullable(formData.get('website')),
    geography: nullable(formData.get('geography')),
    sectors: nullable(formData.get('sectors')),
    stages: nullable(formData.get('stages')),
    check_min: toNumber(formData.get('check_min')),
    check_max: toNumber(formData.get('check_max')),
    currency: nullable(formData.get('currency')),
    investment_focus: nullable(formData.get('investment_focus')),
    relationship_status:
      (formData.get('relationship_status')?.toString() as (typeof INVESTOR_RELATIONSHIP_STATUS)[number]) ?? 'new',
    priority: (formData.get('priority')?.toString() as (typeof INVESTOR_PRIORITY)[number]) ?? 'medium',
    notes: nullable(formData.get('notes')),
    last_contact_date: nullable(formData.get('last_contact_date')),
    next_action_date: nullable(formData.get('next_action_date')),
    owner: nullable(formData.get('owner')),
  };

  if (!payload.name) {
    throw new Error('Investor name is required');
  }

  const id = nullable(formData.get('id'));
  if (id) {
    const { error } = await supabase.from('investors').update(payload).eq('id', id);
    if (error) throw new Error(`Failed to update investor: ${error.message}`);
  } else {
    const { error } = await supabase.from('investors').insert(payload);
    if (error) throw new Error(`Failed to create investor: ${error.message}`);
  }

  revalidatePath('/');
  revalidatePath('/investors');
  if (id) revalidatePath(`/investors/${id}`);
}

export async function upsertProjectAction(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const payload = {
    name: formData.get('name')?.toString().trim(),
    sector: nullable(formData.get('sector')),
    stage: nullable(formData.get('stage')),
    geography: nullable(formData.get('geography')),
    round_size: toNumber(formData.get('round_size')),
    valuation: toNumber(formData.get('valuation')),
    currency: nullable(formData.get('currency')),
    instrument: nullable(formData.get('instrument')),
    short_description: nullable(formData.get('short_description')),
    investment_thesis: nullable(formData.get('investment_thesis')),
    key_metrics: nullable(formData.get('key_metrics')),
    materials_link: nullable(formData.get('materials_link')),
    status: (formData.get('status')?.toString() as (typeof PROJECT_STATUS)[number]) ?? 'draft',
    notes: nullable(formData.get('notes')),
  };

  if (!payload.name) {
    throw new Error('Project name is required');
  }

  const id = nullable(formData.get('id'));
  if (id) {
    const { error } = await supabase.from('projects').update(payload).eq('id', id);
    if (error) throw new Error(`Failed to update project: ${error.message}`);
  } else {
    const { error } = await supabase.from('projects').insert(payload);
    if (error) throw new Error(`Failed to create project: ${error.message}`);
  }

  revalidatePath('/');
  revalidatePath('/projects');
  if (id) revalidatePath(`/projects/${id}`);
}

export async function createMatchAction(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const payload = {
    investor_id: formData.get('investor_id')?.toString(),
    project_id: formData.get('project_id')?.toString(),
    fit_score: toNumber(formData.get('fit_score')),
    fit_status: (formData.get('fit_status')?.toString() as (typeof MATCH_FIT_STATUS)[number]) ?? 'not_reviewed',
    why_match: nullable(formData.get('why_match')),
    risks_objections: nullable(formData.get('risks_objections')),
    suggested_angle: nullable(formData.get('suggested_angle')),
    recommended_next_step: nullable(formData.get('recommended_next_step')),
    outreach_status:
      (formData.get('outreach_status')?.toString() as (typeof MATCH_OUTREACH_STATUS)[number]) ?? 'not_contacted',
  };

  if (!payload.investor_id || !payload.project_id) {
    throw new Error('Investor and project are required to create a match');
  }

  const { error } = await supabase.from('matches').insert(payload);
  if (error) throw new Error(`Failed to create match: ${error.message}`);

  revalidatePath('/');
  revalidatePath('/matches');
  revalidatePath(`/investors/${payload.investor_id}`);
  revalidatePath(`/projects/${payload.project_id}`);
}

export async function createActivityAction(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const payload = {
    investor_id: nullable(formData.get('investor_id')),
    project_id: nullable(formData.get('project_id')),
    match_id: nullable(formData.get('match_id')),
    activity_type: (formData.get('activity_type')?.toString() as (typeof ACTIVITY_TYPES)[number]) ?? 'note',
    activity_date: formData.get('activity_date')?.toString() || new Date().toISOString().slice(0, 10),
    summary: formData.get('summary')?.toString().trim(),
    outcome: nullable(formData.get('outcome')),
    next_action: nullable(formData.get('next_action')),
    next_action_date: nullable(formData.get('next_action_date')),
    created_by: nullable(formData.get('created_by')),
  };

  if (!payload.summary) {
    throw new Error('Activity summary is required');
  }

  const { error } = await supabase.from('activities').insert(payload);
  if (error) throw new Error(`Failed to create activity: ${error.message}`);

  revalidatePath('/');
  revalidatePath('/activities');
  if (payload.investor_id) revalidatePath(`/investors/${payload.investor_id}`);
  if (payload.project_id) revalidatePath(`/projects/${payload.project_id}`);
}

export async function generateFitSummaryAction(formData: FormData) {
  return generateFitSummary({
    investorName: formData.get('investor_name')?.toString() || 'Investor',
    projectName: formData.get('project_name')?.toString() || 'Project',
    investorFocus: nullable(formData.get('investor_focus')),
    projectThesis: nullable(formData.get('project_thesis')),
  });
}

export async function generateOutreachMessageAction(formData: FormData) {
  return generateOutreachMessage({
    investorName: formData.get('investor_name')?.toString() || 'Investor',
    contactPerson: nullable(formData.get('contact_person')),
    projectName: formData.get('project_name')?.toString() || 'Project',
    suggestedAngle: nullable(formData.get('suggested_angle')),
  });
}

export async function generateInvestorSummaryAction(formData: FormData) {
  return generateInvestorSummary({
    investorName: formData.get('investor_name')?.toString() || 'Investor',
    sectors: nullable(formData.get('sectors')),
    stages: nullable(formData.get('stages')),
    geography: nullable(formData.get('geography')),
    notes: nullable(formData.get('notes')),
  });
}
