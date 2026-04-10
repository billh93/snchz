import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const JsonDebugger = dynamic(() =>
  import("@/components/tools/json-debugger").then((m) => m.JsonDebugger)
);

export const metadata: Metadata = {
  title: "JSON / JWT / Cron Debugger",
  description:
    "Free developer debugger. Format JSON, decode JWT tokens, and translate cron expressions to plain English.",
};

export default function JsonDebuggerPage() {
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
                JSON / JWT / Cron Debugger
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Three developer tools in one. Pretty-print JSON, decode JWT
                tokens, and explain cron expressions in plain English.
              </p>
            </div>
          </FadeIn>
          <JsonDebugger />
        </div>
      </main>
    </>
  );
}
