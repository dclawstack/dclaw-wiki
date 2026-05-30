import { Brain, TreePine, History, Search } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Wiki Copilot",
    description:
      "Ask questions about your knowledge base. Get instant answers with source citations.",
  },
  {
    icon: TreePine,
    title: "Hierarchical Navigation",
    description:
      "Organize pages in a tree structure. Navigate complex knowledge with ease.",
  },
  {
    icon: History,
    title: "Revision History",
    description:
      "Every change is tracked. Compare versions, restore previous content anytime.",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Full-text search across all pages. Find exactly what you need in seconds.",
  },
]

const allCards = [...features, ...features]

export default function FeatureCarousel() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">
          Everything you need to manage knowledge
        </h2>
        <p className="mt-4 text-center text-muted-foreground">
          One platform for creating, organizing, and discovering your team&apos;s knowledge.
        </p>
      </div>

      <div className="mt-12 overflow-hidden">
        <div className="animate-scroll flex gap-6 w-max">
          {allCards.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="w-72 min-w-[288px] rounded-2xl border border-border bg-card p-6"
              >
                <div className="mb-4 inline-flex rounded-xl bg-brand-cyan/10 p-3">
                  <Icon size={20} className="text-brand-cyan" />
                </div>
                <h3 className="font-bold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
