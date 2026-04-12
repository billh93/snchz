"use client";

import { Wallpaper } from "./wallpaper";
import { useDesktopDispatch } from "./desktop-provider";
import { MENU_BAR_HEIGHT, DOCK_HEIGHT, DOCK_MARGIN } from "@/lib/desktop-config";

export function DesktopArea() {
  const dispatch = useDesktopDispatch();

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    dispatch({
      type: "SET_CONTEXT_MENU",
      menu: {
        x: e.clientX,
        y: e.clientY,
        items: [
          { label: "Change Wallpaper", action: () => {} },
          { label: "Get Info", disabled: true },
          { separator: true, label: "" },
          { label: "Sort By", disabled: true },
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
    </>
  );
}
