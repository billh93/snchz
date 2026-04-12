import { ImageResponse } from "next/og";

export const alt = "Bill Hinostroza — Product Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#0a0a0a",
          padding: "80px 100px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Sacred geometry background — concentric circles */}
        <svg
          width="600"
          height="600"
          viewBox="0 0 600 600"
          style={{
            position: "absolute",
            right: -40,
            top: 15,
            opacity: 0.04,
          }}
        >
          <circle cx="300" cy="300" r="280" stroke="white" strokeWidth="0.8" fill="none" />
          <circle cx="300" cy="300" r="220" stroke="white" strokeWidth="0.6" fill="none" />
          <circle cx="300" cy="300" r="160" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="300" cy="300" r="100" stroke="white" strokeWidth="0.4" fill="none" />
          {/* Vesica Piscis */}
          <circle cx="260" cy="300" r="140" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="340" cy="300" r="140" stroke="white" strokeWidth="0.5" fill="none" />
          {/* Cross lines */}
          <line x1="300" y1="20" x2="300" y2="580" stroke="white" strokeWidth="0.3" />
          <line x1="20" y1="300" x2="580" y2="300" stroke="white" strokeWidth="0.3" />
          <line x1="100" y1="100" x2="500" y2="500" stroke="white" strokeWidth="0.2" />
          <line x1="500" y1="100" x2="100" y2="500" stroke="white" strokeWidth="0.2" />
        </svg>

        {/* Triangle sigil — positioned right side */}
        <svg
          width="300"
          height="300"
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            right: 120,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.08,
          }}
        >
          <path d="M50 8 L92 85 L8 85 Z" stroke="white" strokeWidth="1.2" fill="none" />
          <path
            d="M50 38 C38 38, 28 50, 28 50 C28 50, 38 62, 50 62 C62 62, 72 50, 72 50 C72 50, 62 38, 50 38Z"
            stroke="white"
            strokeWidth="1"
            fill="none"
          />
          <circle cx="50" cy="50" r="5" fill="white" />
        </svg>

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
          }}
        />

        {/* Role label */}
        <div
          style={{
            display: "flex",
            fontSize: 14,
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.4)",
            marginBottom: 24,
            fontWeight: 500,
          }}
        >
          Product Engineer
        </div>

        {/* Name */}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 24,
          }}
        >
          Bill Hinostroza
        </div>

        {/* Description */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.5,
            maxWidth: 600,
          }}
        >
          5 SaaS exits. Full-stack builder shipping with Next.js, Python, and AI.
        </div>

        {/* Bottom stats */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 60,
            left: 100,
            gap: 40,
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: "rgba(255,255,255,0.3)",
              }}
            />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
              5 EXITS
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: "rgba(255,255,255,0.3)",
              }}
            />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
              FULL-STACK
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: "rgba(255,255,255,0.3)",
              }}
            />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
              AI-NATIVE
            </span>
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 60,
            right: 100,
            fontSize: 14,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.15em",
          }}
        >
          snchz.co
        </div>
      </div>
    ),
    { ...size }
  );
}
