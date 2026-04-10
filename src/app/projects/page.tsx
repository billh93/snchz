import { PROJECTS } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";
import { Nav } from "@/components/nav";
import { FlowField } from "@/components/flow-field";
import { FadeIn, StaggerChildren } from "@/components/motion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects by Bill Hinostroza — 5 SaaS Exits",
  description:
    "Products built by Bill Hinostroza, from SaaS platforms to AI-powered analytics. Five acquisitions and counting.",
};

export default function ProjectsPage() {
  return (
    <>
      <FlowField />
      <Nav />
      <main className="pt-32 pb-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-16">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-foreground/50">
                All Projects
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Things I&apos;ve built
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                Every product here was taken from idea to revenue to exit.
                Full-stack, solo or leading technical decisions.
              </p>
            </div>
          </FadeIn>

          <StaggerChildren className="grid gap-4 sm:grid-cols-2">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </StaggerChildren>
        </div>
      </main>
    </>
  );
}
