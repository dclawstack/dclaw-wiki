import { PageEditor } from "@/components/page-editor";

export default function NewPage({ searchParams }: { searchParams: { parent?: string; template?: string } }) {
  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">New page</h1>
      <PageEditor parentId={searchParams.parent ?? null} templateKey={searchParams.template} />
    </div>
  );
}
