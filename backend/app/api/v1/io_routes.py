from html import escape

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.wiki_repo import WikiRepository
from app.schemas.wiki import PageCreate, PageRead

router = APIRouter()


class ImportRequest(BaseModel):
    title: str
    markdown: str = ""
    parent_id: str | None = None


def _inline(text: str) -> str:
    """Escape HTML then apply inline bold and code formatting."""
    out = escape(text)
    # inline code `...`
    parts = out.split("`")
    rebuilt = []
    for i, part in enumerate(parts):
        if i % 2 == 1:
            rebuilt.append(f"<code>{part}</code>")
        else:
            rebuilt.append(part)
    out = "".join(rebuilt)
    # bold **...**
    bold_parts = out.split("**")
    rebuilt = []
    for i, part in enumerate(bold_parts):
        if i % 2 == 1:
            rebuilt.append(f"<strong>{part}</strong>")
        else:
            rebuilt.append(part)
    return "".join(rebuilt)


def markdown_to_html(md: str) -> str:
    """Minimal, dependency-free Markdown -> HTML converter.

    Supports headings, unordered lists, fenced code blocks, bold, inline code,
    and paragraphs. Everything is HTML-escaped to stay safe.
    """
    lines = md.replace("\r\n", "\n").split("\n")
    html: list[str] = []
    in_list = False
    in_code = False
    para: list[str] = []

    def flush_para() -> None:
        if para:
            html.append(f"<p>{_inline(' '.join(para))}</p>")
            para.clear()

    def close_list() -> None:
        nonlocal in_list
        if in_list:
            html.append("</ul>")
            in_list = False

    for line in lines:
        stripped = line.strip()

        if stripped.startswith("```"):
            flush_para()
            close_list()
            if not in_code:
                html.append("<pre><code>")
                in_code = True
            else:
                html.append("</code></pre>")
                in_code = False
            continue

        if in_code:
            html.append(escape(line))
            continue

        if not stripped:
            flush_para()
            close_list()
            continue

        if stripped.startswith("#"):
            flush_para()
            close_list()
            level = len(stripped) - len(stripped.lstrip("#"))
            level = min(level, 6)
            content = stripped[level:].strip()
            html.append(f"<h{level}>{_inline(content)}</h{level}>")
            continue

        if stripped.startswith(("- ", "* ")):
            flush_para()
            if not in_list:
                html.append("<ul>")
                in_list = True
            html.append(f"<li>{_inline(stripped[2:].strip())}</li>")
            continue

        para.append(stripped)

    flush_para()
    close_list()
    if in_code:
        html.append("</code></pre>")

    return "\n".join(html)


def _html_document(title: str, body: str) -> str:
    return (
        "<!DOCTYPE html>\n"
        '<html lang="en">\n'
        "<head>\n"
        '<meta charset="utf-8">\n'
        f"<title>{escape(title)}</title>\n"
        "</head>\n"
        "<body>\n"
        f"<h1>{escape(title)}</h1>\n"
        f"{body}\n"
        "</body>\n"
        "</html>\n"
    )


def _safe_filename(title: str) -> str:
    cleaned = "".join(c if c.isalnum() or c in (" ", "-", "_") else "_" for c in title)
    return cleaned.strip().replace(" ", "_") or "page"


@router.get("/pages/{page_id}/export")
async def export_page(
    page_id: str,
    format: str = Query("md", pattern="^(md|html)$"),
    db: AsyncSession = Depends(get_db),
) -> Response:
    repo = WikiRepository(db)
    page = await repo.get(page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    filename = _safe_filename(page.title)

    if format == "html":
        body = _html_document(page.title, markdown_to_html(page.content or ""))
        return Response(
            content=body,
            media_type="text/html; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="{filename}.html"'},
        )

    return Response(
        content=page.content or "",
        media_type="text/markdown; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}.md"'},
    )


@router.post("/import", response_model=PageRead, status_code=201)
async def import_markdown(body: ImportRequest, db: AsyncSession = Depends(get_db)) -> PageRead:
    repo = WikiRepository(db)
    page = await repo.create(
        PageCreate(title=body.title, content=body.markdown, parent_id=body.parent_id)
    )
    return PageRead.model_validate(page)
