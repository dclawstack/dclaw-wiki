"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RestoreButton({ documentId, revisionId }: { documentId: string; revisionId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function restore() {
    setBusy(true);
    try {
      const r = await fetch(`/api/pages/${documentId}/revisions/${revisionId}/restore`, { method: "POST" });
      if (r.ok) { router.push(`/wiki/${documentId}`); router.refresh(); }
    } finally { setBusy(false); }
  }

  return (
    <Button size="sm" variant="outline" onClick={restore} disabled={busy}>{busy ? "Restoring…" : "Restore"}</Button>
  );
}
