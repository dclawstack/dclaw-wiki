import pytest
from httpx import AsyncClient


async def _create_page(client: AsyncClient) -> str:
    resp = await client.post(
        "/api/v1/pages",
        json={"title": "Commentable", "content": "content"},
    )
    return resp.json()["id"]


@pytest.mark.asyncio
async def test_list_comments_empty(client: AsyncClient):
    page_id = await _create_page(client)
    resp = await client.get(f"/api/v1/pages/{page_id}/comments")
    assert resp.status_code == 200
    assert resp.json() == []


@pytest.mark.asyncio
async def test_create_comment(client: AsyncClient):
    page_id = await _create_page(client)
    resp = await client.post(
        f"/api/v1/pages/{page_id}/comments",
        json={"body": "Looks good!", "author": "alice"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["body"] == "Looks good!"
    assert data["author"] == "alice"
    assert data["resolved"] is False
    assert data["page_id"] == page_id
    assert "id" in data


@pytest.mark.asyncio
async def test_create_comment_anonymous(client: AsyncClient):
    page_id = await _create_page(client)
    resp = await client.post(
        f"/api/v1/pages/{page_id}/comments",
        json={"body": "No name here"},
    )
    assert resp.status_code == 201
    assert resp.json()["author"] is None


@pytest.mark.asyncio
async def test_list_comments(client: AsyncClient):
    page_id = await _create_page(client)
    await client.post(f"/api/v1/pages/{page_id}/comments", json={"body": "first"})
    await client.post(f"/api/v1/pages/{page_id}/comments", json={"body": "second"})

    resp = await client.get(f"/api/v1/pages/{page_id}/comments")
    assert resp.status_code == 200
    comments = resp.json()
    assert len(comments) == 2
    assert comments[0]["body"] == "first"
    assert comments[1]["body"] == "second"


@pytest.mark.asyncio
async def test_resolve_comment(client: AsyncClient):
    page_id = await _create_page(client)
    create_resp = await client.post(
        f"/api/v1/pages/{page_id}/comments", json={"body": "please fix"}
    )
    comment_id = create_resp.json()["id"]

    resp = await client.patch(f"/api/v1/comments/{comment_id}/resolve")
    assert resp.status_code == 200
    assert resp.json()["resolved"] is True


@pytest.mark.asyncio
async def test_resolve_comment_not_found(client: AsyncClient):
    resp = await client.patch("/api/v1/comments/nonexistent-id/resolve")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_comment(client: AsyncClient):
    page_id = await _create_page(client)
    create_resp = await client.post(
        f"/api/v1/pages/{page_id}/comments", json={"body": "delete me"}
    )
    comment_id = create_resp.json()["id"]

    del_resp = await client.delete(f"/api/v1/comments/{comment_id}")
    assert del_resp.status_code == 204

    list_resp = await client.get(f"/api/v1/pages/{page_id}/comments")
    assert list_resp.json() == []


@pytest.mark.asyncio
async def test_delete_comment_not_found(client: AsyncClient):
    resp = await client.delete("/api/v1/comments/nonexistent-id")
    assert resp.status_code == 404
