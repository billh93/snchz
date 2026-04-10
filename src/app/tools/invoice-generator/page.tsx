import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const InvoiceGenerator = dynamic(() =>
  import("@/components/tools/invoice-generator").then(
    (m) => m.InvoiceGenerator
  )
);

export const metadata: Metadata = {
  title: "Invoice Generator",
  description:
    "Free invoice generator. Fill in your details, add line items, and print a professional PDF invoice.",
};

export default function InvoiceGeneratorPage() {
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
                Invoice Generator
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Create professional invoices in seconds. Add your details,
                line items, and tax rate, then print or save as PDF.
              </p>
            </div>
          </FadeIn>
          <InvoiceGenerator />
        </div>
      </main>
    </>
  );
}
