import { SITE } from "@/lib/data";
import { FadeIn } from "@/components/motion";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Mail } from "lucide-react";

const currentYear = new Date().getFullYear();

export function FooterSection() {
  return (
    <footer
      className="relative border-t border-border/30 py-20 px-6 lg:px-8"
      data-opus="the great work continues"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-foreground/60">
                Let&apos;s Talk
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Building something?
                <br />
                <span className="text-muted-foreground">I want to help.</span>
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                I&apos;m looking for product engineer roles at companies
                building tools for developers and creators. If that&apos;s you,
                let&apos;s talk.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4">
              <a
                href={`mailto:${SITE.email}`}
                className="group flex items-center gap-3 text-foreground transition-colors hover:text-foreground/70"
              >
                <Mail className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground/70" />
                <span className="text-sm">{SITE.email}</span>
              </a>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-foreground transition-colors hover:text-foreground/70"
              >
                <GitHubIcon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground/70" />
                <span className="text-sm">GitHub</span>
              </a>
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-foreground transition-colors hover:text-foreground/70"
              >
                <LinkedInIcon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground/70" />
                <span className="text-sm">LinkedIn</span>
              </a>
            </div>
          </div>
        </FadeIn>

        <div className="mt-16 flex items-center justify-between border-t border-border/20 pt-8">
          <p className="text-xs text-muted-foreground/50">
            &copy; {currentYear} {SITE.title}
          </p>
          <p className="font-mono text-xs text-muted-foreground/30">
            Built with Next.js, Tailwind, Vercel
          </p>
        </div>

        {/* Those who seek will find */}
        <div
          className="mt-4 flex justify-center"
          aria-hidden="true"
        >
          <span
            className="font-mono text-[8px] tracking-[0.5em] text-muted-foreground/[0.08] transition-all duration-1000 hover:text-muted-foreground/30 hover:tracking-[0.8em] cursor-default select-none"
            title="Quod est inferius est sicut quod est superius"
          >
            ORDO AB CHAO
          </span>
        </div>
      </div>
    </footer>
  );
}
