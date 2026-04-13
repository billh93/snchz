import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-HG7YP7VB5Y";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bill Hinostroza, Product Engineer | 5 Exits, Full-Stack Builder",
    template: "%s | Bill Hinostroza, Product Engineer",
  },
  description:
    "Bill Hinostroza is a product engineer with 5 SaaS exits. Full-stack builder shipping with Next.js, Python, FastAPI, and AI. View projects, free tools, and open-source work.",
  metadataBase: new URL("https://snchz.co"),
  keywords: [
    "product engineer",
    "full-stack developer",
    "software engineer portfolio",
    "Bill Hinostroza",
    "SaaS builder",
    "Next.js developer",
    "Python developer",
    "AI engineer",
    "product engineer portfolio",
    "startup engineer",
    "full-stack product engineer",
  ],
  authors: [{ name: "Bill Hinostroza", url: "https://snchz.co" }],
  creator: "Bill Hinostroza",
  openGraph: {
    title: "Bill Hinostroza, Product Engineer | 5 Exits, Full-Stack Builder",
    description:
      "Product engineer with 5 SaaS acquisitions. Building full-stack products with Next.js, Python, and AI.",
    url: "https://snchz.co",
    siteName: "Bill Hinostroza",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bill Hinostroza, Product Engineer",
    description:
      "Product engineer with 5 SaaS exits. Full-stack builder: Next.js, Python, AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://snchz.co",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://snchz.co/#website",
      url: "https://snchz.co",
      name: "Bill Hinostroza, Product Engineer",
      description:
        "Portfolio and free tools by Bill Hinostroza, a product engineer with 5 SaaS exits.",
      publisher: { "@id": "https://snchz.co/#person" },
      inLanguage: "en-US",
    },
    {
      "@type": "Person",
      "@id": "https://snchz.co/#person",
      name: "Bill Hinostroza",
      url: "https://snchz.co",
      jobTitle: "Product Engineer",
      description:
        "Full-stack product engineer with 5 SaaS acquisitions. Builds with Next.js, Python, FastAPI, and AI.",
      knowsAbout: [
        "Product Engineering",
        "Full-Stack Development",
        "TypeScript",
        "Python",
        "React",
        "Next.js",
        "FastAPI",
        "PostgreSQL",
        "AI/ML",
        "OpenAI",
        "Anthropic",
        "SaaS",
        "Vercel",
        "AWS",
      ],
      sameAs: [
        "https://github.com/billh93",
        "https://www.linkedin.com/in/bill-hinostroza/",
      ],
      email: "bill@abriz.ai",
      worksFor: {
        "@type": "Organization",
        name: "Abriz",
        url: "https://abriz.ai",
      },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://snchz.co/#profilepage",
      url: "https://snchz.co",
      name: "Bill Hinostroza, Product Engineer Portfolio",
      mainEntity: { "@id": "https://snchz.co/#person" },
      dateCreated: "2026-01-01T00:00:00+00:00",
      dateModified: new Date().toISOString(),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable} dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        <noscript>
          <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", fontFamily: "system-ui" }}>
            <h1>Bill Hinostroza, Product Engineer</h1>
            <p>Serial builder. 5 exits. I design, engineer, and ship full-stack products from zero to acquisition.</p>
            <p>Stack: Next.js, React, TypeScript, Python, FastAPI, PostgreSQL, OpenAI, Anthropic, Vercel, AWS</p>
            <p>Contact: <a href="mailto:bill@abriz.ai">bill@abriz.ai</a> | <a href="https://github.com/billh93">GitHub</a> | <a href="https://www.linkedin.com/in/bill-hinostroza/">LinkedIn</a></p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
