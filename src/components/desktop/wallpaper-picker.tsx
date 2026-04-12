"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useDesktop, useDesktopDispatch } from "./desktop-provider";
import { WALLPAPERS } from "@/lib/desktop-config";
import { X, Check } from "lucide-react";

export function WallpaperPicker({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { wallpaper } = useDesktop();
  const dispatch = useDesktopDispatch();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-[501] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#2a2a2a] p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Desktop Wallpaper</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-white/30 hover:bg-white/10 hover:text-white/60"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {WALLPAPERS.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => dispatch({ type: "SET_WALLPAPER", wallpaperId: wp.id })}
                  className="group relative overflow-hidden rounded-lg border border-white/10 transition-all hover:border-white/25"
                >
                  {wp.image ? (
                    <Image src={wp.image} alt="" width={200} height={80} className="h-20 w-full object-cover" draggable={false} />
                  ) : (
                    <div
                      className="h-20 w-full"
                      style={{ background: wp.style }}
                    />
                  )}
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-[12px] text-white/60">{wp.name}</span>
                    {wallpaper === wp.id && (
                      <Check size={12} className="text-blue-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
