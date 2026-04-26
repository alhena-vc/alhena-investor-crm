const stages = ["new", "screening", "due_diligence", "term_sheet", "closed_won", "closed_lost"];

export default function DealsPage() {
  return (
    <section className="card">
      <h2>Deals Pipeline</h2>
      <p className="muted">Configurable stage pipeline with analyst + partner workflow.</p>
      <div className="grid">
        {stages.map((stage) => (
          <div key={stage} className="card">
            <strong>{stage}</strong>
            <p className="muted">0 deals yet</p>
          </div>
        ))}
      </div>
    </section>
  );
}
