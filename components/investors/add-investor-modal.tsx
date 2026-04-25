'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateInvestorPayload } from '@/types/investor';

const emptyForm: CreateInvestorPayload = {
  name: '',
  fund_name: '',
  contact_name: '',
  contact_role: '',
  relationship_status: 'new',
  interaction_status: 'not_started',
  chat_status: 'none',
  sector_tags: [],
  stage_tags: [],
  geo_tags: [],
  next_action: '',
};

function parseTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function AddInvestorModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateInvestorPayload>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name?.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    setError(null);

    const response = await fetch('/api/investors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const body = await response.text();
      setSaving(false);
      setError(body || 'Failed to create investor');
      return;
    }

    setSaving(false);
    setOpen(false);
    setForm(emptyForm);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        + Add Investor
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">New investor</h3>
              <button onClick={() => setOpen(false)} className="text-sm text-slate-500 hover:text-slate-900">
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm">
                  Name *
                  <input
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={form.name ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </label>
                <label className="text-sm">
                  Fund name
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={form.fund_name ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, fund_name: e.target.value }))}
                  />
                </label>
                <label className="text-sm">
                  Contact name
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={form.contact_name ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, contact_name: e.target.value }))}
                  />
                </label>
                <label className="text-sm">
                  Contact role
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={form.contact_role ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, contact_role: e.target.value }))}
                  />
                </label>
                <label className="text-sm md:col-span-2">
                  Sector tags (comma-separated)
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={(form.sector_tags ?? []).join(', ')}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, sector_tags: parseTags(e.target.value) }))
                    }
                  />
                </label>
                <label className="text-sm md:col-span-2">
                  Next action
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={form.next_action ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, next_action: e.target.value }))}
                  />
                </label>
              </div>

              {error ? <p className="text-sm text-rose-600">{error}</p> : null}

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save investor'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
