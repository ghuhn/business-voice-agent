const SERVICES = [
  { id: "discovery_sprint", icon: "🔭", name: "Product Discovery Sprint", blurb: "2-week intensive to map the problem, define MVP, and build a roadmap." },
  { id: "ux_ui_design", icon: "🎨", name: "UX/UI Design", blurb: "Wireframes → high-fidelity Figma. User research, IA, design system." },
  { id: "brand_identity", icon: "✦", name: "Brand & Identity", blurb: "Naming, visual identity, guidelines, and go-to-market messaging." },
  { id: "growth_design", icon: "📈", name: "Growth Design", blurb: "Conversion optimization, onboarding redesign, A/B frameworks." },
  { id: "fractional_cpo", icon: "🧭", name: "Fractional CPO", blurb: "Arjun embeds 1–2 days/week as your strategic design leader." },
];

export function ServicesSlide() {
  return (
    <div className="slide services-slide">
      <h2 className="slide-title">What We Do</h2>
      <div className="services-grid">
        {SERVICES.map((s) => (
          <div key={s.id} className="service-card">
            <span className="service-icon">{s.icon}</span>
            <h3>{s.name}</h3>
            <p>{s.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
