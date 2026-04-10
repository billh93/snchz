"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Play, Loader2, RotateCcw, Copy, Check } from "lucide-react";

type Run = {
  id: string;
  prompt: string;
  system: string;
  temperature: number;
  output: string;
  tokens?: { promptTokens: number; completionTokens: number };
  duration: number;
  error?: string;
};

const EXAMPLE_PROMPTS = [
  {
    label: "Explain like I'm five",
    prompt: "Explain how the internet works",
    system: "You are a teacher explaining complex topics to a 5-year-old. Use simple words and fun analogies.",
  },
  {
    label: "Code review",
    prompt: "Write a function that checks if a string is a palindrome. Then review your own code and suggest improvements.",
    system: "You are a senior software engineer. Write clean, well-documented code.",
  },
  {
    label: "Marketing copy",
    prompt: "Write a landing page headline and subheadline for a project management tool that uses AI to auto-prioritize tasks.",
    system: "You are a world-class copywriter. Be concise, benefit-driven, and avoid jargon.",
  },
];

export function PromptLab() {
  const [prompt, setPrompt] = useState("");
  const [system, setSystem] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRun = useCallback(async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    const start = Date.now();
    const runId = Math.random().toString(36).slice(2, 9);

    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          system: system.trim() || undefined,
          temperature,
        }),
      });

      const data = await res.json();
      const duration = Date.now() - start;

      if (!res.ok) {
        setRuns((prev) => [
          {
            id: runId,
            prompt: prompt.trim(),
            system: system.trim(),
            temperature,
            output: "",
            duration,
            error: data.error || "Request failed",
          },
          ...prev,
        ]);
      } else {
        setRuns((prev) => [
          {
            id: runId,
            prompt: prompt.trim(),
            system: system.trim(),
            temperature,
            output: data.text,
            tokens: data.usage,
            duration,
          },
          ...prev,
        ]);
      }
    } catch {
      setRuns((prev) => [
        {
          id: runId,
          prompt: prompt.trim(),
          system: system.trim(),
          temperature,
          output: "",
          duration: Date.now() - start,
          error: "Network error",
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  }, [prompt, system, temperature, loading]);

  const handleCopy = useCallback(async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const loadExample = (ex: (typeof EXAMPLE_PROMPTS)[number]) => {
    setPrompt(ex.prompt);
    setSystem(ex.system);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr] lg:gap-12">
      {/* Input panel */}
      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-6 font-display text-lg font-semibold text-foreground">
            Prompt
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                System Prompt
                <span className="ml-1 text-xs text-muted-foreground/50">(optional)</span>
              </label>
              <textarea
                value={system}
                onChange={(e) => setSystem(e.target.value)}
                placeholder="You are a helpful assistant..."
                rows={3}
                maxLength={1000}
                className="w-full resize-none rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-golden/40 focus:outline-none focus:ring-1 focus:ring-golden/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                User Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write your prompt here..."
                rows={5}
                maxLength={2000}
                className="w-full resize-none rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-golden/40 focus:outline-none focus:ring-1 focus:ring-golden/20"
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground/40">
                {prompt.length}/2000
              </p>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-foreground/80">
                  Temperature
                </label>
                <span className="font-mono text-xs text-golden">
                  {temperature.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-golden"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground/40">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={handleRun}
              disabled={!prompt.trim() || loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-golden px-4 py-2.5 text-sm font-semibold text-golden-foreground transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {loading ? "Running..." : "Run"}
            </button>
            <button
              onClick={() => {
                setPrompt("");
                setSystem("");
                setTemperature(0.7);
              }}
              className="flex items-center justify-center rounded-lg border border-border/60 bg-surface/30 px-3 py-2.5 text-muted-foreground transition-all hover:border-golden/30 hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground/50">
            Try an example
          </p>
          {EXAMPLE_PROMPTS.map((ex) => (
            <button
              key={ex.label}
              onClick={() => loadExample(ex)}
              className="w-full rounded-lg border border-dashed border-border/40 p-3 text-left text-xs text-muted-foreground transition-colors hover:border-golden/30 hover:text-foreground"
            >
              <span className="font-medium text-golden/80">{ex.label}</span>
              <span className="ml-1 line-clamp-1">{ex.prompt}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40">
          Powered by GPT-4o Mini. Rate limited to 30 requests/hour.
        </p>
      </div>

      {/* Results */}
      <div>
        {runs.length === 0 ? (
          <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-dashed border-border/40 p-12">
            <div className="text-center">
              <p className="font-display text-lg font-medium text-muted-foreground">
                Run a prompt to see results
              </p>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Each run appears here so you can compare outputs across
                different prompts and temperatures.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {runs.map((run, idx) => (
              <motion.div
                key={run.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-xl border p-5",
                  run.error
                    ? "border-red-400/20 bg-red-400/5"
                    : "border-border/50 bg-surface/30"
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-golden/10 px-2 py-0.5 font-mono text-[10px] text-golden">
                      Run #{runs.length - idx}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      temp={run.temperature.toFixed(1)}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      {(run.duration / 1000).toFixed(1)}s
                    </span>
                    {run.tokens && (
                      <span className="font-mono text-[10px] text-muted-foreground/50">
                        {run.tokens.promptTokens + run.tokens.completionTokens} tokens
                      </span>
                    )}
                  </div>
                  {!run.error && (
                    <button
                      onClick={() => handleCopy(run.id, run.output)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {copiedId === run.id ? (
                        <Check className="h-3.5 w-3.5 text-green-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {run.system && (
                  <p className="mb-2 text-xs text-muted-foreground/50">
                    <span className="font-medium">System:</span>{" "}
                    <span className="line-clamp-1">{run.system}</span>
                  </p>
                )}

                <p className="mb-3 text-xs text-muted-foreground/70">
                  <span className="font-medium">Prompt:</span> {run.prompt}
                </p>

                {run.error ? (
                  <p className="text-sm text-red-400">{run.error}</p>
                ) : (
                  <div className="whitespace-pre-wrap rounded-lg bg-background/30 p-4 text-sm leading-relaxed text-foreground/90">
                    {run.output}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
