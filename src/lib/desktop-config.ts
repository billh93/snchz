export type AppId =
  | "finder"
  | "safari"
  | "terminal"
  | "notes"
  | "cue"
  | "system-preferences"
  | "calendar"
  | "calculator"
  | "tools"
  | `tool:${string}`;

export type AppConfig = {
  id: AppId;
  name: string;
  iconBg: string;
  iconColor: string;
  lucideIcon: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  dockOrder: number;
  isDockSeparatorAfter?: boolean;
  menuItems?: { label: string; items: string[] }[];
};

export const APPS: Record<AppId, AppConfig> = {
  finder: {
    id: "finder",
    name: "Finder",
    iconBg: "linear-gradient(135deg, #1E90FF 0%, #4169E1 100%)",
    iconColor: "#fff",
    lucideIcon: "hard-drive",
    defaultSize: { width: 800, height: 500 },
    minSize: { width: 500, height: 350 },
    dockOrder: 0,
    menuItems: [
      { label: "File", items: ["New Finder Window", "New Folder", "Close Window"] },
      { label: "Edit", items: ["Copy", "Paste", "Select All"] },
      { label: "View", items: ["as Icons", "as List", "as Columns"] },
      { label: "Go", items: ["Home", "Desktop", "Documents"] },
    ],
  },
  safari: {
    id: "safari",
    name: "Safari",
    iconBg: "linear-gradient(135deg, #00BFFF 0%, #1E90FF 100%)",
    iconColor: "#fff",
    lucideIcon: "compass",
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 500, height: 400 },
    dockOrder: 1,
    menuItems: [
      { label: "File", items: ["New Window", "New Tab", "Close Tab"] },
      { label: "Edit", items: ["Copy", "Paste", "Find"] },
      { label: "View", items: ["Reload Page", "Show Bookmarks"] },
    ],
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    iconBg: "linear-gradient(135deg, #1a1a1a 0%, #333 100%)",
    iconColor: "#0f0",
    lucideIcon: "terminal",
    defaultSize: { width: 700, height: 450 },
    minSize: { width: 400, height: 300 },
    dockOrder: 2,
    menuItems: [
      { label: "Shell", items: ["New Window", "New Tab", "Close Window"] },
      { label: "Edit", items: ["Copy", "Paste", "Clear"] },
      { label: "View", items: ["Bigger", "Smaller", "Default Size"] },
    ],
  },
  notes: {
    id: "notes",
    name: "Notes",
    iconBg: "linear-gradient(135deg, #FFC107 0%, #FF9800 100%)",
    iconColor: "#fff",
    lucideIcon: "sticky-note",
    defaultSize: { width: 650, height: 500 },
    minSize: { width: 400, height: 300 },
    dockOrder: 3,
    menuItems: [
      { label: "File", items: ["New Note", "Close"] },
      { label: "Edit", items: ["Copy", "Paste", "Select All"] },
      { label: "Format", items: ["Bold", "Italic", "Underline"] },
    ],
  },
  cue: {
    id: "cue",
    name: "Cue",
    iconBg: "linear-gradient(135deg, #7B2FF7 0%, #C850C0 100%)",
    iconColor: "#fff",
    lucideIcon: "audio-waveform",
    defaultSize: { width: 420, height: 600 },
    minSize: { width: 360, height: 400 },
    dockOrder: 4,
    isDockSeparatorAfter: true,
    menuItems: [
      { label: "Cue", items: ["New Conversation", "Clear History"] },
    ],
  },
  "system-preferences": {
    id: "system-preferences",
    name: "System Preferences",
    iconBg: "linear-gradient(135deg, #607D8B 0%, #455A64 100%)",
    iconColor: "#fff",
    lucideIcon: "settings",
    defaultSize: { width: 680, height: 500 },
    minSize: { width: 500, height: 400 },
    dockOrder: 5,
    menuItems: [
      { label: "System Preferences", items: ["Show All", "Quit"] },
    ],
  },
  calendar: {
    id: "calendar",
    name: "Calendar",
    iconBg: "linear-gradient(135deg, #fff 0%, #f5f5f5 100%)",
    iconColor: "#E53935",
    lucideIcon: "calendar",
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 400, height: 350 },
    dockOrder: 6,
  },
  calculator: {
    id: "calculator",
    name: "SaaS Metrics Calculator",
    iconBg: "linear-gradient(135deg, #333 0%, #555 100%)",
    iconColor: "#FF9500",
    lucideIcon: "calculator",
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 600, height: 400 },
    dockOrder: 7,
  },
  tools: {
    id: "tools",
    name: "Tools",
    iconBg: "linear-gradient(135deg, #546E7A 0%, #37474F 100%)",
    iconColor: "#fff",
    lucideIcon: "folder-open",
    defaultSize: { width: 800, height: 500 },
    minSize: { width: 600, height: 400 },
    dockOrder: 8,
  },
};

export const DOCK_APPS = Object.values(APPS).sort(
  (a, b) => a.dockOrder - b.dockOrder
);

export type WallpaperConfig = {
  id: string;
  name: string;
  style?: string;
  image?: string;
};

export const WALLPAPERS: WallpaperConfig[] = [
  {
    id: "abriz-lab",
    name: "Abriz Lab",
    image: "/wallpapers/abriz-lab.png",
  },
  {
    id: "dark-gradient",
    name: "Dark Gradient",
    style: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 40%, #16213e 70%, #0a0a0a 100%)",
  },
  {
    id: "midnight",
    name: "Midnight",
    style: "linear-gradient(180deg, #020024 0%, #090979 50%, #00d4ff 200%)",
  },
  {
    id: "aurora",
    name: "Aurora",
    style: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  },
  {
    id: "ember",
    name: "Ember",
    style: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 40%, #2d1a1a 70%, #0a0a0a 100%)",
  },
];

export const DEFAULT_WALLPAPER = "dark-gradient";

export const MENU_BAR_HEIGHT = 28;
export const DOCK_HEIGHT = 72;
export const DOCK_MARGIN = 8;
