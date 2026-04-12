"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesktop, useDesktopDispatch } from "./desktop-provider";
import { APPS, type AppId, DOCK_APPS } from "@/lib/desktop-config";
import { PROJECTS, TOOLS } from "@/lib/data";
import { Search } from "lucide-react";

type SearchResult = {
  id: string;
  label: string;
  category: string;
  action: () => void;
};

export function Spotlight() {
  const { spotlightOpen } = useDesktop();
  const dispatch = useDesktopDispatch();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (spotlightOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [spotlightOpen]);

  const close = useCallback(() => {
    dispatch({ type: "TOGGLE_SPOTLIGHT" });
  }, [dispatch]);

  function openApp(appId: AppId) {
    dispatch({ type: "OPEN_APP", appId });
    close();
  }

  const results: SearchResult[] = [];

  if (query.trim()) {
    const q = query.toLowerCase();

    DOCK_APPS.forEach((app) => {
      if (app.name.toLowerCase().includes(q)) {
        results.push({
          id: `app-${app.id}`,
          label: app.name,
          category: "Apps",
          action: () => openApp(app.id),
        });
      }
    });

    PROJECTS.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)) {
        results.push({
          id: `project-${p.slug}`,
          label: p.name,
          category: "Projects",
          action: () => openApp("finder"),
        });
      }
    });

    TOOLS.forEach((t) => {
      if (t.name.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q)) {
        results.push({
          id: `tool-${t.slug}`,
          label: t.name,
          category: "Tools",
          action: () => {
            dispatch({ type: "OPEN_TOOL", toolSlug: t.slug, toolName: t.name });
            close();
          },
        });
      }
    });
  }

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.category] ??= []).push(r);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {spotlightOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-black/30 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="fixed left-1/2 top-[20%] z-[401] w-[560px] -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 bg-[#232323]/95 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
              <Search size={18} className="shrink-0 text-white/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") close();
                  if (e.key === "Enter" && results.length > 0) {
                    results[0]!.action();
                  }
                }}
                placeholder="Spotlight Search"
                className="flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-white/30"
              />
            </div>

            {Object.keys(grouped).length > 0 && (
              <div className="max-h-[320px] overflow-auto p-2">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <p className="mb-1 mt-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-white/30">
                      {category}
                    </p>
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[14px] text-white/70 transition-colors hover:bg-white/8"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {query.trim() && Object.keys(grouped).length === 0 && (
              <div className="p-6 text-center text-sm text-white/30">No results</div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
