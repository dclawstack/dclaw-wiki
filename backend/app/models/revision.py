import uuid
from typing import Optional
from datetime import datetime

from sqlalchemy import ForeignKey, String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.core.utils import utc_now


class PageRevision(Base):
    __tablename__ = "page_revisions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    page_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("wiki_pages.id", ondelete="CASCADE"), nullable=False
    )
    revision_number: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False, default="")
    change_summary: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    changed_by: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    created_at: Mapped[datetime] = mapped_column(nullable=False, default=utc_now)

    page: Mapped["WikiPage"] = relationship(  # type: ignore[name-defined]
        "WikiPage",
        back_populates="revisions",
        lazy="selectin",
    )
