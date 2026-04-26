export default function InvestorsPage() {
  return (
    <section className="card">
      <h2>Investors</h2>
      <p className="muted">
        New clean entity for investor profiles, stage focus, sector focus and matching readiness.
      </p>
      <div className="grid">
        <div className="card">
          <strong>Manual input</strong>
          <p className="muted">Form-first entry for analyst workflow.</p>
        </div>
        <div className="card">
          <strong>Excel import (planned)</strong>
          <p className="muted">Preview + dedup + validation mode in next iteration.</p>
        </div>
      </div>
    </section>
  );
}
