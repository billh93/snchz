export const SITE = {
  name: "SNCHZ",
  title: "Bill Sanchez",
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
    year: "2024 to now",
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
    url: "https://dope.link",
  },
];

export type Tool = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: "live" | "coming-soon";
  icon: string;
};

export const TOOLS: Tool[] = [
  {
    slug: "saas-calculator",
    name: "SaaS Metrics Calculator",
    tagline: "MRR, churn, LTV, CAC: calculate it all",
    description:
      "Plug in your numbers, get instant SaaS health metrics with benchmarks and visualizations.",
    status: "coming-soon",
    icon: "calculator",
  },
  {
    slug: "prompt-lab",
    name: "AI Prompt Lab",
    tagline: "Test prompts across models, side by side",
    description:
      "Compare outputs from GPT-4, Claude, and Gemini in real-time. Save, share, and iterate on prompts.",
    status: "coming-soon",
    icon: "sparkles",
  },
  {
    slug: "status-page",
    name: "Status Page Generator",
    tagline: "Ship a status page in 60 seconds",
    description:
      "Generate a beautiful, self-hosted status page with monitoring and incident management built in.",
    status: "coming-soon",
    icon: "activity",
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
