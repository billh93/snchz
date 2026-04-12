"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PearLogo } from "@/components/pear-logo";
import { SITE } from "@/lib/data";
import { X } from "lucide-react";

export function AboutThisMac({ open, onClose }: { open: boolean; onClose: () => void }) {
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-[501] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#2a2a2a] p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full p-1 text-white/30 hover:bg-white/10 hover:text-white/60"
            >
              <X size={14} />
            </button>

            <div className="flex flex-col items-center text-center">
              <PearLogo className="mb-4 h-16 w-16 text-white/80" />

              <h2 className="text-xl font-bold text-white">SNCHZ OS</h2>
              <p className="mt-0.5 text-[13px] text-white/40">Version 1.0</p>

              <div className="mt-5 w-full space-y-2.5 text-[13px]">
                {[
                  { label: "Model", value: SITE.role },
                  { label: "Chip", value: "Next.js / Python / FastAPI / AI SDK" },
                  { label: "Memory", value: "5 SaaS Exits" },
                  { label: "Serial Number", value: "billh93" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-white/40">{row.label}</span>
                    <span className="font-medium text-white/70">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex gap-3">
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-white/8 px-3 py-1.5 text-[12px] text-white/60 transition-colors hover:bg-white/12"
                >
                  GitHub
                </a>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-white/8 px-3 py-1.5 text-[12px] text-white/60 transition-colors hover:bg-white/12"
                >
                  LinkedIn
                </a>
              </div>

              <p className="mt-4 text-[11px] text-white/20">
                &copy; {new Date().getFullYear()} {SITE.title}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
