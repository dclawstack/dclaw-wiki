import { notFound } from "next/navigation";
import { getPage } from "@/lib/api";
import { PageEditor } from "@/components/page-editor";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function EditPage({ params }: Props) {
  let page;
  try {
    page = await getPage(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Edit Page</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Editing: {page.title}</p>
      </div>
      <PageEditor page={page} />
    </div>
  );
}
