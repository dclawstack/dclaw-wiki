from __future__ import annotations
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PublishStatus(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    published: bool
    page_id: str
    slug: str | None = None
    published_at: datetime | None = None


class PublishedRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    page_id: str
    slug: str
    published_at: datetime


class PublicPageSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    title: str


class PublicPageDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    title: str
    content: str
