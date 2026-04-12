"use client";

import { SITE, STACK_CATEGORIES } from "@/lib/data";
import { User, Globe, Mail, Keyboard, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PANES = [
  { id: "general", label: "General", icon: User },
  { id: "network", label: "Network", icon: Globe },
  { id: "mail", label: "Mail", icon: Mail },
  { id: "keyboard", label: "Keyboard", icon: Keyboard },
] as const;

type PaneId = (typeof PANES)[number]["id"];

function GeneralPane() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">{SITE.title}</h2>
      <p className="text-sm text-white/50">{SITE.role}</p>
      <p className="text-sm leading-relaxed text-white/70">{SITE.description}</p>
    </div>
  );
}

function NetworkPane() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Social Links</h2>
      <div className="space-y-3">
        {[
          { label: "GitHub", url: SITE.github },
          { label: "LinkedIn", url: SITE.linkedin },
          { label: "Website", url: SITE.url },
        ].map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/8"
          >
            {link.label}
            <ExternalLink size={14} className="text-white/30" />
          </a>
        ))}
      </div>
    </div>
  );
}

function MailPane() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Contact</h2>
      <a
        href={`mailto:${SITE.email}`}
        className="block rounded-lg bg-white/5 px-4 py-3 text-sm text-blue-400 transition-colors hover:bg-white/8"
      >
        {SITE.email}
      </a>
    </div>
  );
}

function KeyboardPane() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Tech Stack</h2>
      <div className="space-y-4">
        {STACK_CATEGORIES.map((cat) => (
          <div key={cat.label}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">
              {cat.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-white/8 px-3 py-1.5 text-[13px] text-white/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SystemPreferencesApp() {
  const [activePane, setActivePane] = useState<PaneId>("general");

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-52 shrink-0 border-r border-white/8 bg-[#252526] p-3">
        <div className="space-y-0.5">
          {PANES.map((pane) => {
            const Icon = pane.icon;
            return (
              <button
                key={pane.id}
                onClick={() => setActivePane(pane.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-[13px] transition-colors",
                  activePane === pane.id
                    ? "bg-blue-600/30 text-white"
                    : "text-white/60 hover:bg-white/5"
                )}
              >
                <Icon size={16} />
                {pane.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activePane === "general" && <GeneralPane />}
        {activePane === "network" && <NetworkPane />}
        {activePane === "mail" && <MailPane />}
        {activePane === "keyboard" && <KeyboardPane />}
      </div>
    </div>
  );
}
