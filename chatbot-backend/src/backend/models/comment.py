from odmantic import Model
from pydantic import BaseModel

# Database model
class Comment(Model):
    user: str  # Reference to User
    post: str  # Reference to Post
    desc: str

# Request/response validation
class CommentSchema(BaseModel):
    user: str
    post: str
    desc: str
