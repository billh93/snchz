import { TOOLS } from "@/lib/data";
import { Nav } from "@/components/nav";
import { FadeIn, StaggerChildren } from "@/components/motion";
import { ToolCard } from "@/components/tool-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Developer Tools by Bill Hinostroza",
  description:
    "13 free tools for developers and founders: SaaS calculator, AI prompt lab, QR code generator, invoice builder, and more. No sign-up required.",
};

export default function ToolsPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-16">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-foreground/50">
                Free Tools
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Built to be useful
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                Open-source tools for developers and founders. Free
                forever, no sign-up required.
              </p>
            </div>
          </FadeIn>

          <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </StaggerChildren>
        </div>
      </main>
    </>
  );
}
