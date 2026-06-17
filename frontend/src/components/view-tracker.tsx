"use client";

import { useEffect } from "react";

export function ViewTracker({ documentId }: { documentId: string }) {
  useEffect(() => {
    fetch(`/api/pages/${documentId}/view`, { method: "POST" }).catch(() => {});
  }, [documentId]);
  return null;
}
