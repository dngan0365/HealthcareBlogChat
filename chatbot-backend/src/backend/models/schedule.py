from odmantic import Model
from pydantic import BaseModel
from datetime import datetime

# Database model
class Schedule(Model):
    user: str
    Id: int
    Subject: str
    StartTime: datetime
    EndTime: datetime
    CategoryColor: Optional[str]

# Request/response validation
class ScheduleSchema(BaseModel):
    user: str
    Id: int
    Subject: str
    StartTime: datetime
    EndTime: datetime
    CategoryColor: Optional[str] = None
