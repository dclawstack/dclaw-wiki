import Link from "next/link";
import { SeedControls } from "@/components/SeedControls";

/* ─── Inline SVG icons (zero dependencies) ─── */

function IconBot() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
      <rect x="4" y="8" width="16" height="11" rx="2" />
      <path d="M12 8V4M9 3h6" strokeLinecap="round" />
      <circle cx="9" cy="13" r="1" fill="currentColor" />
      <circle cx="15" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}
function IconTree() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
      <rect x="3" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="9" width="7" height="5" rx="1" />
      <rect x="14" y="16" width="7" height="5" rx="1" />
      <path d="M6.5 8v8.5h7.5M6.5 11.5h7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconHistory() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 4v4h4M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
      <path d="M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
      <path d="M14 2v4h4M8 13h8M8 17h6" strokeLinecap="round" />
    </svg>
  );
}
function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconLink() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="ml-1 inline h-4 w-4">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Content ─── */

const features = [
  {
    icon: <IconBot />,
    title: "AI Wiki Copilot",
    desc: "Ask your knowledge base anything in plain English. The copilot answers from your live pages and cites the exact source for every claim.",
    tag: "AI",
  },
  {
    icon: <IconTree />,
    title: "Hierarchical Navigation",
    desc: "Organize pages into a nested tree with a materialized path. Browse sections, expand sub-pages, and keep deep knowledge tidy.",
    tag: "Core",
  },
  {
    icon: <IconHistory />,
    title: "Revision History",
    desc: "Every edit is snapshotted automatically. Browse the full history of any page and restore an earlier version with one click.",
    tag: "Core",
  },
  {
    icon: <IconSearch />,
    title: "Smart Search",
    desc: "Full-text search across titles and content, ranked so title matches surface first. Find exactly the page you need in seconds.",
    tag: "Discovery",
  },
  {
    icon: <IconDoc />,
    title: "Markdown Pages",
    desc: "Write rich pages in Markdown — headings, tables, lists, and code blocks render cleanly for readable, structured documentation.",
    tag: "Core",
  },
  {
    icon: <IconLink />,
    title: "Related Pages",
    desc: "The copilot suggests semantically related pages so readers discover connected knowledge without hunting through the tree.",
    tag: "AI",
  },
  {
    icon: <IconMoon />,
    title: "Dark Mode",
    desc: "A system-aware dark and light theme with a manual toggle, so your team can read comfortably in any environment.",
    tag: "Experience",
  },
  {
    icon: <IconBolt />,
    title: "Instant Dashboard",
    desc: "An at-a-glance overview of total, root, and nested pages plus your most recently updated docs — your wiki's pulse.",
    tag: "Discovery",
  },
];

const tagColor: Record<string, string> = {
  AI: "bg-cyan-100 text-cyan-700 border border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
  Core: "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  Discovery: "bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
  Experience: "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
};

const steps = [
  {
    n: "01",
    title: "Seed or write",
    desc: "Start from a populated demo workspace with the button below, or create your first page and build the tree section by section.",
  },
  {
    n: "02",
    title: "Search & ask",
    desc: "Find pages with full-text search, or ask the AI copilot a question and get an answer grounded in your own documentation.",
  },
  {
    n: "03",
    title: "Edit with history",
    desc: "Refine pages over time. Every change is versioned, so you can compare and roll back to any previous revision with confidence.",
  },
];

const stats = [
  { value: "Tree", label: "hierarchical pages" },
  { value: "AI copilot", label: "grounded in your docs" },
  { value: "Full history", label: "every edit versioned" },
  { value: "Instant", label: "full-text search" },
];

/* ─── Page ─── */

export default function LandingPage() {
  return (
    <div className="text-[var(--text)]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[var(--accent-col)] opacity-[0.07] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-col)] bg-[var(--surface)] px-4 py-1.5 text-sm font-medium text-[var(--accent-col)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-col)]" />
            The AI-native team knowledge base
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight md:text-7xl">
            Your team&apos;s knowledge,
            <br className="hidden md:block" />{" "}
            <span className="text-[var(--accent-col)]">always findable.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-[var(--text-muted)]">
            DClaw Wiki is a living knowledge base with a hierarchical page tree, AI-powered
            search and chat, and full revision history — so nothing your team knows ever gets lost.
          </p>

          <div className="flex flex-col justify-center gap-4 pt-2 sm:flex-row">
            <Link
              href="/wiki"
              className="rounded-xl bg-[var(--accent-col)] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-[var(--accent-hover)]"
            >
              Browse the wiki <IconArrow />
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-[var(--border-col)] px-8 py-4 text-lg font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface)]"
            >
              Explore features
            </a>
          </div>
        </div>

        {/* Hero wiki mockup */}
        <div className="relative mx-auto mt-16 max-w-3xl text-left">
          <div className="overflow-hidden rounded-2xl border border-[var(--border-col)] bg-[var(--content-bg)] shadow-2xl">
            <div className="flex items-center gap-2 border-b border-[var(--border-col)] bg-[var(--surface)] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-[var(--text-muted)]">DClaw Wiki · Engineering</span>
            </div>
            <div className="grid grid-cols-3">
              <div className="col-span-1 space-y-1 border-r border-[var(--border-col)] p-4 text-sm">
                {[
                  { t: "Getting Started", d: 0 },
                  { t: "Engineering", d: 0, active: true },
                  { t: "Backend Architecture", d: 1, active: true },
                  { t: "API Reference", d: 1 },
                  { t: "Deployment Guide", d: 1 },
                  { t: "Product", d: 0 },
                  { t: "Team Handbook", d: 0 },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`truncate rounded px-2 py-1 ${
                      row.active ? "bg-[var(--hover-bg)] text-[var(--accent-col)]" : "text-[var(--text-muted)]"
                    }`}
                    style={{ paddingLeft: `${0.5 + row.d * 0.9}rem` }}
                  >
                    {row.d === 1 ? "› " : ""}
                    {row.t}
                  </div>
                ))}
              </div>
              <div className="col-span-2 space-y-3 p-5">
                <div className="text-lg font-bold text-[var(--text)]">Backend Architecture</div>
                <div className="space-y-2 text-sm text-[var(--text-muted)]">
                  <div className="h-2 w-3/4 rounded bg-[var(--hover-bg)]" />
                  <div className="h-2 w-full rounded bg-[var(--hover-bg)]" />
                  <div className="h-2 w-5/6 rounded bg-[var(--hover-bg)]" />
                </div>
                <div className="rounded-lg border border-[var(--border-col)] bg-[var(--surface)] p-3 text-xs">
                  <div className="mb-1 font-mono text-[var(--accent-col)]">AI Copilot</div>
                  <p className="text-[var(--text-muted)]">
                    &ldquo;FastAPI + async SQLAlchemy 2.0, repository pattern, Pydantic v2.&rdquo;{" "}
                    <span className="text-[var(--accent-col)]">— Backend Architecture</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-[var(--border-col)] bg-[var(--surface)] px-6 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-extrabold text-[var(--accent-col)]">{s.value}</div>
              <div className="mt-1 text-sm text-[var(--text-muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 space-y-3 text-center">
            <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent-col)]">
              Everything your team needs
            </div>
            <h2 className="text-4xl font-bold md:text-5xl">Knowledge that works for your team</h2>
            <p className="mx-auto max-w-2xl text-lg text-[var(--text-muted)]">
              From a tidy page tree to AI-assisted answers and full revision history — one wiki
              covers the whole documentation lifecycle.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-[var(--border-col)] bg-[var(--content-bg)] p-6 transition-all duration-200 hover:border-[var(--accent-col)] hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="text-[var(--accent-col)]">{f.icon}</div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tagColor[f.tag]}`}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-semibold leading-snug text-[var(--text)]">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-[var(--surface)] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 space-y-3 text-center">
            <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent-col)]">
              Simple by design
            </div>
            <h2 className="text-4xl font-bold md:text-5xl">From blank page to living knowledge base</h2>
            <p className="mx-auto max-w-xl text-lg text-[var(--text-muted)]">
              No setup overhead. Seed a demo workspace, search and ask, then edit with full history.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="space-y-4 text-center">
                <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--border-col)] bg-[var(--content-bg)]">
                  <span className="text-2xl font-extrabold text-[var(--accent-col)]">{step.n}</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--text)]">{step.title}</h3>
                <p className="leading-relaxed text-[var(--text-muted)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Copilot spotlight ── */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          <div className="space-y-6">
            <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent-col)]">
              AI Wiki Copilot
            </div>
            <h2 className="text-4xl font-bold leading-tight md:text-5xl">Ask your wiki anything</h2>
            <p className="text-lg leading-relaxed text-[var(--text-muted)]">
              The copilot is grounded in your live pages. It retrieves the most relevant docs,
              answers in plain English, and cites the source page for every answer — no query
              language required.
            </p>
            <ul className="space-y-3">
              {[
                "How do I set up the development environment?",
                "What's our deployment process?",
                "Summarize the 2026 product roadmap",
                "What changed in the latest release?",
              ].map((q) => (
                <li key={q} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                  <span className="mt-0.5 text-[var(--accent-col)]">→</span>
                  <span className="italic">&ldquo;{q}&rdquo;</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat mockup */}
          <div className="overflow-hidden rounded-2xl border border-[var(--border-col)] bg-[var(--content-bg)] shadow-2xl">
            <div className="flex items-center gap-2 border-b border-[var(--border-col)] px-4 py-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-[var(--text-muted)]">AI Wiki Copilot</span>
            </div>
            <div className="space-y-4 p-5 text-sm">
              <div className="flex justify-end">
                <div className="max-w-xs rounded-2xl rounded-tr-sm border border-[var(--border-col)] bg-[var(--surface)] px-4 py-2.5 text-[var(--text)]">
                  What&apos;s our deployment process?
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-col)] bg-[var(--surface)] text-xs font-bold text-[var(--accent-col)]">
                  AI
                </div>
                <div className="flex-1 space-y-2 rounded-2xl rounded-tl-sm border border-[var(--border-col)] bg-[var(--surface)] px-4 py-3 leading-relaxed text-[var(--text-muted)]">
                  <p>
                    Push to <strong className="text-[var(--text)]">main</strong>; CI builds and
                    pushes images to GHCR, then Helm applies a rolling update for zero downtime.
                  </p>
                  <div className="rounded-lg bg-[var(--content-bg)] p-2.5 font-mono text-xs">
                    <span className="text-[var(--accent-col)]">Source: Deployment Guide</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 rounded-xl border border-[var(--border-col)] bg-[var(--surface)] px-4 py-2.5">
                <span className="flex-1 text-sm text-[var(--text-muted)]">Ask anything about your wiki…</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-col)] text-white">
                  <IconArrow />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">Stop losing what your team knows</h2>
          <p className="text-lg text-[var(--text-muted)]">
            Seed the demo workspace below and explore a fully-populated knowledge base in seconds.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/wiki"
              className="rounded-xl bg-[var(--accent-col)] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-[var(--accent-hover)]"
            >
              Browse the wiki <IconArrow />
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-[var(--border-col)] px-8 py-4 text-lg font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface)]"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEED CONTROLS — remove this block (and the SeedControls import) to hide ── */}
      <section className="border-t border-[var(--border-col)] px-6 py-12">
        <div className="mx-auto max-w-lg">
          <SeedControls />
        </div>
      </section>
      {/* ── END SEED CONTROLS ── */}

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border-col)] px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[var(--accent-col)]">DClaw Wiki</span>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="text-sm text-[var(--text-muted)]">dclaw_wiki</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
            <Link href="/wiki" className="transition-colors hover:text-[var(--text)]">Wiki</Link>
            <Link href="/dashboard" className="transition-colors hover:text-[var(--text)]">Dashboard</Link>
            <Link href="/wiki/new" className="transition-colors hover:text-[var(--text)]">New Page</Link>
          </nav>
          <div className="text-sm text-[var(--text-muted)]">Built with FastAPI · Next.js · PostgreSQL</div>
        </div>
      </footer>
    </div>
  );
}
