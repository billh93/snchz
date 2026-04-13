"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { DOCK_APPS } from "@/lib/desktop-config";
import { TOOLS } from "@/lib/data";
import { IOSBootScreen } from "./ios-boot-screen";
import { IOSStatusBar } from "./ios-status-bar";
import { IOSDock } from "./ios-dock";
import { IOSAppView } from "./ios-app-view";
import dynamic from "next/dynamic";

const NotesApp = dynamic(() => import("@/components/apps/notes").then((m) => m.NotesApp));
const FinderApp = dynamic(() => import("@/components/apps/finder").then((m) => m.FinderApp));
const SafariApp = dynamic(() => import("@/components/apps/safari").then((m) => m.SafariApp));
const TerminalApp = dynamic(() => import("@/components/apps/terminal").then((m) => m.TerminalApp));
const CueApp = dynamic(() => import("@/components/apps/cue").then((m) => m.CueApp));
const SystemPreferencesApp = dynamic(() => import("@/components/apps/system-preferences").then((m) => m.SystemPreferencesApp));
const CalendarApp = dynamic(() => import("@/components/apps/calendar-app").then((m) => m.CalendarApp));
const LaunchpadApp = dynamic(() => import("@/components/apps/launchpad").then((m) => m.LaunchpadApp));
const SaasCalculator = dynamic(() => import("@/components/tools/saas-calculator").then((m) => m.SaasCalculator));

const QrGenerator = dynamic(() => import("@/components/tools/qr-generator").then((m) => m.QrGenerator));
const PromptLab = dynamic(() => import("@/components/tools/prompt-lab").then((m) => m.PromptLab));
const BioGenerator = dynamic(() => import("@/components/tools/bio-generator").then((m) => m.BioGenerator));
const OgPreview = dynamic(() => import("@/components/tools/og-preview").then((m) => m.OgPreview));
const UtmBuilder = dynamic(() => import("@/components/tools/utm-builder").then((m) => m.UtmBuilder));
const JsonDebugger = dynamic(() => import("@/components/tools/json-debugger").then((m) => m.JsonDebugger));
const InvoiceGenerator = dynamic(() => import("@/components/tools/invoice-generator").then((m) => m.InvoiceGenerator));
const LinkInBio = dynamic(() => import("@/components/tools/link-in-bio").then((m) => m.LinkInBio));
const ChangelogGenerator = dynamic(() => import("@/components/tools/changelog-generator").then((m) => m.ChangelogGenerator));
const WaitlistGenerator = dynamic(() => import("@/components/tools/waitlist-generator").then((m) => m.WaitlistGenerator));
const DeviceMockup = dynamic(() => import("@/components/tools/device-mockup").then((m) => m.DeviceMockup));
const UptimeChecker = dynamic(() => import("@/components/tools/uptime-checker").then((m) => m.UptimeChecker));

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  "qr-generator": QrGenerator,
  "saas-calculator": SaasCalculator,
  "prompt-lab": PromptLab,
  "bio-generator": BioGenerator,
  "og-preview": OgPreview,
  "utm-builder": UtmBuilder,
  "json-debugger": JsonDebugger,
  "invoice-generator": InvoiceGenerator,
  "link-in-bio": LinkInBio,
  "changelog-generator": ChangelogGenerator,
  "waitlist-generator": WaitlistGenerator,
  "device-mockup": DeviceMockup,
  "uptime-checker": UptimeChecker,
};

function MobileAppContent({
  appId,
  onOpenTool,
}: {
  appId: string;
  onOpenTool: (slug: string) => void;
}) {
  if (appId.startsWith("tool:")) {
    const toolSlug = appId.replace("tool:", "");
    const ToolComponent = TOOL_COMPONENTS[toolSlug];
    if (ToolComponent) {
      return (
        <div className="h-full overflow-auto bg-background">
          <ToolComponent />
        </div>
      );
    }
    return (
      <div className="flex h-full items-center justify-center text-sm text-white/30">
        Tool not found
      </div>
    );
  }

  switch (appId) {
    case "notes":
      return <NotesApp />;
    case "finder":
      return <FinderApp />;
    case "safari":
      return <SafariApp />;
    case "terminal":
      return <TerminalApp />;
    case "cue":
      return <CueApp />;
    case "system-preferences":
      return <SystemPreferencesApp />;
    case "calendar":
      return <CalendarApp />;
    case "calculator":
      return <SaasCalculator />;
    case "tools":
      return <LaunchpadApp onOpenTool={onOpenTool} />;
    default:
      return (
        <div className="flex h-full items-center justify-center text-sm text-white/30">
          {appId}: coming soon
        </div>
      );
  }
}

function getAppName(appId: string): string {
  if (appId.startsWith("tool:")) {
    const slug = appId.replace("tool:", "");
    const tool = TOOLS.find((t) => t.slug === slug);
    return tool?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return "";
}

export function IOSHome() {
  const [booted, setBooted] = useState(false);
  const [openApp, setOpenApp] = useState<string | null>(null);

  const handleBoot = useCallback(() => setBooted(true), []);

  const handleOpenTool = useCallback((slug: string) => {
    setOpenApp(`tool:${slug}`);
  }, []);

  if (!booted) {
    return <IOSBootScreen onComplete={handleBoot} />;
  }

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Wallpaper */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)" }}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <IOSStatusBar />

        <AnimatePresence>
          {openApp && (
            <IOSAppView
              appId={openApp}
              appName={getAppName(openApp)}
              onBack={() => setOpenApp(null)}
            >
              <MobileAppContent appId={openApp} onOpenTool={handleOpenTool} />
            </IOSAppView>
          )}
        </AnimatePresence>

        {/* App grid */}
        <div className="flex-1 overflow-auto px-6 pt-4">
          <div className="grid grid-cols-4 gap-y-6 gap-x-4">
            {DOCK_APPS.map((app) => (
              <button
                key={app.id}
                onClick={() => setOpenApp(app.id)}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                  style={{ background: app.iconBg }}
                >
                  <span className="text-xl font-bold" style={{ color: app.iconColor }}>
                    {app.name.charAt(0)}
                  </span>
                </div>
                <span className="text-[11px] text-white/80 line-clamp-1 drop-shadow-sm">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dock */}
        <div className="pb-4 pt-2 px-4">
          <IOSDock onOpenApp={(id) => setOpenApp(id)} />
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-2">
          <div className="h-1 w-32 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}
