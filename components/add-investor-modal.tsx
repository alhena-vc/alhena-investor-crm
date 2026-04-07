"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type State = {
  name: string;
  email: string;
  firm: string;
  stage: string;
  notes: string;
};

const initialState: State = {
  name: "",
  email: "",
  firm: "",
  stage: "",
  notes: "",
};

export function AddInvestorModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<State>(initialState);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/investors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Failed to add investor");
      }

      setForm(initialState);
      setOpen(false);
      router.refresh();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unknown error";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        onClick={() => setOpen(true)}
      >
        Add investor
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Add investor</h2>
              <button
                className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <form className="space-y-3" onSubmit={onSubmit}>
              <input
                required
                value={form.name}
                placeholder="Name"
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />

              <input
                value={form.email}
                placeholder="Email"
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />

              <input
                value={form.firm}
                placeholder="Firm"
                onChange={(event) =>
                  setForm((current) => ({ ...current, firm: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />

              <input
                value={form.stage}
                placeholder="Stage"
                onChange={(event) =>
                  setForm((current) => ({ ...current, stage: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />

              <textarea
                value={form.notes}
                placeholder="Notes"
                rows={3}
                onChange={(event) =>
                  setForm((current) => ({ ...current, notes: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
