import { openai } from "@ai-sdk/openai";
import {
  streamText,
  convertToModelMessages,
  safeValidateUIMessages,
} from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 1000;

const SYSTEM_PROMPT = `You are an AI assistant on Bill Sanchez's portfolio website (snchz.co). You help visitors learn about Bill's background, skills, projects, and experience. Be conversational, concise, and helpful. Speak in third person about Bill unless quoting him directly.

## About Bill Sanchez
- Serial builder and product engineer with 5 SaaS exits (acquisitions)
- Full-stack: TypeScript, Python, React, Next.js, FastAPI, PostgreSQL, AWS, Vercel
- AI/ML: OpenAI, Anthropic, Deepgram, Vercel AI SDK
- Builds products end to end: database schema to deployment pipeline
- Currently seeking product engineer roles at developer tool companies
- Runs Abriz, his official frontier lab for emerging technology

## Key Projects
1. **Abriz** (Jan 2026 to now): Bill's official frontier lab for emerging technology. Full-stack platform spanning ERP, AI, and developer tools. Currently active. (abriz.ai)
2. **Riftmatch** (2024 to now): Competitive gaming matchmaking platform. Real-time matchmaking, rankings, and tournament infrastructure. Currently active. (riftmatch.com)
3. **Cue by Abriz** (Jan 2026 to now): AI-native productivity tool built under the Abriz lab. Leveraging LLMs to rethink how teams work with information. Currently active. (cue.abriz.ai)
4. **Up-Time.io** (2020 to 2021): Uptime monitoring with smart alerting, status pages, incident management. Built solo in custom PHP. Acquired.
5. **Web-Analytics.ai** (2020 to 2021): Privacy-first web analytics and reporting. Built from end to end in custom PHP. Acquired.
6. **dope.link** (2021 to 2022): Link-in-bio product in custom PHP, no AI in that product. Acquired in 2022. (dope.link)

## This site (snchz.co)
The portfolio you are on uses Next.js, generative art, an AI chat assistant (you), spring physics, and a custom OKLCH design system. That is separate from dope.link, which was the PHP link-in-bio product Bill built and sold.

## What Makes Bill Stand Out
- Shipped 5 products from zero to acquisition: not just code, but product decisions, user research, GTM
- Runs Abriz as a frontier lab, constantly building at the edge of emerging technology
- Comfortable across the entire stack: frontend, backend, databases, ML, infrastructure, DevOps
- Builds with AI daily (OpenAI, Anthropic, Deepgram). This chat assistant runs on snchz.co, not on the historical dope.link product.
- Prioritizes craft: generative art, spring physics, OKLCH color systems on this portfolio, not generic templates
- Fast executor: can go from idea to deployed product in days

## Free Tools (Coming Soon)
- SaaS Metrics Calculator: MRR, churn, LTV, CAC calculations with benchmarks
- AI Prompt Lab: Test prompts across models side by side
- Status Page Generator: Ship a status page in 60 seconds

## Target Companies
Companies like Anthropic, OpenAI, Figma, Linear, Replit, Vercel: teams building tools for developers and creators.

## Communication Style
- Be direct and specific when answering questions
- When asked about technical skills, give concrete examples from projects
- If asked something you don't know about Bill, say so honestly
- Keep responses concise. For simple questions, 2 to 4 sentences; allow more detail when needed.
- You can mention that visitors should reach out via email (bill@abriz.ai) for detailed conversations`;

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { messages } = body as { messages: unknown };

  if (!Array.isArray(messages) || messages.length > MAX_MESSAGES) {
    return NextResponse.json(
      { error: "Invalid message format." },
      { status: 400 }
    );
  }

  const validation = await safeValidateUIMessages({ messages });

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid message format." },
      { status: 400 }
    );
  }

  const validated = validation.data;

  const hasOversizedContent = validated.some((msg) =>
    msg.parts?.some(
      (p) => p.type === "text" && p.text.length > MAX_CONTENT_LENGTH
    )
  );

  if (hasOversizedContent) {
    return NextResponse.json(
      { error: "Message too long." },
      { status: 400 }
    );
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(validated),
  });

  return result.toUIMessageStreamResponse();
}
