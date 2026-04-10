"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Copy, Check, Eye, AlertTriangle } from "lucide-react";

type Platform = "twitter" | "facebook" | "linkedin";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "twitter", label: "Twitter / X" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
];

const LIMITS = {
  title: 60,
  description: 155,
};

const INPUT_CLASS =
  "w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-golden/40 focus:outline-none focus:ring-1 focus:ring-golden/20";

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url || "example.com";
  }
}

export function OgPreview() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [copied, setCopied] = useState(false);

  const domain = extractDomain(siteUrl);

  const metaTags = useMemo(() => {
    const tags: string[] = [];
    if (title) {
      tags.push(`<meta property="og:title" content="${title}" />`);
      tags.push(`<meta name="twitter:title" content="${title}" />`);
    }
    if (description) {
      tags.push(`<meta property="og:description" content="${description}" />`);
      tags.push(`<meta name="twitter:description" content="${description}" />`);
    }
    if (imageUrl) {
      tags.push(`<meta property="og:image" content="${imageUrl}" />`);
      tags.push(`<meta name="twitter:image" content="${imageUrl}" />`);
    }
    if (siteUrl) {
      tags.push(`<meta property="og:url" content="${siteUrl}" />`);
    }
    tags.push(`<meta property="og:type" content="website" />`);
    tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
    return tags.join("\n");
  }, [title, description, imageUrl, siteUrl]);

  const handleCopy = useCallback(async () => {
    if (!metaTags) return;
    await navigator.clipboard.writeText(metaTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [metaTags]);

  const titleOverLimit = title.length > LIMITS.title;
  const descOverLimit = description.length > LIMITS.description;

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-12">
      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-5 font-display text-lg font-semibold text-foreground">Meta Info</h2>
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-foreground/80">
                  Title <span className="text-golden/70">*</span>
                </label>
                <span
                  className={cn(
                    "text-[11px]",
                    titleOverLimit ? "text-red-400" : "text-muted-foreground/40"
                  )}
                >
                  {title.length}/{LIMITS.title}
                </span>
              </div>
              <input
                type="text"
                placeholder="My Awesome Page"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={cn(INPUT_CLASS, titleOverLimit && "border-red-400/40")}
              />
              {titleOverLimit && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                  <AlertTriangle className="h-3 w-3" />
                  May be truncated in search results
                </p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-foreground/80">Description</label>
                <span
                  className={cn(
                    "text-[11px]",
                    descOverLimit ? "text-red-400" : "text-muted-foreground/40"
                  )}
                >
                  {description.length}/{LIMITS.description}
                </span>
              </div>
              <textarea
                placeholder="A brief description of your page..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={cn(INPUT_CLASS, "resize-none", descOverLimit && "border-red-400/40")}
              />
              {descOverLimit && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                  <AlertTriangle className="h-3 w-3" />
                  May be truncated on social platforms
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Image URL</label>
              <input
                type="url"
                placeholder="https://example.com/og-image.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={INPUT_CLASS}
              />
              <p className="mt-1 text-[11px] text-muted-foreground/40">
                Recommended: 1200×630px for best results
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Site URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Meta tags output */}
        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-foreground">Meta Tags</h2>
            <button
              onClick={handleCopy}
              disabled={!title}
              className="flex items-center gap-1.5 rounded-md border border-border/40 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-golden/30 hover:text-golden disabled:opacity-40"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="max-h-48 overflow-auto rounded-lg border border-border/30 bg-background/50 p-3 font-mono text-[11px] leading-relaxed text-foreground/70">
            {title ? metaTags : "Enter a title to generate meta tags..."}
          </pre>
        </div>
      </div>

      {/* Preview */}
      <div>
        {!title ? (
          <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-dashed border-border/40 p-12">
            <div className="text-center">
              <Eye className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="font-display text-lg font-medium text-muted-foreground">
                Enter a title to preview social cards
              </p>
              <p className="mt-2 text-sm text-muted-foreground/60">
                See how your link appears on Twitter, Facebook, and LinkedIn.
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
            {/* Platform tabs */}
            <div className="flex gap-1 rounded-lg border border-border/40 bg-background/30 p-1">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    platform === p.value
                      ? "bg-golden/15 text-golden"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-border/50 bg-surface/30 p-8 backdrop-blur-sm">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                {platform === "twitter" ? "Twitter / X" : platform === "facebook" ? "Facebook" : "LinkedIn"} Preview
              </p>

              {platform === "twitter" && (
                <TwitterCard title={title} description={description} imageUrl={imageUrl} domain={domain} />
              )}
              {platform === "facebook" && (
                <FacebookCard title={title} description={description} imageUrl={imageUrl} domain={domain} />
              )}
              {platform === "linkedin" && (
                <LinkedInCard title={title} description={description} imageUrl={imageUrl} domain={domain} />
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ImagePlaceholder({ aspect }: { aspect: string }) {
  return (
    <div className={cn("flex items-center justify-center bg-neutral-800", aspect)}>
      <div className="text-center">
        <Eye className="mx-auto h-8 w-8 text-neutral-600" />
        <p className="mt-1 text-xs text-neutral-600">No image set</p>
      </div>
    </div>
  );
}

function TwitterCard({
  title,
  description,
  imageUrl,
  domain,
}: {
  title: string;
  description: string;
  imageUrl: string;
  domain: string;
}) {
  return (
    <div className="mx-auto max-w-[520px] overflow-hidden rounded-2xl border border-neutral-700/60 bg-neutral-900">
      {imageUrl ? (
        <div className="aspect-[2/1] overflow-hidden bg-neutral-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ) : (
        <ImagePlaceholder aspect="aspect-[2/1]" />
      )}
      <div className="p-3">
        <p className="text-[13px] text-neutral-500">{domain}</p>
        <p className="mt-0.5 truncate text-[15px] font-bold text-neutral-100">{title}</p>
        {description && (
          <p className="mt-0.5 line-clamp-2 text-[13px] text-neutral-500">{description}</p>
        )}
      </div>
    </div>
  );
}

function FacebookCard({
  title,
  description,
  imageUrl,
  domain,
}: {
  title: string;
  description: string;
  imageUrl: string;
  domain: string;
}) {
  return (
    <div className="mx-auto max-w-[520px] overflow-hidden border border-neutral-700/50 bg-neutral-800/80">
      {imageUrl ? (
        <div className="aspect-[1.91/1] overflow-hidden bg-neutral-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ) : (
        <ImagePlaceholder aspect="aspect-[1.91/1]" />
      )}
      <div className="border-t border-neutral-700/40 px-3 py-2.5">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500">{domain}</p>
        <p className="mt-1 truncate text-[16px] font-semibold leading-tight text-neutral-100">{title}</p>
        {description && (
          <p className="mt-0.5 line-clamp-1 text-[13px] text-neutral-400">{description}</p>
        )}
      </div>
    </div>
  );
}

function LinkedInCard({
  title,
  description,
  imageUrl,
  domain,
}: {
  title: string;
  description: string;
  imageUrl: string;
  domain: string;
}) {
  return (
    <div className="mx-auto max-w-[520px] overflow-hidden rounded-lg border border-neutral-700/50 bg-neutral-800/60">
      {imageUrl ? (
        <div className="aspect-[1.91/1] overflow-hidden bg-neutral-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ) : (
        <ImagePlaceholder aspect="aspect-[1.91/1]" />
      )}
      <div className="border-t border-neutral-700/40 px-3 py-2.5">
        <p className="truncate text-[14px] font-semibold text-neutral-100">{title}</p>
        {description && (
          <p className="mt-0.5 line-clamp-2 text-[12px] text-neutral-400">{description}</p>
        )}
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-[#0a66c2]" />
          <p className="text-[11px] text-neutral-500">{domain}</p>
        </div>
      </div>
    </div>
  );
}
