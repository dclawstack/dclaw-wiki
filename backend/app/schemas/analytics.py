from __future__ import annotations
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PageViewRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    page_id: str
    viewed_at: datetime


class PopularPage(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    page_id: str
    title: str
    views: int


class AnalyticsOverview(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total_views: int
    total_pages: int
    recent_activity: int
    popular_pages: list[PopularPage]
