import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const StatusPageGenerator = dynamic(() =>
  import("@/components/tools/status-page-generator").then(
    (m) => m.StatusPageGenerator
  )
);

export const metadata: Metadata = {
  title: "Status Page Generator",
  description:
    "Generate a beautiful, self-hosted status page in seconds. Configure your services, download a single HTML file, and deploy anywhere.",
};

export default function StatusPageGeneratorPage() {
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
                Status Page Generator
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Configure your services, preview the result, and download a
                single HTML file you can host anywhere. Zero dependencies,
                fully self-contained.
              </p>
            </div>
          </FadeIn>

          <StatusPageGenerator />
        </div>
      </main>
    </>
  );
}
