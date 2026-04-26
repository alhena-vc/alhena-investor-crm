import { listInvestors } from "@/lib/crm";
import { AddInvestorForm } from "./add-investor-form";

export const dynamic = "force-dynamic";

export default async function InvestorsPage() {
  let investors = [] as Awaited<ReturnType<typeof listInvestors>>;
  let error: string | null = null;

  try {
    investors = await listInvestors();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : "Unknown error";
  }

  return (
    <section className="card" style={{ display: "grid", gap: 12 }}>
      <h2>Investors</h2>
      <p className="muted">Live data from Supabase investors table.</p>
      <AddInvestorForm />

      {error ? <p style={{ color: "#b91c1c" }}>Supabase error: {error}</p> : null}

      <div className="grid">
        {investors.map((investor) => (
          <div key={investor.id} className="card">
            <strong>{investor.name}</strong>
            <p className="muted">{investor.investor_type}</p>
            <p className="muted">Stage: {investor.stage_focus}</p>
            <p className="muted">Sector: {investor.sector_focus}</p>
            <p className="muted">Geo: {investor.geography_focus}</p>
          </div>
        ))}
        {investors.length === 0 ? <p className="muted">No investors yet.</p> : null}
      </div>
    </section>
  );
}
