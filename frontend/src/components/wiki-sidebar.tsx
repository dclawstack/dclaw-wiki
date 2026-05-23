import Link from "next/link";
import { getPageTree, type PageTree } from "@/lib/api";
import { PageTreeNav } from "@/components/page-tree";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";

interface WikiSidebarProps {
  currentPageId?: string;
}

export async function WikiSidebar({ currentPageId }: WikiSidebarProps) {
  let tree: PageTree[] = [];
  try {
    tree = await getPageTree();
  } catch {
    // Backend may not be available during build; render empty sidebar
  }

  return (
    <aside className="w-64 flex-shrink-0 border-r border-[var(--content-border)] bg-[var(--surface)] h-full flex flex-col">
      <div className="p-4 border-b border-[var(--content-border)] flex items-center justify-between">
        <Link href="/wiki" className="font-semibold text-[var(--text)] hover:text-[var(--accent-col)]">
          DClaw Wiki
        </Link>
        <Link href="/wiki/new">
          <Button size="sm" variant="ghost" className="text-xs px-2">
            + New
          </Button>
        </Link>
      </div>
      <div className="p-3 border-b border-[var(--content-border)]">
        <SearchBar />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {tree.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] px-2 pt-2">No pages yet.</p>
        ) : (
          <PageTreeNav tree={tree} currentId={currentPageId} />
        )}
      </div>
    </aside>
  );
}
