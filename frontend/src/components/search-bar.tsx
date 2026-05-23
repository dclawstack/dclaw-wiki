"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { searchPages, type PageRead } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PageRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchPages(query, 8);
        setResults(res);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <Input
        placeholder="Search wiki…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        className="pr-8"
      />
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
          …
        </span>
      )}

      {open && (
        <Card className="absolute z-50 top-full mt-1 w-full shadow-lg border border-[var(--content-border)] bg-[var(--bg)]">
          <CardContent className="p-0">
            {results.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[var(--text-muted)]">No results for &ldquo;{query}&rdquo;</div>
            ) : (
              <ul>
                {results.map((page) => (
                  <li key={page.id}>
                    <Link
                      href={`/wiki/${page.id}`}
                      onClick={() => { setOpen(false); setQuery(""); }}
                      className="flex flex-col px-4 py-2 hover:bg-[var(--hover-bg)] border-b border-[var(--content-border)] last:border-0"
                    >
                      <span className="font-medium text-sm text-[var(--text)]">{page.title}</span>
                      <span className="text-xs text-[var(--text-muted)] line-clamp-1">{page.content}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
