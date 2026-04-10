import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const PromptLab = dynamic(() =>
  import("@/components/tools/prompt-lab").then((m) => m.PromptLab)
);

export const metadata: Metadata = {
  title: "AI Prompt Lab",
  description:
    "Free AI prompt testing tool. Write prompts, adjust temperature, and compare outputs side by side. Powered by GPT-4o Mini.",
};

export default function PromptLabPage() {
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
                AI Prompt Lab
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Test and iterate on prompts with GPT-4o Mini. Adjust
                system prompts, tweak temperature, and compare outputs
                across runs. Free, no sign-up required.
              </p>
            </div>
          </FadeIn>

          <PromptLab />
        </div>
      </main>
    </>
  );
}
