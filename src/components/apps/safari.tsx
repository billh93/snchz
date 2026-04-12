"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/data";
import { ChevronLeft, ChevronRight, Lock, ExternalLink, Globe } from "lucide-react";

export function SafariApp() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");

  const bookmarks = PROJECTS.filter((p) => p.url).map((p) => ({
    label: p.name,
    url: p.url!,
    tagline: p.tagline,
    status: p.status,
    stack: p.stack,
  }));

  function navigateTo(url: string) {
    setCurrentUrl(url);
    setInputUrl(url);
  }

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-white/8 bg-[#2a2a2a] px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setCurrentUrl(""); setInputUrl(""); }}
            className="rounded p-1 text-white/40 hover:bg-white/8 hover:text-white/60"
          >
            <ChevronLeft size={16} />
          </button>
          <button className="rounded p-1 text-white/40 hover:bg-white/8 hover:text-white/60">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Address bar */}
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5">
          <Lock size={12} className="shrink-0 text-green-400/60" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                let url = inputUrl.trim();
                if (!url) return;
                if (url.toLowerCase().startsWith("javascript:")) return;
                if (!url.startsWith("http")) url = "https://" + url;
                try {
                  new URL(url);
                  window.open(url, "_blank", "noopener,noreferrer");
                } catch { /* invalid URL, ignore */ }
              }
            }}
            className="flex-1 bg-transparent text-[13px] text-white/70 outline-none placeholder:text-white/30"
            placeholder="Search or enter website"
          />
        </div>
      </div>

      {/* Bookmarks bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-white/5 bg-[#272727] px-3 py-1 scrollbar-none">
        {bookmarks.map((bm) => (
          <button
            key={bm.url}
            onClick={() => navigateTo(bm.url)}
            className="shrink-0 rounded px-2 py-0.5 text-[11px] text-white/50 transition-colors hover:bg-white/8 hover:text-white/70"
          >
            {bm.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto p-6">
        {!currentUrl ? (
          <div className="mx-auto max-w-xl">
            <div className="mb-8 text-center">
              <Globe size={40} className="mx-auto mb-3 text-white/20" />
              <h2 className="text-lg font-semibold text-white/60">Favorites</h2>
              <p className="mt-1 text-[13px] text-white/30">Click a bookmark or project to preview</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {bookmarks.map((bm) => (
                <button
                  key={bm.url}
                  onClick={() => navigateTo(bm.url)}
                  className="rounded-xl border border-white/8 bg-white/3 p-4 text-left transition-all hover:border-white/15 hover:bg-white/5"
                >
                  <p className="text-[14px] font-medium text-white/80">{bm.label}</p>
                  <p className="mt-1 text-[12px] text-white/40 line-clamp-1">{bm.tagline}</p>
                  <p className="mt-2 text-[11px] text-blue-400/60 truncate">{bm.url}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-lg">
            {(() => {
              const project = PROJECTS.find((p) => p.url === currentUrl);
              return (
                <div className="rounded-xl border border-white/8 bg-white/3 p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {project?.name ?? new URL(currentUrl).hostname}
                      </h2>
                      {project && (
                        <p className="mt-1 text-[14px] text-white/50">{project.tagline}</p>
                      )}
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      project?.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {project?.status ?? "live"}
                    </span>
                  </div>

                  {project?.description && (
                    <p className="mb-4 text-[14px] leading-relaxed text-white/60">
                      {project.description}
                    </p>
                  )}

                  {project?.stack && (
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      {project.stack.map((s) => (
                        <span key={s} className="rounded-md bg-white/8 px-2 py-1 text-[11px] text-white/50">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {project?.year && (
                    <p className="mb-4 text-[12px] text-white/30">{project.year}</p>
                  )}

                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-blue-500"
                  >
                    Visit Site <ExternalLink size={14} />
                  </a>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
