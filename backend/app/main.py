import json
from datetime import date
from pathlib import Path

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import ChallengeManifest, DailyChallenge, Domain
from .services.validator import validate_manifest

app = FastAPI(title="Cyber-Arcade API")
api = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "data"


def _load_json(name: str) -> list[dict]:
    with open(DATA_DIR / name, "r", encoding="utf-8") as f:
        return json.load(f)


raw_challenges = _load_json("challenges.json")
raw_domains = _load_json("domains.json")

DOMAINS = [Domain(**d) for d in raw_domains]
CHALLENGES = [ChallengeManifest(**c) for c in raw_challenges]
DOMAIN_IDS = {d.id for d in DOMAINS}
CHALLENGE_IDS = {c.id for c in CHALLENGES}

for i, raw in enumerate(raw_challenges):
    for error in validate_manifest(raw, i, DOMAIN_IDS, CHALLENGE_IDS):
        print("Manifest validation error:", error)


@api.get("/challenges", response_model=list[ChallengeManifest])
def list_challenges():
    return CHALLENGES


@api.get("/challenges/{challenge_id}", response_model=ChallengeManifest)
def get_challenge(challenge_id: str):
    for challenge in CHALLENGES:
        if challenge.id == challenge_id:
            return challenge
    raise HTTPException(status_code=404, detail="Challenge not found")


@api.get("/domains", response_model=list[Domain])
def list_domains():
    return DOMAINS


@api.get("/daily", response_model=DailyChallenge)
def get_daily():
    today = str(date.today())
    seed = sum(int(part) for part in today.split("-"))
    available = [c for c in CHALLENGES if c.difficulty in ("beginner", "easy")]
    if not available:
        available = CHALLENGES
    challenge = available[seed % len(available)]
    return DailyChallenge(id=challenge.id, date=today)


app.include_router(api)
