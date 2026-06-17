import uuid
from datetime import datetime

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.core.utils import utc_now


class PublishedPage(Base):
    __tablename__ = "published_pages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    page_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("wiki_pages.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    slug: Mapped[str] = mapped_column(String(512), nullable=False, unique=True)
    published_at: Mapped[datetime] = mapped_column(nullable=False, default=utc_now)

    page: Mapped["WikiPage"] = relationship(  # type: ignore[name-defined]
        "WikiPage",
        lazy="selectin",
    )
