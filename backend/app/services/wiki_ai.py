"""AI Wiki Copilot service.

Uses OpenRouter (cloud) as primary LLM provider with Ollama as local fallback.
Provides:
  - chat():         RAG-based answer over wiki pages
  - related_pages(): suggest semantically related pages for a given page
"""
import json
import logging
from typing import Optional

import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.services.search import SearchService
from app.repositories.wiki_repo import WikiRepository

logger = logging.getLogger(__name__)

# Maximum chars of wiki context injected into the prompt
_MAX_CONTEXT_CHARS = 6000


class WikiAIService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self._search = SearchService(db)
        self._repo = WikiRepository(db)

    async def chat(self, question: str) -> dict:
        """Answer a question using RAG over wiki pages.

        Returns:
            {
                "answer": str,
                "sources": [{"id": str, "title": str}],
                "provider": str,
            }
        """
        # Retrieve relevant pages (keyword-based so full-sentence questions match)
        pages = await self._search.search_keywords(question, limit=5)

        context_parts = []
        sources = []
        chars = 0
        for page in pages:
            snippet = f"### {page.title}\n{page.content}"
            if chars + len(snippet) > _MAX_CONTEXT_CHARS:
                break
            context_parts.append(snippet)
            sources.append({"id": page.id, "title": page.title})
            chars += len(snippet)

        context = "\n\n".join(context_parts) if context_parts else "No relevant pages found."

        system_prompt = (
            "You are a helpful wiki assistant. Answer questions concisely using ONLY "
            "the provided wiki content. If the answer is not in the content, say so. "
            "Do not make up information."
        )
        user_prompt = f"Wiki content:\n{context}\n\nQuestion: {question}"

        answer, provider = await self._call_llm(system_prompt, user_prompt)
        return {"answer": answer, "sources": sources, "provider": provider}

    async def related_pages(self, page_id: str, limit: int = 5) -> list[dict]:
        """Return pages semantically related to the given page."""
        page = await self._repo.get(page_id)
        if not page:
            return []

        # Use title + first 200 chars of content as the query
        query = f"{page.title} {page.content[:200]}"
        results = await self._search.search(query, limit=limit + 1)

        return [
            {"id": p.id, "title": p.title}
            for p in results
            if p.id != page_id
        ][:limit]

    async def summarize_change(self, old_content: str, new_content: str) -> dict:
        """Generate a one-line summary of how a page changed between two versions.

        Returns {"summary": str, "provider": str}.
        """
        system_prompt = (
            "You summarize the difference between two versions of a wiki page in ONE "
            "concise sentence (max 15 words). State what changed. No preamble, no quotes."
        )
        user_prompt = (
            f"OLD VERSION:\n{old_content[:4000]}\n\n"
            f"NEW VERSION:\n{new_content[:4000]}\n\n"
            "One-sentence summary of the change:"
        )
        summary, provider = await self._call_llm(system_prompt, user_prompt)
        return {"summary": summary, "provider": provider}

    async def _call_llm(self, system: str, user: str) -> tuple[str, str]:
        """Try OpenRouter first, fall back to Ollama."""
        if settings.openrouter_api_key:
            try:
                answer = await self._openrouter(system, user)
                return answer, "openrouter"
            except Exception as exc:
                logger.warning("OpenRouter failed, falling back to Ollama: %s", exc)

        try:
            answer = await self._ollama(system, user)
            return answer, "ollama"
        except Exception as exc:
            logger.error("Ollama also failed: %s", exc)
            return (
                "I'm unable to answer right now — the AI backend is not available.",
                "unavailable",
            )

    async def _openrouter(self, system: str, user: str) -> str:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{settings.openrouter_base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.openrouter_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": settings.openrouter_model,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user},
                    ],
                    "max_tokens": 512,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"].strip()

    async def _ollama(self, system: str, user: str) -> str:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                f"{settings.ollama_url}/api/chat",
                json={
                    "model": settings.ollama_model,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user},
                    ],
                    "stream": False,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return data["message"]["content"].strip()
