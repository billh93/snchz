"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { APPS } from "@/lib/desktop-config";

export function IOSAppView({
  appId,
  appName,
  onBack,
  children,
}: {
  appId: string;
  appName?: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  const app = APPS[appId as keyof typeof APPS];
  const title = appName || app?.name || appId;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#1e1e1e]"
    >
      {/* iOS nav bar */}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-white/8 bg-[#2a2a2a] px-3">
        <button onClick={onBack} className="flex items-center gap-0.5 text-blue-400">
          <ChevronLeft size={20} />
          <span className="text-[15px]">Back</span>
        </button>
        <span className="flex-1 text-center text-[15px] font-semibold text-white/80">
          {title}
        </span>
        <div className="w-14" />
      </div>

      {/* App content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {/* Home indicator */}
      <div className="flex justify-center py-2">
        <button
          onClick={onBack}
          className="h-1 w-32 rounded-full bg-white/30"
        />
      </div>
    </motion.div>
  );
}
