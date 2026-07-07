"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Search, Plus } from "lucide-react";

interface Node {
  id: string;
  title: string;
  children: Node[];
}
interface Hit {
  id: string;
  title: string;
  snippet: string;
}

function TreeItem({ node, depth }: { node: Node; depth: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const active = pathname === `/wiki/${node.id}`;
  return (
    <div>
      <div className="flex items-center" style={{ paddingLeft: depth * 12 }}>
        {node.children.length > 0 ? (
          <button onClick={() => setOpen(!open)} className="p-0.5 text-[var(--text-muted)]">
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`} />
          </button>
        ) : (
          <span className="w-4" />
        )}
        <Link
          href={`/wiki/${node.id}`}
          className={`flex-1 truncate rounded px-2 py-1 text-sm ${active ? "bg-[var(--accent-col)] text-white" : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"}`}
        >
          {node.title}
        </Link>
      </div>
      {open && node.children.map((c) => <TreeItem key={c.id} node={c} depth={depth + 1} />)}
    </div>
  );
}

export function WikiSidebar() {
  const [tree, setTree] = useState<Node[]>([]);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);

  useEffect(() => {
    fetch("/api/pages?tree=1").then((r) => (r.ok ? r.json() : [])).then(setTree).catch(() => {});
  }, []);

  useEffect(() => {
    if (q.trim().length < 2) { setHits([]); return; }
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`).then((r) => (r.ok ? r.json() : [])).then(setHits).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <aside className="w-64 flex-shrink-0 space-y-3 border-r border-[var(--content-border)] pr-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Pages</span>
        <Link href="/wiki/new" className="flex items-center gap-1 text-xs text-[var(--accent-col)] hover:underline">
          <Plus className="h-3 w-3" /> New
        </Link>
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {hits.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-[var(--content-border)] bg-[var(--content-bg)] shadow-lg">
            {hits.map((h) => (
              <Link key={h.id} href={`/wiki/${h.id}`} onClick={() => setHits([])} className="block px-3 py-2 text-sm hover:bg-[var(--hover-bg)]">
                <div className="font-medium text-[var(--text)]">{h.title}</div>
                <div className="truncate text-xs text-[var(--text-muted)]">{h.snippet}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <nav className="space-y-0.5">
        {tree.map((n) => <TreeItem key={n.id} node={n} depth={0} />)}
        {tree.length === 0 && <p className="px-2 text-xs italic text-[var(--text-muted)]">No pages yet.</p>}
      </nav>
    </aside>
  );
}
