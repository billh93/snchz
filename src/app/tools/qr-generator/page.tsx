import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

const QrGenerator = dynamic(() =>
  import("@/components/tools/qr-generator").then((m) => m.QrGenerator)
);

export const metadata: Metadata = {
  title: "QR Code Generator",
  description:
    "Free QR code generator. Create QR codes for URLs, WiFi, email, and text with custom colors. Download as PNG.",
};

export default function QrGeneratorPage() {
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
                QR Code Generator
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Generate QR codes for URLs, WiFi credentials, email addresses,
                and plain text. Customize colors and download as PNG.
              </p>
            </div>
          </FadeIn>
          <QrGenerator />
        </div>
      </main>
    </>
  );
}
