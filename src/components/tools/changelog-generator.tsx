"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, escapeHtml } from "@/lib/utils";
import { Plus, Trash2, Download, Copy, Check, FileText } from "lucide-react";

type ChangeType = "Added" | "Changed" | "Fixed" | "Removed" | "Security";

type Entry = { id: string; type: ChangeType; description: string };

type Version = { id: string; version: string; date: string; entries: Entry[] };

const CHANGE_TYPES: { value: ChangeType; color: string; bg: string }[] = [
  { value: "Added", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
  { value: "Changed", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  { value: "Fixed", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30" },
  { value: "Removed", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30" },
  { value: "Security", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30" },
];

const TYPE_COLORS: Record<ChangeType, string> = {
  Added: "#4ade80",
  Changed: "#facc15",
  Fixed: "#60a5fa",
  Removed: "#f87171",
  Security: "#c084fc",
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const INPUT_CLASS =
  "w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-golden/40 focus:outline-none focus:ring-1 focus:ring-golden/20";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function generateMarkdown(versions: Version[]): string {
  const lines: string[] = ["# Changelog", "", "All notable changes to this project will be documented in this file.", ""];

  for (const v of versions) {
    lines.push(`## [${v.version || "Unreleased"}] - ${v.date || "TBD"}`);
    const grouped = new Map<ChangeType, string[]>();
    for (const e of v.entries) {
      if (!e.description.trim()) continue;
      if (!grouped.has(e.type)) grouped.set(e.type, []);
      grouped.get(e.type)!.push(e.description.trim());
    }
    for (const [type, items] of grouped) {
      lines.push(`### ${type}`);
      for (const item of items) {
        lines.push(`- ${item}`);
      }
      lines.push("");
    }
    if (grouped.size === 0) lines.push("");
  }
  return lines.join("\n");
}

function generateChangelogHTML(versions: Version[]): string {
  let entries = "";

  for (const v of versions) {
    const grouped = new Map<ChangeType, string[]>();
    for (const e of v.entries) {
      if (!e.description.trim()) continue;
      if (!grouped.has(e.type)) grouped.set(e.type, []);
      grouped.get(e.type)!.push(e.description.trim());
    }

    let sections = "";
    for (const [type, items] of grouped) {
      sections += `<div class="section">
<h3><span class="badge" style="background:${TYPE_COLORS[type]}20;color:${TYPE_COLORS[type]};border:1px solid ${TYPE_COLORS[type]}40">${type}</span></h3>
<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
</div>`;
    }

    entries += `<div class="version">
<h2><span class="version-tag">${escapeHtml(v.version) || "Unreleased"}</span><time>${escapeHtml(v.date) || "TBD"}</time></h2>
${sections}
</div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Changelog</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;color:#e5e5e5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:3rem 1.5rem;line-height:1.6}
.container{max-width:720px;margin:0 auto}
h1{font-size:2rem;font-weight:700;margin-bottom:0.5rem;color:#fff}
.subtitle{color:#888;margin-bottom:3rem;font-size:0.95rem}
.version{margin-bottom:2.5rem;padding-bottom:2.5rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.version:last-child{border-bottom:none}
h2{display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;font-size:1.1rem;font-weight:600;color:#fff}
.version-tag{font-family:ui-monospace,SFMono-Regular,monospace;font-size:0.95rem}
time{color:#666;font-size:0.85rem;font-weight:400}
.section{margin-bottom:1rem}
h3{margin-bottom:0.5rem}
.badge{display:inline-block;padding:0.15rem 0.6rem;border-radius:6px;font-size:0.75rem;font-weight:600;letter-spacing:0.02em}
ul{list-style:none;padding-left:0}
li{position:relative;padding:0.3rem 0 0.3rem 1.25rem;font-size:0.9rem;color:#ccc}
li::before{content:"";position:absolute;left:0;top:0.75rem;width:5px;height:5px;border-radius:50%;background:#444}
</style>
</head>
<body>
<div class="container">
<h1>Changelog</h1>
<p class="subtitle">All notable changes to this project.</p>
${entries}
</div>
</body>
</html>`;
}

export function ChangelogGenerator() {
  const [versions, setVersions] = useState<Version[]>([
    {
      id: uid(),
      version: "1.0.0",
      date: todayStr(),
      entries: [{ id: uid(), type: "Added", description: "" }],
    },
  ]);
  const [copiedState, setCopiedState] = useState<"html" | "md" | null>(null);

  const addVersion = () =>
    setVersions((prev) => [
      {
        id: uid(),
        version: "",
        date: todayStr(),
        entries: [{ id: uid(), type: "Added", description: "" }],
      },
      ...prev,
    ]);

  const removeVersion = (vid: string) =>
    setVersions((prev) => (prev.length > 1 ? prev.filter((v) => v.id !== vid) : prev));

  const updateVersion = (vid: string, field: "version" | "date", value: string) =>
    setVersions((prev) => prev.map((v) => (v.id === vid ? { ...v, [field]: value } : v)));

  const addEntry = (vid: string) =>
    setVersions((prev) =>
      prev.map((v) =>
        v.id === vid
          ? { ...v, entries: [...v.entries, { id: uid(), type: "Added", description: "" }] }
          : v
      )
    );

  const removeEntry = (vid: string, eid: string) =>
    setVersions((prev) =>
      prev.map((v) =>
        v.id === vid
          ? { ...v, entries: v.entries.length > 1 ? v.entries.filter((e) => e.id !== eid) : v.entries }
          : v
      )
    );

  const updateEntry = (vid: string, eid: string, field: "type" | "description", value: string) =>
    setVersions((prev) =>
      prev.map((v) =>
        v.id === vid
          ? {
              ...v,
              entries: v.entries.map((e) => (e.id === eid ? { ...e, [field]: value } : e)),
            }
          : v
      )
    );

  const md = generateMarkdown(versions);
  const html = generateChangelogHTML(versions);

  const handleCopy = useCallback(
    async (format: "html" | "md") => {
      await navigator.clipboard.writeText(format === "html" ? html : md);
      setCopiedState(format);
      setTimeout(() => setCopiedState(null), 2000);
    },
    [html, md]
  );

  const handleDownload = useCallback(() => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "changelog.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [html]);

  return (
    <div className="grid gap-8 lg:grid-cols-[440px_1fr] lg:gap-10">
      {/* Editor Panel */}
      <div className="space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={addVersion}
            className="flex items-center gap-2 rounded-lg border border-dashed border-golden/30 px-3.5 py-2 text-sm font-medium text-golden transition-colors hover:bg-golden/5"
          >
            <Plus size={14} />
            Add Version
          </button>
        </div>

        <AnimatePresence initial={false}>
          {versions.map((v) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-foreground/60">
                        Version
                      </label>
                      <input
                        type="text"
                        placeholder="1.0.0"
                        value={v.version}
                        onChange={(e) => updateVersion(v.id, "version", e.target.value)}
                        className={cn(INPUT_CLASS, "font-mono")}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-foreground/60">
                        Date
                      </label>
                      <input
                        type="date"
                        value={v.date}
                        onChange={(e) => updateVersion(v.id, "date", e.target.value)}
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeVersion(v.id)}
                  className="mt-5 rounded p-1.5 text-muted-foreground transition-colors hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="space-y-3">
                {v.entries.map((entry) => (
                  <div key={entry.id} className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {CHANGE_TYPES.map((ct) => (
                        <button
                          key={ct.value}
                          onClick={() => updateEntry(v.id, entry.id, "type", ct.value)}
                          className={cn(
                            "rounded-md border px-2.5 py-1 text-xs font-medium transition-all",
                            entry.type === ct.value ? ct.bg : "border-border/30 text-muted-foreground hover:border-border"
                          )}
                        >
                          {ct.value}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Describe the change..."
                        value={entry.description}
                        onChange={(e) => updateEntry(v.id, entry.id, "description", e.target.value)}
                        className={cn(INPUT_CLASS, "flex-1")}
                      />
                      <button
                        onClick={() => removeEntry(v.id, entry.id)}
                        className="rounded p-2 text-muted-foreground transition-colors hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addEntry(v.id)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border/40 py-2 text-xs text-muted-foreground transition-colors hover:border-golden/30 hover:text-foreground"
              >
                <Plus size={12} />
                Add Entry
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-golden px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <Download size={15} />
            Download HTML
          </button>
          <button
            onClick={() => handleCopy("html")}
            className="flex items-center gap-2 rounded-lg border border-border/50 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface/50"
          >
            {copiedState === "html" ? (
              <Check size={15} className="text-green-400" />
            ) : (
              <Copy size={15} />
            )}
            HTML
          </button>
          <button
            onClick={() => handleCopy("md")}
            className="flex items-center gap-2 rounded-lg border border-border/50 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface/50"
          >
            {copiedState === "md" ? (
              <Check size={15} className="text-green-400" />
            ) : (
              <FileText size={15} />
            )}
            Markdown
          </button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText size={12} />
          Preview
        </div>
        <div className="overflow-hidden rounded-xl border border-border/30 bg-[#0a0a0a] p-8">
          <div className="max-w-lg">
            <h2 className="mb-1 text-2xl font-bold text-white">Changelog</h2>
            <p className="mb-8 text-sm text-[#888]">
              All notable changes to this project.
            </p>

            {versions.map((v, vi) => {
              const grouped = new Map<ChangeType, string[]>();
              for (const e of v.entries) {
                if (!e.description.trim()) continue;
                if (!grouped.has(e.type)) grouped.set(e.type, []);
                grouped.get(e.type)!.push(e.description.trim());
              }

              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "pb-6 mb-6",
                    vi < versions.length - 1 && "border-b border-white/[0.06]"
                  )}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-white">
                      {v.version || "Unreleased"}
                    </span>
                    <span className="text-xs text-[#666]">{v.date || "TBD"}</span>
                  </div>
                  {Array.from(grouped).map(([type, items]) => (
                    <div key={type} className="mb-3">
                      <span
                        className="mb-2 inline-block rounded-md border px-2 py-0.5 text-xs font-semibold"
                        style={{
                          background: `${TYPE_COLORS[type]}15`,
                          color: TYPE_COLORS[type],
                          borderColor: `${TYPE_COLORS[type]}30`,
                        }}
                      >
                        {type}
                      </span>
                      <ul className="mt-1.5 space-y-1">
                        {items.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2.5 text-sm text-[#ccc]"
                          >
                            <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#444]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {grouped.size === 0 && (
                    <p className="text-sm italic text-[#555]">No entries yet</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
