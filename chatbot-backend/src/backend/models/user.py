from odmantic import Model
from pydantic import BaseModel
from typing import List, Optional

# Database model
class User(Model):
    clerk_user_id: str
    username: str
    firstname: Optional[str] = ""
    lastname: Optional[str] = ""
    age: Optional[int] = None
    gender: Optional[str] = None  # "male" or "female"
    height: Optional[int] = None
    weight: Optional[int] = None
    email: str
    img: Optional[str] = None
    saved_posts: List[str] = []

# Request/response validation
class UserSchema(BaseModel):
    clerk_user_id: str
    username: str
    firstname: Optional[str] = ""
    lastname: Optional[str] = ""
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    email: str
    img: Optional[str] = None
    saved_posts: List[str] = []
