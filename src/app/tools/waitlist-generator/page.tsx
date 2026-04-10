import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const WaitlistGenerator = dynamic(() =>
  import("@/components/tools/waitlist-generator").then(
    (m) => m.WaitlistGenerator
  )
);

export const metadata: Metadata = {
  title: "Waitlist Page Generator",
  description:
    "Free waitlist page generator. Configure branding, preview, and download a ready-to-deploy coming-soon landing page.",
};

export default function WaitlistGeneratorPage() {
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
                Waitlist Page Generator
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Launch a coming-soon page in 60 seconds. Configure your
                branding, preview the result, and download a self-contained
                HTML file.
              </p>
            </div>
          </FadeIn>
          <WaitlistGenerator />
        </div>
      </main>
    </>
  );
}
