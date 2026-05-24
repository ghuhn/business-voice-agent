import { create } from "zustand";

export type AgentState = "idle" | "listening" | "thinking" | "speaking";

export type SlideType =
  | null
  | "services"
  | "service_detail"
  | "process"
  | "team"
  | "pricing"
  | "case_study";

export interface SlidePayload {
  slide: SlideType;
  service?: string;
  client?: string;
}

export interface LeadData {
  name?: string;
  company?: string;
  role?: string;
  problem?: string;
  current_solution?: string;
  timeline?: string;
  budget?: string;
}

export interface TranscriptEntry {
  id: string;
  speaker: "agent" | "user";
  text: string;
  timestamp: number;
}

interface AppStore {
  agentState: AgentState;
  currentSlide: SlidePayload;
  leadData: LeadData;
  transcript: TranscriptEntry[];
  connected: boolean;
  leadFinalized: boolean;
  debugLogs: string[];
  sessionSummary: string;
  actionItems: string[];

  setAgentState: (state: AgentState) => void;
  setSlide: (payload: SlidePayload) => void;
  updateLeadField: (field: keyof LeadData, value: string) => void;
  addTranscriptEntry: (entry: TranscriptEntry) => void;
  updateTranscriptEntry: (entry: TranscriptEntry) => void;
  setConnected: (v: boolean) => void;
  setLeadFinalized: () => void;
  addDebugLog: (log: string) => void;
  clearDebugLogs: () => void;
  setSessionSummary: (summary: string) => void;
  setActionItems: (items: string[]) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  agentState: "idle",
  currentSlide: { slide: null },
  leadData: {},
  transcript: [],
  connected: false,
  leadFinalized: false,
  debugLogs: [],
  sessionSummary: "",
  actionItems: [],

  setAgentState: (state) => set({ agentState: state }),
  setSlide: (payload) => set({ currentSlide: payload }),
  updateLeadField: (field, value) =>
    set((s) => ({ leadData: { ...s.leadData, [field]: value } })),
  addTranscriptEntry: (entry) =>
    set((s) => ({ transcript: [...s.transcript, entry] })),
  updateTranscriptEntry: (entry) =>
    set((s) => {
      const idx = s.transcript.findIndex((t) => t.id === entry.id);
      if (idx !== -1) {
        const next = [...s.transcript];
        next[idx] = { ...next[idx], text: entry.text };
        return { transcript: next };
      } else {
        return { transcript: [...s.transcript, entry] };
      }
    }),
  setConnected: (v) =>
    set((s) => ({
      connected: v,
      agentState: v ? s.agentState : "idle",
      sessionSummary: v ? s.sessionSummary : "",
      actionItems: v ? s.actionItems : [],
    })),
  setLeadFinalized: () => set({ leadFinalized: true }),
  addDebugLog: (log) =>
    set((s) => ({
      debugLogs: [...s.debugLogs, `[${new Date().toLocaleTimeString()}] ${log}`],
    })),
  clearDebugLogs: () => set({ debugLogs: [] }),
  setSessionSummary: (summary) => set({ sessionSummary: summary }),
  setActionItems: (items) => set({ actionItems: items }),
}));
