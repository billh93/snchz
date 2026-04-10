"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Braces,
  KeyRound,
  Clock,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  AlignLeft,
  Minimize2,
  CircleCheck,
  CircleX,
  ListTree,
} from "lucide-react";

function base64UrlDecode(str: string): string {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return decodeURIComponent(
    atob(s)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

function extractErrorLine(input: string, error: unknown): number | undefined {
  const msg = (error as Error).message;
  const posMatch = msg.match(/position\s+(\d+)/i);
  if (posMatch) {
    return input.slice(0, parseInt(posMatch[1])).split("\n").length;
  }
  const lineMatch = msg.match(/line\s+(\d+)/i);
  if (lineMatch) return parseInt(lineMatch[1]);
  return undefined;
}

function parseCronField(field: string, min: number, max: number): number[] {
  const values = new Set<number>();
  for (const part of field.split(",")) {
    if (part.includes("/")) {
      const [range, stepStr] = part.split("/");
      const step = parseInt(stepStr);
      if (isNaN(step) || step <= 0) continue;
      const start = range === "*" ? min : parseInt(range);
      for (let i = start; i <= max; i += step) values.add(i);
    } else if (part === "*") {
      for (let i = min; i <= max; i++) values.add(i);
    } else if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = a; i <= b; i++) values.add(i);
    } else {
      let v = parseInt(part);
      if (max === 6 && v === 7) v = 0;
      if (!isNaN(v)) values.add(v);
    }
  }
  return Array.from(values).sort((a, b) => a - b);
}

function getNextExecutions(expr: string, count: number): Date[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  const minutes = parseCronField(parts[0], 0, 59);
  const hours = parseCronField(parts[1], 0, 23);
  const doms = parseCronField(parts[2], 1, 31);
  const months = parseCronField(parts[3], 1, 12);
  const dows = parseCronField(parts[4], 0, 6);
  if (!minutes.length || !hours.length || !doms.length || !months.length || !dows.length) return [];

  const results: Date[] = [];
  const cur = new Date();
  cur.setSeconds(0, 0);
  cur.setMinutes(cur.getMinutes() + 1);
  let iterations = 0;
  const MAX = 1_050_000;

  while (results.length < count && iterations < MAX) {
    if (
      minutes.includes(cur.getMinutes()) &&
      hours.includes(cur.getHours()) &&
      doms.includes(cur.getDate()) &&
      months.includes(cur.getMonth() + 1) &&
      dows.includes(cur.getDay())
    ) {
      results.push(new Date(cur));
    }
    cur.setMinutes(cur.getMinutes() + 1);
    iterations++;
  }
  return results;
}

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression (expected 5 fields)";
  const [min, hour, dom, mon, dow] = parts;

  const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MON = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const ordinal = (n: number) => {
    if (n >= 11 && n <= 13) return `${n}th`;
    const s = ["th", "st", "nd", "rd"];
    return `${n}${s[n % 10] || "th"}`;
  };

  const formatTime = (h: number, m: number) => {
    if (h === 0 && m === 0) return "midnight";
    if (h === 12 && m === 0) return "noon";
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
  };

  const segs: string[] = [];

  if (min === "*" && hour === "*") {
    segs.push("Every minute");
  } else if (min.startsWith("*/") && hour === "*") {
    segs.push(`Every ${min.slice(2)} minutes`);
  } else if (hour.startsWith("*/") && !min.includes("*")) {
    segs.push(`At minute ${min} every ${hour.slice(2)} hours`);
  } else if (hour === "*" && !min.includes("*") && !min.includes("/")) {
    segs.push(min === "0" ? "At the start of every hour" : `At minute ${min} of every hour`);
  } else if (min.startsWith("*/") && hour !== "*") {
    segs.push(`Every ${min.slice(2)} minutes during hour ${hour}`);
  } else {
    const h = parseInt(hour);
    const m = parseInt(min);
    if (!isNaN(h) && !isNaN(m)) {
      segs.push(`At ${formatTime(h, m)}`);
    } else {
      segs.push(`At ${hour}:${min}`);
    }
  }

  if (dom !== "*") {
    if (dom.includes(",")) {
      segs.push(`on the ${dom.split(",").map((d) => ordinal(parseInt(d))).join(" and ")}`);
    } else if (dom.includes("-")) {
      const [a, b] = dom.split("-").map(Number);
      segs.push(`on the ${ordinal(a)} through ${ordinal(b)}`);
    } else {
      segs.push(`on the ${ordinal(parseInt(dom))}`);
    }
  }

  if (mon !== "*") {
    if (mon.includes(",")) {
      segs.push(`in ${mon.split(",").map((m) => MON[parseInt(m)] || m).join(", ")}`);
    } else {
      segs.push(`in ${MON[parseInt(mon)] || mon}`);
    }
  }

  if (dow !== "*") {
    if (dow === "1-5") {
      segs.push("on weekdays");
    } else if (dow === "0,6" || dow === "6,0") {
      segs.push("on weekends");
    } else if (dow.includes("-")) {
      const [a, b] = dow.split("-").map(Number);
      segs.push(`${DOW[a]} through ${DOW[b]}`);
    } else if (dow.includes(",")) {
      segs.push(`on ${dow.split(",").map((d) => DOW[parseInt(d) === 7 ? 0 : parseInt(d)]).join(", ")}`);
    } else {
      const d = parseInt(dow) === 7 ? 0 : parseInt(dow);
      segs.push(`on ${DOW[d]}`);
    }
  }

  return segs.join(" ");
}

function JsonTreeNode({
  name,
  value,
  depth = 0,
}: {
  name?: string;
  value: unknown;
  depth?: number;
}) {
  const isExpandable = value !== null && typeof value === "object";
  const count = isExpandable
    ? Array.isArray(value) ? value.length : Object.keys(value as Record<string, unknown>).length
    : 0;
  const [expanded, setExpanded] = useState(depth < 2 || count <= 5);

  if (value === null || typeof value !== "object") {
    const rendered =
      value === null ? (
        <span className="italic text-muted-foreground">null</span>
      ) : typeof value === "boolean" ? (
        <span className="text-orange-400">{String(value)}</span>
      ) : typeof value === "number" ? (
        <span className="text-sky-400">{value}</span>
      ) : (
        <span className="text-emerald-400">&quot;{String(value)}&quot;</span>
      );

    return (
      <div className="flex items-baseline gap-1.5 py-px font-mono text-xs">
        {name !== undefined && (
          <span className="text-foreground/60">{name}:</span>
        )}
        {rendered}
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries: [string, unknown][] = isArray
    ? value.map((v, i) => [String(i), v])
    : Object.entries(value as Record<string, unknown>);
  const bracket = isArray ? ["[", "]"] : ["{", "}"];

  return (
    <div className="font-mono text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 py-px transition-colors hover:text-foreground"
      >
        {expanded ? (
          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
        )}
        {name !== undefined && (
          <span className="text-foreground/60">{name}:</span>
        )}
        <span className="text-muted-foreground/70">
          {bracket[0]}
          {!expanded && (
            <span>
              {" "}{count} {isArray ? "items" : "keys"}{" "}
            </span>
          )}
          {!expanded && bracket[1]}
        </span>
      </button>
      {expanded && (
        <div className="ml-3 border-l border-border/30 pl-3">
          {entries.length === 0 ? (
            <span className="py-px text-muted-foreground/50 italic">empty</span>
          ) : (
            entries.map(([key, val]) => (
              <JsonTreeNode key={key} name={key} value={val} depth={depth + 1} />
            ))
          )}
          <span className="text-muted-foreground/70">{bracket[1]}</span>
        </div>
      )}
    </div>
  );
}

type Tab = "json" | "jwt" | "cron";
type JsonResult = {
  type: "formatted" | "minified" | "valid" | "error";
  text: string;
  line?: number;
};

const CRON_PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 min", value: "*/5 * * * *" },
  { label: "Hourly", value: "0 * * * *" },
  { label: "Daily midnight", value: "0 0 * * *" },
  { label: "Weekly Monday", value: "0 0 * * 1" },
  { label: "Monthly 1st", value: "0 0 1 * *" },
];

const inputClass =
  "w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10";

export function JsonDebugger() {
  const [activeTab, setActiveTab] = useState<Tab>("json");
  const [copied, setCopied] = useState(false);

  const [jsonInput, setJsonInput] = useState("");
  const [jsonResult, setJsonResult] = useState<JsonResult | null>(null);
  const [showTree, setShowTree] = useState(false);
  const [parsedJson, setParsedJson] = useState<unknown>(null);

  const [jwtInput, setJwtInput] = useState("");

  const [cronInput, setCronInput] = useState("0 0 * * *");

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleFormat = useCallback(() => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setParsedJson(parsed);
      setJsonResult({ type: "formatted", text: JSON.stringify(parsed, null, 2) });
      setShowTree(false);
    } catch (e) {
      setParsedJson(null);
      setJsonResult({
        type: "error",
        text: (e as Error).message,
        line: extractErrorLine(jsonInput, e),
      });
      setShowTree(false);
    }
  }, [jsonInput]);

  const handleMinify = useCallback(() => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setParsedJson(parsed);
      setJsonResult({ type: "minified", text: JSON.stringify(parsed) });
      setShowTree(false);
    } catch (e) {
      setParsedJson(null);
      setJsonResult({
        type: "error",
        text: (e as Error).message,
        line: extractErrorLine(jsonInput, e),
      });
      setShowTree(false);
    }
  }, [jsonInput]);

  const handleValidate = useCallback(() => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setParsedJson(parsed);
      setJsonResult({ type: "valid", text: "Valid JSON" });
    } catch (e) {
      setParsedJson(null);
      setJsonResult({
        type: "error",
        text: (e as Error).message,
        line: extractErrorLine(jsonInput, e),
      });
    }
  }, [jsonInput]);

  const handleToggleTree = useCallback(() => {
    if (showTree) {
      setShowTree(false);
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      setParsedJson(parsed);
      setShowTree(true);
      setJsonResult(null);
    } catch (e) {
      setJsonResult({
        type: "error",
        text: (e as Error).message,
        line: extractErrorLine(jsonInput, e),
      });
    }
  }, [jsonInput, showTree]);

  const jwtDecoded = useMemo(() => {
    if (!jwtInput.trim()) return null;
    const parts = jwtInput.trim().split(".");
    if (parts.length !== 3) return { error: "Invalid JWT format (expected 3 dot-separated parts)" };
    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      return { header, payload, signature: parts[2] };
    } catch {
      return { error: "Failed to decode JWT — check that the token is valid" };
    }
  }, [jwtInput]);

  const cronResult = useMemo(() => {
    const trimmed = cronInput.trim();
    if (!trimmed) return null;
    const parts = trimmed.split(/\s+/);
    if (parts.length !== 5) return { error: "Expected 5 space-separated fields" };
    try {
      return {
        description: describeCron(trimmed),
        nextRuns: getNextExecutions(trimmed, 5),
      };
    } catch {
      return { error: "Failed to parse cron expression" };
    }
  }, [cronInput]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "json", label: "JSON", icon: <Braces className="h-4 w-4" /> },
    { id: "jwt", label: "JWT", icon: <KeyRound className="h-4 w-4" /> },
    { id: "cron", label: "Cron", icon: <Clock className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-lg border border-border/50 bg-surface/20 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-foreground/[0.06] text-foreground/80"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === "json" && (
            <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground/80">
                    Input
                  </label>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='{"key": "value", "nested": {"array": [1, 2, 3]}}'
                    rows={14}
                    spellCheck={false}
                    className={cn(inputClass, "resize-none font-mono text-xs")}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleFormat}
                      disabled={!jsonInput.trim()}
                      className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/15 hover:text-foreground disabled:opacity-40"
                    >
                      <AlignLeft className="h-3.5 w-3.5" />
                      Format
                    </button>
                    <button
                      onClick={handleMinify}
                      disabled={!jsonInput.trim()}
                      className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/15 hover:text-foreground disabled:opacity-40"
                    >
                      <Minimize2 className="h-3.5 w-3.5" />
                      Minify
                    </button>
                    <button
                      onClick={handleValidate}
                      disabled={!jsonInput.trim()}
                      className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/15 hover:text-foreground disabled:opacity-40"
                    >
                      <CircleCheck className="h-3.5 w-3.5" />
                      Validate
                    </button>
                    <button
                      onClick={handleToggleTree}
                      disabled={!jsonInput.trim()}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-40",
                        showTree
                          ? "border-foreground/20 bg-foreground/[0.06] text-foreground/80"
                          : "border-border/60 bg-surface/30 text-muted-foreground hover:border-foreground/15 hover:text-foreground"
                      )}
                    >
                      <ListTree className="h-3.5 w-3.5" />
                      Tree
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground/80">
                      Output
                    </label>
                    {jsonResult?.type === "formatted" || jsonResult?.type === "minified" ? (
                      <button
                        onClick={() => handleCopy(jsonResult.text)}
                        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {copied ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    ) : null}
                  </div>

                  <div className="min-h-[340px] rounded-lg border border-border/30 bg-background/30 p-4">
                    {showTree && parsedJson !== undefined ? (
                      <JsonTreeNode value={parsedJson} />
                    ) : jsonResult?.type === "valid" ? (
                      <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <CircleCheck className="h-4 w-4" />
                        Valid JSON
                      </div>
                    ) : jsonResult?.type === "error" ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-red-400">
                          <CircleX className="h-4 w-4 shrink-0" />
                          Invalid JSON
                        </div>
                        <p className="text-xs text-red-400/70">{jsonResult.text}</p>
                        {jsonResult.line && (
                          <p className="text-xs text-muted-foreground">
                            Near line {jsonResult.line}
                          </p>
                        )}
                      </div>
                    ) : jsonResult ? (
                      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/90">
                        {jsonResult.text}
                      </pre>
                    ) : (
                      <p className="text-sm text-muted-foreground/40">
                        Paste JSON and use the tools to format, minify, validate, or explore as a tree.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "jwt" && (
            <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
              <div className="space-y-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                    JWT Token
                  </label>
                  <textarea
                    value={jwtInput}
                    onChange={(e) => setJwtInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
                    rows={3}
                    spellCheck={false}
                    className={cn(inputClass, "resize-none break-all font-mono text-xs")}
                  />
                </div>

                {jwtDecoded && "error" in jwtDecoded && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-400">
                    <CircleX className="h-4 w-4 shrink-0" />
                    {jwtDecoded.error}
                  </div>
                )}

                {jwtDecoded && "header" in jwtDecoded && (
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-sky-400">
                        <span className="h-2 w-2 rounded-full bg-sky-400" />
                        Header
                      </h3>
                      <pre className="rounded-lg border border-sky-400/10 bg-sky-400/5 p-4 font-mono text-xs leading-relaxed text-foreground/90">
                        {JSON.stringify(jwtDecoded.header, null, 2)}
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                        <span className="h-2 w-2 rounded-full bg-foreground" />
                        Payload
                      </h3>
                      <pre className="rounded-lg border border-foreground/10 bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground/90">
                        {JSON.stringify(jwtDecoded.payload, null, 2)}
                      </pre>
                      {(() => {
                        const payload = jwtDecoded.payload as Record<string, unknown>;
                        if (typeof payload.exp !== "number") return null;
                        const expDate = new Date(payload.exp * 1000);
                        const isExpired = expDate < new Date();
                        return (
                          <div
                            className={cn(
                              "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium",
                              isExpired
                                ? "bg-red-400/10 text-red-400"
                                : "bg-emerald-400/10 text-emerald-400"
                            )}
                          >
                            {isExpired ? (
                              <CircleX className="h-3.5 w-3.5" />
                            ) : (
                              <CircleCheck className="h-3.5 w-3.5" />
                            )}
                            {isExpired ? "Expired" : "Valid"} — {expDate.toLocaleString()}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                        Signature
                      </h3>
                      <div className="rounded-lg border border-border/30 bg-background/30 p-4">
                        <p className="break-all font-mono text-xs text-muted-foreground/70">
                          {jwtDecoded.signature}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground/50">
                          <span>
                            Algorithm:{" "}
                            <span className="font-medium text-foreground/60">
                              {(jwtDecoded.header as Record<string, unknown>).alg as string || "unknown"}
                            </span>
                          </span>
                          <span className="text-border">•</span>
                          <span>Signature verification is not performed client-side</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!jwtDecoded && (
                  <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border/40">
                    <p className="text-sm text-muted-foreground/40">
                      Paste a JWT token above to decode it
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "cron" && (
            <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
              <div className="space-y-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                    Cron Expression
                    <span className="ml-2 font-mono text-xs text-muted-foreground/50">
                      min hour day month weekday
                    </span>
                  </label>
                  <input
                    type="text"
                    value={cronInput}
                    onChange={(e) => setCronInput(e.target.value)}
                    placeholder="* * * * *"
                    spellCheck={false}
                    className={cn(inputClass, "font-mono")}
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground/50">
                    Presets
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CRON_PRESETS.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setCronInput(p.value)}
                        className={cn(
                          "rounded-md border px-2.5 py-1 text-xs transition-colors",
                          cronInput === p.value
                            ? "border-foreground/20 bg-foreground/[0.06] text-foreground/80"
                            : "border-border/50 text-muted-foreground hover:border-foreground/15 hover:text-foreground"
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {cronResult && "error" in cronResult ? (
                  <div className="flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-400">
                    <CircleX className="h-4 w-4 shrink-0" />
                    {cronResult.error}
                  </div>
                ) : cronResult ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-foreground/10 bg-foreground/[0.04] px-4 py-3">
                      <p className="text-sm font-medium text-foreground/80">
                        {cronResult.description}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-medium text-muted-foreground/50">
                        Next 5 executions
                      </p>
                      {cronResult.nextRuns.length > 0 ? (
                        <div className="space-y-1">
                          {cronResult.nextRuns.map((date, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 rounded-md bg-background/30 px-3 py-1.5 font-mono text-xs text-foreground/80"
                            >
                              <span className="text-muted-foreground/40">
                                {i + 1}.
                              </span>
                              {date.toLocaleString(undefined, {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground/50">
                          No executions found within the next 2 years
                        </p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
