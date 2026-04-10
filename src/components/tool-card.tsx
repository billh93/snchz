"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { type Tool } from "@/lib/data";
import {
  Calculator,
  Sparkles,
  Activity,
  QrCode,
  Link as LinkIcon,
  Eye,
  Braces,
  FileText,
  LayoutList,
  ListOrdered,
  Rocket,
  MonitorSmartphone,
  UserPen,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  calculator: <Calculator className="h-5 w-5" />,
  sparkles: <Sparkles className="h-5 w-5" />,
  activity: <Activity className="h-5 w-5" />,
  "qr-code": <QrCode className="h-5 w-5" />,
  link: <LinkIcon className="h-5 w-5" />,
  eye: <Eye className="h-5 w-5" />,
  braces: <Braces className="h-5 w-5" />,
  "file-text": <FileText className="h-5 w-5" />,
  "layout-list": <LayoutList className="h-5 w-5" />,
  "list-ordered": <ListOrdered className="h-5 w-5" />,
  rocket: <Rocket className="h-5 w-5" />,
  "monitor-smartphone": <MonitorSmartphone className="h-5 w-5" />,
  "user-pen": <UserPen className="h-5 w-5" />,
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <motion.div variants={cardVariants}>
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
        <p className="mt-1 text-sm text-muted-foreground">{tool.tagline}</p>

        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-golden/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
    </motion.div>
  );
}
