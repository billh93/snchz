"use client";

import { useEffect, useState } from "react";

export function IOSStatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    }
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-12 items-center justify-between px-6 text-white">
      <span className="text-[15px] font-semibold tabular-nums">{time}</span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" className="opacity-80">
          <rect x="0" y="9" width="3" height="3" rx="0.5" />
          <rect x="4.5" y="6" width="3" height="6" rx="0.5" />
          <rect x="9" y="3" width="3" height="9" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.3" />
        </svg>
        {/* WiFi */}
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" className="opacity-80">
          <path d="M1 3.5C1 3.5 3.5 0.5 7 0.5C10.5 0.5 13 3.5 13 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 6.5C3 6.5 4.5 4.5 7 4.5C9.5 4.5 11 6.5 11 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="7" cy="10" r="1.5" fill="currentColor" />
        </svg>
        {/* Battery */}
        <svg width="24" height="12" viewBox="0 0 24 12" className="opacity-80">
          <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none" />
          <rect x="2" y="2" width="14" height="8" rx="1" fill="currentColor" opacity="0.8" />
          <path d="M22 4.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
