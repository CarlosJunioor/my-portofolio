import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal, Stagger } from "@/components/ui/motion";

export interface FeaturedMissionsProps {
  projects: Project[];
}

export function FeaturedMissions({ projects }: FeaturedMissionsProps) {
  return (
    <section id="missions" className="scroll-mt-24 py-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <SectionHeading
          index="02"
          title="Featured Missions"
          subtitle="What I'm building and shipping right now."
        />
        <Link
          href="/projects"
          className="group hidden shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-star sm:inline-flex"
        >
          All projects
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="py-12 text-center font-mono text-sm text-muted">
          No missions logged yet.
        </p>
      ) : (
        <Stagger className="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => (
            <Reveal key={p.slug}>
              <ProjectCard project={p} featured />
            </Reveal>
          ))}
        </Stagger>
      )}
    </section>
  );
}
