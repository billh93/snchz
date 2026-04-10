"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Monitor,
  Smartphone,
  Laptop,
  Tablet,
  Upload,
  Download,
  Link,
  ImageIcon,
} from "lucide-react";

type DeviceType = "browser" | "iphone" | "macbook" | "ipad" | "android";

const DEVICES: { value: DeviceType; label: string; icon: typeof Monitor }[] = [
  { value: "browser", label: "Browser", icon: Monitor },
  { value: "iphone", label: "iPhone", icon: Smartphone },
  { value: "macbook", label: "MacBook", icon: Laptop },
  { value: "ipad", label: "iPad", icon: Tablet },
  { value: "android", label: "Android", icon: Smartphone },
];

const BG_PRESETS = [
  "#0f0f17",
  "#1a1a2e",
  "#16213e",
  "#0d1b2a",
  "#1b2838",
  "#2d1b69",
  "#1a0a2e",
  "#0a2342",
  "#f5f5f5",
  "#ffffff",
  "#fef3c7",
  "#dbeafe",
];

const INPUT_CLASS =
  "w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10";

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl">
      <div className="flex items-center gap-2 bg-[#2a2a35] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-3 flex flex-1 items-center rounded-md bg-[#1e1e28] px-3 py-1.5">
          <span className="text-xs text-muted-foreground/50">
            https://example.com
          </span>
        </div>
      </div>
      <div className="bg-white">{children}</div>
    </div>
  );
}

function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[280px] rounded-[3rem] border-[6px] border-[#1a1a24] bg-[#1a1a24] p-1.5 shadow-2xl">
      <div className="absolute left-1/2 top-2 z-10 h-[22px] w-[100px] -translate-x-1/2 rounded-full bg-[#1a1a24]" />
      <div className="relative overflow-hidden rounded-[2.25rem] bg-white">
        <div className="pt-6">{children}</div>
      </div>
      <div className="absolute bottom-2.5 left-1/2 h-1 w-[100px] -translate-x-1/2 rounded-full bg-white/20" />
    </div>
  );
}

function MacBookFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[520px]">
      <div className="overflow-hidden rounded-t-xl border-[3px] border-b-0 border-[#2a2a35] bg-[#2a2a35]">
        <div className="relative bg-white pt-0.5">
          <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full" />
          {children}
        </div>
      </div>
      <div className="relative">
        <div className="mx-auto h-3 rounded-b-sm bg-[#3a3a45]" />
        <div className="mx-[10%] h-1.5 rounded-b-lg bg-[#2a2a35]" />
      </div>
    </div>
  );
}

function IPadFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[400px] rounded-[2rem] border-[10px] border-[#1a1a24] bg-[#1a1a24] p-1 shadow-2xl">
      <div className="overflow-hidden rounded-[1.25rem] bg-white">
        {children}
      </div>
    </div>
  );
}

function AndroidFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[280px] rounded-[2.5rem] border-[5px] border-[#1a1a24] bg-[#1a1a24] p-1 shadow-2xl">
      {/* Camera hole */}
      <div className="absolute left-1/2 top-3.5 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-[#0a0a12] ring-1 ring-white/10" />
      <div className="overflow-hidden rounded-[2rem] bg-white">
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}

const FRAME_COMPONENTS: Record<
  DeviceType,
  React.ComponentType<{ children: React.ReactNode }>
> = {
  browser: BrowserFrame,
  iphone: IPhoneFrame,
  macbook: MacBookFrame,
  ipad: IPadFrame,
  android: AndroidFrame,
};

// Canvas dimensions for each device type, aspect ratio for the screen area
const CANVAS_CONFIG: Record<
  DeviceType,
  { width: number; height: number; screenX: number; screenY: number; screenW: number; screenH: number }
> = {
  browser: { width: 1200, height: 820, screenX: 0, screenY: 72, screenW: 1200, screenH: 748 },
  iphone: { width: 440, height: 900, screenX: 30, screenY: 70, screenW: 380, screenH: 780 },
  macbook: { width: 1200, height: 780, screenX: 24, screenY: 6, screenW: 1152, screenH: 720 },
  ipad: { width: 620, height: 840, screenX: 30, screenY: 30, screenW: 560, screenH: 780 },
  android: { width: 440, height: 880, screenX: 26, screenY: 60, screenW: 388, screenH: 780 },
};

function drawDeviceToCanvas(
  ctx: CanvasRenderingContext2D,
  device: DeviceType,
  img: HTMLImageElement,
  bgColor: string,
  w: number,
  h: number
) {
  const cfg = CANVAS_CONFIG[device];
  const scale = w / cfg.width;
  const sh = cfg.height * scale;

  ctx.canvas.width = w;
  ctx.canvas.height = sh;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, sh);

  const frameColor = "#1a1a24";
  const barColor = "#2a2a35";

  if (device === "browser") {
    const r = 16 * scale;
    const barH = 72 * scale;

    ctx.fillStyle = barColor;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, barH);
    ctx.lineTo(0, barH);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.fill();

    const dots = [
      { color: "#ff5f57", x: 20 },
      { color: "#febc2e", x: 38 },
      { color: "#28c840", x: 56 },
    ];
    dots.forEach((d) => {
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(d.x * scale, 36 * scale, 6 * scale, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "#1e1e28";
    const urlX = 80 * scale;
    const urlW = w - 100 * scale;
    const urlH = 28 * scale;
    const urlY = 22 * scale;
    const urlR = 6 * scale;
    ctx.beginPath();
    ctx.moveTo(urlX + urlR, urlY);
    ctx.lineTo(urlX + urlW - urlR, urlY);
    ctx.quadraticCurveTo(urlX + urlW, urlY, urlX + urlW, urlY + urlR);
    ctx.lineTo(urlX + urlW, urlY + urlH - urlR);
    ctx.quadraticCurveTo(urlX + urlW, urlY + urlH, urlX + urlW - urlR, urlY + urlH);
    ctx.lineTo(urlX + urlR, urlY + urlH);
    ctx.quadraticCurveTo(urlX, urlY + urlH, urlX, urlY + urlH - urlR);
    ctx.lineTo(urlX, urlY + urlR);
    ctx.quadraticCurveTo(urlX, urlY, urlX + urlR, urlY);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = `${11 * scale}px system-ui`;
    ctx.fillText("https://example.com", (urlX + 12 * scale), (urlY + 18 * scale));
  }

  if (device === "iphone") {
    const border = 6 * scale;
    const outerR = 48 * scale;
    const innerR = 36 * scale;
    roundRect(ctx, 0, 0, w, sh, outerR, frameColor);
    roundRect(ctx, border + 2 * scale, border + 2 * scale, w - (border + 2 * scale) * 2, sh - (border + 2 * scale) * 2, innerR, "#fff");

    ctx.fillStyle = frameColor;
    ctx.beginPath();
    const notchW = 100 * scale;
    const notchH = 22 * scale;
    const nx = (w - notchW) / 2;
    ctx.ellipse(w / 2, border, notchW / 2, notchH, 0, 0, Math.PI);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.15)";
    const barW = 100 * scale;
    ctx.beginPath();
    ctx.roundRect((w - barW) / 2, sh - 14 * scale, barW, 4 * scale, 2 * scale);
    ctx.fill();
  }

  if (device === "macbook") {
    const bezel = 3 * scale;
    const topR = 16 * scale;
    ctx.fillStyle = barColor;
    ctx.beginPath();
    ctx.moveTo(topR, 0);
    ctx.lineTo(w - topR, 0);
    ctx.quadraticCurveTo(w, 0, w, topR);
    ctx.lineTo(w, sh - 40 * scale);
    ctx.lineTo(0, sh - 40 * scale);
    ctx.lineTo(0, topR);
    ctx.quadraticCurveTo(0, 0, topR, 0);
    ctx.fill();

    ctx.fillStyle = "#3a3a45";
    ctx.fillRect(0, sh - 40 * scale, w, 24 * scale);
    const kickX = w * 0.1;
    ctx.fillStyle = "#2a2a35";
    ctx.beginPath();
    ctx.roundRect(kickX, sh - 16 * scale, w - kickX * 2, 16 * scale, [0, 0, 12 * scale, 12 * scale]);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.fillRect(bezel, bezel, w - bezel * 2, sh - 40 * scale - bezel * 2);
  }

  if (device === "ipad") {
    const border = 10 * scale;
    const outerR = 32 * scale;
    const innerR = 20 * scale;
    roundRect(ctx, 0, 0, w, sh, outerR, frameColor);
    roundRect(ctx, border + 2 * scale, border + 2 * scale, w - (border + 2 * scale) * 2, sh - (border + 2 * scale) * 2, innerR, "#fff");
  }

  if (device === "android") {
    const border = 5 * scale;
    const outerR = 40 * scale;
    const innerR = 32 * scale;
    roundRect(ctx, 0, 0, w, sh, outerR, frameColor);
    roundRect(ctx, border + 2 * scale, border + 2 * scale, w - (border + 2 * scale) * 2, sh - (border + 2 * scale) * 2, innerR, "#fff");

    ctx.fillStyle = "#0a0a12";
    ctx.beginPath();
    ctx.arc(w / 2, 20 * scale, 6 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = scale;
    ctx.stroke();
  }

  const sx = cfg.screenX * scale;
  const sy = cfg.screenY * scale;
  const sw = cfg.screenW * scale;
  const sHeight = cfg.screenH * scale;

  const imgAspect = img.naturalWidth / img.naturalHeight;
  const slotAspect = sw / sHeight;

  let dx: number, dy: number, dw: number, dh: number;
  if (imgAspect > slotAspect) {
    dw = sw;
    dh = sw / imgAspect;
    dx = sx;
    dy = sy + (sHeight - dh) / 2;
  } else {
    dh = sHeight;
    dw = sHeight * imgAspect;
    dx = sx + (sw - dw) / 2;
    dy = sy;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string
) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

export function DeviceMockup() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [device, setDevice] = useState<DeviceType>("browser");
  const [bgColor, setBgColor] = useState("#0f0f17");
  const [imageUrl, setImageUrl] = useState("");
  const [imageSource, setImageSource] = useState<"file" | "url">("file");
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const loadImage = useCallback((src: string, name?: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setLoadedImage(img);
      if (name) setFileName(name);
    };
    img.onerror = () => setLoadedImage(null);
    img.src = src;
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      loadImage(url, file.name);
    },
    [loadImage]
  );

  const handleUrlLoad = useCallback(() => {
    if (!imageUrl.trim()) return;
    loadImage(imageUrl.trim(), "screenshot");
  }, [imageUrl, loadImage]);

  useEffect(() => {
    if (!loadedImage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawDeviceToCanvas(ctx, device, loadedImage, bgColor, 1200, 1200);
  }, [loadedImage, device, bgColor]);

  const handleExport = useCallback(async () => {
    if (!loadedImage) return;
    setIsExporting(true);
    try {
      const offscreen = document.createElement("canvas");
      const ctx = offscreen.getContext("2d");
      if (!ctx) return;
      drawDeviceToCanvas(ctx, device, loadedImage, bgColor, 2400, 2400);
      const dataUrl = offscreen.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `mockup-${device}-${Date.now()}.png`;
      a.click();
    } finally {
      setIsExporting(false);
    }
  }, [loadedImage, device, bgColor]);

  const FrameComponent = FRAME_COMPONENTS[device];

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-12">
      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-5 font-display text-lg font-semibold text-foreground">
            Image
          </h2>

          <div className="mb-5 flex gap-1 rounded-lg border border-border/40 bg-background/30 p-1">
            {(["file", "url"] as const).map((src) => (
              <button
                key={src}
                onClick={() => setImageSource(src)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  imageSource === src
                    ? "bg-foreground/[0.08] text-foreground/80"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {src === "file" ? (
                  <Upload className="h-3 w-3" />
                ) : (
                  <Link className="h-3 w-3" />
                )}
                {src === "file" ? "Upload" : "URL"}
              </button>
            ))}
          </div>

          {imageSource === "file" ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  INPUT_CLASS,
                  "flex cursor-pointer items-center gap-2 text-muted-foreground/40"
                )}
              >
                <Upload className="h-4 w-4" />
                {fileName || "Choose an image..."}
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/screenshot.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={INPUT_CLASS}
                onKeyDown={(e) => e.key === "Enter" && handleUrlLoad()}
              />
              <button
                onClick={handleUrlLoad}
                className="shrink-0 rounded-lg border border-border/50 bg-surface/30 px-3 py-2.5 text-sm text-foreground transition-colors hover:border-foreground/15 hover:text-foreground"
              >
                Load
              </button>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-5 font-display text-lg font-semibold text-foreground">
            Device
          </h2>

          <div className="grid grid-cols-5 gap-1 rounded-lg border border-border/40 bg-background/30 p-1">
            {DEVICES.map((d) => {
              const Icon = d.icon;
              return (
                <button
                  key={d.value}
                  onClick={() => setDevice(d.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-md px-2 py-2 text-[10px] font-medium transition-colors",
                    device === d.value
                      ? "bg-foreground/[0.08] text-foreground/80"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-5 font-display text-lg font-semibold text-foreground">
            Background
          </h2>

          <div className="mb-4 flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-9 w-9 cursor-pointer rounded-md border border-border/50 bg-transparent"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className={cn(INPUT_CLASS, "font-mono text-xs")}
            />
          </div>

          <div className="grid grid-cols-6 gap-2">
            {BG_PRESETS.map((color) => (
              <button
                key={color}
                onClick={() => setBgColor(color)}
                className={cn(
                  "h-8 w-full rounded-md border transition-all",
                  bgColor === color
                    ? "border-foreground/25 ring-1 ring-foreground/15"
                    : "border-border/30 hover:border-border/60"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {loadedImage && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleExport}
            disabled={isExporting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground/90 px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Download PNG (2x)"}
          </motion.button>
        )}
      </div>

      <div>
        {!loadedImage ? (
          <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-dashed border-border/40 p-12">
            <div className="text-center">
              <ImageIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="font-display text-lg font-medium text-muted-foreground">
                Upload a screenshot to get started
              </p>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Choose a device frame and background to create your mockup.
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            key={device}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div
              className="flex items-center justify-center rounded-xl border border-border/50 p-8 transition-colors"
              style={{ backgroundColor: bgColor }}
            >
              <div className="w-full max-w-[520px]">
                <FrameComponent>
                  <img
                    src={loadedImage.src}
                    alt="Mockup preview"
                    className="block w-full"
                    draggable={false}
                  />
                </FrameComponent>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground/50">
              Preview only — download uses the Canvas API for a crisp 2x export
            </p>

            {/* Hidden canvas for export */}
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
