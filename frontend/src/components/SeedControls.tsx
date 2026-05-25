// ─── SEED CONTROLS ────────────────────────────────────────────────────────────
// Demo utility — remove this file and the <SeedControls /> block in
// app/page.tsx (and the seed router in the backend) when no longer needed.
// ──────────────────────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import Link from "next/link";
import { seedDemoData, clearDemoData, type SeedResult } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

export function SeedControls() {
  const [fillStatus, setFillStatus] = useState<Status>("idle");
  const [clearStatus, setClearStatus] = useState<Status>("idle");
  const [result, setResult] = useState<SeedResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function handleFill() {
    setFillStatus("loading");
    setMessage(null);
    setIsError(false);
    try {
      const res = await seedDemoData();
      setResult(res);
      setMessage(
        `Seeded ${res.pages} pages across 5 sections, with ${res.revisions} revisions. Your wiki is ready to explore.`
      );
      setFillStatus("success");
    } catch (e) {
      setIsError(true);
      setMessage(e instanceof Error ? e.message : "Seed failed");
      setFillStatus("error");
    }
  }

  async function handleClear() {
    setClearStatus("loading");
    setMessage(null);
    setIsError(false);
    try {
      await clearDemoData();
      setResult(null);
      setMessage("All pages cleared. The wiki is back to a fresh, empty state.");
      setClearStatus("success");
      setFillStatus("idle");
    } catch (e) {
      setIsError(true);
      setMessage(e instanceof Error ? e.message : "Clear failed");
      setClearStatus("error");
    }
  }

  const busy = fillStatus === "loading" || clearStatus === "loading";
  const fillLabel =
    fillStatus === "loading"
      ? "Seeding…"
      : fillStatus === "success"
        ? "Re-seed Demo Data"
        : "Seed Demo Data";
  const clearLabel = clearStatus === "loading" ? "Clearing…" : "Clear Data";

  return (
    <div className="rounded-2xl border border-dashed border-[var(--accent-col)] bg-[var(--surface)] p-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-col)]">
        Demo Controls
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Populate the wiki with a realistic, multi-section knowledge base — or wipe it to start fresh.
      </p>

      <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          onClick={handleFill}
          disabled={busy}
          className="rounded-lg bg-[var(--accent-col)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {fillLabel}
        </button>
        <button
          onClick={handleClear}
          disabled={busy}
          className="rounded-lg border border-[var(--border-col)] px-6 py-2.5 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--hover-bg)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {clearLabel}
        </button>
      </div>

      {message && (
        <p className={`mt-4 text-xs ${isError ? "text-[var(--error-text)]" : "text-[var(--accent-col)]"}`}>
          {message}
        </p>
      )}

      {result && fillStatus === "success" && (
        <div className="mt-4">
          <Link
            href="/wiki"
            className="inline-block rounded-lg bg-[var(--text)] px-6 py-2.5 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
          >
            Open the demo wiki →
          </Link>
        </div>
      )}
    </div>
  );
}
