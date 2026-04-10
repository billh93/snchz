"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import QRCode from "qrcode";
import { Copy, Check, Download, QrCode } from "lucide-react";

type QrType = "url" | "text" | "wifi" | "email";
type ErrorLevel = "L" | "M" | "Q" | "H";
type WifiEncryption = "WPA" | "WEP" | "nopass";

const QR_TYPES: { value: QrType; label: string }[] = [
  { value: "url", label: "URL" },
  { value: "text", label: "Text" },
  { value: "wifi", label: "WiFi" },
  { value: "email", label: "Email" },
];

const SIZES = [256, 512, 1024] as const;
const ERROR_LEVELS: ErrorLevel[] = ["L", "M", "Q", "H"];

const INPUT_CLASS =
  "w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10";

function buildQrData(
  type: QrType,
  content: string,
  wifi: { ssid: string; password: string; encryption: WifiEncryption },
  email: { address: string; subject: string }
): string {
  switch (type) {
    case "wifi": {
      const s = wifi.ssid.replace(/[\\;,"]/g, (c) => `\\${c}`);
      const p = wifi.password.replace(/[\\;,"]/g, (c) => `\\${c}`);
      return `WIFI:T:${wifi.encryption};S:${s};P:${p};;`;
    }
    case "email": {
      const params = email.subject ? `?subject=${encodeURIComponent(email.subject)}` : "";
      return `mailto:${email.address}${params}`;
    }
    default:
      return content;
  }
}

export function QrGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [type, setType] = useState<QrType>("url");
  const [content, setContent] = useState("");
  const [wifi, setWifi] = useState({ ssid: "", password: "", encryption: "WPA" as WifiEncryption });
  const [email, setEmail] = useState({ address: "", subject: "" });
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [size, setSize] = useState<(typeof SIZES)[number]>(512);
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [copied, setCopied] = useState(false);

  const data = buildQrData(type, content, wifi, email);
  const hasData =
    type === "wifi" ? wifi.ssid.length > 0 : type === "email" ? email.address.length > 0 : content.length > 0;

  useEffect(() => {
    if (!canvasRef.current || !hasData) return;
    QRCode.toCanvas(canvasRef.current, data, {
      width: size,
      margin: 2,
      color: { dark: fg, light: bg },
      errorCorrectionLevel: errorLevel,
    }).catch(() => {});
  }, [data, size, fg, bg, errorLevel, hasData]);

  const handleDownload = useCallback(async () => {
    if (!hasData) return;
    try {
      const url = await QRCode.toDataURL(data, {
        width: size,
        margin: 2,
        color: { dark: fg, light: bg },
        errorCorrectionLevel: errorLevel,
      });
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${Date.now()}.png`;
      a.click();
    } catch {}
  }, [data, size, fg, bg, errorLevel, hasData]);

  const handleCopySvg = useCallback(async () => {
    if (!hasData) return;
    try {
      const svg = await QRCode.toString(data, {
        type: "svg",
        width: size,
        margin: 2,
        color: { dark: fg, light: bg },
        errorCorrectionLevel: errorLevel,
      });
      await navigator.clipboard.writeText(svg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [data, size, fg, bg, errorLevel, hasData]);

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-12">
      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-5 font-display text-lg font-semibold text-foreground">Configure</h2>

          {/* Type tabs */}
          <div className="mb-5 flex gap-1 rounded-lg border border-border/40 bg-background/30 p-1">
            {QR_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  type === t.value
                    ? "bg-foreground/[0.08] text-foreground/80"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {type === "url" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground/80">URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
            )}

            {type === "text" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground/80">Text</label>
                <textarea
                  placeholder="Enter any text..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  className={cn(INPUT_CLASS, "resize-none")}
                />
              </div>
            )}

            {type === "wifi" && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/80">SSID</label>
                  <input
                    type="text"
                    placeholder="Network name"
                    value={wifi.ssid}
                    onChange={(e) => setWifi((p) => ({ ...p, ssid: e.target.value }))}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/80">Password</label>
                  <input
                    type="text"
                    placeholder="Network password"
                    value={wifi.password}
                    onChange={(e) => setWifi((p) => ({ ...p, password: e.target.value }))}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/80">Encryption</label>
                  <div className="flex gap-1 rounded-lg border border-border/40 bg-background/30 p-1">
                    {(["WPA", "WEP", "nopass"] as WifiEncryption[]).map((enc) => (
                      <button
                        key={enc}
                        onClick={() => setWifi((p) => ({ ...p, encryption: enc }))}
                        className={cn(
                          "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                          wifi.encryption === enc
                            ? "bg-foreground/[0.08] text-foreground/80"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {enc === "nopass" ? "None" : enc}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {type === "email" && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/80">Email Address</label>
                  <input
                    type="email"
                    placeholder="hello@example.com"
                    value={email.address}
                    onChange={(e) => setEmail((p) => ({ ...p, address: e.target.value }))}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/80">Subject</label>
                  <input
                    type="text"
                    placeholder="Optional subject line"
                    value={email.subject}
                    onChange={(e) => setEmail((p) => ({ ...p, subject: e.target.value }))}
                    className={INPUT_CLASS}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-surface/30 p-6 backdrop-blur-sm">
          <h2 className="mb-5 font-display text-lg font-semibold text-foreground">Style</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground/80">Foreground</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fg}
                    onChange={(e) => setFg(e.target.value)}
                    className="h-9 w-9 cursor-pointer rounded-md border border-border/50 bg-transparent"
                  />
                  <input
                    type="text"
                    value={fg}
                    onChange={(e) => setFg(e.target.value)}
                    className={cn(INPUT_CLASS, "font-mono text-xs")}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground/80">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    className="h-9 w-9 cursor-pointer rounded-md border border-border/50 bg-transparent"
                  />
                  <input
                    type="text"
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    className={cn(INPUT_CLASS, "font-mono text-xs")}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Size</label>
              <div className="flex gap-1 rounded-lg border border-border/40 bg-background/30 p-1">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      size === s
                        ? "bg-foreground/[0.08] text-foreground/80"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Error Correction</label>
              <div className="flex gap-1 rounded-lg border border-border/40 bg-background/30 p-1">
                {ERROR_LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setErrorLevel(l)}
                    className={cn(
                      "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      errorLevel === l
                        ? "bg-foreground/[0.08] text-foreground/80"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground/50">
                L 7% · M 15% · Q 25% · H 30% recovery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div>
        {!hasData ? (
          <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-dashed border-border/40 p-12">
            <div className="text-center">
              <QrCode className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="font-display text-lg font-medium text-muted-foreground">
                Enter content to generate a QR code
              </p>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Everything runs locally in your browser.
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center rounded-xl border border-border/50 bg-surface/30 p-8 backdrop-blur-sm">
              <canvas
                ref={canvasRef}
                className="max-w-full rounded-lg"
                style={{ imageRendering: "pixelated", maxHeight: 400 }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-foreground/90 px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </button>
              <button
                onClick={handleCopySvg}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border/50 bg-surface/30 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/15 hover:text-foreground"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied SVG" : "Copy SVG"}
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground/50">
              {size}×{size}px · Error correction {errorLevel}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
