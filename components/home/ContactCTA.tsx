import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Reveal } from "@/components/ui/motion";

export interface ContactCTAProps {
  email?: string;
}

export function ContactCTA({ email }: ContactCTAProps) {
  return (
    <section className="py-20">
      <Reveal>
        <GlassPanel
          glow
          className="flex flex-col items-center gap-6 px-6 py-16 text-center"
        >
          <p className="telemetry">// OPEN A CHANNEL</p>
          <h2 className="text-nebula font-display max-w-2xl text-3xl font-extrabold sm:text-4xl">
            Let&apos;s build something off-world.
          </h2>
          <p className="max-w-md text-sm text-muted">
            Got a project, a question, or just want to talk shop about OutSystems and
            the front-end? My channel is open.
          </p>
          {email ? (
            <a
              href={`mailto:${email}`}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-nebula-cyan)]/40 bg-[var(--color-nebula-cyan)]/10 px-6 py-3 font-mono text-sm uppercase tracking-wider text-[var(--color-nebula-cyan)] transition-all hover:-translate-y-0.5 hover:glow-cyan"
            >
              <Mail size={16} /> Say hello
            </a>
          ) : (
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-nebula-cyan)]/40 bg-[var(--color-nebula-cyan)]/10 px-6 py-3 font-mono text-sm uppercase tracking-wider text-[var(--color-nebula-cyan)] transition-all hover:-translate-y-0.5 hover:glow-cyan"
            >
              More about me
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </GlassPanel>
      </Reveal>
    </section>
  );
}
