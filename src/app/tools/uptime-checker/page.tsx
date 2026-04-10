import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const UptimeChecker = dynamic(() =>
  import("@/components/tools/uptime-checker").then((m) => m.UptimeChecker)
);

export const metadata: Metadata = {
  title: "Uptime Checker",
  description:
    "Free uptime checker. Spot-check any URL from your browser, measure response time, and view latency stats.",
};

export default function UptimeCheckerPage() {
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
                Uptime Checker
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Spot-check any URL from your browser. Measure response time,
                run multiple pings, and see latency statistics. No server
                needed.
              </p>
            </div>
          </FadeIn>
          <UptimeChecker />
        </div>
      </main>
    </>
  );
}
