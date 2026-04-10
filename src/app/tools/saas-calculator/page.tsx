import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const SaasCalculator = dynamic(() =>
  import("@/components/tools/saas-calculator").then((m) => m.SaasCalculator)
);

export const metadata: Metadata = {
  title: "SaaS Metrics Calculator",
  description:
    "Free SaaS metrics calculator. Instantly compute MRR, ARR, churn, LTV, CAC, payback period, quick ratio, and more with industry benchmarks.",
};

export default function SaasCalculatorPage() {
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
                SaaS Metrics Calculator
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Plug in your numbers and get instant health metrics with
                industry benchmarks. No sign-up, no tracking, everything
                runs in your browser.
              </p>
            </div>
          </FadeIn>

          <SaasCalculator />
        </div>
      </main>
    </>
  );
}
