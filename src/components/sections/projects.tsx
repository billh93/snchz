"use client";

import { PROJECTS } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";
import { FadeIn, StaggerChildren } from "@/components/motion";
import Link from "next/link";

export function ProjectsSection() {
  return (
    <section id="projects" className="relative py-32 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-golden">
                Selected Work
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Products I&apos;ve shipped
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-golden sm:block"
            >
              View all →
            </Link>
          </div>
        </FadeIn>

        <StaggerChildren className="grid gap-4 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </StaggerChildren>

        <div className="mt-6 sm:hidden">
          <Link
            href="/projects"
            className="text-sm text-muted-foreground transition-colors hover:text-golden"
          >
            View all projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
