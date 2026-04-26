"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AddInvestorForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/investors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          investor_type: formData.get("investor_type"),
          stage_focus: formData.get("stage_focus"),
          sector_focus: formData.get("sector_focus"),
          geography_focus: formData.get("geography_focus"),
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Failed to create investor");
      }

      event.currentTarget.reset();
      router.refresh();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unknown error";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <h3>Add investor</h3>
      <div className="grid">
        <input name="name" placeholder="Name" required />
        <input name="investor_type" placeholder="Type (fund/angel/etc)" required />
        <input name="stage_focus" placeholder="Stage focus" required />
        <input name="sector_focus" placeholder="Sector focus" required />
        <input name="geography_focus" placeholder="Geography focus" required />
      </div>
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save investor"}</button>
    </form>
  );
}
