"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Target,
  RefreshCw,
  ListChecks,
  BookOpen,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { listTemplates, type Template } from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ICONS: Record<string, LucideIcon> = {
  ClipboardList,
  Target,
  RefreshCw,
  ListChecks,
  BookOpen,
};

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listTemplates()
      .then(setTemplates)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load templates.")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Template Gallery</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Start a new page from a pre-built blueprint.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-[var(--error-bg)] border border-[var(--error-border)] p-3 text-sm text-[var(--error-text)]">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading templates…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => {
            const Icon = ICONS[tpl.icon] ?? FileText;
            return (
              <Card key={tpl.key} className="flex flex-col bg-[var(--surface)] border-[var(--border-col)]">
                <CardHeader className="flex-1">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-[var(--hover-bg)]">
                    <Icon className="h-5 w-5 text-[var(--accent-col)]" />
                  </div>
                  <CardTitle className="text-lg text-[var(--text)]">{tpl.name}</CardTitle>
                  <CardDescription className="text-[var(--text-muted)]">
                    {tpl.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => router.push(`/wiki/new?template=${tpl.key}`)}
                  >
                    Use template
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
