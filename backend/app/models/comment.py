import uuid
from typing import Optional
from datetime import datetime

from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.core.utils import utc_now


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    page_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("wiki_pages.id", ondelete="CASCADE"), nullable=False
    )
    author: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    body: Mapped[str] = mapped_column(Text, nullable=False, default="")
    resolved: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(nullable=False, default=utc_now)

    page: Mapped["WikiPage"] = relationship(  # type: ignore[name-defined]
        "WikiPage",
        lazy="selectin",
    )
