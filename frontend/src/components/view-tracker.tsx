"use client";

import { useEffect } from "react";
import { recordPageView } from "@/lib/api";

/** Fires a single page-view analytics event on mount. Renders nothing. */
export function ViewTracker({ pageId }: { pageId: string }) {
  useEffect(() => {
    recordPageView(pageId).catch(() => {});
  }, [pageId]);
  return null;
}
