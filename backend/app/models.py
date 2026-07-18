from typing import Literal, Union
from pydantic import BaseModel, Field


class Domain(BaseModel):
    id: str
    label: str
    color: str
    description: str


class ChallengeManifest(BaseModel):
    id: str
    title: str
    domain: str
    difficulty: Literal["beginner", "easy", "medium", "hard"]
    description: str
    xp: float = Field(..., ge=0)
    objective: str
    hints: list[str]
    successCriteria: Union[str, list[str]]
    prerequisites: list[str] = Field(default_factory=list)


class DailyChallenge(BaseModel):
    id: str
    date: str
