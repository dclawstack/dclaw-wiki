"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PageTree } from "@/lib/api";

interface PageTreeNodeProps {
  node: PageTree;
  currentId?: string;
  depth?: number;
}

function PageTreeNode({ node, currentId, depth = 0 }: PageTreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isActive = node.id === currentId;

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-1 rounded px-2 py-1 text-sm cursor-pointer",
          isActive
            ? "bg-[var(--hover-bg)] text-[var(--accent-col)] font-medium"
            : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"
        )}
        style={{ paddingLeft: `${(depth + 1) * 12}px` }}
      >
        {hasChildren && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-[var(--text-muted)] hover:text-[var(--text)] w-4 flex-shrink-0"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? "▾" : "▸"}
          </button>
        )}
        {!hasChildren && <span className="w-4 flex-shrink-0" />}
        <Link
          href={`/wiki/${node.id}`}
          className="flex-1 truncate"
        >
          {node.title}
        </Link>
      </div>
      {hasChildren && expanded && (
        <ul>
          {node.children.map((child) => (
            <PageTreeNode key={child.id} node={child} currentId={currentId} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

interface PageTreeProps {
  tree: PageTree[];
  currentId?: string;
}

export function PageTreeNav({ tree, currentId }: PageTreeProps) {
  return (
    <nav aria-label="Wiki pages">
      <ul className="space-y-0.5">
        {tree.map((node) => (
          <PageTreeNode key={node.id} node={node} currentId={currentId} />
        ))}
      </ul>
    </nav>
  );
}
