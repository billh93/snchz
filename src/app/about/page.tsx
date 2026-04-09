import { SITE, STACK_CATEGORIES } from "@/lib/data";
import { Nav } from "@/components/nav";
import { FlowField } from "@/components/flow-field";
import { FadeIn } from "@/components/motion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Serial builder, product engineer, and full-stack developer with 5 exits.",
};

export default function AboutPage() {
  return (
    <>
      <FlowField />
      <Nav />
      <main className="pt-32 pb-20 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-golden">
              About
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {SITE.title}
            </h1>
            <p className="mt-2 text-xl text-muted-foreground">{SITE.role}</p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-12 space-y-6 text-lg leading-relaxed text-foreground/85">
              <p>
                I build products from zero to exit. Over the past five years,
                I&apos;ve designed, engineered, and shipped five SaaS platforms,
                each acquired. Not because I got lucky, but because I obsess
                over the full picture: what to build, how to build it, and
                whether anyone actually needs it.
              </p>
              <p>
                My background spans the entire stack. I write TypeScript and
                Python daily. I design databases, build APIs, craft frontends,
                set up CI/CD, and talk to users, often in the same day.
                I&apos;m most dangerous when I can own a product end to end.
              </p>
              <p>
                Right now I&apos;m looking for a product engineer role at a
                company that builds tools for developers and creators. I want to
                work with people who ship fast, care about craft, and believe
                that the best products are built by people who understand both
                the code and the customer.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-16 border-t border-border/30 pt-12">
              <h2 className="mb-8 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Stack
              </h2>
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                {STACK_CATEGORIES.map((category) => (
                  <div key={category.label}>
                    <h3 className="mb-3 text-sm font-medium text-golden/80">
                      {category.label}
                    </h3>
                    <ul className="space-y-1.5">
                      {category.items.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-muted-foreground"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-16 border-t border-border/30 pt-12">
              <h2 className="mb-6 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Get in Touch
              </h2>
              <div className="flex flex-wrap gap-6">
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-sm text-foreground transition-colors hover:text-golden"
                >
                  {SITE.email}
                </a>
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground transition-colors hover:text-golden"
                >
                  GitHub
                </a>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground transition-colors hover:text-golden"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    </>
  );
}
