"use client";

import type { DealStage } from "@/lib/deal-stages";
import type { Project } from "@/lib/projects";
import type { Investor } from "@/types/investor";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  investors: Investor[];
  projects: Project[];
  stages: DealStage[];
};

type FormState = {
  investor_id: string;
  project_id: string;
  stage_id: string;
  deal_type: "equity" | "debt" | "venture_loan" | "other";
  amount_usd: string;
  status_note: string;
};

export function AddDealModal({ investors, projects, stages }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    investor_id: investors[0]?.id ?? "",
    project_id: projects[0]?.id ?? "",
    stage_id: stages[0]?.id ?? "",
    deal_type: "equity",
    amount_usd: "",
    status_note: "",
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount_usd: form.amount_usd ? Number(form.amount_usd) : undefined,
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Failed to add deal");
      }

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

  const disabled = !investors.length || !projects.length || !stages.length;

  return (
    <>
      <button
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        Add deal
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Add deal</h2>
              <button
                className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <form className="space-y-3" onSubmit={onSubmit}>
              <select
                value={form.investor_id}
                onChange={(event) =>
                  setForm((current) => ({ ...current, investor_id: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {investors.map((investor) => (
                  <option key={investor.id} value={investor.id}>
                    {investor.name}
                  </option>
                ))}
              </select>

              <select
                value={form.project_id}
                onChange={(event) =>
                  setForm((current) => ({ ...current, project_id: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <select
                  value={form.stage_id}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, stage_id: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.title}
                    </option>
                  ))}
                </select>

                <select
                  value={form.deal_type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      deal_type: event.target.value as FormState["deal_type"],
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="equity">equity</option>
                  <option value="debt">debt</option>
                  <option value="venture_loan">venture_loan</option>
                  <option value="other">other</option>
                </select>
              </div>

              <input
                value={form.amount_usd}
                placeholder="Amount USD"
                onChange={(event) =>
                  setForm((current) => ({ ...current, amount_usd: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />

              <textarea
                value={form.status_note}
                placeholder="Status notes"
                rows={3}
                onChange={(event) =>
                  setForm((current) => ({ ...current, status_note: event.target.value }))
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
