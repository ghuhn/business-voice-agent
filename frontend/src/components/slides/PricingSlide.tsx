const TIERS = [
  { service: "Discovery Sprint", range: "$8,000–$15,000", note: "Our entry point" },
  { service: "UX/UI Design", range: "$20,000–$60,000", note: "Scope & duration dependent" },
  { service: "Brand Identity", range: "$12,000–$25,000", note: "Full identity system" },
  { service: "Growth Design", range: "$15,000–$35,000", note: "Audit + redesign" },
  { service: "Fractional CPO", range: "$5,000–$10,000/mo", note: "3-month minimum" },
];

export function PricingSlide() {
  return (
    <div className="slide pricing-slide">
      <h2 className="slide-title">Investment</h2>
      <p className="pricing-note">Every engagement is custom-scoped. These are typical ranges.</p>
      <div className="pricing-table">
        {TIERS.map((t) => (
          <div key={t.service} className="pricing-row">
            <span className="pricing-service">{t.service}</span>
            <span className="pricing-range">{t.range}</span>
            <span className="pricing-note-inline">{t.note}</span>
          </div>
        ))}
      </div>
      <p className="pricing-footer">We do not work on equity-only. Mission-driven startups may qualify for reduced rates.</p>
    </div>
  );
}
