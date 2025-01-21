from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Part(BaseModel):
    text: str

class HistoryItem(BaseModel):
    role: str
    parts: List[Part]
    img: Optional[str] = None

class Chat(BaseModel):
    user: str
    history: List[HistoryItem] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)