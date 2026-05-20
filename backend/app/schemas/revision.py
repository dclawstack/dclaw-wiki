from typing import Optional
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RevisionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    page_id: str
    revision_number: int
    title: str
    content: str
    change_summary: Optional[str]
    changed_by: Optional[str]
    created_at: datetime
