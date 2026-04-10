import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const BioGenerator = dynamic(() =>
  import("@/components/tools/bio-generator").then((m) => m.BioGenerator)
);

export const metadata: Metadata = {
  title: "AI Bio Generator",
  description:
    "Free AI bio generator for Twitter, LinkedIn, and GitHub. Pick your tone and platform, get polished profile copy.",
};

export default function BioGeneratorPage() {
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
                AI Bio Generator
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Generate professional bios for Twitter, LinkedIn, and GitHub.
                Pick your tone, enter your details, and get polished copy
                powered by AI.
              </p>
            </div>
          </FadeIn>
          <BioGenerator />
        </div>
      </main>
    </>
  );
}
