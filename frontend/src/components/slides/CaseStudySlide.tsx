const CASE_STUDIES: Record<string, { client: string; industry: string; work: string; result: string; duration: string }> = {
  veridian_health: { client: "Veridian Health", industry: "HealthTech", work: "Redesigned patient onboarding flow end-to-end.", result: "42% reduction in onboarding drop-off in 6 weeks.", duration: "8 weeks" },
  stackform: { client: "Stackform", industry: "B2B SaaS", work: "Led product discovery for a major pivot.", result: "Shipped MVP in 10 weeks post-discovery.", duration: "12 weeks" },
  nomad_finance: { client: "Nomad Finance", industry: "Fintech", work: "Full brand identity + app UX for digital nomad banking.", result: "Launched to 2,000 users on day one.", duration: "10 weeks" },
  relay: { client: "Relay", industry: "PropTech", work: "Fractional CPO — grew design org and shipped 3 major features.", result: "Design team scaled from 1 to 4 in 6 months.", duration: "6 months" },
};

export function CaseStudySlide({ client }: { client: string }) {
  const cs = CASE_STUDIES[client];
  if (!cs) return null;

  return (
    <div className="slide case-study-slide">
      <div className="cs-tag">{cs.industry}</div>
      <h2>{cs.client}</h2>
      <p className="cs-work">{cs.work}</p>
      <div className="cs-result">
        <span className="result-label">Outcome</span>
        <span className="result-value">{cs.result}</span>
      </div>
      <div className="cs-duration">
        <span className="result-label">Duration</span>
        <span className="result-value">{cs.duration}</span>
      </div>
    </div>
  );
}
