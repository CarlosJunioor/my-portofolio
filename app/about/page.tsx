import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Timeline } from "@/components/about/Timeline";
import { SkillConstellation } from "@/components/about/SkillConstellation";
import { Reveal } from "@/components/ui/motion";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "About",
  description: profile.bio.slice(0, 160),
};

export default function AboutPage() {
  return (
    <div className="space-y-16 pt-28 pb-12">
      <SectionHeading
        index="01"
        title="About"
        subtitle={`${profile.name} — ${profile.location}`}
      />

      <Reveal>
        <GlassPanel
          brackets
          className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center"
        >
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            width={120}
            height={120}
            className="h-30 w-30 shrink-0 rounded-full border border-white/10"
            priority
          />
          <p className="leading-relaxed text-muted">{profile.bio}</p>
        </GlassPanel>
      </Reveal>

      <section className="space-y-8">
        <SectionHeading index="02" title="Skills" />
        <SkillConstellation skills={profile.skills} />
      </section>

      <section className="space-y-8">
        <SectionHeading index="03" title="Mission Log" />
        <Timeline entries={profile.experience} />
      </section>
    </div>
  );
}
