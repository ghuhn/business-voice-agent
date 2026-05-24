import { useRef, useState } from "react";
import {
  Room,
  RoomEvent,
  DataPacket_Kind,
  RemoteParticipant,
} from "livekit-client";
import { useAppStore } from "../store/appStore";

export function useLiveKit() {
  const roomRef = useRef<Room | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const store = useAppStore();

  const connect = async () => {
    try {
      store.addDebugLog("Fetching connection token from token server: " + import.meta.env.VITE_TOKEN_ENDPOINT);
      const tokenRes = await fetch(import.meta.env.VITE_TOKEN_ENDPOINT);
      if (!tokenRes.ok) {
        throw new Error(`Token server returned status ${tokenRes.status}`);
      }
      const { token, url } = await tokenRes.json();
      store.addDebugLog("Token fetched successfully. Connecting to LiveKit URL: " + url);

      const r = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = r;

      // Handle RPC messages from agent
      r.on(RoomEvent.DataReceived, (payload: Uint8Array, _participant?: RemoteParticipant, _kind?: DataPacket_Kind, topic?: string) => {
        if (topic !== "agent_rpc") return;
        try {
          const msg = JSON.parse(new TextDecoder().decode(payload));
          store.addDebugLog(`Received RPC data: method="${msg.method}"`);
          handleAgentRPC(msg);
        } catch (e: any) {
          store.addDebugLog("Failed to parse RPC message: " + e.message);
        }
      });

      // Agent state via participant attributes or data messages
      r.on(RoomEvent.TrackSubscribed, (_track, _pub, participant) => {
        if (participant.identity.startsWith("agent")) {
          store.setConnected(true);
          store.addDebugLog("Agent audio track subscribed!");
        }
      });

      // Listen for transcription from the agent
      r.on(RoomEvent.TranscriptionReceived, (segments, participant) => {
        const speaker = participant?.identity?.startsWith("agent") ? "agent" : "user";
        segments.forEach((seg) => {
          if (seg.text.trim()) {
            store.addDebugLog(`[Transcription] ${speaker} (final=${seg.final}): "${seg.text}"`);
            store.updateTranscriptEntry({
              id: `${speaker}-${seg.id}`,
              speaker,
              text: seg.text,
              timestamp: Date.now(),
            });
          }
        });
      });

      store.addDebugLog("Connecting to LiveKit room...");
      await r.connect(url, token);
      setRoom(r);
      store.setConnected(true);
      store.addDebugLog("Room connected successfully: " + r.name);

      // Enable mic
      store.addDebugLog("Enabling microphone...");
      await r.localParticipant.setMicrophoneEnabled(true);
      store.addDebugLog("Microphone enabled!");
    } catch (err: any) {
      store.addDebugLog("Connection error: " + err.message);
      console.error(err);
      store.setConnected(false);
    }
  };

  const disconnect = () => {
    store.addDebugLog("Disconnecting from room...");
    roomRef.current?.disconnect();
    store.setConnected(false);
    setRoom(null);
    store.addDebugLog("Disconnected.");
  };

  function handleAgentRPC(msg: { method: string; payload: Record<string, unknown> }) {
    const { method, payload } = msg;
    switch (method) {
      case "show_slide":
        store.setSlide(payload as any);
        break;
      case "update_lead":
        store.updateLeadField(
          payload.field as any,
          payload.value as string
        );
        break;
      case "agent_state":
        store.setAgentState(payload.state as any);
        break;
      case "lead_finalized":
        store.setLeadFinalized();
        break;
      case "update_summary":
        if (typeof payload.summary === "string") {
          store.setSessionSummary(payload.summary);
        }
        if (typeof payload.action_items === "string") {
          store.setActionItems(
            payload.action_items
              .split(";")
              .map((s) => s.trim())
              .filter(Boolean)
          );
        } else if (Array.isArray(payload.action_items)) {
          store.setActionItems(payload.action_items);
        }
        break;
    }
  }

  return { room, connect, disconnect };
}
