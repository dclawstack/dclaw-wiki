"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { restoreRevision } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface Props {
  pageId: string;
  revisionId: string;
}

export function RestoreButton({ pageId, revisionId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRestore() {
    if (!confirm("Restore this revision? The current version will be saved in history.")) return;
    setLoading(true);
    try {
      await restoreRevision(pageId, revisionId);
      router.push(`/wiki/${pageId}`);
      router.refresh();
    } catch {
      alert("Failed to restore revision.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRestore}
      disabled={loading}
    >
      {loading ? "Restoring…" : "Restore"}
    </Button>
  );
}
