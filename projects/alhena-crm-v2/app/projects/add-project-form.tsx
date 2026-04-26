"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AddProjectForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          sector: formData.get("sector"),
          stage: formData.get("stage"),
          geography: formData.get("geography"),
          summary: formData.get("summary"),
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Failed to create project");
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
      <h3>Add project</h3>
      <div className="grid">
        <input name="name" placeholder="Project name" required />
        <input name="sector" placeholder="Sector" required />
        <input name="stage" placeholder="Stage" required />
        <input name="geography" placeholder="Geography" required />
      </div>
      <textarea name="summary" placeholder="Summary" rows={3} required />
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save project"}</button>
    </form>
  );
}
