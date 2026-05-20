import { WikiSidebar } from "@/components/wiki-sidebar";

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <WikiSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
