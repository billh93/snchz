"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn, escapeHtml } from "@/lib/utils";
import { Download, Copy, Check, ExternalLink } from "lucide-react";

type BgStyle = "dark" | "gradient" | "image";

const BG_OPTIONS: { value: BgStyle; label: string }[] = [
  { value: "dark", label: "Solid Dark" },
  { value: "gradient", label: "Gradient" },
  { value: "image", label: "Image URL" },
];

const INPUT_CLASS =
  "w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-golden/40 focus:outline-none focus:ring-1 focus:ring-golden/20";

function generateWaitlistHTML(config: {
  productName: string;
  headline: string;
  subheadline: string;
  brandColor: string;
  bgStyle: BgStyle;
  bgImageUrl: string;
  logoUrl: string;
  ctaText: string;
}): string {
  const { productName, headline, subheadline, brandColor: rawColor, bgStyle, bgImageUrl, logoUrl, ctaText } = config;

  const brandColor = /^#[0-9a-fA-F]{3,8}$/.test(rawColor) ? rawColor : "#6366f1";
  const safeBgUrl = bgImageUrl.trim().replace(/'/g, "");

  let bgCSS: string;
  switch (bgStyle) {
    case "gradient":
      bgCSS = `background:linear-gradient(135deg,#0a0a0a 0%,${brandColor}22 50%,#0a0a0a 100%);`;
      break;
    case "image":
      bgCSS = safeBgUrl
        ? `background:linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.85)),url('${safeBgUrl}') center/cover no-repeat;`
        : `background:#0a0a0a;`;
      break;
    default:
      bgCSS = `background:#0a0a0a;`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(productName) || "Coming Soon"}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{${bgCSS}color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem 1rem}
.container{max-width:560px;width:100%;text-align:center}
.logo{max-height:48px;margin-bottom:2rem}
.product-name{font-size:0.85rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${brandColor};margin-bottom:1.5rem}
h1{font-size:clamp(2rem,5vw,3rem);font-weight:800;line-height:1.1;margin-bottom:1rem;background:linear-gradient(135deg,#fff 60%,rgba(255,255,255,0.6));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sub{color:rgba(255,255,255,0.55);font-size:1.05rem;line-height:1.6;margin-bottom:2.5rem;max-width:480px;margin-left:auto;margin-right:auto}
.form{display:flex;gap:0.75rem;max-width:420px;margin:0 auto 1.5rem}
.form input{flex:1;padding:0.85rem 1rem;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.06);color:#fff;font-size:0.95rem;outline:none;transition:border-color 0.2s}
.form input::placeholder{color:rgba(255,255,255,0.3)}
.form input:focus{border-color:${brandColor}60}
.form button{padding:0.85rem 1.75rem;border-radius:10px;border:none;background:${brandColor};color:#fff;font-weight:600;font-size:0.95rem;cursor:pointer;white-space:nowrap;transition:opacity 0.2s}
.form button:hover{opacity:0.88}
.note{color:rgba(255,255,255,0.35);font-size:0.8rem}
@media(max-width:480px){.form{flex-direction:column}.form button{width:100%}}
</style>
</head>
<body>
<div class="container">
${logoUrl.trim() ? `<img class="logo" src="${escapeHtml(logoUrl.trim())}" alt="${escapeHtml(productName)}">` : ""}
${productName.trim() ? `<div class="product-name">${escapeHtml(productName)}</div>` : ""}
<h1>${escapeHtml(headline) || "Something amazing is coming"}</h1>
${subheadline.trim() ? `<p class="sub">${escapeHtml(subheadline)}</p>` : ""}
<form class="form" onsubmit="return false">
<input type="email" placeholder="you@example.com" required>
<button type="submit">${escapeHtml(ctaText) || "Join the Waitlist"}</button>
</form>
<p class="note">We\u2019ll notify you when we launch. No spam, ever.</p>
</div>
</body>
</html>`;
}

export function WaitlistGenerator() {
  const [productName, setProductName] = useState("");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [brandColor, setBrandColor] = useState("#6366f1");
  const [bgStyle, setBgStyle] = useState<BgStyle>("dark");
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [ctaText, setCtaText] = useState("Join the Waitlist");
  const [copied, setCopied] = useState(false);

  const html = generateWaitlistHTML({
    productName,
    headline,
    subheadline,
    brandColor,
    bgStyle,
    bgImageUrl,
    logoUrl,
    ctaText,
  });

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
    a.download = `${(productName || "waitlist").toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [html, productName]);

  const previewBg =
    bgStyle === "gradient"
      ? { background: `linear-gradient(135deg, #0a0a0a 0%, ${brandColor}22 50%, #0a0a0a 100%)` }
      : bgStyle === "image" && bgImageUrl.trim()
        ? { background: `linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.85)),url('${bgImageUrl.trim()}') center/cover no-repeat` }
        : { background: "#0a0a0a" };

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-10">
      {/* Config Panel */}
      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Branding
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Acme Inc"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Logo URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/logo.svg"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Brand Color
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-border/50 bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className={cn(INPUT_CLASS, "font-mono")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Content
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Headline
              </label>
              <input
                type="text"
                placeholder="Something amazing is coming"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Description
              </label>
              <textarea
                placeholder="A brief description of what you're building..."
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                rows={3}
                className={cn(INPUT_CLASS, "resize-none")}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Button Text
              </label>
              <input
                type="text"
                placeholder="Join the Waitlist"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Background
          </h2>
          <div className="mb-4 flex gap-2">
            {BG_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setBgStyle(opt.value)}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                  bgStyle === opt.value
                    ? "border-golden/50 bg-golden/5 text-foreground"
                    : "border-border/40 text-muted-foreground hover:border-border"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {bgStyle === "image" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <input
                type="url"
                placeholder="https://example.com/bg.jpg"
                value={bgImageUrl}
                onChange={(e) => setBgImageUrl(e.target.value)}
                className={INPUT_CLASS}
              />
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-golden px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <Download size={15} />
            Download HTML
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg border border-border/50 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface/50"
          >
            {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ExternalLink size={12} />
          Live Preview
        </div>
        <div
          className="flex min-h-[520px] items-center justify-center overflow-hidden rounded-xl border border-border/30 p-8 text-white"
          style={previewBg}
        >
          <div className="w-full max-w-md text-center">
            {logoUrl.trim() && (
              <img
                src={logoUrl}
                alt={productName}
                className="mx-auto mb-6 max-h-12"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            {productName.trim() && (
              <div
                className="mb-4 text-xs font-semibold uppercase tracking-[0.1em]"
                style={{ color: brandColor }}
              >
                {productName}
              </div>
            )}
            <motion.h2
              key={headline}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="mb-3 bg-gradient-to-br from-white to-white/60 bg-clip-text text-3xl font-extrabold leading-tight text-transparent"
            >
              {headline || "Something amazing is coming"}
            </motion.h2>
            {subheadline.trim() && (
              <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-white/55">
                {subheadline}
              </p>
            )}
            <div className="mx-auto flex max-w-sm gap-2">
              <div className="flex-1 rounded-[10px] border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-sm text-white/30">
                you@example.com
              </div>
              <button
                className="whitespace-nowrap rounded-[10px] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: brandColor }}
              >
                {ctaText || "Join the Waitlist"}
              </button>
            </div>
            <p className="mt-4 text-xs text-white/35">
              We&rsquo;ll notify you when we launch. No spam, ever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
