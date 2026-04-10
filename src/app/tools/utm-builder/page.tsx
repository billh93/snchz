import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const UtmBuilder = dynamic(() =>
  import("@/components/tools/utm-builder").then((m) => m.UtmBuilder)
);

export const metadata: Metadata = {
  title: "UTM Link Builder",
  description:
    "Free UTM link builder. Create trackable campaign URLs with presets for Google, Facebook, LinkedIn, and more.",
};

export default function UtmBuilderPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-12">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-golden">
                Free Tool
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                UTM Link Builder
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Build campaign-tracked URLs in seconds. Pick a preset or
                fill in your own UTM parameters and copy the final link.
              </p>
            </div>
          </FadeIn>
          <UtmBuilder />
        </div>
      </main>
    </>
  );
}
