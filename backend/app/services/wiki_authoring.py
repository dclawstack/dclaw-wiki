"""AI Wiki Authoring service.

Uses OpenRouter (cloud) as primary LLM provider with Ollama as local fallback,
mirroring app.services.wiki_ai. Provides:
  - generate(): turn an outline/prompt into a full Markdown wiki page
  - improve():  rewrite existing content for clarity/completeness, keep Markdown
"""
import logging

import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings

logger = logging.getLogger(__name__)


class WikiAuthoringService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def generate(self, outline: str) -> dict:
        """Turn an outline/prompt into a full Markdown wiki page.

        Returns:
            {"content": str, "provider": str}
        """
        system_prompt = (
            "You are a technical writer for a wiki. Given an outline or prompt, "
            "write a complete, well-structured wiki page in GitHub-flavored "
            "Markdown. Use headings, lists, and code blocks where appropriate. "
            "Output ONLY the Markdown content — no preamble or explanation."
        )
        user_prompt = f"Outline / prompt:\n{outline}"

        content, provider = await self._call_llm(system_prompt, user_prompt)
        return {"content": content, "provider": provider}

    async def improve(self, content: str) -> dict:
        """Rewrite existing content for clarity/completeness, keeping Markdown.

        Returns:
            {"content": str, "provider": str}
        """
        system_prompt = (
            "You are an editor for a wiki. Rewrite the provided content to improve "
            "clarity, structure, and completeness while preserving its meaning. "
            "Keep it as GitHub-flavored Markdown. Output ONLY the improved Markdown "
            "content — no preamble or explanation."
        )
        user_prompt = f"Content to improve:\n{content}"

        improved, provider = await self._call_llm(system_prompt, user_prompt)
        return {"content": improved, "provider": provider}

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
                "_The AI backend is not available right now._",
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
                    "max_tokens": 2048,
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
