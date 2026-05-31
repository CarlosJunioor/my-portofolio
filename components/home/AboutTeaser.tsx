import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TechChip } from "@/components/ui/TechChip";
import { Reveal } from "@/components/ui/motion";

export interface AboutTeaserProps {
  bio: string;
  skills: string[];
}

export function AboutTeaser({ bio, skills }: AboutTeaserProps) {
  return (
    <section id="about" className="scroll-mt-24 py-20">
      <Reveal>
        <SectionHeading index="01" title="About" className="mb-8" />
        <GlassPanel brackets className="space-y-6 p-8">
          <p className="max-w-2xl leading-relaxed text-muted">{bio}</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <TechChip key={s} label={s} />
            ))}
          </div>
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-[var(--color-nebula-cyan)]"
          >
            Full bio
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </GlassPanel>
      </Reveal>
    </section>
  );
}
