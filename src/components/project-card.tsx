"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { type Project } from "@/lib/data";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div variants={cardVariants}>
      <Link
        href={`/projects/${project.slug}`}
        className="group relative block overflow-hidden rounded-lg border border-border/50 bg-surface/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-golden/30 hover:bg-surface/80"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-3">
              <h3 className="font-display text-xl font-semibold text-foreground transition-colors group-hover:text-golden">
                {project.name}
              </h3>
              {project.status === "acquired" && (
                <span className="inline-flex items-center rounded-full bg-golden/10 px-2.5 py-0.5 text-xs font-medium text-golden">
                  {project.metrics ?? "Acquired"}
                </span>
              )}
              {project.status === "active" && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{project.tagline}</p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground/60">
            {project.year}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
              +{project.stack.length - 4}
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-golden/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
    </motion.div>
  );
}
