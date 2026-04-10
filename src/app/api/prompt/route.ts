import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const MAX_PROMPT_LENGTH = 2000;
const MAX_SYSTEM_LENGTH = 1000;

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

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { prompt, system, temperature } = body as {
    prompt?: string;
    system?: string;
    temperature?: number;
  };

  if (typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json(
      { error: "Prompt is required." },
      { status: 400 }
    );
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: `Prompt must be under ${MAX_PROMPT_LENGTH} characters.` },
      { status: 400 }
    );
  }

  if (system && typeof system === "string" && system.length > MAX_SYSTEM_LENGTH) {
    return NextResponse.json(
      { error: `System prompt must be under ${MAX_SYSTEM_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const temp = typeof temperature === "number" ? Math.max(0, Math.min(2, temperature)) : 0.7;

  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: system?.trim() || undefined,
      prompt: prompt.trim(),
      temperature: temp,
    });

    return NextResponse.json({
      text: result.text,
      usage: result.usage,
    });
  } catch (err) {
    console.error("Prompt lab error:", err);
    return NextResponse.json(
      { error: "Failed to generate response." },
      { status: 500 }
    );
  }
}
