import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

export const maxDuration = 30;

const isRateLimited = createRateLimiter(30, 60 * 60 * 1000);

const MAX_PROMPT_LENGTH = 2000;
const MAX_SYSTEM_LENGTH = 1000;

export async function POST(req: Request) {
  if (isRateLimited(getClientIp(req))) {
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
