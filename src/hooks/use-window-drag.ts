"use client";

import { useCallback, useRef } from "react";
import { useDesktopDispatch } from "@/components/desktop/desktop-provider";
import { MENU_BAR_HEIGHT } from "@/lib/desktop-config";

export function useWindowDrag(windowId: string) {
  const dispatch = useDesktopDispatch();
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      dragging.current = true;

      const titleBar = e.currentTarget as HTMLElement;
      const windowEl = titleBar.closest<HTMLElement>("[data-window-id]");
      if (!windowEl) return;

      const rect = windowEl.getBoundingClientRect();
      offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      titleBar.setPointerCapture(e.pointerId);

      dispatch({ type: "FOCUS_WINDOW", windowId });
    },
    [dispatch, windowId]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const x = Math.max(0, e.clientX - offset.current.x);
      const y = Math.max(MENU_BAR_HEIGHT, e.clientY - offset.current.y);
      dispatch({ type: "MOVE_WINDOW", windowId, position: { x, y } });
    },
    [dispatch, windowId]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    },
    []
  );

  return { onPointerDown, onPointerMove, onPointerUp };
}
