import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const ChatWidget = dynamic(() =>
  import("@/components/chat-widget").then((m) => m.ChatWidget)
);

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
    default: "Bill Sanchez, Product Engineer",
    template: "%s | Bill Sanchez",
  },
  description:
    "Serial builder, 5 exits. Full-stack product engineer building with Next.js, Python, and AI.",
  metadataBase: new URL("https://snchz.co"),
  openGraph: {
    title: "Bill Sanchez, Product Engineer",
    description: "Serial builder, 5 exits. Full-stack product engineer.",
    url: "https://snchz.co",
    siteName: "snchz.co",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bill Sanchez, Product Engineer",
    description: "Serial builder, 5 exits. Full-stack product engineer.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
