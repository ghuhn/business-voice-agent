import { VoiceOrb } from "./components/VoiceOrb";
import { SlideRenderer } from "./components/SlideRenderer";
import { LeadPanel } from "./components/LeadPanel";
import { TranscriptPanel } from "./components/TranscriptPanel";
import { DebugPanel } from "./components/DebugPanel";
import { useLiveKit } from "./hooks/useLiveKit";
import { useAppStore } from "./store/appStore";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "./styles/globals.css";

export default function App() {
  const { connect, disconnect, room } = useLiveKit();
  const connected = useAppStore((s) => s.connected);
  const currentSlide = useAppStore((s) => s.currentSlide);

  const appContent = (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <span className="logo-mark">◆</span>
          <span className="logo-text">Maneuver</span>
        </div>
        <span className="header-tagline">Talk to the Founder</span>
      </header>

      {/* Main layout */}
      <main className="app-main">
        {/* Left: Orb + Transcript */}
        <section className="voice-section">
          <VoiceOrb
            onConnect={connect}
            onDisconnect={disconnect}
            connected={connected}
          />
          <TranscriptPanel />
        </section>

        {/* Center: Slide area */}
        <section className={`slide-section ${currentSlide.slide ? "has-slide" : ""}`}>
          {!currentSlide.slide && (
            <div className="slide-placeholder">
              <p>Visual context will appear here as we talk</p>
            </div>
          )}
          <SlideRenderer />
        </section>

        {/* Right: Lead capture panel */}
        <aside className="lead-section">
          <LeadPanel />
        </aside>
      </main>

      <DebugPanel />
    </div>
  );

  if (room) {
    return (
      <LiveKitRoom room={room} token="" serverUrl="">
        {appContent}
        <RoomAudioRenderer />
      </LiveKitRoom>
    );
  }

  return appContent;
}
