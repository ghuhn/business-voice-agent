import { motion } from "framer-motion";
import { useAppStore } from "../store/appStore";
import clsx from "clsx";

export function LeadPanel() {
  const connected = useAppStore((s) => s.connected);
  const leadData = useAppStore((s) => s.leadData);
  const finalized = useAppStore((s) => s.leadFinalized);
  const sessionSummary = useAppStore((s) => s.sessionSummary);
  const actionItems = useAppStore((s) => s.actionItems);

  // Determine if we have any lead data captured
  const hasLeadData = Object.values(leadData).some(Boolean);

  // Build the checklist items and check if they are completed
  const checklist = [
    { id: "identity", label: "Introduce Yourself", completed: !!(leadData.name || leadData.role) },
    { id: "company", label: "Company Profile", completed: !!leadData.company },
    { id: "challenge", label: "Describe Challenge", completed: !!(leadData.problem || leadData.current_solution) },
    { id: "timeline", label: "Project Timeline", completed: !!leadData.timeline },
    { id: "budget", label: "Ballpark Budget", completed: !!leadData.budget },
  ];

  // Inferred summary if no explicit AI summary is set
  const displaySummary = sessionSummary || leadData.problem || "";

  return (
    <div className="lead-panel">
      {/* Header */}
      <div className="lead-panel-header">
        <span className={clsx("lead-dot", connected && !finalized && "live-pulsing", finalized && "finalized")} />
        <h3>{connected ? (finalized ? "Session Finished" : "Live Session Intelligence") : "Session Intelligence"}</h3>
      </div>

      {!connected ? (
        // Offline / Pre-connect UI
        <motion.div
          className="sidebar-card intro-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4>Maneuver Discovery</h4>
          <p className="card-desc">
            Arjun Mehta (Founder) is offline. Start the conversation to dynamically capture project goals and establish action items.
          </p>
          <div className="connect-guide">
            <span className="guide-icon">⚡</span>
            <span>Click the center orb to connect.</span>
          </div>
        </motion.div>
      ) : (
        // Live Connected UI
        <>
          {/* Summary Card */}
          <motion.div
            className="sidebar-card summary-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4>Primary Need</h4>
            {displaySummary ? (
              <p className="summary-text">{displaySummary}</p>
            ) : (
              <p className="summary-placeholder">
                Describe your project, problems, and what you're building. Arjun will summarize your needs here in real time.
              </p>
            )}
          </motion.div>

          {/* Custom Action Items Card (Only if the agent sets them) */}
          {actionItems.length > 0 && (
            <motion.div
              className="sidebar-card action-items-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4>Next Steps</h4>
              <ul className="action-items-list">
                {actionItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="action-bullet">→</span>
                    <span className="action-text">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </>
      )}

      {/* Checklist Card (Always visible, acts as a guide pre-connect and checks off during connect) */}
      <div className="sidebar-card checklist-card">
        <h4>Discovery Agenda</h4>
        <div className="checklist-items">
          {checklist.map((item) => (
            <div key={item.id} className={clsx("checklist-item", item.completed && "completed")}>
              <span className="checklist-checkbox">
                {item.completed ? "✓" : "○"}
              </span>
              <span className="checklist-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Captured Lead Data Fields (Only shown if data exists) */}
      {hasLeadData && (
        <div className="sidebar-card fields-card">
          <h4>Captured Profile</h4>
          <div className="mini-lead-fields">
            {leadData.name && (
              <div className="mini-field">
                <span className="mini-label">Name</span>
                <span className="mini-value">{leadData.name}</span>
              </div>
            )}
            {leadData.role && (
              <div className="mini-field">
                <span className="mini-label">Role</span>
                <span className="mini-value">{leadData.role}</span>
              </div>
            )}
            {leadData.company && (
              <div className="mini-field">
                <span className="mini-label">Company</span>
                <span className="mini-value">{leadData.company}</span>
              </div>
            )}
            {leadData.timeline && (
              <div className="mini-field">
                <span className="mini-label">Timeline</span>
                <span className="mini-value">{leadData.timeline}</span>
              </div>
            )}
            {leadData.budget && (
              <div className="mini-field">
                <span className="mini-label">Budget</span>
                <span className="mini-value">{leadData.budget}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
