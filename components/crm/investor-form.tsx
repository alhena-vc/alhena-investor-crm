import { upsertInvestorAction } from '@/app/actions';
import { INVESTOR_PRIORITY, INVESTOR_RELATIONSHIP_STATUS } from '@/lib/crm-types';

type InvestorFormProps = {
  investor?: {
    id: string;
    name: string;
    type: string | null;
    contact_person: string | null;
    telegram: string | null;
    email: string | null;
    website: string | null;
    geography: string | null;
    sectors: string | null;
    stages: string | null;
    check_min: number | null;
    check_max: number | null;
    currency: string | null;
    investment_focus: string | null;
    relationship_status: string;
    priority: string;
    notes: string | null;
    last_contact_date: string | null;
    next_action_date: string | null;
    owner: string | null;
  };
  submitLabel: string;
};

export function InvestorForm({ investor, submitLabel }: InvestorFormProps) {
  return (
    <form action={upsertInvestorAction} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      {investor ? <input type="hidden" name="id" value={investor.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <input required name="name" placeholder="Name" defaultValue={investor?.name ?? ''} className="input" />
        <input name="type" placeholder="Type" defaultValue={investor?.type ?? ''} className="input" />
        <input
          name="contact_person"
          placeholder="Contact person"
          defaultValue={investor?.contact_person ?? ''}
          className="input"
        />
        <input name="telegram" placeholder="Telegram" defaultValue={investor?.telegram ?? ''} className="input" />
        <input name="email" type="email" placeholder="Email" defaultValue={investor?.email ?? ''} className="input" />
        <input name="website" placeholder="Website" defaultValue={investor?.website ?? ''} className="input" />
        <input name="geography" placeholder="Geography" defaultValue={investor?.geography ?? ''} className="input" />
        <input name="sectors" placeholder="Sectors" defaultValue={investor?.sectors ?? ''} className="input" />
        <input name="stages" placeholder="Stages" defaultValue={investor?.stages ?? ''} className="input" />
        <input
          name="currency"
          placeholder="Currency"
          defaultValue={investor?.currency ?? 'USD'}
          className="input"
        />
        <input name="check_min" type="number" placeholder="Check min" defaultValue={investor?.check_min ?? ''} className="input" />
        <input name="check_max" type="number" placeholder="Check max" defaultValue={investor?.check_max ?? ''} className="input" />
        <input name="owner" placeholder="Owner" defaultValue={investor?.owner ?? ''} className="input" />
        <select name="relationship_status" defaultValue={investor?.relationship_status ?? 'new'} className="input">
          {INVESTOR_RELATIONSHIP_STATUS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select name="priority" defaultValue={investor?.priority ?? 'medium'} className="input">
          {INVESTOR_PRIORITY.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          name="last_contact_date"
          type="date"
          defaultValue={investor?.last_contact_date ?? ''}
          className="input"
        />
        <input
          name="next_action_date"
          type="date"
          defaultValue={investor?.next_action_date ?? ''}
          className="input"
        />
      </div>
      <textarea
        name="investment_focus"
        placeholder="Investment focus"
        defaultValue={investor?.investment_focus ?? ''}
        rows={2}
        className="input w-full"
      />
      <textarea name="notes" placeholder="Notes" defaultValue={investor?.notes ?? ''} rows={3} className="input w-full" />
      <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
        {submitLabel}
      </button>
    </form>
  );
}
