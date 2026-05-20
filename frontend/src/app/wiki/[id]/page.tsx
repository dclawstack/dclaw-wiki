import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/api";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  params: { id: string };
}

export default async function WikiPageView({ params }: Props) {
  let page;
  try {
    page = await getPage(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/wiki" className="hover:text-indigo-600">Wiki</Link>
        <span>/</span>
        {page.parent_id && (
          <>
            <Link href={`/wiki/${page.parent_id}`} className="hover:text-indigo-600 truncate max-w-xs">
              Parent
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 font-medium truncate">{page.title}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
        <div className="flex gap-2 flex-shrink-0">
          <Link href={`/wiki/${page.id}/history`}>
            <Button variant="ghost" size="sm">History</Button>
          </Link>
          <Link href={`/wiki/${page.id}/edit`}>
            <Button size="sm">Edit</Button>
          </Link>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
        {page.created_by && (
          <span>Created by <span className="text-gray-600">{page.created_by}</span></span>
        )}
        {page.updated_by && (
          <span>· Last edited by <span className="text-gray-600">{page.updated_by}</span></span>
        )}
        <span>· {formatDate(page.updated_at)}</span>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-48">
        {page.content ? (
          <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm leading-relaxed">
            {page.content}
          </pre>
        ) : (
          <p className="text-gray-400 italic">This page has no content yet.</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Link href={`/wiki/new?parent=${page.id}`}>
          <Button variant="outline" size="sm">+ Add Child Page</Button>
        </Link>
      </div>
    </div>
  );
}
