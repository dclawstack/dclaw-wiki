import uuid
from typing import Optional

from sqlalchemy import ForeignKey, String, Text, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.core.utils import utc_now
from datetime import datetime


class WikiPage(Base):
    __tablename__ = "wiki_pages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False, default="")
    parent_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("wiki_pages.id", ondelete="SET NULL"), nullable=True
    )
    # Materialized path for efficient tree queries (e.g. "/root-id/child-id/")
    path: Mapped[str] = mapped_column(String(2048), nullable=False, default="/")
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    created_by: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    updated_by: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)

    created_at: Mapped[datetime] = mapped_column(nullable=False, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(nullable=False, default=utc_now, onupdate=utc_now)

    # Trust / freshness metadata (v2.0 roadmap 0.5)
    tags: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    verified_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    verified_by: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    freshness_state: Mapped[str] = mapped_column(
        String(32), nullable=False, default="unknown", server_default="unknown"
    )

    # Self-referential relationship
    children: Mapped[list["WikiPage"]] = relationship(
        "WikiPage",
        back_populates="parent",
        foreign_keys=[parent_id],
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    parent: Mapped[Optional["WikiPage"]] = relationship(
        "WikiPage",
        back_populates="children",
        foreign_keys=[parent_id],
        remote_side=[id],
        lazy="selectin",
    )
    revisions: Mapped[list["PageRevision"]] = relationship(  # type: ignore[name-defined]
        "PageRevision",
        back_populates="page",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
