import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/data";
import { Nav } from "@/components/nav";
import { FlowField } from "@/components/flow-field";
import { FadeIn } from "@/components/motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import Link from "next/link";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.tagline,
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <FlowField />
      <Nav />
      <main className="pt-32 pb-20 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <Link
              href="/projects"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-golden"
            >
              <ArrowLeft className="h-3 w-3" />
              All Projects
            </Link>

            <div className="mb-4 flex items-center gap-3">
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {project.name}
              </h1>
              {project.status === "acquired" && (
                <span className="rounded-full bg-golden/10 px-3 py-1 text-sm font-medium text-golden">
                  {project.metrics ?? "Acquired"}
                </span>
              )}
            </div>

            <p className="text-xl text-muted-foreground">{project.tagline}</p>

            <div className="mt-4 flex items-center gap-4">
              <span className="font-mono text-sm text-muted-foreground/60">
                {project.year}
              </span>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-golden transition-colors hover:text-golden/80"
                >
                  <ExternalLink className="h-3 w-3" />
                  Visit
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-golden"
                >
                  <GitHubIcon className="h-3 w-3" />
                  Source
                </a>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-12 border-t border-border/30 pt-8">
              <p className="text-lg leading-relaxed text-foreground/90">
                {project.description}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-12">
              <h2 className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-border/50 bg-surface/50 px-3 py-1.5 text-sm text-foreground/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    </>
  );
}
