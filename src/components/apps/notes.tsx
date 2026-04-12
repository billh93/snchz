"use client";

import { SITE } from "@/lib/data";

export function NotesApp() {
  return (
    <div className="h-full overflow-auto bg-[#1e1e1e] p-6">
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            About {SITE.title}
          </h1>
          <p className="mt-1 text-sm text-white/40">{SITE.role}</p>
        </div>

        <div className="space-y-4 text-[15px] leading-relaxed text-white/70">
          <p>{SITE.description}</p>
          <p>
            I build products end-to-end — from the first wireframe to production deployment.
            My work spans frontend, backend, AI/ML, and infrastructure. I&apos;ve founded
            and sold 5 SaaS products, and I&apos;m currently building at Abriz, my frontier lab
            for emerging technology.
          </p>
          <p>
            My stack: Next.js, React, TypeScript, Python, FastAPI, PostgreSQL, Supabase,
            Vercel, AWS. I build with AI (OpenAI, Anthropic, Vercel AI SDK) and ship fast.
          </p>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">
            Connect
          </h2>
          <div className="flex flex-col gap-2 text-sm">
            <a
              href={`mailto:${SITE.email}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {SITE.email}
            </a>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              GitHub
            </a>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
