import type { Investor } from '@/types/investor';

function renderValue(value: string | null | undefined) {
  if (!value || !value.trim()) {
    return <span className="text-slate-400">Not set</span>;
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return (
      <a href={value} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
        {value}
      </a>
    );
  }

  return value;
}

function renderTags(tags: string[] | null) {
  if (!tags || tags.length === 0) {
    return <span className="text-slate-400">Not set</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
          {tag}
        </span>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-2 text-sm text-slate-900">{children}</div>
    </div>
  );
}

export function InvestorDetailView({ investor }: { investor: Investor }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{investor.name || 'Unnamed investor'}</h2>
        <p className="mt-1 text-sm text-slate-600">Detailed profile and outreach context.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Fund name">{renderValue(investor.fund_name)}</Field>
        <Field label="Contact name">{renderValue(investor.contact_name)}</Field>
        <Field label="Contact role">{renderValue(investor.contact_role)}</Field>
        <Field label="Relationship status">{renderValue(investor.relationship_status)}</Field>
        <Field label="Interaction status">{renderValue(investor.interaction_status)}</Field>
        <Field label="Chat status">{renderValue(investor.chat_status)}</Field>
        <Field label="Telegram chat name">{renderValue(investor.telegram_chat_name)}</Field>
        <Field label="Telegram chat link">{renderValue(investor.telegram_chat_link)}</Field>
        <Field label="Anti focus">{renderValue(investor.anti_focus)}</Field>
        <Field label="Preferred angle">{renderValue(investor.preferred_angle)}</Field>
        <Field label="Last contact date">{renderValue(investor.last_contact_date)}</Field>
        <Field label="Next action date">{renderValue(investor.next_action_date)}</Field>
        <Field label="Sector tags">{renderTags(investor.sector_tags)}</Field>
        <Field label="Stage tags">{renderTags(investor.stage_tags)}</Field>
        <Field label="Geo tags">{renderTags(investor.geo_tags)}</Field>
      </div>

      <Field label="Next action">{renderValue(investor.next_action)}</Field>
      <Field label="AI summary">{renderValue(investor.ai_summary)}</Field>
    </section>
  );
}
