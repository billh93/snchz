import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const OgPreview = dynamic(() =>
  import("@/components/tools/og-preview").then((m) => m.OgPreview)
);

export const metadata: Metadata = {
  title: "Social Preview Cards",
  description:
    "Free Open Graph preview tool. See how your links look on Twitter, Facebook, and LinkedIn before sharing. Get the meta tags to copy-paste.",
};

export default function OgPreviewPage() {
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
                Social Preview Cards
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Preview how your links will appear on Twitter, Facebook, and
                LinkedIn. Copy the meta tags you need.
              </p>
            </div>
          </FadeIn>
          <OgPreview />
        </div>
      </main>
    </>
  );
}
