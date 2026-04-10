"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Globe,
  Play,
  RotateCw,
  Zap,
  ArrowDown,
  ArrowUp,
  Clock,
  AlertTriangle,
} from "lucide-react";

type CheckResult = {
  id: string;
  url: string;
  status: number;
  time: number;
  up: boolean;
  cors: boolean;
  timestamp: Date;
};

const INPUT_CLASS =
  "w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10";

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

async function checkUrl(url: string): Promise<Omit<CheckResult, "id" | "url" | "timestamp">> {
  try {
    const start = performance.now();
    const res = await fetch(url, { mode: "cors", cache: "no-store" });
    const time = performance.now() - start;
    return { status: res.status, time, up: true, cors: true };
  } catch {
    try {
      const start2 = performance.now();
      await fetch(url, { mode: "no-cors", cache: "no-store" });
      const time = performance.now() - start2;
      return { status: 0, time, up: true, cors: false };
    } catch {
      return { status: 0, time: 0, up: false, cors: false };
    }
  }
}

function latencyColor(ms: number): string {
  if (ms < 200) return "bg-emerald-400";
  if (ms < 500) return "bg-yellow-400";
  return "bg-red-400";
}

function latencyTextColor(ms: number): string {
  if (ms < 200) return "text-emerald-400";
  if (ms < 500) return "text-yellow-400";
  return "text-red-400";
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function UptimeChecker() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<CheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isRunningBatch, setIsRunningBatch] = useState(false);
  const abortRef = useRef(false);

  const runSingleCheck = useCallback(async () => {
    const normalized = normalizeUrl(url);
    if (!normalized) return;
    setIsChecking(true);
    try {
      const result = await checkUrl(normalized);
      setResults((prev) => [
        {
          ...result,
          id: crypto.randomUUID(),
          url: normalized,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    } finally {
      setIsChecking(false);
    }
  }, [url]);

  const runBatchCheck = useCallback(async () => {
    const normalized = normalizeUrl(url);
    if (!normalized) return;
    setIsRunningBatch(true);
    abortRef.current = false;
    try {
      for (let i = 0; i < 5; i++) {
        if (abortRef.current) break;
        const result = await checkUrl(normalized);
        setResults((prev) => [
          {
            ...result,
            id: crypto.randomUUID(),
            url: normalized,
            timestamp: new Date(),
          },
          ...prev,
        ]);
        if (i < 4 && !abortRef.current) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    } finally {
      setIsRunningBatch(false);
    }
  }, [url]);

  const clearResults = useCallback(() => {
    abortRef.current = true;
    setResults([]);
    setIsRunningBatch(false);
    setIsChecking(false);
  }, []);

  const upResults = results.filter((r) => r.up);
  const stats =
    upResults.length > 0
      ? {
          avg: upResults.reduce((s, r) => s + r.time, 0) / upResults.length,
          min: Math.min(...upResults.map((r) => r.time)),
          max: Math.max(...upResults.map((r) => r.time)),
          upCount: upResults.length,
          downCount: results.length - upResults.length,
        }
      : null;

  // Scale the latency bar relative to the max observed time, capped at 2000ms
  const maxBar = stats ? Math.max(stats.max, 200) : 200;

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-12">
      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-5 font-display text-lg font-semibold text-foreground">
            Check URL
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                URL
              </label>
              <input
                type="text"
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !isChecking && runSingleCheck()
                }
                className={INPUT_CLASS}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={runSingleCheck}
                disabled={isChecking || isRunningBatch || !url.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-foreground/90 px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
              >
                {isChecking ? (
                  <RotateCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Check
              </button>
              <button
                onClick={isRunningBatch ? () => (abortRef.current = true) : runBatchCheck}
                disabled={isChecking || !url.trim()}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                  isRunningBatch
                    ? "border-red-400/30 bg-red-400/10 text-red-400 hover:bg-red-400/20"
                    : "border-border/50 bg-surface/30 text-foreground hover:border-foreground/15 hover:text-foreground disabled:opacity-50"
                )}
              >
                {isRunningBatch ? (
                  <>
                    <RotateCw className="h-4 w-4 animate-spin" />
                    Stop
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Run 5x
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm"
          >
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
              Stats
            </h2>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border/30 bg-background/30 p-3 text-center">
                <p className="text-[11px] font-medium text-muted-foreground/60">
                  Avg
                </p>
                <p
                  className={cn(
                    "mt-1 font-mono text-lg font-semibold",
                    latencyTextColor(stats.avg)
                  )}
                >
                  {Math.round(stats.avg)}
                </p>
                <p className="text-[10px] text-muted-foreground/40">ms</p>
              </div>
              <div className="rounded-lg border border-border/30 bg-background/30 p-3 text-center">
                <p className="text-[11px] font-medium text-muted-foreground/60">
                  Min
                </p>
                <p className="mt-1 font-mono text-lg font-semibold text-emerald-400">
                  {Math.round(stats.min)}
                </p>
                <p className="text-[10px] text-muted-foreground/40">ms</p>
              </div>
              <div className="rounded-lg border border-border/30 bg-background/30 p-3 text-center">
                <p className="text-[11px] font-medium text-muted-foreground/60">
                  Max
                </p>
                <p
                  className={cn(
                    "mt-1 font-mono text-lg font-semibold",
                    latencyTextColor(stats.max)
                  )}
                >
                  {Math.round(stats.max)}
                </p>
                <p className="text-[10px] text-muted-foreground/40">ms</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground/60">
              <span className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3 text-emerald-400" />
                {stats.upCount} up
              </span>
              {stats.downCount > 0 && (
                <span className="flex items-center gap-1">
                  <ArrowDown className="h-3 w-3 text-red-400" />
                  {stats.downCount} down
                </span>
              )}
              <span className="ml-auto">
                {results.length} check{results.length !== 1 && "s"}
              </span>
            </div>
          </motion.div>
        )}

        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/40">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
          Checked from your browser. CORS restrictions may affect status codes.
          Latency includes network overhead.
        </p>
      </div>

      <div>
        {results.length === 0 ? (
          <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-dashed border-border/40 p-12">
            <div className="text-center">
              <Globe className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="font-display text-lg font-medium text-muted-foreground">
                Enter a URL and hit Check
              </p>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Measure uptime and response latency from your browser.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Results
              </h2>
              <button
                onClick={clearResults}
                className="text-xs text-muted-foreground/50 transition-colors hover:text-foreground"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {results.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg border border-border/40 bg-surface/20 p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                              r.up
                                ? "bg-emerald-400/10 text-emerald-400"
                                : "bg-red-400/10 text-red-400"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                r.up ? "bg-emerald-400" : "bg-red-400"
                              )}
                            />
                            {r.up ? "UP" : "DOWN"}
                          </span>

                          {r.up && r.cors && r.status > 0 && (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs font-medium",
                                r.status >= 200 && r.status < 300
                                  ? "bg-emerald-400/10 text-emerald-400"
                                  : r.status >= 300 && r.status < 400
                                    ? "bg-blue-400/10 text-blue-400"
                                    : "bg-yellow-400/10 text-yellow-400"
                              )}
                            >
                              {r.status}
                            </span>
                          )}

                          {r.up && !r.cors && (
                            <span className="rounded-full bg-blue-400/10 px-2 py-0.5 text-xs font-medium text-blue-400">
                              Reachable
                            </span>
                          )}
                        </div>

                        {r.up && (
                          <div className="mt-2.5">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${Math.min((r.time / Math.min(maxBar, 2000)) * 100, 100)}%`,
                                  }}
                                  transition={{ duration: 0.4, ease: "easeOut" }}
                                  className={cn(
                                    "h-full rounded-full",
                                    latencyColor(r.time)
                                  )}
                                />
                              </div>
                              <span
                                className={cn(
                                  "shrink-0 font-mono text-sm font-semibold",
                                  latencyTextColor(r.time)
                                )}
                              >
                                {Math.round(r.time)}ms
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground/40">
                        <Clock className="h-3 w-3" />
                        {formatTime(r.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
