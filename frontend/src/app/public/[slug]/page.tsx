import { notFound } from "next/navigation";
import { getPublicPage } from "@/lib/api";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export default async function PublicPageView({ params }: Props) {
  let page;
  try {
    page = await getPublicPage(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-[var(--text)]">{page.title}</h1>

      <div className="bg-[var(--content-bg)] rounded-lg border border-[var(--content-border)] p-6 min-h-48">
        {page.content ? (
          <MarkdownRenderer content={page.content} />
        ) : (
          <p className="text-[var(--text-muted)] italic">This page has no content.</p>
        )}
      </div>
    </div>
  );
}
