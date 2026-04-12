"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PearLogo } from "@/components/pear-logo";
import { useDesktop, useDesktopDispatch } from "./desktop-provider";
import { APPS, MENU_BAR_HEIGHT } from "@/lib/desktop-config";

function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    }
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time}</span>;
}

export function MenuBar({ onOpenAbout }: { onOpenAbout: () => void }) {
  const { activeWindowId, windows } = useDesktop();
  const dispatch = useDesktopDispatch();
  const [pearMenuOpen, setPearMenuOpen] = useState(false);
  const pearMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pearMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (pearMenuRef.current && !pearMenuRef.current.contains(e.target as Node)) {
        setPearMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClick, true);
    return () => document.removeEventListener("pointerdown", handleClick, true);
  }, [pearMenuOpen]);

  const activeWindow = windows.find((w) => w.id === activeWindowId);
  const activeApp = activeWindow ? APPS[activeWindow.appId] : null;
  const appName = activeApp?.name ?? "Finder";

  return (
    <motion.header
      initial={{ y: -MENU_BAR_HEIGHT }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-[200] flex select-none items-center justify-between px-4 font-sans text-[13px] font-medium text-white/90 backdrop-blur-2xl"
      style={{
        height: MENU_BAR_HEIGHT,
        background: "rgba(30, 30, 30, 0.65)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        <div className="relative" ref={pearMenuRef}>
          <button
            onClick={() => setPearMenuOpen(!pearMenuOpen)}
            className="flex items-center opacity-90 transition-opacity hover:opacity-100"
            aria-label="Pear menu"
          >
            <PearLogo className="h-[14px] w-[14px]" />
          </button>

          {/* Pear dropdown */}
          {pearMenuOpen && (
            <div className="absolute left-0 top-6 z-[211] min-w-[220px] overflow-hidden rounded-lg border border-white/10 bg-[#2a2a2a]/95 py-1 shadow-xl backdrop-blur-2xl">
              <button
                onClick={() => { onOpenAbout(); setPearMenuOpen(false); }}
                className="flex w-full items-center px-3 py-1.5 text-left text-[13px] text-white/70 hover:bg-blue-600/40 hover:text-white"
              >
                About This Mac
              </button>
              <div className="my-1 h-px bg-white/8" />
              <button
                onClick={() => { dispatch({ type: "OPEN_APP", appId: "system-preferences" }); setPearMenuOpen(false); }}
                className="flex w-full items-center px-3 py-1.5 text-left text-[13px] text-white/70 hover:bg-blue-600/40 hover:text-white"
              >
                System Preferences...
              </button>
              <div className="my-1 h-px bg-white/8" />
              <a
                href="https://github.com/billh93"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center px-3 py-1.5 text-left text-[13px] text-white/70 hover:bg-blue-600/40 hover:text-white"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/bill-hinostroza/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center px-3 py-1.5 text-left text-[13px] text-white/70 hover:bg-blue-600/40 hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          )}
        </div>

        <span className="font-semibold">{appName}</span>

        {activeApp?.menuItems?.map((menu) => (
          <button
            key={menu.label}
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            {menu.label}
          </button>
        ))}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch({ type: "TOGGLE_SPOTLIGHT" })}
          className="opacity-60 transition-opacity hover:opacity-100"
          aria-label="Spotlight search"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <span className="opacity-60">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 5C1 5 3.5 1 7 1C10.5 1 13 5 13 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M3 7.5C3 7.5 4.5 5 7 5C9.5 5 11 7.5 11 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="7" cy="10" r="1" fill="currentColor" />
          </svg>
        </span>

        <span className="opacity-60">
          <svg width="20" height="11" viewBox="0 0 20 11" fill="none">
            <rect x="0.5" y="0.5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1" />
            <rect x="1.5" y="1.5" width="10" height="8" rx="1" fill="currentColor" opacity="0.7" />
            <path d="M18 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>

        <button
          onClick={() => dispatch({ type: "TOGGLE_NOTIFICATION_CENTER" })}
          className="opacity-70 transition-opacity hover:opacity-100"
        >
          <Clock />
        </button>
      </div>
    </motion.header>
  );
}
