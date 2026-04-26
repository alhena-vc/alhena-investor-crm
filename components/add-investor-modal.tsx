"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type State = {
  name: string;
  fund_name: string;
  contact_name: string;
  contact_role: string;
  relationship_status: string;
  sector_tags: string;
  stage_tags: string;
  geo_tags: string;
  preferred_angle: string;
  next_action: string;
  ai_summary: string;
};

const initialState: State = {
  name: "",
  fund_name: "",
  contact_name: "",
  contact_role: "",
  relationship_status: "",
  sector_tags: "",
  stage_tags: "",
  geo_tags: "",
  preferred_angle: "",
  next_action: "",
  ai_summary: "",
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
        body: JSON.stringify({
          ...form,
          sector_tags: parseTags(form.sector_tags),
          stage_tags: parseTags(form.stage_tags),
          geo_tags: parseTags(form.geo_tags),
        }),
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
                placeholder="Investor name"
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                  value={form.fund_name}
                  placeholder="Fund name"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, fund_name: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />

                <input
                  value={form.relationship_status}
                  placeholder="Relationship status"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, relationship_status: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                  value={form.contact_name}
                  placeholder="Contact name"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, contact_name: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />

                <input
                  value={form.contact_role}
                  placeholder="Contact role"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, contact_role: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <input
                value={form.sector_tags}
                placeholder="Sector tags (comma separated)"
                onChange={(event) =>
                  setForm((current) => ({ ...current, sector_tags: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                  value={form.stage_tags}
                  placeholder="Stage tags (comma separated)"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, stage_tags: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />

                <input
                  value={form.geo_tags}
                  placeholder="Geo tags (comma separated)"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, geo_tags: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <input
                value={form.preferred_angle}
                placeholder="Preferred angle"
                onChange={(event) =>
                  setForm((current) => ({ ...current, preferred_angle: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />

              <input
                value={form.next_action}
                placeholder="Next action"
                onChange={(event) =>
                  setForm((current) => ({ ...current, next_action: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />

              <textarea
                value={form.ai_summary}
                placeholder="AI summary or notes"
                rows={4}
                onChange={(event) =>
                  setForm((current) => ({ ...current, ai_summary: event.target.value }))
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

function parseTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
