"""Static page templates (blueprints) for the wiki.

Templates are intentionally NOT stored in the database — they are fixed,
code-defined starting points. Each template is a plain dict with:
    key         stable identifier used in URLs (?template=<key>)
    name        human-readable title
    description short blurb for the gallery
    icon        lucide-react icon name (frontend resolves it)
    content     Markdown body prefilled into the new-page editor
"""
from __future__ import annotations

from typing import Optional

TEMPLATES: list[dict[str, str]] = [
    {
        "key": "meeting-notes",
        "name": "Meeting Notes",
        "description": "Capture attendees, agenda, discussion, and action items.",
        "icon": "ClipboardList",
        "content": (
            "# Meeting Notes\n\n"
            "**Date:** \n"
            "**Attendees:** \n\n"
            "## Agenda\n\n"
            "1. \n2. \n3. \n\n"
            "## Discussion\n\n"
            "- \n\n"
            "## Decisions\n\n"
            "- \n\n"
            "## Action Items\n\n"
            "| Owner | Task | Due |\n"
            "| --- | --- | --- |\n"
            "|  |  |  |\n"
        ),
    },
    {
        "key": "project-plan",
        "name": "Project Plan",
        "description": "Outline goals, scope, milestones, and risks for a project.",
        "icon": "Target",
        "content": (
            "# Project Plan\n\n"
            "## Overview\n\n"
            "_What is this project and why does it matter?_\n\n"
            "## Goals\n\n"
            "- \n\n"
            "## Scope\n\n"
            "**In scope:** \n\n"
            "**Out of scope:** \n\n"
            "## Milestones\n\n"
            "| Milestone | Owner | Target Date |\n"
            "| --- | --- | --- |\n"
            "|  |  |  |\n\n"
            "## Risks\n\n"
            "- \n"
        ),
    },
    {
        "key": "retrospective",
        "name": "Retrospective",
        "description": "Reflect on what went well, what didn't, and next steps.",
        "icon": "RefreshCw",
        "content": (
            "# Retrospective\n\n"
            "**Sprint / Period:** \n"
            "**Date:** \n\n"
            "## What went well\n\n"
            "- \n\n"
            "## What didn't go well\n\n"
            "- \n\n"
            "## What we'll try next\n\n"
            "- \n\n"
            "## Action Items\n\n"
            "| Owner | Action | Due |\n"
            "| --- | --- | --- |\n"
            "|  |  |  |\n"
        ),
    },
    {
        "key": "sop",
        "name": "SOP (Standard Operating Procedure)",
        "description": "Document a repeatable procedure step by step.",
        "icon": "ListChecks",
        "content": (
            "# Standard Operating Procedure\n\n"
            "## Purpose\n\n"
            "_Why does this procedure exist?_\n\n"
            "## Scope\n\n"
            "_Who and what this applies to._\n\n"
            "## Prerequisites\n\n"
            "- \n\n"
            "## Procedure\n\n"
            "1. \n2. \n3. \n\n"
            "## Verification\n\n"
            "_How do you confirm the procedure was done correctly?_\n\n"
            "## References\n\n"
            "- \n"
        ),
    },
    {
        "key": "how-to-guide",
        "name": "How-To Guide",
        "description": "Walk a reader through accomplishing a specific task.",
        "icon": "BookOpen",
        "content": (
            "# How-To: \n\n"
            "## Overview\n\n"
            "_What will the reader achieve by following this guide?_\n\n"
            "## Before you begin\n\n"
            "- \n\n"
            "## Steps\n\n"
            "### 1. \n\n"
            "### 2. \n\n"
            "### 3. \n\n"
            "## Troubleshooting\n\n"
            "| Problem | Solution |\n"
            "| --- | --- |\n"
            "|  |  |\n\n"
            "## See also\n\n"
            "- \n"
        ),
    },
]

_BY_KEY: dict[str, dict[str, str]] = {t["key"]: t for t in TEMPLATES}


def list_templates() -> list[dict[str, str]]:
    """Return all templates (including content)."""
    return TEMPLATES


def get_template(key: str) -> Optional[dict[str, str]]:
    """Return a single template by key, or None if not found."""
    return _BY_KEY.get(key)
