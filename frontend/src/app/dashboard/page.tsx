"use client";

import React, { useState } from "react";
import { BookOpen } from "lucide-react";

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    topArticle: string;
    relatedPages: string[];
    lastEditedBy: string;
  } | null>(null);

  const handleSearch = () => {
    setResults({
      topArticle: `How to use ${query || "DClaw Wiki"}`,
      relatedPages: ["Getting Started", "Advanced Search", "Contributing Guide"],
      lastEditedBy: "Alice",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-[#06B6D4]" />
          <h1 className="text-2xl font-bold text-gray-900">Wiki Dashboard</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Search Wiki
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Search wiki
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. onboarding"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#06B6D4] focus:outline-none focus:ring-1 focus:ring-[#06B6D4]"
                />
              </div>
              <button
                onClick={handleSearch}
                className="inline-flex w-full justify-center rounded-lg bg-[#06B6D4] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              >
                Search
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Search Results
            </h2>
            {results ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Top article</p>
                  <p className="text-lg font-semibold text-[#06B6D4]">
                    {results.topArticle}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Related pages</p>
                  <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
                    {results.relatedPages.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Last edited by</p>
                  <p className="text-lg font-semibold text-[#06B6D4]">
                    {results.lastEditedBy}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Enter a query and click Search to see results.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
