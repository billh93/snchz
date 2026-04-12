export const SITE = {
  name: "SNCHZ",
  title: "Bill Hinostroza",
  role: "Product Engineer",
  tagline: "Building products end to end, from idea to launch.",
  description:
    "Serial builder. 5 exits. I design, engineer, and ship full-stack products from zero to acquisition.",
  url: "https://snchz.co",
  github: "https://github.com/billh93",
  linkedin: "https://www.linkedin.com/in/bill-hinostroza/",
  email: "bill@abriz.ai",
} as const;

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: "acquired" | "active" | "archived";
  year: string;
  stack: string[];
  metrics?: string;
  url?: string;
  github?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "abriz",
    name: "Abriz",
    tagline: "The official frontier lab for emerging technology",
    description:
      "Abriz is my frontier lab for emerging technology, building and shipping products at the edge of what's possible. Full-stack work spanning ERP, AI, and developer tools.",
    status: "active",
    year: "Jan 2026 to now",
    stack: ["React", "Node.js", "PostgreSQL", "AWS", "Stripe"],
    url: "https://abriz.ai",
  },
  {
    slug: "riftmatch",
    name: "Riftmatch",
    tagline: "Competitive gaming matchmaking platform",
    description:
      "A matchmaking and competitive gaming platform built from the ground up. Real-time matchmaking, rankings, and tournament infrastructure.",
    status: "active",
    year: "Apr 2026 to now",
    stack: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    url: "https://riftmatch.com",
  },
  {
    slug: "cue-abriz",
    name: "Cue by Abriz",
    tagline: "AI-powered productivity, built at the frontier",
    description:
      "An AI-native productivity tool shipping under the Abriz lab. Leveraging LLMs to rethink how teams work with information.",
    status: "active",
    year: "Jan 2026 to now",
    stack: ["Next.js", "Python", "FastAPI", "OpenAI", "Anthropic"],
    url: "https://cue.abriz.ai",
  },
  {
    slug: "uptime-io",
    name: "Up-Time.io",
    tagline: "Uptime monitoring that developers actually like",
    description:
      "Real-time uptime monitoring with smart alerting, status pages, and incident management. Built the entire platform solo in custom PHP.",
    status: "acquired",
    year: "2020 to 2021",
    stack: ["PHP"],
    metrics: "Acquired",
  },
  {
    slug: "web-analytics-ai",
    name: "Web-Analytics.ai",
    tagline: "Privacy-first analytics for the modern web",
    description:
      "Privacy-first web analytics: traffic, events, and reporting without the bloat. Built from end to end in custom PHP.",
    status: "acquired",
    year: "2020 to 2021",
    stack: ["PHP"],
    metrics: "Acquired",
  },
  {
    slug: "dope-link",
    name: "dope.link",
    tagline: "Link in bio, custom PHP",
    description:
      "A link-in-bio product: one page for your links and presence. Built with custom PHP, no AI in the stack. Acquired in 2022.",
    status: "acquired",
    year: "2021 to 2022",
    stack: ["PHP"],
    metrics: "Acquired 2022",
  },
];

export type Tool = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: "live" | "coming-soon";
  icon: string;
  href: string;
};

export const TOOLS: Tool[] = [
  {
    slug: "qr-generator",
    name: "QR Code Generator",
    tagline: "Generate QR codes for URLs, WiFi, email, and text",
    description:
      "Create customizable QR codes with custom colors and sizes. Download as PNG instantly.",
    status: "live",
    icon: "qr-code",
    href: "/tools/qr-generator",
  },
  {
    slug: "saas-calculator",
    name: "SaaS Metrics Calculator",
    tagline: "MRR, churn, LTV, CAC: calculate it all",
    description:
      "Plug in your numbers, get instant SaaS health metrics with benchmarks and visualizations.",
    status: "live",
    icon: "calculator",
    href: "/tools/saas-calculator",
  },
  {
    slug: "prompt-lab",
    name: "AI Prompt Lab",
    tagline: "Test prompts with GPT-4o Mini, side by side",
    description:
      "Write prompts, adjust temperature, and compare outputs across runs in real-time.",
    status: "live",
    icon: "sparkles",
    href: "/tools/prompt-lab",
  },
  {
    slug: "bio-generator",
    name: "AI Bio Generator",
    tagline: "Generate professional bios for any platform",
    description:
      "AI-powered bios for Twitter, LinkedIn, GitHub. Pick your tone and platform, get polished copy.",
    status: "live",
    icon: "user-pen",
    href: "/tools/bio-generator",
  },
  {
    slug: "og-preview",
    name: "Social Preview Cards",
    tagline: "Preview how your links appear on social media",
    description:
      "See Twitter, Facebook, and LinkedIn card previews. Get the meta tags you need to copy-paste.",
    status: "live",
    icon: "eye",
    href: "/tools/og-preview",
  },
  {
    slug: "utm-builder",
    name: "UTM Link Builder",
    tagline: "Build trackable campaign URLs in seconds",
    description:
      "Construct UTM-tagged URLs with presets for Google, Facebook, LinkedIn, and more.",
    status: "live",
    icon: "link",
    href: "/tools/utm-builder",
  },
  {
    slug: "json-debugger",
    name: "JSON / JWT / Cron Debugger",
    tagline: "Format, decode, and debug in one place",
    description:
      "Pretty-print JSON, decode JWT tokens, and translate cron expressions to plain English.",
    status: "live",
    icon: "braces",
    href: "/tools/json-debugger",
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    tagline: "Create professional invoices, print to PDF",
    description:
      "Fill in your details, add line items, and generate a clean invoice ready to send.",
    status: "live",
    icon: "file-text",
    href: "/tools/invoice-generator",
  },
  {
    slug: "link-in-bio",
    name: "Link in Bio Builder",
    tagline: "Build your own link page, download the HTML",
    description:
      "Configure links, pick a theme, and export a self-contained page you can host anywhere.",
    status: "live",
    icon: "layout-list",
    href: "/tools/link-in-bio",
  },
  {
    slug: "changelog-generator",
    name: "Changelog Generator",
    tagline: "Structure release notes, export clean HTML",
    description:
      "Add versions and entries by type (added, fixed, changed). Export as HTML or Markdown.",
    status: "live",
    icon: "list-ordered",
    href: "/tools/changelog-generator",
  },
  {
    slug: "waitlist-generator",
    name: "Waitlist Page Generator",
    tagline: "Launch a coming-soon page in 60 seconds",
    description:
      "Configure your branding, preview the result, and download a ready-to-deploy landing page.",
    status: "live",
    icon: "rocket",
    href: "/tools/waitlist-generator",
  },
  {
    slug: "device-mockup",
    name: "Device Mockup",
    tagline: "Frame screenshots in phones, laptops, and browsers",
    description:
      "Upload an image and wrap it in an iPhone, MacBook, iPad, or browser frame. Pure CSS rendering.",
    status: "live",
    icon: "monitor-smartphone",
    href: "/tools/device-mockup",
  },
  {
    slug: "uptime-checker",
    name: "Uptime Checker",
    tagline: "Spot-check any URL from your browser",
    description:
      "Ping a URL, measure response time, and see latency stats. No server needed, runs in your browser.",
    status: "live",
    icon: "activity",
    href: "/tools/uptime-checker",
  },
];

export const STACK_CATEGORIES = [
  {
    label: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    label: "Backend",
    items: ["Python", "FastAPI", "Node.js", "PostgreSQL"],
  },
  {
    label: "AI / ML",
    items: ["OpenAI", "Anthropic", "Deepgram", "Vercel AI SDK"],
  },
  {
    label: "Infra",
    items: ["Vercel", "Supabase", "Railway", "AWS"],
  },
] as const;

export const NAV_ITEMS = [
  { label: "Projects", href: "/projects" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
] as const;
