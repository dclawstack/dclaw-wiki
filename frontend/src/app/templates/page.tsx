import Link from "next/link";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { listTemplates } from "@/lib/templates";

export const dynamic = "force-dynamic";

export default function TemplatesPage() {
  const templates = listTemplates();

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Templates</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Start a new page from a ready-made structure.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((t) => {
          const Icon =
            (Icons as unknown as Record<string, Icons.LucideIcon>)[t.icon] ?? Icons.FileText;
          return (
            <Card key={t.key} className="flex flex-col bg-[var(--content-bg)] border-[var(--content-border)]">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[var(--surface)] p-2 text-[var(--accent-col)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-base text-[var(--text)]">{t.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-[var(--text-muted)]">{t.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Link href={`/wiki/new?template=${t.key}`}>
                  <Button size="sm">Use template</Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
