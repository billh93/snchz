"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PearLogo } from "@/components/pear-logo";
import { useDesktopDispatch } from "./desktop-provider";

export function BootScreen() {
  const dispatch = useDesktopDispatch();
  const [phase, setPhase] = useState<"black" | "logo" | "progress" | "done">("black");
  const [progress, setProgress] = useState(0);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const alreadyBooted = sessionStorage.getItem("snchz-booted");
    if (alreadyBooted) {
      dispatch({ type: "BOOT_COMPLETE" });
      return;
    }

    const t1 = setTimeout(() => setPhase("logo"), 800);
    const t2 = setTimeout(() => setPhase("progress"), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [dispatch]);

  useEffect(() => {
    if (phase !== "progress") return;

    let frame: number;
    const start = performance.now();
    const duration = 3000;

    function tick() {
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setPhase("done");
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => {
      sessionStorage.setItem("snchz-booted", "1");
      dispatch({ type: "BOOT_COMPLETE" });
    }, 600);
    return () => clearTimeout(t);
  }, [phase, dispatch]);

  const handleSkip = useCallback(() => {
    setSkipped(true);
    sessionStorage.setItem("snchz-booted", "1");
    dispatch({ type: "BOOT_COMPLETE" });
  }, [dispatch]);

  if (skipped) return null;

  return (
    <AnimatePresence>
      {phase !== "done" ? (
        <motion.div
          key="boot"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          {/* Pear logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              phase === "logo" || phase === "progress"
                ? { opacity: 1, scale: 1 }
                : { opacity: 0 }
            }
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          >
            <PearLogo className="h-20 w-20 text-neutral-300 drop-shadow-[0_0_40px_rgba(255,255,255,0.12)]" />
          </motion.div>

          {/* Progress bar */}
          <AnimatePresence>
            {phase === "progress" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <div className="h-1 w-48 overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-neutral-300 transition-none"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ opacity: 0.8 }}
            onClick={handleSkip}
            className="absolute bottom-8 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
          >
            Skip
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
