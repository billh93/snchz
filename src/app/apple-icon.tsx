import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0d",
          borderRadius: 36,
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Triangle / Delta */}
          <path
            d="M50 8 L92 85 L8 85 Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          {/* Eye outline */}
          <path
            d="M50 38 C38 38, 28 50, 28 50 C28 50, 38 62, 50 62 C62 62, 72 50, 72 50 C72 50, 62 38, 50 38Z"
            stroke="white"
            strokeWidth="1.8"
            fill="none"
          />
          {/* Iris */}
          <circle cx="50" cy="50" r="6" fill="white" />
          {/* Subtle radiating lines from iris */}
          <line x1="50" y1="40" x2="50" y2="35" stroke="white" strokeWidth="0.6" opacity="0.4" />
          <line x1="50" y1="60" x2="50" y2="65" stroke="white" strokeWidth="0.6" opacity="0.4" />
          <line x1="40" y1="50" x2="35" y2="50" stroke="white" strokeWidth="0.6" opacity="0.4" />
          <line x1="60" y1="50" x2="65" y2="50" stroke="white" strokeWidth="0.6" opacity="0.4" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
