import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0d",
          borderRadius: 4,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Triangle / Delta */}
          <path
            d="M50 8 L92 85 L8 85 Z"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
          {/* Eye outline */}
          <path
            d="M50 38 C38 38, 28 50, 28 50 C28 50, 38 62, 50 62 C62 62, 72 50, 72 50 C72 50, 62 38, 50 38Z"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Iris */}
          <circle cx="50" cy="50" r="6" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
