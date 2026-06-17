import { WikiSidebar } from "@/components/wiki-sidebar";

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6">
      <WikiSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
