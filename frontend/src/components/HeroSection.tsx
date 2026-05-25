import Link from 'next/link';
export function HeroSection() {
  return (
    <section className="bg-[var(--bg)] py-24 px-6 text-center">
      <h1 className="text-5xl font-bold text-[var(--text)] mb-6">Your team's knowledge,<br />always findable.</h1>
      <p className="text-xl text-[var(--text-muted)] mb-10 max-w-2xl mx-auto">
        Build a living knowledge base with hierarchical pages, AI-powered search, and full revision history.
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link href="/wiki" className="bg-[var(--accent-col)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors">Browse Wiki</Link>
        <Link href="/wiki/new" className="border border-[var(--border-col)] text-[var(--text)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--surface)] transition-colors">New Page</Link>
      </div>
    </section>
  );
}
