"use client";

import type { Deal } from "@/lib/deals";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  deals: Deal[];
};

type FormState = {
  deal_id: string;
  channel: "email" | "call" | "meeting" | "telegram" | "other";
  direction: "inbound" | "outbound";
  happened_at: string;
  summary: string;
  next_action: string;
  next_action_at: string;
};

export function AddCommunicationModal({ deals }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    deal_id: deals[0]?.id ?? "",
    channel: "email",
    direction: "outbound",
    happened_at: new Date().toISOString().slice(0, 16),
    summary: "",
    next_action: "",
    next_action_at: "",
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          happened_at: new Date(form.happened_at).toISOString(),
          next_action_at: form.next_action_at
            ? new Date(form.next_action_at).toISOString()
            : undefined,
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Failed to add communication");
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

  const disabled = !deals.length;

  return (
    <>
      <button
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        Log communication
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Log communication</h2>
              <button
                className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <form className="space-y-3" onSubmit={onSubmit}>
              <select
                value={form.deal_id}
                onChange={(event) =>
                  setForm((current) => ({ ...current, deal_id: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {deals.map((deal) => (
                  <option key={deal.id} value={deal.id}>
                    {deal.id.slice(0, 8)} · {deal.deal_type}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <select
                  value={form.channel}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      channel: event.target.value as FormState["channel"],
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="email">email</option>
                  <option value="call">call</option>
                  <option value="meeting">meeting</option>
                  <option value="telegram">telegram</option>
                  <option value="other">other</option>
                </select>

                <select
                  value={form.direction}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      direction: event.target.value as FormState["direction"],
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="outbound">outbound</option>
                  <option value="inbound">inbound</option>
                </select>

                <input
                  type="datetime-local"
                  value={form.happened_at}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, happened_at: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <textarea
                required
                value={form.summary}
                placeholder="Communication summary"
                rows={3}
                onChange={(event) =>
                  setForm((current) => ({ ...current, summary: event.target.value }))
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

              <input
                type="datetime-local"
                value={form.next_action_at}
                onChange={(event) =>
                  setForm((current) => ({ ...current, next_action_at: event.target.value }))
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
