"use client";

import { type ReactNode, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { APPS } from "@/lib/desktop-config";
import {
  useDesktop,
  useDesktopDispatch,
  type WindowInstance,
} from "./desktop-provider";
import { useWindowDrag } from "@/hooks/use-window-drag";
import { useWindowResize } from "@/hooks/use-window-resize";

function TrafficLights({ windowId }: { windowId: string }) {
  const dispatch = useDesktopDispatch();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => dispatch({ type: "CLOSE_WINDOW", windowId })}
        className="group relative flex h-3 w-3 items-center justify-center rounded-full bg-[#FF5F57] transition-colors hover:bg-[#FF5F57]"
        aria-label="Close"
      >
        <svg className="h-2 w-2 opacity-0 group-hover:opacity-100" viewBox="0 0 8 8" fill="none">
          <path d="M1 1L7 7M7 1L1 7" stroke="#4D0000" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
      <button
        onClick={() => dispatch({ type: "MINIMIZE_WINDOW", windowId })}
        className="group relative flex h-3 w-3 items-center justify-center rounded-full bg-[#FEBC2E] transition-colors hover:bg-[#FEBC2E]"
        aria-label="Minimize"
      >
        <svg className="h-2 w-2 opacity-0 group-hover:opacity-100" viewBox="0 0 8 8" fill="none">
          <path d="M1 4H7" stroke="#995700" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
      <button
        onClick={() => dispatch({ type: "MAXIMIZE_WINDOW", windowId })}
        className="group relative flex h-3 w-3 items-center justify-center rounded-full bg-[#28C840] transition-colors hover:bg-[#28C840]"
        aria-label="Maximize"
      >
        <svg className="h-2 w-2 opacity-0 group-hover:opacity-100" viewBox="0 0 8 8" fill="none">
          <path d="M1 2.5L4 0.5L7 2.5M1 5.5L4 7.5L7 5.5" stroke="#006500" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export function Window({
  window: win,
  children,
}: {
  window: WindowInstance;
  children: ReactNode;
}) {
  const { activeWindowId } = useDesktop();
  const dispatch = useDesktopDispatch();
  const isActive = activeWindowId === win.id;
  const appConfig = APPS[win.appId as keyof typeof APPS];
  const windowTitle = appConfig?.name ?? win.appId.replace("tool:", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const drag = useWindowDrag(win.id);
  const resize = useWindowResize(win);

  const handleFocus = useCallback(() => {
    if (!isActive) dispatch({ type: "FOCUS_WINDOW", windowId: win.id });
  }, [dispatch, isActive, win.id]);

  if (win.state === "minimized") return null;

  return (
    <motion.div
      data-window-id={win.id}
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-xl shadow-2xl",
        isActive ? "shadow-black/50" : "shadow-black/30"
      )}
      style={{
        left: win.position.x,
        top: win.position.y,
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
      }}
      onPointerDown={(e) => {
        handleFocus();
        resize.onPointerDown(e);
      }}
      onPointerMove={resize.onPointerMove}
      onPointerUp={resize.onPointerUp}
    >
      {/* Title bar */}
      <div
        className={cn(
          "flex h-11 shrink-0 items-center gap-3 px-4",
          "border-b border-white/5",
          isActive
            ? "bg-[#2a2a2a]"
            : "bg-[#2a2a2a]/80"
        )}
        {...drag}
        style={{ touchAction: "none" }}
      >
        <TrafficLights windowId={win.id} />
        <div className="pointer-events-none flex-1 text-center text-[13px] font-medium text-white/60">
          {windowTitle}
        </div>
        <div className="w-[52px]" />
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-auto bg-[#1e1e1e]">
        {children}
      </div>
    </motion.div>
  );
}
