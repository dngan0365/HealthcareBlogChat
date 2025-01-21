from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ChatSummary(BaseModel):
    _id: str
    title: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserChats(BaseModel):
    user: str
    chats: List[ChatSummary] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
