"use client";

import { useState } from "react";
import { PROJECTS, type Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Folder, FileText, Globe, ChevronRight } from "lucide-react";

const SIDEBAR_ITEMS = [
  { label: "Favorites", items: ["All Projects", "Active", "Acquired"] },
];

export function FinderApp() {
  const [filter, setFilter] = useState<"all" | "active" | "acquired">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filtered = PROJECTS.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const selectedProject = PROJECTS.find((p) => p.slug === selected);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-48 shrink-0 border-r border-white/8 bg-[#252526] p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Favorites
        </p>
        <div className="space-y-0.5">
          {[
            { label: "All Projects", value: "all" as const },
            { label: "Active", value: "active" as const },
            { label: "Acquired", value: "acquired" as const },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => { setFilter(item.value); setSelected(null); }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                filter === item.value
                  ? "bg-blue-600/30 text-white"
                  : "text-white/60 hover:bg-white/5"
              )}
            >
              <Folder size={14} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-white/8 bg-[#2a2a2a] px-3 py-1.5">
          <div className="flex items-center gap-1 text-[11px] text-white/40">
            <span>Projects</span>
            <ChevronRight size={10} />
            <span className="text-white/70 capitalize">{filter}</span>
          </div>
          <div className="flex-1" />
          <div className="flex gap-1">
            {(["list", "grid"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "rounded px-2 py-0.5 text-[11px]",
                  viewMode === mode ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                {mode === "list" ? "List" : "Grid"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* File list */}
          <div className={cn(
            "flex-1 overflow-auto p-2",
            viewMode === "grid" ? "grid grid-cols-3 gap-2 content-start" : "space-y-px"
          )}>
            {filtered.map((project) => (
              <button
                key={project.slug}
                onClick={() => setSelected(project.slug)}
                className={cn(
                  "w-full text-left transition-colors",
                  viewMode === "grid"
                    ? cn(
                        "flex flex-col items-center gap-2 rounded-lg p-3",
                        selected === project.slug ? "bg-blue-600/30" : "hover:bg-white/5"
                      )
                    : cn(
                        "flex items-center gap-2 rounded-md px-3 py-2",
                        selected === project.slug ? "bg-blue-600/30" : "hover:bg-white/5"
                      )
                )}
              >
                <FileText
                  size={viewMode === "grid" ? 32 : 16}
                  className="shrink-0 text-blue-400"
                />
                <div className={viewMode === "grid" ? "text-center" : ""}>
                  <p className="text-[13px] font-medium text-white/80 truncate">
                    {project.name}
                  </p>
                  {viewMode === "list" && (
                    <p className="text-[11px] text-white/40 truncate">{project.tagline}</p>
                  )}
                </div>
                {viewMode === "list" && (
                  <div className="ml-auto flex items-center gap-2">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      project.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    )}>
                      {project.status}
                    </span>
                    <span className="text-[11px] text-white/30">{project.year}</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Preview panel */}
          {selectedProject && (
            <div className="w-64 shrink-0 border-l border-white/8 bg-[#252526] p-4 overflow-auto">
              <h3 className="text-sm font-semibold text-white">{selectedProject.name}</h3>
              <p className="mt-1 text-[12px] text-white/50">{selectedProject.tagline}</p>
              <div className="mt-4 space-y-3 text-[12px]">
                <div>
                  <span className="text-white/30">Status:</span>{" "}
                  <span className="capitalize text-white/70">{selectedProject.status}</span>
                </div>
                <div>
                  <span className="text-white/30">Year:</span>{" "}
                  <span className="text-white/70">{selectedProject.year}</span>
                </div>
                <div>
                  <span className="text-white/30">Stack:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedProject.stack.map((s) => (
                      <span key={s} className="rounded bg-white/8 px-1.5 py-0.5 text-[10px] text-white/60">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-white/50 leading-relaxed">{selectedProject.description}</p>
                {selectedProject.url && (
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                  >
                    <Globe size={12} /> Visit Site
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center border-t border-white/8 bg-[#2a2a2a] px-3 py-1 text-[11px] text-white/30">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
