"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";

export interface HeroProps {
  name: string;
  roles: string[];
  location: string;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero({ name, roles, location }: HeroProps) {
  const reduced = useReducedMotion();
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    if (reduced || roles.length <= 1) return;
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2800);
    return () => clearInterval(id);
  }, [reduced, roles.length]);

  return (
    <section className="relative flex min-h-[92vh] flex-col justify-center pt-20">
      <motion.div
        variants={reduced ? undefined : container}
        initial={reduced ? undefined : "hidden"}
        animate={reduced ? undefined : "show"}
        className="max-w-3xl"
      >
        <motion.p variants={reduced ? undefined : item} className="telemetry mb-5">
          // LAT 38.72°N · LON 9.14°W — {location}
        </motion.p>

        <motion.h1
          variants={reduced ? undefined : item}
          className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl"
        >
          <span className="text-star">Hi, I&apos;m</span>
          <br />
          <span className="text-nebula">{name}</span>
        </motion.h1>

        <motion.div
          variants={reduced ? undefined : item}
          className="mt-6 flex h-8 items-center font-mono text-lg text-muted sm:text-xl"
        >
          <span className="mr-2 text-[var(--color-nebula-cyan)]">▹</span>
          {reduced ? (
            <span>{roles[0]}</span>
          ) : (
            <motion.span
              key={roleIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {roles[roleIdx]}
            </motion.span>
          )}
        </motion.div>

        <motion.div
          variants={reduced ? undefined : item}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-nebula-cyan)]/40 bg-[var(--color-nebula-cyan)]/10 px-6 py-3 font-mono text-sm uppercase tracking-wider text-[var(--color-nebula-cyan)] transition-all hover:-translate-y-0.5 hover:glow-cyan"
          >
            View Missions
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/posts"
            className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm uppercase tracking-wider text-star transition-all hover:-translate-y-0.5"
          >
            Read Logs
          </Link>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
        <ChevronDown className="animate-cue text-muted" size={24} aria-hidden="true" />
      </div>
    </section>
  );
}
