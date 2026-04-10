"use client";

import { STACK_CATEGORIES } from "@/lib/data";
import { FadeIn, StaggerChildren } from "@/components/motion";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function StackSection() {
  return (
    <section
      className="relative py-32 px-6 lg:px-8"
      data-arcanum="the tools shape the maker"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <FadeIn>
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-foreground/50">
                How I Build
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                End to end,
                <br />
                every time
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                I don&apos;t just write frontend code. For every product I&apos;ve
                built, from database schema to deployment pipeline, I shipped
                alone or led the technical decisions. That&apos;s what 5
                acquisitions in 5 years teaches you: own the whole stack, or
                don&apos;t ship.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-foreground/20 to-transparent" />
                <span className="font-mono text-xs text-foreground/30">
                  2019 &rarr; now
                </span>
              </div>
            </div>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-2 gap-6">
            {STACK_CATEGORIES.map((category) => (
              <motion.div key={category.label} variants={itemVariants}>
                <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {category.label}
                </h3>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-foreground/80"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </section>
  );
}
