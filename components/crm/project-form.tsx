import { upsertProjectAction } from '@/app/actions';
import { PROJECT_STATUS } from '@/lib/crm-types';

type ProjectFormProps = {
  project?: {
    id: string;
    name: string;
    sector: string | null;
    stage: string | null;
    geography: string | null;
    round_size: number | null;
    valuation: number | null;
    currency: string | null;
    instrument: string | null;
    short_description: string | null;
    investment_thesis: string | null;
    key_metrics: string | null;
    materials_link: string | null;
    status: string;
    notes: string | null;
  };
  submitLabel: string;
};

export function ProjectForm({ project, submitLabel }: ProjectFormProps) {
  return (
    <form action={upsertProjectAction} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <input required name="name" defaultValue={project?.name ?? ''} placeholder="Name" className="input" />
        <input name="sector" defaultValue={project?.sector ?? ''} placeholder="Sector" className="input" />
        <input name="stage" defaultValue={project?.stage ?? ''} placeholder="Stage" className="input" />
        <input name="geography" defaultValue={project?.geography ?? ''} placeholder="Geography" className="input" />
        <input name="round_size" type="number" defaultValue={project?.round_size ?? ''} placeholder="Round size" className="input" />
        <input name="valuation" type="number" defaultValue={project?.valuation ?? ''} placeholder="Valuation" className="input" />
        <input name="currency" defaultValue={project?.currency ?? 'USD'} placeholder="Currency" className="input" />
        <input name="instrument" defaultValue={project?.instrument ?? ''} placeholder="Instrument" className="input" />
        <input name="materials_link" defaultValue={project?.materials_link ?? ''} placeholder="Materials link" className="input" />
        <select name="status" defaultValue={project?.status ?? 'draft'} className="input">
          {PROJECT_STATUS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <textarea
        name="short_description"
        rows={2}
        defaultValue={project?.short_description ?? ''}
        placeholder="Short description"
        className="input w-full"
      />
      <textarea
        name="investment_thesis"
        rows={2}
        defaultValue={project?.investment_thesis ?? ''}
        placeholder="Investment thesis"
        className="input w-full"
      />
      <textarea
        name="key_metrics"
        rows={2}
        defaultValue={project?.key_metrics ?? ''}
        placeholder="Key metrics"
        className="input w-full"
      />
      <textarea name="notes" rows={3} defaultValue={project?.notes ?? ''} placeholder="Notes" className="input w-full" />
      <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
        {submitLabel}
      </button>
    </form>
  );
}
