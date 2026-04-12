"use client";

import { useCallback, useRef, useState } from "react";

const ICON_SIZE = 48;
const MAX_SCALE = 1.6;
const INFLUENCE_RANGE = 120;

function parabolicScale(distance: number): number {
  if (distance >= INFLUENCE_RANGE) return 1;
  const normalized = distance / INFLUENCE_RANGE;
  const scale = 1 + (MAX_SCALE - 1) * Math.cos((normalized * Math.PI) / 2);
  return scale;
}

export function useDockMagnify() {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX);
  }, []);

  const onMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  function getScale(itemCenterX: number): number {
    if (mouseX === null) return 1;
    const distance = Math.abs(mouseX - itemCenterX);
    return parabolicScale(distance);
  }

  return {
    dockRef,
    mouseX,
    onMouseMove,
    onMouseLeave,
    getScale,
    iconSize: ICON_SIZE,
  };
}
