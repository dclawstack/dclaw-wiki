/** Heading extraction + slugging shared by the renderer (anchor ids) and the TOC. */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface Heading {
  level: number;
  text: string;
  slug: string;
}

/** Parse `#`..`###` headings from Markdown, ignoring fenced code blocks. */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) {
      const text = m[2].trim();
      headings.push({ level: m[1].length, text, slug: slugify(text) });
    }
  }
  return headings;
}
