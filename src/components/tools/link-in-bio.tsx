"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, escapeHtml } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

type Link = { id: string; title: string; url: string };

type Socials = {
  twitter: string;
  github: string;
  linkedin: string;
  instagram: string;
  youtube: string;
};

type Theme = "dark" | "light" | "gradient";

const THEMES: { value: Theme; label: string; preview: string }[] = [
  { value: "dark", label: "Dark", preview: "bg-[#0a0a0a]" },
  { value: "light", label: "Light", preview: "bg-white" },
  { value: "gradient", label: "Gradient", preview: "bg-gradient-to-br from-purple-600 to-blue-500" },
];

const SOCIAL_LABELS: { key: keyof Socials; label: string }[] = [
  { key: "twitter", label: "Twitter / X" },
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const INPUT_CLASS =
  "w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-golden/40 focus:outline-none focus:ring-1 focus:ring-golden/20";

function socialSvg(key: keyof Socials): string {
  const svgs: Record<keyof Socials, string> = {
    twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
    youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>`,
  };
  return svgs[key];
}

function generateHTML(
  displayName: string,
  bio: string,
  avatarUrl: string,
  links: Link[],
  theme: Theme,
  socials: Socials
): string {
  const themeStyles: Record<Theme, { bg: string; text: string; card: string; cardHover: string; subtext: string }> = {
    dark: {
      bg: "background:#0a0a0a;",
      text: "color:#ffffff;",
      card: "background:rgba(255,255,255,0.08);color:#ffffff;border:1px solid rgba(255,255,255,0.1);",
      cardHover: "background:rgba(255,255,255,0.14);",
      subtext: "color:rgba(255,255,255,0.6);",
    },
    light: {
      bg: "background:#ffffff;",
      text: "color:#111111;",
      card: "background:#f5f5f5;color:#111111;border:1px solid #e5e5e5;",
      cardHover: "background:#ebebeb;",
      subtext: "color:#666666;",
    },
    gradient: {
      bg: "background:linear-gradient(135deg,#7c3aed,#3b82f6);",
      text: "color:#ffffff;",
      card: "background:rgba(255,255,255,0.15);color:#ffffff;border:1px solid rgba(255,255,255,0.2);backdrop-filter:blur(10px);",
      cardHover: "background:rgba(255,255,255,0.25);",
      subtext: "color:rgba(255,255,255,0.7);",
    },
  };

  const t = themeStyles[theme];
  const activeSocials = SOCIAL_LABELS.filter((s) => socials[s.key].trim());

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(displayName) || "My Links"}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{${t.bg}${t.text}font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem 1rem}
.container{max-width:480px;width:100%;text-align:center}
.avatar{width:96px;height:96px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block;border:3px solid rgba(255,255,255,0.2)}
h1{font-size:1.5rem;font-weight:700;margin-bottom:0.25rem}
.bio{${t.subtext}font-size:0.9rem;margin-bottom:2rem;line-height:1.5}
.links{display:flex;flex-direction:column;gap:0.75rem;margin-bottom:2rem}
.link-card{${t.card}display:block;padding:0.875rem 1.25rem;border-radius:12px;text-decoration:none;font-weight:500;font-size:0.95rem;transition:all 0.2s}
.link-card:hover{${t.cardHover}transform:translateY(-1px)}
.socials{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.socials a{${t.subtext}transition:opacity 0.2s}
.socials a:hover{opacity:0.7}
</style>
</head>
<body>
<div class="container">
${avatarUrl.trim() ? `<img class="avatar" src="${escapeHtml(avatarUrl.trim())}" alt="${escapeHtml(displayName)}">` : ""}
<h1>${escapeHtml(displayName) || "Your Name"}</h1>
${bio.trim() ? `<p class="bio">${escapeHtml(bio)}</p>` : ""}
${links.length > 0 ? `<div class="links">${links.map((l) => `\n<a class="link-card" href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.title)}</a>`).join("")}\n</div>` : ""}
${activeSocials.length > 0 ? `<div class="socials">${activeSocials.map((s) => `\n<a href="${escapeHtml(socials[s.key])}" target="_blank" rel="noopener noreferrer">${socialSvg(s.key)}</a>`).join("")}\n</div>` : ""}
</div>
</body>
</html>`;
}

export function LinkInBio() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [links, setLinks] = useState<Link[]>([{ id: uid(), title: "", url: "" }]);
  const [theme, setTheme] = useState<Theme>("dark");
  const [socials, setSocials] = useState<Socials>({
    twitter: "",
    github: "",
    linkedin: "",
    instagram: "",
    youtube: "",
  });
  const [copied, setCopied] = useState(false);

  const addLink = () => setLinks((prev) => [...prev, { id: uid(), title: "", url: "" }]);

  const removeLink = (id: string) =>
    setLinks((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));

  const updateLink = (id: string, field: "title" | "url", value: string) =>
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  const moveLink = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= links.length) return;
    setLinks((prev) => {
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  };

  const updateSocial = (key: keyof Socials, value: string) =>
    setSocials((prev) => ({ ...prev, [key]: value }));

  const html = generateHTML(displayName, bio, avatarUrl, links.filter((l) => l.title.trim()), theme, socials);

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
    a.download = `${(displayName || "links").toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [html, displayName]);

  const previewThemeStyles: Record<Theme, string> = {
    dark: "bg-[#0a0a0a] text-white",
    light: "bg-white text-[#111]",
    gradient: "bg-gradient-to-br from-purple-600 to-blue-500 text-white",
  };

  const filteredLinks = links.filter((l) => l.title.trim());
  const activeSocials = SOCIAL_LABELS.filter((s) => socials[s.key].trim());

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr] lg:gap-10">
      {/* Config Panel */}
      <div className="space-y-4 overflow-y-auto">
        {/* Profile */}
        <div className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Display Name
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Bio</label>
              <textarea
                placeholder="Designer, developer & coffee lover"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className={cn(INPUT_CLASS, "resize-none")}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                Avatar URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Theme
          </h2>
          <div className="flex gap-3">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-2 rounded-lg border p-3 transition-all",
                  theme === t.value
                    ? "border-golden/50 bg-golden/5"
                    : "border-border/40 hover:border-border"
                )}
              >
                <div className={cn("h-8 w-full rounded-md border border-white/10", t.preview)} />
                <span className="text-xs font-medium text-foreground/70">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Links
          </h2>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {links.map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Link title"
                        value={link.title}
                        onChange={(e) => updateLink(link.id, "title", e.target.value)}
                        className={INPUT_CLASS}
                      />
                      <input
                        type="url"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => updateLink(link.id, "url", e.target.value)}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                      <button
                        onClick={() => moveLink(i, -1)}
                        disabled={i === 0}
                        className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-20"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => moveLink(i, 1)}
                        disabled={i === links.length - 1}
                        className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-20"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        onClick={() => removeLink(link.id)}
                        className="rounded p-1 text-muted-foreground transition-colors hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <button
            onClick={addLink}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border/50 py-2.5 text-sm text-muted-foreground transition-colors hover:border-golden/30 hover:text-foreground"
          >
            <Plus size={14} />
            Add Link
          </button>
        </div>

        {/* Socials */}
        <div className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Social Links
          </h2>
          <div className="space-y-3">
            {SOCIAL_LABELS.map((s) => (
              <div key={s.key}>
                <label className="mb-1 block text-xs font-medium text-foreground/60">
                  {s.label}
                </label>
                <input
                  type="url"
                  placeholder={`https://${s.key}.com/...`}
                  value={socials[s.key]}
                  onChange={(e) => updateSocial(s.key, e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
            ))}
          </div>
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
        <motion.div
          layout
          className={cn(
            "flex min-h-[500px] items-center justify-center overflow-hidden rounded-xl border border-border/30 p-8",
            previewThemeStyles[theme]
          )}
        >
          <div className="w-full max-w-sm text-center">
            {avatarUrl.trim() && (
              <img
                src={avatarUrl}
                alt={displayName}
                className="mx-auto mb-4 h-24 w-24 rounded-full border-2 border-white/20 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <h2 className="text-xl font-bold">{displayName || "Your Name"}</h2>
            {bio.trim() && (
              <p className="mt-1 text-sm opacity-60">{bio}</p>
            )}

            {filteredLinks.length > 0 && (
              <div className="mt-6 flex flex-col gap-3">
                {filteredLinks.map((l) => (
                  <div
                    key={l.id}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium transition-all",
                      theme === "dark" && "bg-white/[0.08] hover:bg-white/[0.14]",
                      theme === "light" && "bg-[#f5f5f5] hover:bg-[#ebebeb] text-[#111]",
                      theme === "gradient" && "bg-white/15 hover:bg-white/25 backdrop-blur-sm"
                    )}
                  >
                    {l.title}
                  </div>
                ))}
              </div>
            )}

            {activeSocials.length > 0 && (
              <div className="mt-6 flex justify-center gap-4">
                {activeSocials.map((s) => (
                  <span key={s.key} className="opacity-60">
                    {s.label[0]}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
