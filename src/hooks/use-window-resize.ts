"use client";

import { useCallback, useRef } from "react";
import { useDesktopDispatch } from "@/components/desktop/desktop-provider";
import type { WindowInstance } from "@/components/desktop/desktop-provider";
import { APPS } from "@/lib/desktop-config";

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | null;

export function useWindowResize(window: WindowInstance) {
  const dispatch = useDesktopDispatch();
  const edge = useRef<Edge>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startRect = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const appConfig = APPS[window.appId as keyof typeof APPS];
  const minSize = appConfig?.minSize ?? { width: 400, height: 300 };

  const getEdge = useCallback(
    (e: React.PointerEvent, el: HTMLElement): Edge => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const threshold = 6;

      const isN = y < threshold;
      const isS = y > rect.height - threshold;
      const isW = x < threshold;
      const isE = x > rect.width - threshold;

      if (isN && isW) return "nw";
      if (isN && isE) return "ne";
      if (isS && isW) return "sw";
      if (isS && isE) return "se";
      if (isN) return "n";
      if (isS) return "s";
      if (isW) return "w";
      if (isE) return "e";
      return null;
    },
    []
  );

  const getCursor = useCallback(
    (e: React.PointerEvent, el: HTMLElement): string => {
      const edgeVal = getEdge(e, el);
      switch (edgeVal) {
        case "n":
        case "s":
          return "ns-resize";
        case "e":
        case "w":
          return "ew-resize";
        case "ne":
        case "sw":
          return "nesw-resize";
        case "nw":
        case "se":
          return "nwse-resize";
        default:
          return "default";
      }
    },
    [getEdge]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const edgeVal = getEdge(e, el);
      if (!edgeVal) return;

      e.preventDefault();
      e.stopPropagation();
      edge.current = edgeVal;
      startPos.current = { x: e.clientX, y: e.clientY };
      startRect.current = {
        x: window.position.x,
        y: window.position.y,
        w: window.size.width,
        h: window.size.height,
      };
      el.setPointerCapture(e.pointerId);
      document.body.style.cursor = getCursor(e, el);
      document.body.style.userSelect = "none";
    },
    [getEdge, getCursor, window.position, window.size]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const el = e.currentTarget as HTMLElement;

      if (!edge.current) {
        el.style.cursor = getCursor(e, el);
        return;
      }

      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      const r = startRect.current;

      let newX = r.x;
      let newY = r.y;
      let newW = r.w;
      let newH = r.h;

      if (edge.current.includes("e")) newW = Math.max(minSize.width, r.w + dx);
      if (edge.current.includes("w")) {
        newW = Math.max(minSize.width, r.w - dx);
        newX = r.x + (r.w - newW);
      }
      if (edge.current.includes("s")) newH = Math.max(minSize.height, r.h + dy);
      if (edge.current.includes("n")) {
        newH = Math.max(minSize.height, r.h - dy);
        newY = r.y + (r.h - newH);
      }

      dispatch({ type: "MOVE_WINDOW", windowId: window.id, position: { x: newX, y: newY } });
      dispatch({ type: "RESIZE_WINDOW", windowId: window.id, size: { width: newW, height: newH } });
    },
    [dispatch, getCursor, minSize, window.id]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!edge.current) return;
      edge.current = null;
      const el = e.currentTarget as HTMLElement;
      el.releasePointerCapture(e.pointerId);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    },
    []
  );

  return { onPointerDown, onPointerMove, onPointerUp };
}
