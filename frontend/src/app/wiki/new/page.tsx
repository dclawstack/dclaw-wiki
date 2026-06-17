import { PageEditor } from "@/components/page-editor";
import { getTemplate } from "@/lib/api";

interface Props {
  searchParams: { parent?: string; template?: string };
}

export default async function NewPage({ searchParams }: Props) {
  let templateContent = "";
  if (searchParams.template) {
    try {
      templateContent = (await getTemplate(searchParams.template)).content;
    } catch {
      templateContent = "";
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">New Page</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Create a new wiki page</p>
      </div>
      <PageEditor defaultParentId={searchParams.parent ?? null} defaultContent={templateContent} />
    </div>
  );
}
