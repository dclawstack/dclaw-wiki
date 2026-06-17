import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 py-8">
      <div className="space-y-4 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent-col)]">DClaw Wiki</p>
        <h1 className="text-4xl font-bold text-[var(--text)] sm:text-5xl">
          The wiki that keeps itself&nbsp;true
        </h1>
        <p className="mx-auto max-w-xl text-lg text-[var(--text-muted)]">
          Ask a question, get a <strong>cited answer</strong> with a confidence score — or an honest
          “I don’t know.” Every page carries a freshness state, and unanswered questions become a
          tracked knowledge gap.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/ask"><Button size="lg">Ask a question</Button></Link>
          <Link href="/knowledge"><Button size="lg" variant="outline">Add knowledge</Button></Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { t: "Cited & honest", d: "Answers cite their sources and refuse to guess when the knowledge base can’t support them." },
          { t: "Stays fresh", d: "Pages track a verification state; stale knowledge is flagged, not silently trusted." },
          { t: "Finds its gaps", d: "Every question we can’t answer becomes a knowledge gap to fill." },
        ].map((f) => (
          <Card key={f.t} className="bg-[var(--content-bg)] border-[var(--content-border)]">
            <CardHeader className="pb-2"><CardTitle className="text-base text-[var(--text)]">{f.t}</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-[var(--text-muted)]">{f.d}</p></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
