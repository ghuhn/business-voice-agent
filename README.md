# Maneuver — "Talk to Founder" Voice AI Agent

A real-time voice AI web application where visitors can have a natural conversation with an AI
agent that represents Arjun Mehta, the fictional founder of Maneuver — a boutique product design studio.

## How It Works

- **Voice in → voice out** — real-time conversation via LiveKit Agents (Python)
- **Discovery mode** — agent asks qualifying questions and captures lead data live
- **Q&A mode** — agent answers questions about Maneuver from a structured knowledge base
- **Synchronized visuals** — the frontend renders relevant slides/cards as the agent speaks, triggered by LLM tool calls forwarded over LiveKit data messages

## Stack

| Component | Service | Why |
|---|---|---|
| Agent framework | LiveKit Agents (Python) | Required by assignment; best-in-class voice agent infra |
| STT | Deepgram Nova-2 | Best accuracy, free $200 credits, low latency |
| LLM | Google Gemini 2.0 Flash | Free tier, fast, supports function calling |
| TTS | Cartesia Sonic | Sub-200ms latency, natural voice, generous free tier |
| VAD | Silero VAD | Open-source, bundled with LiveKit agents |
| Frontend | React + Vite + TypeScript | LiveKit starter is React; Vite is fastest dev experience |
| State management | Zustand | Lightweight, no boilerplate |
| Animations | Framer Motion | Smooth slide transitions and orb animations |

## Prerequisites

- Python 3.11+
- Node.js 20+
- Accounts + API keys (all free) — see API Keys section below

## API Keys Required

1. **LiveKit Cloud** — https://cloud.livekit.io (free tier)
2. **Google Gemini** — https://aistudio.google.com/app/apikey (free)
3. **Deepgram** — https://console.deepgram.com (free $200 credits)
4. **Cartesia** — https://play.cartesia.ai (free tier)

## Setup

### 1. Clone and configure

```bash
git clone https://github.com/YOUR_USERNAME/maneuver-voice-agent
cd maneuver-voice-agent
```

### 2. Agent setup

```bash
cd agent
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy the `.env` template and fill in your API keys:

```bash
cp .env.example .env
# Edit .env with your keys
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Copy the frontend `.env`:

```bash
cp .env.example .env
# Edit .env — set VITE_LIVEKIT_URL
```

## Running Locally

**Terminal 1 — Agent:**
```bash
cd agent
source venv/bin/activate
python main.py dev
```

**Terminal 2 — Token server:**
```bash
cd agent
source venv/bin/activate
uvicorn token_server:app --port 8080 --reload
```

**Terminal 3 — Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser. Grant microphone permission. Click the orb to connect.

## What Gets Captured

At the end of each call, a JSON file is written to `leads/lead_<session_id>.json`:

```json
{
  "session_id": "a1b2c3d4",
  "timestamp": "2025-01-15T10:23:00",
  "name": "Priya Sharma",
  "company": "Stackr",
  "role": "Founder",
  "problem": "Their onboarding takes 20 minutes and 40% of users drop off",
  "current_solution": "Tried tweaking copy, no improvement",
  "timeline": "Need to fix before Series A in Q2",
  "budget": "Around 25k",
  "next_step": "Book a discovery call this week",
  "notes": []
}
```

## Potential Upgrades

1. **Multi-agent handoff** — discovery agent → scheduling agent that books a Calendly meeting
2. **Admin view** — founder dashboard showing all past leads with conversation summaries
3. **Follow-up email** — triggered at call end via Resend API (free tier) with lead summary
4. **Transcript storage** — save full transcript alongside the lead JSON
5. **Mobile layout** — collapse the 3-panel layout for smaller screens
