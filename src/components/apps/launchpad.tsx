"use client";

import { TOOLS } from "@/lib/data";
import {
  QrCode,
  Calculator,
  Sparkles,
  UserPen,
  Eye,
  Link,
  Braces,
  FileText,
  LayoutList,
  ListOrdered,
  Rocket,
  MonitorSmartphone,
  Activity,
} from "lucide-react";

const TOOL_ICONS: Record<string, React.ElementType> = {
  "qr-code": QrCode,
  calculator: Calculator,
  sparkles: Sparkles,
  "user-pen": UserPen,
  eye: Eye,
  link: Link,
  braces: Braces,
  "file-text": FileText,
  "layout-list": LayoutList,
  "list-ordered": ListOrdered,
  rocket: Rocket,
  "monitor-smartphone": MonitorSmartphone,
  activity: Activity,
};

export function LaunchpadApp({
  onOpenTool,
}: {
  onOpenTool?: (toolSlug: string) => void;
} = {}) {
  return (
    <div className="h-full overflow-auto bg-[#1e1e1e] p-6">
      <h2 className="mb-6 text-center text-lg font-semibold text-white/80">Tools</h2>
      <div className="mx-auto grid max-w-2xl grid-cols-4 gap-6">
        {TOOLS.map((tool) => {
          const Icon = TOOL_ICONS[tool.icon] ?? Sparkles;
          return (
            <button
              key={tool.slug}
              onClick={() => {
                if (onOpenTool) {
                  onOpenTool(tool.slug);
                }
              }}
              className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-white/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 shadow-lg transition-transform group-hover:scale-105">
                <Icon size={24} className="text-white/80" />
              </div>
              <span className="text-[11px] leading-tight text-white/60 text-center line-clamp-2">
                {tool.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
