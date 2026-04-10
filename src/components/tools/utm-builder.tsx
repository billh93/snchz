"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Copy, Check, Link, Trash2, Save, FolderOpen } from "lucide-react";

type UtmParams = {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
};

type SavedPreset = {
  name: string;
  params: Omit<UtmParams, "baseUrl">;
};

const EMPTY_PARAMS: UtmParams = {
  baseUrl: "",
  source: "",
  medium: "",
  campaign: "",
  term: "",
  content: "",
};

const SOURCE_PRESETS: { label: string; params: Partial<UtmParams> }[] = [
  { label: "Google Ads", params: { source: "google", medium: "cpc" } },
  { label: "Facebook", params: { source: "facebook", medium: "paid_social" } },
  { label: "Twitter", params: { source: "twitter", medium: "social" } },
  { label: "LinkedIn", params: { source: "linkedin", medium: "social" } },
  { label: "Email", params: { source: "email", medium: "email" } },
  { label: "Newsletter", params: { source: "newsletter", medium: "email" } },
];

const INPUT_CLASS =
  "w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-golden/40 focus:outline-none focus:ring-1 focus:ring-golden/20";

const STORAGE_KEY = "snchz-utm-presets";

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function loadPresets(): SavedPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function UtmBuilder() {
  const [params, setParams] = useState<UtmParams>(EMPTY_PARAMS);
  const [copied, setCopied] = useState(false);
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    setSavedPresets(loadPresets());
  }, []);

  const urlError = params.baseUrl.length > 0 && !isValidUrl(params.baseUrl);

  const builtUrl = useMemo(() => {
    if (!params.baseUrl || !isValidUrl(params.baseUrl)) return "";
    try {
      const url = new URL(params.baseUrl);
      if (params.source) url.searchParams.set("utm_source", params.source);
      if (params.medium) url.searchParams.set("utm_medium", params.medium);
      if (params.campaign) url.searchParams.set("utm_campaign", params.campaign);
      if (params.term) url.searchParams.set("utm_term", params.term);
      if (params.content) url.searchParams.set("utm_content", params.content);
      return url.toString();
    } catch {
      return "";
    }
  }, [params]);

  const handleCopy = useCallback(async () => {
    if (!builtUrl) return;
    await navigator.clipboard.writeText(builtUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [builtUrl]);

  const handleSavePreset = useCallback(() => {
    if (!presetName.trim()) return;
    const preset: SavedPreset = {
      name: presetName.trim(),
      params: {
        source: params.source,
        medium: params.medium,
        campaign: params.campaign,
        term: params.term,
        content: params.content,
      },
    };
    const next = [...savedPresets.filter((p) => p.name !== preset.name), preset];
    setSavedPresets(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setPresetName("");
  }, [presetName, params, savedPresets]);

  const handleLoadPreset = useCallback((preset: SavedPreset) => {
    setParams((prev) => ({ ...prev, ...preset.params }));
    setShowPresets(false);
  }, []);

  const handleDeletePreset = useCallback(
    (name: string) => {
      const next = savedPresets.filter((p) => p.name !== name);
      setSavedPresets(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    },
    [savedPresets]
  );

  const update = (key: keyof UtmParams) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setParams((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-12">
      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-5 font-display text-lg font-semibold text-foreground">Parameters</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Base URL <span className="text-golden/70">*</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/page"
                value={params.baseUrl}
                onChange={update("baseUrl")}
                className={cn(INPUT_CLASS, urlError && "border-red-400/50 focus:border-red-400/60 focus:ring-red-400/20")}
              />
              {urlError && (
                <p className="mt-1 text-xs text-red-400">Enter a valid URL including https://</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">utm_source</label>
              <input
                type="text"
                placeholder="google, facebook, newsletter"
                value={params.source}
                onChange={update("source")}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">utm_medium</label>
              <input
                type="text"
                placeholder="cpc, social, email"
                value={params.medium}
                onChange={update("medium")}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">utm_campaign</label>
              <input
                type="text"
                placeholder="spring_sale, product_launch"
                value={params.campaign}
                onChange={update("campaign")}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                utm_term <span className="text-muted-foreground/40 text-xs font-normal">optional</span>
              </label>
              <input
                type="text"
                placeholder="running+shoes, best+saas"
                value={params.term}
                onChange={update("term")}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                utm_content <span className="text-muted-foreground/40 text-xs font-normal">optional</span>
              </label>
              <input
                type="text"
                placeholder="hero_cta, sidebar_banner"
                value={params.content}
                onChange={update("content")}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <button
            onClick={() => setParams(EMPTY_PARAMS)}
            className="mt-5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Reset all fields
          </button>
        </div>

        {/* Quick presets */}
        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-4 font-display text-sm font-semibold text-foreground">Quick Fill</h2>
          <div className="flex flex-wrap gap-2">
            {SOURCE_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setParams((prev) => ({ ...prev, ...p.params }))}
                className="rounded-md border border-border/40 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-golden/30 hover:text-golden"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save / Load presets */}
        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-4 font-display text-sm font-semibold text-foreground">Saved Presets</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSavePreset()}
              className={cn(INPUT_CLASS, "text-xs")}
            />
            <button
              onClick={handleSavePreset}
              disabled={!presetName.trim()}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/50 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-golden/30 hover:text-golden disabled:opacity-40"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>
          </div>
          {savedPresets.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {savedPresets.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between rounded-md border border-border/30 px-3 py-2"
                >
                  <button
                    onClick={() => handleLoadPreset(p)}
                    className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <FolderOpen className="h-3 w-3" />
                    {p.name}
                  </button>
                  <button
                    onClick={() => handleDeletePreset(p.name)}
                    className="text-muted-foreground/40 transition-colors hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {savedPresets.length === 0 && (
            <p className="mt-2 text-[11px] text-muted-foreground/40">No saved presets yet</p>
          )}
        </div>
      </div>

      {/* Result */}
      <div>
        {!builtUrl ? (
          <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-dashed border-border/40 p-12">
            <div className="text-center">
              <Link className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="font-display text-lg font-medium text-muted-foreground">
                Enter a base URL to build your tracked link
              </p>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Add UTM parameters to track campaign performance.
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-foreground">Generated URL</h3>
                <span className="text-[11px] text-muted-foreground/50">
                  {builtUrl.length} characters
                </span>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                <p className="break-all font-mono text-sm leading-relaxed text-foreground/90">
                  {builtUrl}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-golden/90 px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-golden"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy URL"}
              </button>
            </div>

            {/* Breakdown */}
            <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 font-display text-sm font-semibold text-foreground">Parameter Breakdown</h3>
              <div className="space-y-2">
                {[
                  { label: "Source", value: params.source, param: "utm_source" },
                  { label: "Medium", value: params.medium, param: "utm_medium" },
                  { label: "Campaign", value: params.campaign, param: "utm_campaign" },
                  { label: "Term", value: params.term, param: "utm_term" },
                  { label: "Content", value: params.content, param: "utm_content" },
                ]
                  .filter((p) => p.value)
                  .map((p) => (
                    <div
                      key={p.param}
                      className="flex items-center justify-between rounded-md border border-border/30 px-3 py-2"
                    >
                      <span className="font-mono text-xs text-golden/70">{p.param}</span>
                      <span className="text-sm text-foreground">{p.value}</span>
                    </div>
                  ))}
                {!params.source && !params.medium && !params.campaign && (
                  <p className="text-xs text-muted-foreground/50">Add parameters to see the breakdown</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
