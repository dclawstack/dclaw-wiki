import pytest

from app.services.wiki_ai import WikiAIService


@pytest.mark.asyncio
async def test_summarize_revision(client, monkeypatch):
    async def fake_call_llm(self, system, user):
        return "Added an installation section.", "test"

    monkeypatch.setattr(WikiAIService, "_call_llm", fake_call_llm)

    # Create a page, then edit it to produce a revision.
    created = (await client.post("/api/v1/pages", json={"title": "Doc", "content": "# Doc\noriginal"})).json()
    pid = created["id"]
    await client.patch(f"/api/v1/pages/{pid}", json={"content": "# Doc\noriginal\n\n## Install\nsteps"})

    revisions = (await client.get(f"/api/v1/pages/{pid}/revisions")).json()
    assert len(revisions) >= 1
    rev_id = revisions[0]["id"]

    resp = await client.post(f"/api/v1/pages/{pid}/revisions/{rev_id}/summarize")
    assert resp.status_code == 200
    body = resp.json()
    assert body["change_summary"] == "Added an installation section."


@pytest.mark.asyncio
async def test_summarize_revision_404(client):
    created = (await client.post("/api/v1/pages", json={"title": "X", "content": "y"})).json()
    resp = await client.post(f"/api/v1/pages/{created['id']}/revisions/does-not-exist/summarize")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_page_has_trust_fields(client):
    created = (await client.post("/api/v1/pages", json={"title": "T", "content": "c", "tags": ["a", "b"]})).json()
    assert created["tags"] == ["a", "b"]
    assert created["freshness_state"] == "unknown"
    assert created["verified_at"] is None
