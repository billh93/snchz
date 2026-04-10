import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const LinkInBio = dynamic(() =>
  import("@/components/tools/link-in-bio").then((m) => m.LinkInBio)
);

export const metadata: Metadata = {
  title: "Link in Bio Builder",
  description:
    "Free link-in-bio page builder. Add links, pick a theme, and download a self-contained HTML page.",
};

export default function LinkInBioPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-12">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-foreground/80">
                Free Tool
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Link in Bio Builder
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Build a link-in-bio page in minutes. Add your links, pick a
                theme, and download a self-contained HTML file you can host
                anywhere.
              </p>
            </div>
          </FadeIn>
          <LinkInBio />
        </div>
      </main>
    </>
  );
}
