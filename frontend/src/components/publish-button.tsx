"use client";

import { useEffect, useState } from "react";
import { Globe, Lock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { publishPage, unpublishPage, getPublishStatus } from "@/lib/api";

export function PublishButton({ pageId }: { pageId: string }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    getPublishStatus(pageId)
      .then((status) => active && setSlug(status.published ? status.slug ?? null : null))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pageId]);

  const published = slug !== null;

  async function toggle() {
    setLoading(true);
    try {
      if (published) {
        await unpublishPage(pageId);
        setSlug(null);
      } else {
        const result = await publishPage(pageId);
        setSlug(result.slug);
      }
    } catch {
      // ignore — keep current state
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant={published ? "secondary" : "outline"}
        size="sm"
        onClick={toggle}
        disabled={loading}
      >
        {published ? (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Unpublish
          </>
        ) : (
          <>
            <Globe className="mr-2 h-4 w-4" />
            Publish
          </>
        )}
      </Button>

      {published && slug && (
        <a
          href={`/public/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[var(--accent-col)] hover:opacity-80"
        >
          <Badge variant="secondary" className="gap-1">
            <Globe className="h-3 w-3" />
            Public
          </Badge>
          <span className="text-xs">/public/{slug}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
