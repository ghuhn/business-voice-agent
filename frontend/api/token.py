import os
import uuid
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from livekit.api import AccessToken, VideoGrants
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/token")
async def get_token():
    room_name = f"maneuver-{uuid.uuid4().hex[:6]}"
    identity = f"visitor-{uuid.uuid4().hex[:6]}"

    token = (
        AccessToken(
            api_key=os.environ["LIVEKIT_API_KEY"],
            api_secret=os.environ["LIVEKIT_API_SECRET"],
        )
        .with_identity(identity)
        .with_name("Visitor")
        .with_grants(VideoGrants(room_join=True, room=room_name))
        .to_jwt()
    )

    return {
        "token": token,
        "room": room_name,
        "url": os.environ["LIVEKIT_URL"],
        "identity": identity,
    }
