"use client";

import { useRef, useLayoutEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { type AppConfig } from "@/lib/desktop-config";
import { useDesktop, useDesktopDispatch } from "./desktop-provider";
import type { AppId } from "@/lib/desktop-config";
import {
  HardDrive,
  Compass,
  Terminal,
  StickyNote,
  AudioWaveform,
  Settings,
  Calendar,
  Calculator,
  FolderOpen,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  "hard-drive": HardDrive,
  compass: Compass,
  terminal: Terminal,
  "sticky-note": StickyNote,
  "audio-waveform": AudioWaveform,
  settings: Settings,
  calendar: Calendar,
  calculator: Calculator,
  "folder-open": FolderOpen,
};

function CalendarDateOverlay() {
  const day = new Date().getDate();
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="text-[8px] font-bold uppercase leading-none text-red-500">
        {new Date().toLocaleDateString("en-US", { weekday: "short" })}
      </span>
      <span className="text-[16px] font-bold leading-none text-neutral-900 -mt-0.5">
        {day}
      </span>
    </div>
  );
}

export function DockItem({
  app,
  index,
  scale,
  mouseX,
}: {
  app: AppConfig;
  index: number;
  scale: number;
  mouseX: number | null;
}) {
  const { windows } = useDesktop();
  const dispatch = useDesktopDispatch();
  const isRunning = windows.some((w) => w.appId === app.id);
  const [bouncing, setBouncing] = useState(false);

  const IconComponent = ICON_MAP[app.lucideIcon];

  const handleClick = useCallback(() => {
    const alreadyOpen = windows.some((w) => w.appId === app.id);
    if (!alreadyOpen) {
      setBouncing(true);
      setTimeout(() => setBouncing(false), 600);
    }
    dispatch({ type: "OPEN_APP", appId: app.id });
  }, [dispatch, app.id, windows]);

  const baseSize = 48;
  const size = baseSize * scale;
  const iconInnerSize = Math.round(24 * scale);

  return (
    <motion.div
      className="group relative flex flex-col items-center"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.3 + index * 0.05,
      }}
    >
      {/* Tooltip */}
      <div
        className="pointer-events-none absolute rounded-md bg-neutral-800/90 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100 whitespace-nowrap"
        style={{ bottom: size + 16 }}
      >
        {app.name}
      </div>

      {/* Icon button */}
      <motion.button
        onClick={handleClick}
        animate={
          bouncing
            ? {
                y: [0, -20, 0, -12, 0, -4, 0],
              }
            : { y: 0 }
        }
        transition={
          bouncing
            ? { duration: 0.6, ease: "easeOut" }
            : { type: "spring", stiffness: 300, damping: 20 }
        }
        className={cn(
          "relative flex items-center justify-center transition-[width,height] duration-100 ease-out",
          "hover:brightness-110 active:scale-90"
        )}
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.22,
          background: app.iconBg,
        }}
        aria-label={`Open ${app.name}`}
      >
        {app.id === "calendar" ? (
          <CalendarDateOverlay />
        ) : IconComponent ? (
          <IconComponent
            size={iconInnerSize}
            strokeWidth={1.8}
            style={{ color: app.iconColor }}
          />
        ) : null}
      </motion.button>

      {/* Running indicator */}
      <div
        className={cn(
          "mt-0.5 h-1 w-1 rounded-full bg-white/70 transition-opacity duration-200",
          isRunning ? "opacity-100" : "opacity-0"
        )}
      />
    </motion.div>
  );
}
