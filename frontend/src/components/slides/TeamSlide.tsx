export function TeamSlide() {
  return (
    <div className="slide team-slide">
      <h2 className="slide-title">The Team</h2>
      <div className="founder-card">
        <div className="founder-avatar">AM</div>
        <div className="founder-info">
          <h3>Arjun Mehta</h3>
          <p className="founder-role">Founder & Design Lead</p>
          <p className="founder-bio">
            10 years in product design. Previously led design at Razorpay and two YC-backed startups.
            Every Maneuver client works directly with Arjun.
          </p>
          <div className="founder-tags">
            <span>Bengaluru</span>
            <span>YC Alumni</span>
            <span>Ex-Razorpay</span>
          </div>
        </div>
      </div>
      <p className="team-note">
        We bring in 2–4 senior collaborators per project — design, research, strategy — 
        chosen for your specific problem.
      </p>
    </div>
  );
}
