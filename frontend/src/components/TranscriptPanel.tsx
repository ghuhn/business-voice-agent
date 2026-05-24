import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/appStore";

export function TranscriptPanel() {
  const transcript = useAppStore((s) => s.transcript);
  const bottomRef = useRef<HTMLDivElement>(null);

  const lastLength = useRef(transcript.length);
  useEffect(() => {
    if (transcript.length !== lastLength.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      lastLength.current = transcript.length;
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [transcript]);

  if (transcript.length === 0) return null;

  return (
    <div className="transcript-panel">
      <h4 className="transcript-header">Transcript</h4>
      <div className="transcript-scroll">
        {transcript.map((entry) => (
          <motion.div
            key={entry.id}
            className={`transcript-entry ${entry.speaker}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="entry-speaker">{entry.speaker === "agent" ? "Arjun" : "You"}</span>
            <span className="entry-text">{entry.text}</span>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
