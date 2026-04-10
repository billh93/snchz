"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Download, Copy, Check, Eye } from "lucide-react";

type ServiceStatus = "operational" | "degraded" | "partial-outage" | "major-outage";

type Service = {
  id: string;
  name: string;
  status: ServiceStatus;
};

const STATUS_OPTIONS: { value: ServiceStatus; label: string; color: string; dot: string }[] = [
  { value: "operational", label: "Operational", color: "text-green-400", dot: "bg-green-400" },
  { value: "degraded", label: "Degraded", color: "text-yellow-400", dot: "bg-yellow-400" },
  { value: "partial-outage", label: "Partial Outage", color: "text-orange-400", dot: "bg-orange-400" },
  { value: "major-outage", label: "Major Outage", color: "text-red-400", dot: "bg-red-400" },
];

const DEFAULT_SERVICES: Service[] = [
  { id: "1", name: "API", status: "operational" },
  { id: "2", name: "Web App", status: "operational" },
  { id: "3", name: "Database", status: "operational" },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function generateHTML(companyName: string, services: Service[]): string {
  const overallStatus = services.every((s) => s.status === "operational")
    ? "All Systems Operational"
    : services.some((s) => s.status === "major-outage")
      ? "Major Outage"
      : services.some((s) => s.status === "partial-outage")
        ? "Partial Outage"
        : "Degraded Performance";

  const statusColor = services.every((s) => s.status === "operational")
    ? "#4ade80"
    : services.some((s) => s.status === "major-outage")
      ? "#f87171"
      : services.some((s) => s.status === "partial-outage")
        ? "#fb923c"
        : "#facc15";

  const serviceRows = services
    .map((s) => {
      const opt = STATUS_OPTIONS.find((o) => o.value === s.status)!;
      const dotColor =
        s.status === "operational" ? "#4ade80"
          : s.status === "degraded" ? "#facc15"
            : s.status === "partial-outage" ? "#fb923c" : "#f87171";
      return `      <div class="service">
        <span class="service-name">${escapeHtml(s.name)}</span>
        <span class="service-status">
          <span class="dot" style="background:${dotColor}"></span>
          ${escapeHtml(opt.label)}
        </span>
      </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(companyName)} Status</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #e5e5e5;
      min-height: 100vh;
      padding: 2rem 1rem;
    }
    .container { max-width: 640px; margin: 0 auto; }
    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 2rem;
      color: #fff;
    }
    .overall {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem;
      border-radius: 0.75rem;
      background: ${statusColor}11;
      border: 1px solid ${statusColor}33;
      margin-bottom: 2rem;
    }
    .overall-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: ${statusColor};
    }
    .overall-text {
      font-size: 1rem;
      font-weight: 600;
      color: ${statusColor};
    }
    .services {
      display: flex;
      flex-direction: column;
      gap: 1px;
      background: #1a1a1a;
      border-radius: 0.75rem;
      overflow: hidden;
      border: 1px solid #262626;
    }
    .service {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: #0f0f0f;
    }
    .service-name { font-weight: 500; }
    .service-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #a1a1a1;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .footer {
      margin-top: 3rem;
      text-align: center;
      font-size: 0.75rem;
      color: #525252;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${escapeHtml(companyName)} Status</h1>
    <div class="overall">
      <span class="overall-dot"></span>
      <span class="overall-text">${overallStatus}</span>
    </div>
    <div class="services">
${serviceRows}
    </div>
    <p class="footer">Last updated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function StatusPageGenerator() {
  const [companyName, setCompanyName] = useState("My Company");
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const addService = () => {
    setServices((prev) => [
      ...prev,
      { id: uid(), name: "", status: "operational" },
    ]);
  };

  const removeService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const updateService = (id: string, patch: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  };

  const html = generateHTML(companyName, services);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [html]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "status-page.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [html]);

  const overallOk = services.every((s) => s.status === "operational");

  return (
    <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-12">
      {/* Config Panel */}
      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-6 font-display text-lg font-semibold text-foreground">
            Configure
          </h2>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-foreground/80">
              Company / Product Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-golden/40 focus:outline-none focus:ring-1 focus:ring-golden/20"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground/80">
                Services
              </label>
              <button
                onClick={addService}
                className="flex items-center gap-1 text-xs text-golden transition-colors hover:text-golden/80"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>

            <AnimatePresence initial={false}>
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 rounded-lg border border-border/30 bg-background/30 p-2">
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) =>
                        updateService(service.id, { name: e.target.value })
                      }
                      placeholder="Service name"
                      className="flex-1 bg-transparent px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                    />
                    <select
                      value={service.status}
                      onChange={(e) =>
                        updateService(service.id, {
                          status: e.target.value as ServiceStatus,
                        })
                      }
                      className="rounded-md border border-border/30 bg-background/50 px-2 py-1 text-xs text-foreground focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeService(service.id)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-golden px-4 py-2.5 text-sm font-semibold text-golden-foreground transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            Download HTML
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-surface/30 px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-golden/30 hover:bg-surface/60"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setShowPreview((p) => !p)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
              showPreview
                ? "border-golden/40 bg-golden/10 text-golden"
                : "border-border/60 bg-surface/30 text-foreground hover:border-golden/30 hover:bg-surface/60"
            )}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div>
        {showPreview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-2 border-b border-border/30 bg-surface/30 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-muted-foreground/50">
                status.{companyName.toLowerCase().replace(/\s+/g, "")}.com
              </span>
            </div>
            <iframe
              srcDoc={html}
              title="Status page preview"
              className="h-[600px] w-full bg-black"
              sandbox=""
            />
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Live card preview */}
            <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
              <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                {companyName} Status
              </h3>

              <div
                className={cn(
                  "mb-6 flex items-center gap-3 rounded-lg border p-4",
                  overallOk
                    ? "border-green-400/20 bg-green-400/5"
                    : "border-yellow-400/20 bg-yellow-400/5"
                )}
              >
                <span
                  className={cn(
                    "h-3 w-3 rounded-full",
                    overallOk ? "bg-green-400" : "bg-yellow-400"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-semibold",
                    overallOk ? "text-green-400" : "text-yellow-400"
                  )}
                >
                  {overallOk ? "All Systems Operational" : "Some Issues Detected"}
                </span>
              </div>

              <div className="space-y-px overflow-hidden rounded-lg border border-border/30">
                {services.map((service) => {
                  const opt = STATUS_OPTIONS.find((o) => o.value === service.status)!;
                  return (
                    <div
                      key={service.id}
                      className="flex items-center justify-between bg-background/30 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {service.name || "Untitled"}
                      </span>
                      <span className="flex items-center gap-2 text-xs">
                        <span
                          className={cn("h-2 w-2 rounded-full", opt.dot)}
                        />
                        <span className={opt.color}>{opt.label}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground/50">
              Click the eye icon to see the full HTML preview, or download to get the file.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
