"use client";

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  type AppId,
  APPS,
  DEFAULT_WALLPAPER,
  MENU_BAR_HEIGHT,
} from "@/lib/desktop-config";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type WindowInstance = {
  id: string;
  appId: AppId;
  position: { x: number; y: number };
  size: { width: number; height: number };
  prevSize?: { width: number; height: number };
  prevPosition?: { x: number; y: number };
  zIndex: number;
  state: "normal" | "minimized" | "maximized";
};

export type ContextMenuItem = {
  label: string;
  action?: () => void;
  separator?: boolean;
  disabled?: boolean;
};

export type DesktopState = {
  windows: WindowInstance[];
  activeWindowId: string | null;
  nextZIndex: number;
  bootComplete: boolean;
  spotlightOpen: boolean;
  notificationCenterOpen: boolean;
  contextMenu: { x: number; y: number; items: ContextMenuItem[] } | null;
  wallpaper: string;
};

/* ------------------------------------------------------------------ */
/*  Actions                                                            */
/* ------------------------------------------------------------------ */

export type DesktopAction =
  | { type: "BOOT_COMPLETE" }
  | { type: "OPEN_APP"; appId: AppId }
  | { type: "OPEN_TOOL"; toolSlug: string; toolName: string }
  | { type: "CLOSE_WINDOW"; windowId: string }
  | { type: "FOCUS_WINDOW"; windowId: string }
  | { type: "MINIMIZE_WINDOW"; windowId: string }
  | { type: "MAXIMIZE_WINDOW"; windowId: string }
  | { type: "RESTORE_WINDOW"; windowId: string }
  | { type: "MOVE_WINDOW"; windowId: string; position: { x: number; y: number } }
  | { type: "RESIZE_WINDOW"; windowId: string; size: { width: number; height: number } }
  | { type: "TOGGLE_SPOTLIGHT" }
  | { type: "TOGGLE_NOTIFICATION_CENTER" }
  | { type: "SET_CONTEXT_MENU"; menu: DesktopState["contextMenu"] }
  | { type: "SET_WALLPAPER"; wallpaperId: string };

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

let windowCounter = 0;

function getDefaultPosition(appId: AppId, existingCount: number): { x: number; y: number } {
  const cfg = APPS[appId];
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const offset = existingCount * 28;
  return {
    x: Math.max(20, (vw - cfg.defaultSize.width) / 2 + offset),
    y: Math.max(MENU_BAR_HEIGHT + 10, (vh - cfg.defaultSize.height) / 2 + offset),
  };
}

/* ------------------------------------------------------------------ */
/*  Reducer                                                            */
/* ------------------------------------------------------------------ */

function desktopReducer(state: DesktopState, action: DesktopAction): DesktopState {
  switch (action.type) {
    case "BOOT_COMPLETE":
      return { ...state, bootComplete: true };

    case "OPEN_APP": {
      const appId = action.appId;
      const existing = state.windows.find(
        (w) => w.appId === appId && w.state !== "minimized"
      );
      if (existing) {
        return desktopReducer(state, { type: "FOCUS_WINDOW", windowId: existing.id });
      }

      const minimized = state.windows.find(
        (w) => w.appId === appId && w.state === "minimized"
      );
      if (minimized) {
        return desktopReducer(state, { type: "RESTORE_WINDOW", windowId: minimized.id });
      }

      const cfg = APPS[appId];
      const appWindowCount = state.windows.filter((w) => w.appId === appId).length;
      const id = `${appId}-${++windowCounter}`;
      const newWindow: WindowInstance = {
        id,
        appId,
        position: getDefaultPosition(appId, appWindowCount),
        size: { ...cfg.defaultSize },
        zIndex: state.nextZIndex,
        state: "normal",
      };
      return {
        ...state,
        windows: [...state.windows, newWindow],
        activeWindowId: id,
        nextZIndex: state.nextZIndex + 1,
      };
    }

    case "OPEN_TOOL": {
      const appId = `tool:${action.toolSlug}` as AppId;
      const existing = state.windows.find(
        (w) => w.appId === appId && w.state !== "minimized"
      );
      if (existing) {
        return desktopReducer(state, { type: "FOCUS_WINDOW", windowId: existing.id });
      }

      const minimized = state.windows.find(
        (w) => w.appId === appId && w.state === "minimized"
      );
      if (minimized) {
        return desktopReducer(state, { type: "RESTORE_WINDOW", windowId: minimized.id });
      }

      const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      const toolSize = { width: 900, height: 600 };
      const id = `${appId}-${++windowCounter}`;
      const newWindow: WindowInstance = {
        id,
        appId,
        position: {
          x: Math.max(20, (vw - toolSize.width) / 2),
          y: Math.max(MENU_BAR_HEIGHT + 10, (vh - toolSize.height) / 2),
        },
        size: { ...toolSize },
        zIndex: state.nextZIndex,
        state: "normal",
      };
      return {
        ...state,
        windows: [...state.windows, newWindow],
        activeWindowId: id,
        nextZIndex: state.nextZIndex + 1,
      };
    }

    case "CLOSE_WINDOW":
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.windowId),
        activeWindowId:
          state.activeWindowId === action.windowId
            ? state.windows.filter((w) => w.id !== action.windowId).at(-1)?.id ?? null
            : state.activeWindowId,
      };

    case "FOCUS_WINDOW": {
      const win = state.windows.find((w) => w.id === action.windowId);
      if (!win || win.id === state.activeWindowId) return state;
      return {
        ...state,
        activeWindowId: action.windowId,
        windows: state.windows.map((w) =>
          w.id === action.windowId ? { ...w, zIndex: state.nextZIndex } : w
        ),
        nextZIndex: state.nextZIndex + 1,
      };
    }

    case "MINIMIZE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.windowId ? { ...w, state: "minimized" as const } : w
        ),
        activeWindowId:
          state.activeWindowId === action.windowId
            ? state.windows
                .filter((w) => w.id !== action.windowId && w.state !== "minimized")
                .at(-1)?.id ?? null
            : state.activeWindowId,
      };

    case "MAXIMIZE_WINDOW": {
      const win = state.windows.find((w) => w.id === action.windowId);
      if (!win) return state;
      const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.windowId
            ? {
                ...w,
                state: "maximized" as const,
                prevSize: { ...w.size },
                prevPosition: { ...w.position },
                position: { x: 0, y: MENU_BAR_HEIGHT },
                size: { width: vw, height: vh - MENU_BAR_HEIGHT },
                zIndex: state.nextZIndex,
              }
            : w
        ),
        activeWindowId: action.windowId,
        nextZIndex: state.nextZIndex + 1,
      };
    }

    case "RESTORE_WINDOW": {
      const win = state.windows.find((w) => w.id === action.windowId);
      if (!win) return state;
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.windowId
            ? {
                ...w,
                state: "normal" as const,
                position: w.prevPosition ?? w.position,
                size: w.prevSize ?? w.size,
                zIndex: state.nextZIndex,
              }
            : w
        ),
        activeWindowId: action.windowId,
        nextZIndex: state.nextZIndex + 1,
      };
    }

    case "MOVE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.windowId ? { ...w, position: action.position } : w
        ),
      };

    case "RESIZE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.windowId ? { ...w, size: action.size } : w
        ),
      };

    case "TOGGLE_SPOTLIGHT":
      return { ...state, spotlightOpen: !state.spotlightOpen, contextMenu: null };

    case "TOGGLE_NOTIFICATION_CENTER":
      return { ...state, notificationCenterOpen: !state.notificationCenterOpen, contextMenu: null };

    case "SET_CONTEXT_MENU":
      return { ...state, contextMenu: action.menu };

    case "SET_WALLPAPER":
      if (typeof window !== "undefined") {
        localStorage.setItem("snchz-wallpaper", action.wallpaperId);
      }
      return { ...state, wallpaper: action.wallpaperId };

    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const initialState: DesktopState = {
  windows: [],
  activeWindowId: null,
  nextZIndex: 10,
  bootComplete: false,
  spotlightOpen: false,
  notificationCenterOpen: false,
  contextMenu: null,
  wallpaper: DEFAULT_WALLPAPER,
};

const DesktopContext = createContext<DesktopState>(initialState);
const DesktopDispatchContext = createContext<Dispatch<DesktopAction>>(() => {});

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(desktopReducer, initialState, (init) => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("snchz-wallpaper");
      if (saved) return { ...init, wallpaper: saved };
    }
    return init;
  });

  return (
    <DesktopContext.Provider value={state}>
      <DesktopDispatchContext.Provider value={dispatch}>
        {children}
      </DesktopDispatchContext.Provider>
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  return useContext(DesktopContext);
}

export function useDesktopDispatch() {
  return useContext(DesktopDispatchContext);
}
