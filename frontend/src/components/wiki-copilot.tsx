"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { wikiChat, type ChatResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: { id: string; title: string }[];
}

export function WikiCopilot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function handleSend() {
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res: ChatResponse = await wikiChat(question);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: res.answer, sources: res.sources },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I couldn't reach the AI backend. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition flex items-center justify-center text-xl"
        aria-label="Open Wiki Copilot"
      >
        {open ? "×" : "✦"}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] shadow-2xl">
          <Card className="border border-gray-200 flex flex-col h-[500px]">
            <CardHeader className="pb-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-indigo-600">✦</span>
                  Wiki Copilot
                </CardTitle>
                <Badge variant="secondary" className="text-xs">AI</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-1">Ask anything about your wiki</p>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-sm text-gray-400 pt-4 space-y-2">
                  <p>Hello! I can help you find information in your wiki.</p>
                  <p className="text-xs">Try: &ldquo;How do I get started?&rdquo;</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] text-sm"
                        : "bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[85%] text-sm"
                    }
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                        <p className="text-xs text-gray-500 font-medium">Sources:</p>
                        {msg.sources.map((src) => (
                          <Link
                            key={src.id}
                            href={`/wiki/${src.id}`}
                            className="block text-xs text-indigo-600 hover:underline"
                            onClick={() => setOpen(false)}
                          >
                            → {src.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <span className="text-gray-400 text-sm animate-pulse">Thinking…</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 flex gap-2 flex-shrink-0">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask the wiki…"
                disabled={loading}
                className="text-sm"
              />
              <Button size="sm" onClick={handleSend} disabled={loading || !input.trim()}>
                Send
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
