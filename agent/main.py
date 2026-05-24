import asyncio
import os
import json
import uuid
import logging
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

from livekit import agents, rtc
from livekit.agents import AgentSession, Agent, RoomInputOptions, llm
from livekit.plugins import deepgram, cartesia, google, silero

load_dotenv()

logger = logging.getLogger("maneuver-agent")
logging.basicConfig(level=logging.INFO)


# ── Read the knowledge base once at startup ──────────────────────────────────
KB_PATH = Path(__file__).parent / "maneuver_kb.md"
KNOWLEDGE_BASE = KB_PATH.read_text()

LEADS_DIR = Path(os.getenv("LEADS_DIR", "../leads"))
LEADS_DIR.mkdir(parents=True, exist_ok=True)


# ── Lead storage in memory per session, flushed to JSON at end ───────────────
class LeadStore:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.data: dict = {
            "session_id": session_id,
            "timestamp": datetime.utcnow().isoformat(),
            "name": None,
            "company": None,
            "role": None,
            "problem": None,
            "current_solution": None,
            "timeline": None,
            "budget": None,
            "next_step": None,
            "notes": [],
        }

    def update(self, field: str, value: str):
        if field in self.data:
            self.data[field] = value
            logger.info(f"Lead updated: {field} = {value}")

    def add_note(self, note: str):
        self.data["notes"].append(note)

    def flush(self):
        path = LEADS_DIR / f"lead_{self.session_id}.json"
        with open(path, "w") as f:
            json.dump(self.data, f, indent=2)
        logger.info(f"Lead saved to {path}")
        return path


# ── System prompt builder ─────────────────────────────────────────────────────
def build_system_prompt() -> str:
    return f"""
You are Arjun Mehta, founder of Maneuver — a boutique product design and strategy studio.
You are on a voice call with someone who just landed on the Maneuver website.

YOUR PERSONALITY:
- Direct, thoughtful, genuinely curious about the visitor's problem
- You speak like a seasoned founder/designer — not corporate, not overly casual
- You ask one question at a time. You listen. You adapt.
- You do NOT sound like a chatbot. Never use filler like "Great!" or "Certainly!"
- Natural speech patterns: contractions, occasional "hmm", short acknowledgments
- If interrupted, you acknowledge gracefully and yield the floor

YOUR TWO MODES (you switch fluidly, no announcement):

1. DISCOVERY MODE (default, start here):
   Goal: Understand who this person is and whether we can help them.
   Discovery questions (ask naturally, in order, don't skip but don't force):
   - Open: "What brought you to Maneuver today?"
   - Role: "Are you a founder, or part of a team?"
   - Problem: "Tell me more about what you're trying to build / fix."
   - Stakes: "What happens if you don't solve this in the next quarter?"
   - Current state: "What have you tried so far?"
   - Timeline: "Do you have a deadline in mind — a launch date, a raise, anything like that?"
   - Budget: "Do you have a sense of the budget you're working with? Even a ballpark helps."
   - Next step: "If the conversation goes well today, what would the next step look like for you?"

2. Q&A MODE (when the visitor asks about Maneuver):
   Answer ONLY from the knowledge base below. Do not invent anything.
   If you don't know, say "I'd have to look into that — let me find out and follow up."
   Be concise in voice — summarize, don't recite everything.

IMPORTANT TOOL USE:
You have access to tools that update the UI the visitor sees. Call them proactively:
- When a visitor asks about services → call show_services_slide()
- When they ask about a specific service → call show_service_detail(service_name)
- When they ask about process → call show_process_slide()
- When they ask about team → call show_team_slide()
- When they ask about pricing → call show_pricing_slide()
- When they mention a case study → call show_case_study_slide(client_name)
- As soon as you learn a discovery field → call update_lead_field(field, value)
  Fields: name, company, role, problem, current_solution, timeline, budget
- As you understand their requirements, pain points, or next steps → call update_session_summary(summary, action_items)
- At the end of the call → call finalize_lead()

KNOWLEDGE BASE:
{KNOWLEDGE_BASE}

OPENING LINE (say this exactly to start):
"Hey — thanks for stopping by. I'm Arjun. What brought you to Maneuver today?"
""".strip()


# ── Tool definitions ──────────────────────────────────────────────────────────
def get_tools(lead_store: LeadStore, room: rtc.Room):
    """
    Returns tool functions. Each tool does two things:
    1. Updates server-side state (lead store)
    2. Sends an RPC message to the frontend to trigger UI change
    """

    async def _rpc(method: str, payload: dict):
        """Send RPC to all frontend participants."""
        data = json.dumps({"method": method, "payload": payload})
        # Publish as data message; frontend listens and dispatches
        await room.local_participant.publish_data(
            data.encode(),
            topic="agent_rpc",
            reliable=True,
        )

    @llm.function_tool
    async def show_services_slide():
        """Show the full list of Maneuver services on screen."""
        await _rpc("show_slide", {"slide": "services"})
        return "Showing the services overview on screen."

    @llm.function_tool
    async def show_service_detail(service_name: str):
        """
        Show detail view for a specific service.
        service_name: one of 'discovery_sprint', 'ux_ui_design', 'brand_identity', 'growth_design', 'fractional_cpo'
        """
        await _rpc("show_slide", {"slide": "service_detail", "service": service_name})
        return f"Showing detail for {service_name}."

    @llm.function_tool
    async def show_process_slide():
        """Show the Maneuver engagement process as a visual diagram."""
        await _rpc("show_slide", {"slide": "process"})
        return "Showing the process diagram."

    @llm.function_tool
    async def show_team_slide():
        """Show information about the Maneuver team."""
        await _rpc("show_slide", {"slide": "team"})
        return "Showing the team."

    @llm.function_tool
    async def show_pricing_slide():
        """Show pricing overview for Maneuver services."""
        await _rpc("show_slide", {"slide": "pricing"})
        return "Showing the pricing overview."

    @llm.function_tool
    async def show_case_study_slide(client_name: str):
        """
        Show a case study card.
        client_name: one of 'veridian_health', 'stackform', 'nomad_finance', 'relay'
        """
        await _rpc("show_slide", {"slide": "case_study", "client": client_name})
        return f"Showing the {client_name} case study."

    @llm.function_tool
    async def update_lead_field(field: str, value: str):
        """
        Persist a discovered lead field and update the frontend panel.
        field: one of name, company, role, problem, current_solution, timeline, budget
        value: the captured value as a concise string
        """
        lead_store.update(field, value)
        await _rpc("update_lead", {"field": field, "value": value})
        return f"Captured {field}."

    @llm.function_tool
    async def update_session_summary(summary: str, action_items: str):
        """
        Update the live AI summary and action items displayed on the client.
        summary: A concise, one-sentence summary of the user's primary business need/pain point.
        action_items: A semicolon-separated list of agreed next steps or topics to cover (e.g. "Send pricing proposal; Schedule intro call").
        """
        await _rpc("update_summary", {"summary": summary, "action_items": action_items})
        return "Session summary and action items updated on screen."

    @llm.function_tool
    async def finalize_lead():
        """Call this at the end of the call to save the full lead to disk."""
        path = lead_store.flush()
        await _rpc("lead_finalized", {"session_id": lead_store.session_id})
        return f"Lead saved. Session: {lead_store.session_id}"

    return [
        show_services_slide,
        show_service_detail,
        show_process_slide,
        show_team_slide,
        show_pricing_slide,
        show_case_study_slide,
        update_lead_field,
        update_session_summary,
        finalize_lead,
    ]


# ── Agent entrypoint ──────────────────────────────────────────────────────────
async def entrypoint(ctx: agents.JobContext):
    session_id = str(uuid.uuid4())[:8]
    lead_store = LeadStore(session_id)

    await ctx.connect()
    room = ctx.room

    session = AgentSession(
        stt=deepgram.STT(model="nova-2"),
        llm=google.LLM(model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash")),
        tts=cartesia.TTS(
            model="sonic-english",
            voice="a0e99841-438c-4a64-b679-ae501e7d6091",  # replace with chosen voice ID
        ),
        vad=silero.VAD.load(),
        turn_detection="vad",  # VAD-based turn detection prevents talking over user
        allow_interruptions=True,
    )

    # Register tools
    tools = get_tools(lead_store, room)

    agent = Agent(
        instructions=build_system_prompt(),
        tools=tools,
    )

    # Publish agent state changes to frontend
    @session.on("agent_state_changed")
    def on_state_changed(state):
        async def send_state():
            try:
                await room.local_participant.publish_data(
                    json.dumps({"method": "agent_state", "payload": {"state": state.new_state}}).encode(),
                    topic="agent_rpc",
                    reliable=True,
                )
            except Exception as e:
                logger.error(f"Error publishing agent state: {e}")
        asyncio.create_task(send_state())

    await session.start(agent, room=ctx.room, room_input_options=RoomInputOptions())

    # At session end, ensure lead is flushed
    @ctx.add_shutdown_callback
    async def on_shutdown():
        if any(v for k, v in lead_store.data.items() if k not in ("session_id", "timestamp", "notes") and v):
            lead_store.flush()


if __name__ == "__main__":
    agents.cli.run_app(
        agents.WorkerOptions(entrypoint_fnc=entrypoint)
    )
