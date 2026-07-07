import { notFound } from "next/navigation";
import { getPage } from "@/lib/wiki";
import { PageEditor } from "@/components/page-editor";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: { id: string } }) {
  const page = await getPage(params.id);
  if (!page) notFound();
  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">Edit page</h1>
      <PageEditor page={{ id: page.id, title: page.title, content: page.content }} />
    </div>
  );
}
