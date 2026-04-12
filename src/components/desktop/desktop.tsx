"use client";

import { useState } from "react";
import { DesktopProvider, useDesktop, useDesktopDispatch } from "./desktop-provider";
import { BootScreen } from "./boot-screen";
import { DesktopArea } from "./desktop-area";
import { MenuBar } from "./menu-bar";
import { Dock } from "./dock";
import { WindowManager } from "./window-manager";
import { Spotlight } from "./spotlight";
import { NotificationCenter } from "./notification-center";
import { ContextMenu } from "./context-menu";
import { AboutThisMac } from "./about-this-mac";
import { WallpaperPicker } from "./wallpaper-picker";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useDeviceType } from "@/hooks/use-device-type";
import { Wallpaper } from "./wallpaper";
import { MENU_BAR_HEIGHT, DOCK_HEIGHT, DOCK_MARGIN } from "@/lib/desktop-config";
import dynamic from "next/dynamic";

const IOSHome = dynamic(() =>
  import("@/components/ios/ios-home").then((m) => m.IOSHome)
);

function DesktopInteractiveArea() {
  const dispatch = useDesktopDispatch();
  const [wpOpen, setWpOpen] = useState(false);

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    dispatch({
      type: "SET_CONTEXT_MENU",
      menu: {
        x: e.clientX,
        y: e.clientY,
        items: [
          { label: "Change Wallpaper...", action: () => setWpOpen(true) },
          { label: "Get Info", disabled: true },
          { separator: true, label: "" },
          { label: "Sort By", disabled: true },
          { label: "Clean Up", disabled: true },
        ],
      },
    });
  }

  function handleClick() {
    dispatch({ type: "SET_CONTEXT_MENU", menu: null });
  }

  return (
    <>
      <Wallpaper />
      <div
        className="fixed inset-0"
        style={{
          top: MENU_BAR_HEIGHT,
          bottom: DOCK_HEIGHT + DOCK_MARGIN * 2,
        }}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
      />
      <WallpaperPicker open={wpOpen} onClose={() => setWpOpen(false)} />
    </>
  );
}

function DesktopShell() {
  const { bootComplete } = useDesktop();
  const [aboutOpen, setAboutOpen] = useState(false);

  useKeyboardShortcuts();

  return (
    <>
      {!bootComplete && <BootScreen />}
      {bootComplete && (
        <>
          <DesktopInteractiveArea />
          <MenuBar onOpenAbout={() => setAboutOpen(true)} />
          <WindowManager />
          <Dock />
          <Spotlight />
          <NotificationCenter />
          <ContextMenu />
          <AboutThisMac open={aboutOpen} onClose={() => setAboutOpen(false)} />
        </>
      )}
    </>
  );
}

function DesktopInner() {
  const { isMobile, isReady } = useDeviceType();

  if (!isReady) {
    return <div className="fixed inset-0 bg-black" />;
  }

  if (isMobile) {
    return <IOSHome />;
  }

  return (
    <DesktopProvider>
      <DesktopShell />
    </DesktopProvider>
  );
}

export function Desktop() {
  return <DesktopInner />;
}
