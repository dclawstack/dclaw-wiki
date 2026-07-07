import pytest
from httpx import AsyncClient

from app.services.wiki_authoring import WikiAuthoringService


@pytest.fixture(autouse=True)
def mock_llm(monkeypatch):
    """Stub the LLM network call so tests never hit OpenRouter/Ollama."""

    async def fake_call_llm(self, system, user):
        return f"# Mocked\n\n{user}", "openrouter"

    monkeypatch.setattr(WikiAuthoringService, "_call_llm", fake_call_llm)


@pytest.mark.asyncio
async def test_generate_page(client: AsyncClient):
    response = await client.post(
        "/api/v1/ai/generate-page",
        json={"outline": "A guide to FastAPI routing"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["provider"] == "openrouter"
    assert "A guide to FastAPI routing" in data["content"]
    assert data["content"].startswith("# Mocked")


@pytest.mark.asyncio
async def test_improve(client: AsyncClient):
    response = await client.post(
        "/api/v1/ai/improve",
        json={"content": "this page need improve."},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["provider"] == "openrouter"
    assert "this page need improve." in data["content"]


@pytest.mark.asyncio
async def test_generate_page_requires_outline(client: AsyncClient):
    response = await client.post("/api/v1/ai/generate-page", json={})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_improve_requires_content(client: AsyncClient):
    response = await client.post("/api/v1/ai/improve", json={})
    assert response.status_code == 422
