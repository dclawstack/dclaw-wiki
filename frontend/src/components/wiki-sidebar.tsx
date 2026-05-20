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
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <Link href="/wiki" className="font-semibold text-gray-900 hover:text-indigo-600">
          DClaw Wiki
        </Link>
        <Link href="/wiki/new">
          <Button size="sm" variant="ghost" className="text-xs px-2">
            + New
          </Button>
        </Link>
      </div>
      <div className="p-3 border-b border-gray-100">
        <SearchBar />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {tree.length === 0 ? (
          <p className="text-xs text-gray-400 px-2 pt-2">No pages yet.</p>
        ) : (
          <PageTreeNav tree={tree} currentId={currentPageId} />
        )}
      </div>
    </aside>
  );
}
