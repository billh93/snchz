"use client";

import { AnimatePresence } from "framer-motion";
import { useDesktop, useDesktopDispatch } from "./desktop-provider";
import { Window } from "./window";
import dynamic from "next/dynamic";

const NotesApp = dynamic(() => import("@/components/apps/notes").then((m) => m.NotesApp));
const FinderApp = dynamic(() => import("@/components/apps/finder").then((m) => m.FinderApp));
const SafariApp = dynamic(() => import("@/components/apps/safari").then((m) => m.SafariApp));
const TerminalApp = dynamic(() => import("@/components/apps/terminal").then((m) => m.TerminalApp));
const CueApp = dynamic(() => import("@/components/apps/cue").then((m) => m.CueApp));
const SystemPreferencesApp = dynamic(() => import("@/components/apps/system-preferences").then((m) => m.SystemPreferencesApp));
const CalendarApp = dynamic(() => import("@/components/apps/calendar-app").then((m) => m.CalendarApp));
const LaunchpadApp = dynamic(() => import("@/components/apps/launchpad").then((m) => m.LaunchpadApp));

const QrGenerator = dynamic(() => import("@/components/tools/qr-generator").then((m) => m.QrGenerator));
const SaasCalculator = dynamic(() => import("@/components/tools/saas-calculator").then((m) => m.SaasCalculator));
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

function AppContent({ appId }: { appId: string }) {
  const dispatch = useDesktopDispatch();

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
      return (
        <LaunchpadApp
          onOpenTool={(slug) =>
            dispatch({ type: "OPEN_TOOL", toolSlug: slug, toolName: slug })
          }
        />
      );
    default:
      return (
        <div className="flex h-full items-center justify-center text-sm text-white/30">
          {appId} — coming soon
        </div>
      );
  }
}

export function WindowManager() {
  const { windows } = useDesktop();

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <AnimatePresence>
        {windows
          .filter((w) => w.state !== "minimized")
          .map((win) => (
            <div key={win.id} className="pointer-events-auto">
              <Window window={win}>
                <AppContent appId={win.appId} />
              </Window>
            </div>
          ))}
      </AnimatePresence>
    </div>
  );
}
