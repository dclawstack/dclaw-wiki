"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js/lib/common";
import mermaid from "mermaid";
import "highlight.js/styles/github-dark.css";

mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "default" });

function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const id = "mermaid-" + Math.random().toString(36).slice(2);
    mermaid
      .render(id, chart)
      .then(({ svg }) => active && (setSvg(svg), setError(false)))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, [chart]);

  if (error) {
    return (
      <pre className="rounded-md border border-[var(--error-border)] bg-[var(--error-bg)] p-3 text-xs text-[var(--error-text)] overflow-x-auto">
        {chart}
      </pre>
    );
  }
  return <div className="my-4 flex justify-center" dangerouslySetInnerHTML={{ __html: svg }} />;
}

function VideoEmbed({ url }: { url: string }) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) {
    return (
      <div className="my-4 aspect-video">
        <iframe
          className="h-full w-full rounded-md"
          src={`https://www.youtube.com/embed/${yt[1]}`}
          title="Embedded video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return <video src={url} controls className="my-4 w-full rounded-md" />;
}

function CodeBlock({ lang, raw }: { lang: string | undefined; raw: string }) {
  const html =
    lang && hljs.getLanguage(lang)
      ? hljs.highlight(raw, { language: lang }).value
      : hljs.highlightAuto(raw).value;
  return (
    <pre className="my-4 overflow-x-auto rounded-md bg-[#0d1117] p-4 text-sm">
      <code className={`hljs language-${lang ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="text-[var(--text)] text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Strip the wrapping <pre>; CodeBlock renders its own.
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || "");
            const raw = String(children).replace(/\n$/, "");
            if (!match) {
              return (
                <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[0.85em]">
                  {children}
                </code>
              );
            }
            if (match[1] === "mermaid") return <Mermaid chart={raw} />;
            if (match[1] === "video") return <VideoEmbed url={raw.trim()} />;
            return <CodeBlock lang={match[1]} raw={raw} />;
          },
          h1: ({ children }) => <h1 className="mt-6 mb-3 text-2xl font-bold">{children}</h1>,
          h2: ({ children }) => <h2 className="mt-6 mb-3 text-xl font-bold">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-4 mb-2 text-lg font-semibold">{children}</h3>,
          p: ({ children }) => <p className="my-3">{children}</p>,
          ul: ({ children }) => <ul className="my-3 list-disc space-y-1 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-6">{children}</ol>,
          a: ({ href, children }) => (
            <a href={href} className="text-[var(--accent-col)] underline hover:opacity-80" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-4 border-[var(--accent-col)] pl-4 text-[var(--text-muted)]">
              {children}
            </blockquote>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt ?? ""} className="my-4 max-w-full rounded-md border border-[var(--content-border)]" />
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-[var(--content-border)] bg-[var(--surface)] px-3 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-[var(--content-border)] px-3 py-2">{children}</td>
          ),
          hr: () => <hr className="my-6 border-[var(--content-border)]" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
