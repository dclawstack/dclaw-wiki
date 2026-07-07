// Static page templates — no DB. Used by /templates and the new-page editor.

export interface Template {
  key: string;
  name: string;
  description: string;
  icon: string; // lucide-react icon name
  content: string; // Markdown body
}

const TEMPLATES: Template[] = [
  {
    key: "meeting-notes",
    name: "Meeting Notes",
    description: "Capture attendees, agenda, decisions, and action items from a meeting.",
    icon: "Users",
    content: `# Meeting Notes — {{ topic }}

**Date:** ${"{{ date }}"}
**Attendees:**

## Agenda

1.
2.
3.

## Discussion

-

## Decisions

-

## Action Items

| Owner | Action | Due |
| --- | --- | --- |
|  |  |  |
`,
  },
  {
    key: "project-plan",
    name: "Project Plan",
    description: "Define goals, scope, milestones, and risks for a new project.",
    icon: "ClipboardList",
    content: `# Project Plan — {{ project }}

## Summary

A one-paragraph overview of what this project delivers and why.

## Goals

-

## Scope

**In scope:**
-

**Out of scope:**
-

## Milestones

| Milestone | Target date | Owner |
| --- | --- | --- |
|  |  |  |

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
|  |  |  |
`,
  },
  {
    key: "retrospective",
    name: "Retrospective",
    description: "Reflect on what went well, what didn't, and what to change next time.",
    icon: "RefreshCcw",
    content: `# Retrospective — {{ period }}

## What went well

-

## What didn't go well

-

## What we'll change

-

## Action Items

| Owner | Action | Due |
| --- | --- | --- |
|  |  |  |
`,
  },
  {
    key: "sop",
    name: "SOP",
    description: "A standard operating procedure with purpose, steps, and ownership.",
    icon: "ListChecks",
    content: `# SOP — {{ procedure }}

## Purpose

Why this procedure exists and when it applies.

## Owner

Who is responsible for keeping this procedure current.

## Procedure

1.
2.
3.

## Notes & exceptions

-
`,
  },
  {
    key: "how-to-guide",
    name: "How-To Guide",
    description: "Step-by-step instructions to accomplish a specific task.",
    icon: "BookOpen",
    content: `# How To — {{ task }}

## Prerequisites

-

## Steps

1.
2.
3.

## Verify

How to confirm it worked.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
|  |  |  |
`,
  },
];

export function listTemplates(): Template[] {
  return TEMPLATES;
}

export function getTemplate(key: string): Template | undefined {
  return TEMPLATES.find((t) => t.key === key);
}
