const STEPS = [
  { n: "01", title: "Intake Call", desc: "Free 30-min call to understand your situation." },
  { n: "02", title: "Proposal", desc: "Scoped SOW, timeline, and investment within 48h." },
  { n: "03", title: "Kickoff", desc: "Align on success metrics and communication cadence." },
  { n: "04", title: "Sprint Cycles", desc: "2-week sprints with mid-sprint check-ins and reviews." },
  { n: "05", title: "Handoff", desc: "Full files, docs, and a 30-day support window." },
];

export function ProcessSlide() {
  return (
    <div className="slide process-slide">
      <h2 className="slide-title">How We Work</h2>
      <div className="process-steps">
        {STEPS.map((s, i) => (
          <div key={s.n} className="process-step">
            <div className="step-number">{s.n}</div>
            {i < STEPS.length - 1 && <div className="step-connector" />}
            <div className="step-content">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
