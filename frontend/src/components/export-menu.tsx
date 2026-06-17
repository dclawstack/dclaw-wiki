"use client";

import { FileText, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportPageUrl } from "@/lib/api";

export function ExportMenu({ pageId }: { pageId: string }) {
  function download(format: "md" | "html") {
    // The export endpoint sets Content-Disposition: attachment, so opening the
    // URL triggers a file download rather than a navigation.
    window.open(exportPageUrl(pageId, format), "_blank");
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => download("md")}
        title="Export as Markdown"
      >
        <FileText className="mr-1.5 h-4 w-4" />
        Export Markdown
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => download("html")}
        title="Export as HTML"
      >
        <FileCode className="mr-1.5 h-4 w-4" />
        Export HTML
      </Button>
    </div>
  );
}
