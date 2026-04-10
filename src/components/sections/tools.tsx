"use client";

import Link from "next/link";
import { TOOLS } from "@/lib/data";
import { FadeIn, StaggerChildren } from "@/components/motion";
import { motion } from "framer-motion";
import { Calculator, Sparkles, Activity } from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  calculator: <Calculator className="h-5 w-5" />,
  sparkles: <Sparkles className="h-5 w-5" />,
  activity: <Activity className="h-5 w-5" />,
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function ToolsSection() {
  return (
    <section id="tools" className="relative py-32 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-12">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-golden">
              Free Tools
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built to be useful
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Open-source tools I&apos;m building for developers and founders.
              Ship fast, measure what matters.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="grid gap-4 sm:grid-cols-3">
          {TOOLS.map((tool) => (
            <motion.div key={tool.slug} variants={cardVariants}>
              <Link
                href={tool.href}
                className="group relative block overflow-hidden rounded-lg border border-border/50 bg-surface/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-golden/20 hover:bg-surface/50"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-golden/10 text-golden">
                    {ICON_MAP[tool.icon]}
                  </div>
                  {tool.status === "live" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-green-400">
                      <span className="h-1 w-1 rounded-full bg-green-400" />
                      Live
                    </span>
                  )}
                </div>

                <h3 className="font-display text-lg font-semibold text-foreground transition-colors group-hover:text-golden">
                  {tool.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tool.tagline}
                </p>

                <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-golden/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
