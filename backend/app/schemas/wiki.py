from __future__ import annotations
from typing import Optional
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PageCreate(BaseModel):
    title: str
    content: str = ""
    parent_id: Optional[str] = None
    created_by: Optional[str] = None


class PageUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    parent_id: Optional[str] = None
    updated_by: Optional[str] = None


class PageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    content: str
    parent_id: Optional[str]
    path: str
    position: int
    created_by: Optional[str]
    updated_by: Optional[str]
    created_at: datetime
    updated_at: datetime


class PageTree(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    parent_id: Optional[str]
    path: str
    position: int
    children: list[PageTree] = []
