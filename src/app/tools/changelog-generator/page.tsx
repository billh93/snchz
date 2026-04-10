import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const ChangelogGenerator = dynamic(() =>
  import("@/components/tools/changelog-generator").then(
    (m) => m.ChangelogGenerator
  )
);

export const metadata: Metadata = {
  title: "Changelog Generator",
  description:
    "Free changelog generator. Add versions, categorize changes, and export as styled HTML or Markdown.",
};

export default function ChangelogGeneratorPage() {
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
                Changelog Generator
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Create structured release notes following Keep a Changelog
                conventions. Export as HTML or Markdown.
              </p>
            </div>
          </FadeIn>
          <ChangelogGenerator />
        </div>
      </main>
    </>
  );
}
