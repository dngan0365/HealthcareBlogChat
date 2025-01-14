from odmantic import Model
from pydantic import BaseModel

# Database model
class Post(Model):
    user: str  # Reference to User
    img: Optional[str] = None
    title: str
    slug: str
    desc: Optional[str] = None
    category: str = "general"
    content: str
    is_featured: bool = False
    visit: int = 0

# Request/response validation
class PostSchema(BaseModel):
    user: str
    img: Optional[str] = None
    title: str
    slug: str
    desc: Optional[str] = None
    category: str = "general"
    content: str
    is_featured: bool = False
    visit: int = 0
