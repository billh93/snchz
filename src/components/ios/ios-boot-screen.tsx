"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PearLogo } from "@/components/pear-logo";
import { useState, useEffect } from "react";

export function IOSBootScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"black" | "logo" | "done">("black");

  useEffect(() => {
    const alreadyBooted = sessionStorage.getItem("snchz-ios-booted");
    if (alreadyBooted) {
      onComplete();
      return;
    }
    const t1 = setTimeout(() => setPhase("logo"), 500);
    const t2 = setTimeout(() => setPhase("done"), 4400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  useEffect(() => {
    if (phase === "done") {
      sessionStorage.setItem("snchz-ios-booted", "1");
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" ? (
        <motion.div
          key="ios-boot"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={phase === "logo" ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <PearLogo className="h-16 w-16 text-neutral-300" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
