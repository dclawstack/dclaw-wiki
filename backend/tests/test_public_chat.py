import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_public_chat_returns_answer(client: AsyncClient, monkeypatch):
    await client.post(
        "/api/v1/pages",
        json={"title": "Getting Started", "content": "Install via pip then run the server."},
    )

    async def fake_call_llm(self, system: str, user: str):
        return ("You install it with pip.", "test-provider")

    monkeypatch.setattr(
        "app.services.wiki_ai.WikiAIService._call_llm", fake_call_llm
    )

    resp = await client.post(
        "/api/v1/public/chat",
        json={"question": "How do I install it?"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["answer"] == "You install it with pip."
    assert data["provider"] == "test-provider"
    assert any(src["title"] == "Getting Started" for src in data["sources"])
