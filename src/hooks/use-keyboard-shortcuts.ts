"use client";

import { useEffect } from "react";
import { useDesktop, useDesktopDispatch } from "@/components/desktop/desktop-provider";

export function useKeyboardShortcuts() {
  const { activeWindowId, windows } = useDesktop();
  const dispatch = useDesktopDispatch();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const isMeta = e.metaKey || e.ctrlKey;
      if (!isMeta) return;

      const key = e.key.toLowerCase();

      if (key === "k" || (key === " " && !e.shiftKey)) {
        e.preventDefault();
        dispatch({ type: "TOGGLE_SPOTLIGHT" });
        return;
      }

      if (key === "q" || key === "w") {
        e.preventDefault();
        if (activeWindowId) {
          dispatch({ type: "CLOSE_WINDOW", windowId: activeWindowId });
        }
        return;
      }

      if (key === "m") {
        e.preventDefault();
        if (activeWindowId) {
          dispatch({ type: "MINIMIZE_WINDOW", windowId: activeWindowId });
        }
        return;
      }

      if (key === "h") {
        e.preventDefault();
        if (activeWindowId) {
          dispatch({ type: "MINIMIZE_WINDOW", windowId: activeWindowId });
        }
        return;
      }

      if (key === "," && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "OPEN_APP", appId: "system-preferences" });
        return;
      }

      if (key === "c" && e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "OPEN_APP", appId: "cue" });
        return;
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dispatch, activeWindowId, windows]);
}
