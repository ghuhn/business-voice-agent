import { useState, useRef, useEffect } from "react";
import { useAppStore } from "../store/appStore";

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const debugLogs = useAppStore((s) => s.debugLogs);
  const clearDebugLogs = useAppStore((s) => s.clearDebugLogs);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [debugLogs, isOpen]);

  return (
    <div className={`debug-panel-wrapper ${isOpen ? "open" : ""}`}>
      <button className="debug-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <span>🐞 Debug Logs ({debugLogs.length})</span>
        <span className="toggle-arrow">{isOpen ? "▼" : "▲"}</span>
      </button>

      {isOpen && (
        <div className="debug-content">
          <div className="debug-actions">
            <button className="clear-btn" onClick={clearDebugLogs}>Clear Logs</button>
          </div>
          <div className="debug-logs-container">
            {debugLogs.length === 0 ? (
              <p className="no-logs">No logs recorded yet. Tap the orb to connect.</p>
            ) : (
              debugLogs.map((log, index) => (
                <div key={index} className="debug-log-line">
                  {log}
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}
