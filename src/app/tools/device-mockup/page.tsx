import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const DeviceMockup = dynamic(() =>
  import("@/components/tools/device-mockup").then((m) => m.DeviceMockup)
);

export const metadata: Metadata = {
  title: "Device Mockup",
  description:
    "Free device mockup tool. Frame your screenshots in iPhone, MacBook, iPad, or browser frames using pure CSS.",
};

export default function DeviceMockupPage() {
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
                Device Mockup
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Upload a screenshot and frame it in a phone, laptop, tablet,
                or browser window. Pure CSS, no server rendering.
              </p>
            </div>
          </FadeIn>
          <DeviceMockup />
        </div>
      </main>
    </>
  );
}
