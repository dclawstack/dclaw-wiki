from typing import Optional
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CommentCreate(BaseModel):
    body: str
    author: Optional[str] = None


class CommentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    page_id: str
    author: Optional[str]
    body: str
    resolved: bool
    created_at: datetime
