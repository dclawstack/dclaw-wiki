"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStalePages, suggestUpdate, type StalePage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MaintenancePage() {
  const [days, setDays] = useState(90);
  const [pages, setPages] = useState<StalePage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [suggesting, setSuggesting] = useState<string | null>(null);

  async function load(d: number) {
    setLoading(true);
    setError(null);
    try {
      setPages(await getStalePages(d));
    } catch {
      setError("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSuggest(pageId: string) {
    setSuggesting(pageId);
    try {
      const res = await suggestUpdate(pageId);
      setSuggestions((prev) => ({
        ...prev,
        [pageId]: `${res.suggestion} (via ${res.provider})`,
      }));
    } catch {
      setSuggestions((prev) => ({
        ...prev,
        [pageId]: "Could not generate a suggestion.",
      }));
    } finally {
      setSuggesting(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text)]">Maintenance</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="days" className="text-sm text-[var(--text-muted)]">
            Stale after
          </label>
          <input
            id="days"
            type="number"
            min={1}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-20 rounded-md border border-[var(--content-border)] bg-[var(--content-bg)] px-2 py-1 text-sm text-[var(--text)]"
          />
          <span className="text-sm text-[var(--text-muted)]">days</span>
          <Button onClick={() => load(days)} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-[var(--error-bg)] border border-[var(--error-border)] p-4 text-sm text-[var(--error-text)]">
          {error}
        </div>
      )}

      {!loading && pages.length === 0 && !error ? (
        <div className="rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] p-8 text-center text-[var(--text-muted)]">
          No stale pages. Everything is up to date.
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[var(--text)]">Title</TableHead>
                <TableHead className="text-[var(--text)]">Last updated</TableHead>
                <TableHead className="text-[var(--text)]">Days stale</TableHead>
                <TableHead className="text-right text-[var(--text)]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium text-[var(--text)]">
                    <Link
                      href={`/wiki/${page.id}`}
                      className="hover:text-[var(--accent-col)]"
                    >
                      {page.title}
                    </Link>
                    {suggestions[page.id] && (
                      <p className="mt-2 text-sm font-normal text-[var(--text-muted)]">
                        {suggestions[page.id]}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-[var(--text-muted)]">
                    {formatDate(page.updated_at)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">{page.days_stale}d</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggest(page.id)}
                      disabled={suggesting === page.id}
                    >
                      {suggesting === page.id ? "Thinking..." : "Suggest update"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
