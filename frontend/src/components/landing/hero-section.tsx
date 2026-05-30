import Link from "next/link"

const floatingCards = [
  { label: "Knowledge Base", left: "8%", top: "20%", delay: "0s" },
  { label: "Revision History", left: "75%", top: "15%", delay: "1.2s" },
  { label: "AI Copilot", left: "85%", top: "55%", delay: "0.6s" },
  { label: "Tree Navigation", left: "5%", top: "65%", delay: "1.8s" },
  { label: "Full-text Search", left: "70%", top: "75%", delay: "0.3s" },
  { label: "Markdown Editor", left: "15%", top: "80%", delay: "2.1s" },
]

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-cyan/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 top-1/2 h-[300px] w-[300px] rounded-full bg-brand-emerald/10 blur-2xl"
      />

      {floatingCards.map((card) => (
        <div
          key={card.label}
          aria-hidden
          className="animate-float pointer-events-none absolute rounded-lg border border-border/60 bg-card/80 px-3 py-2 text-xs font-medium text-muted-foreground backdrop-blur-sm"
          style={{ left: card.left, top: card.top, animationDelay: card.delay }}
        >
          {card.label}
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-1.5 text-xs text-brand-cyan">
          <span className="animate-pulse">✦</span> AI-Powered Knowledge Platform
        </div>

        <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">
          Your team&apos;s knowledge,{" "}
          <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
            always
          </span>{" "}
          findable
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Build a living knowledge base with hierarchical pages, AI-powered search,
          and full revision history — all in one platform.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/wiki"
            className="rounded-xl bg-brand-cyan px-8 py-3 font-semibold text-white shadow-lg shadow-brand-cyan/30 transition-opacity hover:opacity-90"
          >
            Browse Wiki
          </Link>
          <a
            href="#features"
            className="rounded-xl border border-border px-8 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
          >
            See Features
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-black text-brand-cyan">∞</div>
            <div className="text-sm text-muted-foreground">Pages</div>
          </div>
          <div>
            <div className="text-3xl font-black text-brand-cyan">100%</div>
            <div className="text-sm text-muted-foreground">Versioned</div>
          </div>
          <div>
            <div className="text-3xl font-black text-brand-cyan">AI</div>
            <div className="text-sm text-muted-foreground">Copilot</div>
          </div>
        </div>
      </div>
    </section>
  )
}
