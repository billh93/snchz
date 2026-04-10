"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Clock,
} from "lucide-react";

const PLATFORMS: Record<string, { label: string; limit: number | null }> = {
  twitter: { label: "Twitter / X", limit: 160 },
  linkedin: { label: "LinkedIn", limit: 2000 },
  github: { label: "GitHub", limit: 256 },
  general: { label: "General", limit: null },
};

const TONES = ["professional", "casual", "creative", "bold"] as const;
type Tone = (typeof TONES)[number];

type Generation = {
  id: string;
  text: string;
  platform: string;
  tone: Tone;
  timestamp: number;
};

const inputClass =
  "w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10";

export function BioGenerator() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [platform, setPlatform] = useState("linkedin");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Generation[]>([]);

  const charLimit = PLATFORMS[platform]?.limit;

  const generate = useCallback(async () => {
    if (!name.trim() || !role.trim() || loading) return;

    setLoading(true);
    setError("");

    const platformLabel = PLATFORMS[platform]?.label || platform;
    const limitStr = charLimit ? `Keep it under ${charLimit} characters.` : "";

    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a ${platformLabel} bio for ${name.trim()}, a ${role.trim()}${industry.trim() ? ` in ${industry.trim()}` : ""}. ${skills.trim() ? `Key skills: ${skills.trim()}.` : ""} Tone: ${tone}. ${limitStr} Return ONLY the bio text, nothing else.`,
          temperature: 0.8,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }

      const text = data.text?.trim() || "";
      setOutput(text);

      const gen: Generation = {
        id: Math.random().toString(36).slice(2, 9),
        text,
        platform,
        tone,
        timestamp: Date.now(),
      };
      setHistory((prev) => [gen, ...prev].slice(0, 3));
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }, [name, role, industry, skills, tone, platform, charLimit, loading]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const charCount = output.length;
  const limitPct = charLimit ? charCount / charLimit : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr] lg:gap-12">
      {/* Input panel */}
      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-6 font-display text-lg font-semibold text-foreground">
            Profile Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Senior Product Designer"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Industry
                <span className="ml-1 text-xs text-muted-foreground/50">(optional)</span>
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Fintech, Healthcare, SaaS…"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Key Skills
                <span className="ml-1 text-xs text-muted-foreground/50">(comma separated)</span>
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="UX research, prototyping, design systems"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Tone
              </label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                      tone === t
                        ? "border-foreground/20 bg-foreground/[0.06] text-foreground/80"
                        : "border-border/50 text-muted-foreground hover:border-foreground/15 hover:text-foreground"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Platform
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PLATFORMS).map(([key, { label, limit }]) => (
                  <button
                    key={key}
                    onClick={() => setPlatform(key)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                      platform === key
                        ? "border-foreground/20 bg-foreground/[0.06] text-foreground/80"
                        : "border-border/50 text-muted-foreground hover:border-foreground/15 hover:text-foreground"
                    )}
                  >
                    {label}
                    {limit && (
                      <span className="ml-1 text-[10px] text-muted-foreground/50">
                        {limit}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={generate}
              disabled={!name.trim() || !role.trim() || loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Generating…" : "Generate Bio"}
            </button>
            {output && (
              <button
                onClick={generate}
                disabled={loading}
                className="flex items-center justify-center rounded-lg border border-border/60 bg-surface/30 px-3 py-2.5 text-muted-foreground transition-all hover:border-foreground/15 hover:text-foreground disabled:opacity-40"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40">
          Powered by GPT-4o Mini. Rate limited to 30 requests/hour.
        </p>
      </div>

      {/* Output */}
      <div className="space-y-4">
        {!output && !loading && !error ? (
          <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-dashed border-border/40 p-12">
            <div className="text-center">
              <p className="font-display text-lg font-medium text-muted-foreground">
                Generate a bio to see results
              </p>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Fill in your details and pick a platform to get a tailored bio.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-400"
              >
                {error}
              </motion.div>
            )}

            {(output || loading) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-foreground/[0.06] px-2 py-0.5 text-[10px] font-medium text-foreground/80">
                      {PLATFORMS[platform]?.label}
                    </span>
                    <span className="text-[10px] capitalize text-muted-foreground/50">
                      {tone}
                    </span>
                  </div>
                  {output && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  )}
                </div>

                {loading && !output ? (
                  <div className="flex h-24 items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-foreground/40" />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap rounded-lg bg-background/30 p-4 text-sm leading-relaxed text-foreground/90">
                    {output}
                  </p>
                )}

                {output && (
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={cn(
                        "font-mono text-[10px]",
                        !charLimit
                          ? "text-muted-foreground/50"
                          : limitPct > 1
                            ? "text-red-400"
                            : limitPct > 0.8
                              ? "text-yellow-400"
                              : "text-emerald-400"
                      )}
                    >
                      {charCount}
                      {charLimit ? `/${charLimit}` : ""} characters
                    </span>
                    {charLimit && limitPct > 1 && (
                      <span className="text-[10px] text-red-400/70">
                        Over limit by {charCount - charLimit}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* History */}
            <AnimatePresence>
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/50">
                    <Clock className="h-3 w-3" />
                    Recent generations
                  </p>
                  {history.map((gen) => (
                    <motion.div
                      key={gen.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-border/30 bg-surface/20 p-3"
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-[9px] text-foreground/80">
                          {PLATFORMS[gen.platform]?.label}
                        </span>
                        <span className="text-[9px] capitalize text-muted-foreground/40">
                          {gen.tone}
                        </span>
                        <span className="ml-auto text-[9px] text-muted-foreground/30">
                          {new Date(gen.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground/70">
                        {gen.text}
                      </p>
                      <button
                        onClick={() => setOutput(gen.text)}
                        className="mt-1.5 text-[10px] text-foreground/40 transition-colors hover:text-foreground"
                      >
                        Use this
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
