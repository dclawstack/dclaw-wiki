import pytest


@pytest.mark.asyncio
async def test_list_templates(client):
    response = await client.get("/api/v1/templates")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 5
    keys = {t["key"] for t in data}
    assert keys == {
        "meeting-notes",
        "project-plan",
        "retrospective",
        "sop",
        "how-to-guide",
    }
    for t in data:
        assert t["name"]
        assert t["description"]
        assert t["icon"]
        assert t["content"]


@pytest.mark.asyncio
async def test_get_single_template(client):
    response = await client.get("/api/v1/templates/meeting-notes")
    assert response.status_code == 200
    data = response.json()
    assert data["key"] == "meeting-notes"
    assert data["name"] == "Meeting Notes"
    assert "## Action Items" in data["content"]


@pytest.mark.asyncio
async def test_get_template_not_found(client):
    response = await client.get("/api/v1/templates/does-not-exist")
    assert response.status_code == 404
    assert response.json()["detail"] == "Template not found"
