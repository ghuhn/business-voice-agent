const SERVICE_DETAILS: Record<string, { icon: string; name: string; description: string; deliverables: string[]; duration: string }> = {
  discovery_sprint: {
    icon: "🔭", name: "Product Discovery Sprint",
    description: "A focused 2-week engagement where we map your problem space, validate assumptions, define the MVP scope, and give you a prioritized roadmap you can take to any team.",
    deliverables: ["Discovery Report", "Prioritized Feature Roadmap", "User Persona Summaries", "30-min readout call"],
    duration: "2 weeks",
  },
  ux_ui_design: {
    icon: "🎨", name: "UX/UI Design",
    description: "Full-stack design from blank canvas to pixel-perfect Figma. We run user research, build IA, design the system, and hand off production-ready files.",
    deliverables: ["User Research Summary", "IA & Wireframes", "High-Fidelity Figma Prototype", "Design System", "Dev Handoff Specs"],
    duration: "6–16 weeks",
  },
  brand_identity: {
    icon: "✦", name: "Brand & Identity",
    description: "We develop the name, visual identity, tone of voice, and brand guidelines for startups building a distinct market position.",
    deliverables: ["Brand Strategy Document", "Logo & Visual Identity", "Brand Guidelines PDF", "Messaging Framework"],
    duration: "4–6 weeks",
  },
  growth_design: {
    icon: "📈", name: "Growth Design",
    description: "We audit your existing product, identify conversion killers, and redesign the flows that matter most — onboarding, activation, and retention.",
    deliverables: ["Audit Report", "Redesigned Flows", "A/B Test Plan", "Implementation Checklist"],
    duration: "4–8 weeks",
  },
  fractional_cpo: {
    icon: "🧭", name: "Fractional CPO",
    description: "Arjun joins your team 1–2 days/week as a strategic design and product leader. He runs design reviews, mentors your team, and keeps product quality high.",
    deliverables: ["Weekly Design Reviews", "Quarterly Roadmap Sessions", "Team Mentorship", "Async Feedback on Demand"],
    duration: "3–12 months",
  },
};

export function ServiceDetailSlide({ service }: { service: string }) {
  const detail = SERVICE_DETAILS[service];
  if (!detail) return null;

  return (
    <div className="slide service-detail-slide">
      <span className="detail-icon">{detail.icon}</span>
      <h2>{detail.name}</h2>
      <p className="detail-desc">{detail.description}</p>
      <div className="detail-meta">
        <div className="detail-duration">
          <span className="meta-label">Duration</span>
          <span className="meta-value">{detail.duration}</span>
        </div>
        <div className="detail-deliverables">
          <span className="meta-label">Deliverables</span>
          <ul>{detail.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
