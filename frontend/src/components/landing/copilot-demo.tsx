import Link from "next/link"

const checks = [
  "AI answers grounded in your wiki content",
  "Hierarchical page tree with drag-and-drop",
  "Full revision history with one-click restore",
  "Real-time full-text search across all pages",
]

export default function CopilotDemo() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            See the AI Copilot in action
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ask any question and the copilot searches your wiki, synthesizes an answer,
            and cites the source pages — all in real time.
          </p>

          <div className="mt-8 rounded-xl bg-muted p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Your Question
            </p>
            <p className="text-sm text-foreground">
              How do we handle database migrations in production?
            </p>
          </div>

          <div className="my-3 flex items-center justify-center gap-2 text-brand-cyan">
            <div className="h-px flex-1 bg-brand-cyan/20" />
            <span className="text-xs font-medium">AI Copilot</span>
            <div className="h-px flex-1 bg-brand-cyan/20" />
          </div>

          <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-cyan">
              Answer
            </p>
            <p className="text-sm text-foreground">
              Production migrations use Alembic with a blue-green deployment strategy.
              The runbook is documented in the &quot;DevOps Playbook&quot; page under
              Infrastructure &gt; Deployments.
            </p>
          </div>
        </div>

        <div>
          <ul className="space-y-4">
            {checks.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 text-lg font-bold text-brand-cyan">✓</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/wiki"
            className="mt-10 inline-block rounded-xl bg-brand-cyan px-8 py-3 font-semibold text-white shadow-lg shadow-brand-cyan/30 transition-opacity hover:opacity-90"
          >
            Try it now
          </Link>
        </div>
      </div>
    </section>
  )
}
