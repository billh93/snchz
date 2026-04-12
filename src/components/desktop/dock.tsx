"use client";

import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { DOCK_APPS, DOCK_MARGIN } from "@/lib/desktop-config";
import { DockItem } from "./dock-item";

const ICON_SIZE = 48;
const MAX_SCALE = 1.5;
const INFLUENCE_RANGE = 130;

function parabolicScale(distance: number): number {
  if (distance >= INFLUENCE_RANGE) return 1;
  const normalized = distance / INFLUENCE_RANGE;
  return 1 + (MAX_SCALE - 1) * Math.pow(Math.cos((normalized * Math.PI) / 2), 2);
}

export function Dock() {
  const dockRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX);
  }, []);

  const onMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  function getItemScale(appId: string): number {
    if (mouseX === null) return 1;
    const el = itemRefs.current.get(appId);
    if (!el) return 1;
    const rect = el.getBoundingClientRect();
    const itemCenterX = rect.left + rect.width / 2;
    return parabolicScale(Math.abs(mouseX - itemCenterX));
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-[200] flex justify-center"
      style={{ paddingBottom: DOCK_MARGIN }}
    >
      <div
        ref={dockRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="flex items-end gap-1.5 rounded-2xl border border-white/10 px-3 pb-1 pt-1 backdrop-blur-2xl"
        style={{
          background: "rgba(50, 50, 50, 0.35)",
        }}
      >
        {DOCK_APPS.map((app, i) => (
          <div
            key={app.id}
            ref={(el) => {
              if (el) itemRefs.current.set(app.id, el);
            }}
            className="flex items-end gap-1.5"
          >
            <DockItem
              app={app}
              index={i}
              scale={getItemScale(app.id)}
              mouseX={mouseX}
            />
            {app.isDockSeparatorAfter && (
              <div className="mx-0.5 mb-3 h-10 w-px bg-white/15" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
