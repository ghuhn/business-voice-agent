import { motion } from "framer-motion";
import { useAppStore } from "../store/appStore";

const STATE_LABELS = {
  idle: "Click to connect",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking",
};

const ORB_COLORS = {
  idle: "#1a1a2e",
  listening: "#00d4ff",
  thinking: "#7c3aed",
  speaking: "#10b981",
};

export function VoiceOrb({ onConnect, onDisconnect, connected }: {
  onConnect: () => void;
  onDisconnect: () => void;
  connected: boolean;
}) {
  const storeAgentState = useAppStore((s) => s.agentState);
  const agentState = connected ? storeAgentState : "idle";

  return (
    <div className="orb-container" onClick={connected ? onDisconnect : onConnect}>
      <motion.div
        className="orb-ring outer"
        animate={{
          scale: agentState === "speaking" ? [1, 1.15, 1] : 1,
          opacity: agentState === "speaking" ? [0.3, 0.6, 0.3] : 0.2,
        }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ borderColor: ORB_COLORS[agentState] }}
      />
      <motion.div
        className="orb-ring middle"
        animate={{
          scale: agentState === "listening" ? [1, 1.08, 1] : 1,
          opacity: agentState === "listening" ? [0.4, 0.8, 0.4] : 0.3,
        }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ borderColor: ORB_COLORS[agentState] }}
      />
      <motion.div
        className="orb-core"
        animate={{ backgroundColor: ORB_COLORS[agentState] }}
        transition={{ duration: 0.5 }}
      >
        {agentState === "thinking" && (
          <motion.div
            className="thinking-dots"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            ···
          </motion.div>
        )}
      </motion.div>
      <motion.p className="orb-label" key={agentState} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
        {STATE_LABELS[agentState]}
      </motion.p>
    </div>
  );
}
