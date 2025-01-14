from pydantic import BaseModel
from typing import Optional, List

class CreateChatRequest(BaseModel):
    user: str
    initial_message: Optional[str] = None  # Optional initial message to start the chat
