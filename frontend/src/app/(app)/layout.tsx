import { HeaderNav } from "@/components/HeaderNav"
import { WikiCopilot } from "@/components/wiki-copilot"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <HeaderNav />
      {children}
      <WikiCopilot />
    </div>
  )
}
