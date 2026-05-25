import { PageEditor } from "@/components/page-editor";

interface Props {
  searchParams: { parent?: string };
}

export default function NewPage({ searchParams }: Props) {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">New Page</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Create a new wiki page</p>
      </div>
      <PageEditor defaultParentId={searchParams.parent ?? null} />
    </div>
  );
}
