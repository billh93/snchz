"use client";

import { motion } from "framer-motion";
import { type Tool } from "@/lib/data";
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

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative overflow-hidden rounded-lg border border-border/50 bg-surface/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-golden/20 hover:bg-surface/50"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-golden/10 text-golden">
          {ICON_MAP[tool.icon]}
        </div>
        {tool.status === "coming-soon" && (
          <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Coming Soon
          </span>
        )}
        {tool.status === "live" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-green-400">
            <span className="h-1 w-1 rounded-full bg-green-400" />
            Live
          </span>
        )}
      </div>

      <h3 className="font-display text-lg font-semibold text-foreground">
        {tool.name}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{tool.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground/70">
        {tool.description}
      </p>
    </motion.div>
  );
}
