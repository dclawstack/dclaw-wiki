from sqlalchemy import select, or_, case
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.wiki import WikiPage


class SearchService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def search(self, query: str, limit: int = 20) -> list[WikiPage]:
        """Full-text search over page title and content using ILIKE.

        Uses PostgreSQL ILIKE for case-insensitive substring matching.
        A tsvector/tsquery GIN index can be layered on later for performance.
        """
        pattern = f"%{query}%"
        result = await self.db.execute(
            select(WikiPage)
            .where(
                or_(
                    WikiPage.title.ilike(pattern),
                    WikiPage.content.ilike(pattern),
                )
            )
            .order_by(
                # Rank title matches higher than content matches
                case((WikiPage.title.ilike(pattern), 0), else_=1),
                WikiPage.updated_at.desc(),
            )
            .limit(limit)
        )
        return list(result.scalars().all())

    # Common words that add noise to keyword retrieval, not search relevance.
    _STOPWORDS = {
        "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is",
        "are", "do", "does", "how", "what", "why", "when", "where", "can",
        "i", "you", "it", "this", "that", "with", "my", "me", "we", "us",
    }

    async def search_keywords(self, query: str, limit: int = 20) -> list[WikiPage]:
        """Keyword-based retrieval for RAG: match ANY significant term.

        Unlike :meth:`search` (which matches the whole query as one substring),
        this splits a natural-language question into terms and ORs them across
        title and content, so the copilot can find pages from full sentences.
        Falls back to substring search when no usable terms remain.
        """
        terms = [
            t for w in query.split()
            if len(t := "".join(c for c in w if c.isalnum()).lower()) > 2
            and t not in self._STOPWORDS
        ]
        if not terms:
            return await self.search(query, limit=limit)

        conditions = []
        for term in terms:
            pattern = f"%{term}%"
            conditions.append(WikiPage.title.ilike(pattern))
            conditions.append(WikiPage.content.ilike(pattern))

        # Rank pages whose title matches any term above content-only matches.
        title_match = or_(*(WikiPage.title.ilike(f"%{t}%") for t in terms))
        result = await self.db.execute(
            select(WikiPage)
            .where(or_(*conditions))
            .order_by(
                case((title_match, 0), else_=1),
                WikiPage.updated_at.desc(),
            )
            .limit(limit)
        )
        return list(result.scalars().all())
