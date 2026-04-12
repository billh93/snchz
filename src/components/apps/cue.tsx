"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { SITE } from "@/lib/data";
import { Send } from "lucide-react";

export function CueApp() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    sendMessage({ text });
  }

  return (
    <div className="flex h-full flex-col bg-[#1a1a2e]">
      <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
          <span className="text-sm font-bold text-white">C</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Cue</p>
          <p className="text-[11px] text-white/40">AI Assistant</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl bg-white/8 px-4 py-2.5 text-[14px] leading-relaxed text-white/80">
              Hey! I&apos;m Cue, {SITE.title}&apos;s AI assistant. Ask me
              anything about his projects, skills, or experience.
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white/8 text-white/80"
              }`}
            >
              {msg.parts
                ?.filter((p) => p.type === "text")
                .map((p, i) => <span key={i}>{p.text}</span>) || (
                <span className="inline-flex gap-1">
                  <span className="animate-pulse">●</span>
                  <span
                    className="animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  >
                    ●
                  </span>
                  <span
                    className="animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  >
                    ●
                  </span>
                </span>
              )}
            </div>
          </div>
        ))}
        {busy && messages.at(-1)?.role === "user" && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl bg-white/8 px-4 py-2.5 text-[14px] text-white/80">
              <span className="inline-flex gap-1">
                <span className="animate-pulse">●</span>
                <span
                  className="animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                >
                  ●
                </span>
                <span
                  className="animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                >
                  ●
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/8 p-3">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-xl bg-white/8 px-3 py-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Cue anything..."
            className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/30"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-500 disabled:opacity-30"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
