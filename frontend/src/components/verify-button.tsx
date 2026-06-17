"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function VerifyButton({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: "verify" | "flag_stale") {
    setBusy(true);
    try {
      await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => act("verify")} disabled={busy}>Verify</Button>
      <Button size="sm" variant="outline" onClick={() => act("flag_stale")} disabled={busy}>Flag stale</Button>
    </div>
  );
}
