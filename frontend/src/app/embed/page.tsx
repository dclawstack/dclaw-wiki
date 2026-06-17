"use client";

import { useState, useRef, useEffect } from "react";
import { publicChat, type ChatResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: { id: string; title: string }[];
}

export default function EmbedPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res: ChatResponse = await publicChat(question);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: res.answer, sources: res.sources },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I couldn't reach the assistant. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    // Fixed full-viewport overlay so the embedded iframe shows only the widget,
    // covering any app chrome rendered by the root layout. See /embed note.
    <div className="fixed inset-0 z-[100] flex flex-col bg-[var(--bg)]">
      <div className="border-b border-[var(--content-border)] px-4 py-3 flex-shrink-0">
        <p className="text-sm font-semibold text-[var(--text)]">Ask the Wiki</p>
        <p className="text-xs text-[var(--text-muted)]">Answers come from our public documentation.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-sm text-[var(--text-muted)] pt-6 space-y-2">
            <p>Hi! Ask me anything about the wiki.</p>
            <p className="text-xs">Try: &ldquo;How do I get started?&rdquo;</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
            {msg.role === "user" ? (
              <div className="bg-[var(--accent-col)] text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] text-sm">
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            ) : (
              <div className="bg-[var(--surface)] text-[var(--text)] rounded-2xl rounded-tl-sm px-4 py-2 max-w-[90%]">
                <MarkdownRenderer content={msg.content} />
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[var(--content-border)] space-y-1">
                    <p className="text-xs text-[var(--text-muted)] font-medium">Sources:</p>
                    {msg.sources.map((src) => (
                      <p key={src.id} className="text-xs text-[var(--accent-col)]">
                        → {src.title}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[var(--surface)] rounded-2xl rounded-tl-sm px-4 py-3">
              <span className="text-[var(--text-muted)] text-sm animate-pulse">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-[var(--content-border)] flex gap-2 flex-shrink-0">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask a question…"
          disabled={loading}
          className="text-sm"
        />
        <Button size="sm" onClick={handleSend} disabled={loading || !input.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
