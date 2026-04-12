"use client";

import type { AppId } from "@/lib/desktop-config";

export function IOSDock({
  onOpenApp,
}: {
  onOpenApp: (appId: AppId) => void;
}) {
  const dockApps: { id: AppId; label: string; emoji: string }[] = [
    { id: "finder", label: "Projects", emoji: "📁" },
    { id: "safari", label: "Safari", emoji: "🧭" },
    { id: "cue", label: "Cue", emoji: "🤖" },
    { id: "tools", label: "Tools", emoji: "🛠️" },
  ];

  return (
    <div className="mx-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-2xl">
      <div className="flex items-center justify-around">
        {dockApps.map((app) => (
          <button
            key={app.id}
            onClick={() => onOpenApp(app.id)}
            className="flex flex-col items-center gap-0.5"
          >
            <span className="text-[28px]">{app.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
