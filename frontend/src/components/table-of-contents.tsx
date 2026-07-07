import { extractHeadings } from "@/lib/toc";

/** Renders an auto-generated table of contents from a page's Markdown. */
export function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);
  if (headings.length < 2) return null;

  return (
    <nav className="rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        On this page
      </p>
      <ul className="space-y-1 text-sm">
        {headings.map((h, i) => (
          <li key={i} style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
            <a href={`#${h.slug}`} className="text-[var(--text-muted)] hover:text-[var(--accent-col)]">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
