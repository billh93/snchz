"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/data";
import { ArrowDown } from "lucide-react";

function AllSeeingEye({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M60 10 C30 10, 5 40, 5 40 C5 40, 30 70, 60 70 C90 70, 115 40, 115 40 C115 40, 90 10, 60 10Z"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.06"
      />
      <circle cx="60" cy="40" r="15" stroke="currentColor" strokeWidth="0.3" opacity="0.05" />
      <circle cx="60" cy="40" r="5" fill="currentColor" opacity="0.04" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-dvh flex-col items-start justify-center px-6 lg:px-8"
      data-initium="as above so below"
    >
      <AllSeeingEye className="pointer-events-none absolute right-[10%] top-1/2 -translate-y-1/2 w-[220px] text-foreground opacity-20 lg:w-[360px]" />

      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="mb-4 font-mono text-sm tracking-widest text-foreground/50 uppercase"
          >
            {SITE.role}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            {SITE.tagline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            {SITE.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90 active:scale-[0.98]"
            >
              See My Work
            </a>
            <a
              href="#tools"
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface/30 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-foreground/20 hover:bg-surface/60"
            >
              Try My Tools
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 flex items-center gap-6 text-xs text-muted-foreground/60"
          >
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/40" />
              5 exits
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/40" />
              Full-stack
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/40" />
              AI-native
            </span>
            <span
              className="ml-2 font-mono text-[9px] text-muted-foreground/20 transition-colors duration-700 hover:text-muted-foreground/60 cursor-default select-none"
              title="Solve et Coagula"
            >
              &#x25B3; &#x25BD;
            </span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4 text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
