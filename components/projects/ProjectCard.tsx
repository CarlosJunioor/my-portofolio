import { Github, ArrowUpRight, Star, Lock } from "lucide-react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TechChip } from "@/components/ui/TechChip";

export interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const hasLinks = Boolean(project.liveUrl || project.repoUrl);

  return (
    <GlassPanel
      as="article"
      glow
      brackets={featured}
      className={cn(
        "flex flex-col overflow-hidden",
        featured ? "p-0" : "p-5",
      )}
    >
      {/* cover band */}
      <div
        className={cn(
          "relative w-full overflow-hidden",
          featured ? "h-28" : "h-20",
        )}
        style={
          project.thumbnail
            ? undefined
            : {
                background:
                  "linear-gradient(120deg, rgba(124,58,237,0.35), rgba(59,130,246,0.25) 45%, rgba(34,211,238,0.30))",
              }
        }
      >
        {project.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnail}
            alt={project.name}
            className="h-full w-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 flex items-end justify-between p-4">
            <span className="telemetry text-[0.6rem] opacity-80">
              {featured ? "// MISSION" : "// LOG"} · {project.status.toUpperCase()}
            </span>
            {project.language && (
              <span className="font-mono text-[0.6rem] text-star/70">
                {project.language}
              </span>
            )}
          </div>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col gap-3", featured ? "p-6" : "pt-4")}>
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              "font-display font-bold leading-tight text-star",
              featured ? "text-xl" : "text-base",
            )}
          >
            {project.name}
          </h3>
          <StatusBadge status={project.status} className="shrink-0" />
        </div>

        {project.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted">
            {project.description}
          </p>
        )}

        {project.stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, featured ? 6 : 4).map((t) => (
              <TechChip key={t} label={t} />
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 text-muted">
            {project.stars > 0 && (
              <span className="inline-flex items-center gap-1 font-mono text-xs">
                <Star size={13} className="text-[var(--color-building)]" />
                {project.stars}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!hasLinks && (
              <span className="inline-flex items-center gap-1 font-mono text-[0.65rem] uppercase tracking-wider text-archived">
                <Lock size={12} /> Private
              </span>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} live demo`}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--color-nebula-cyan)]/30 bg-[var(--color-nebula-cyan)]/10 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--color-nebula-cyan)] transition-colors hover:bg-[var(--color-nebula-cyan)]/20"
              >
                Live <ArrowUpRight size={13} />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} source code`}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted transition-colors hover:border-white/25 hover:text-star"
              >
                <Github size={13} /> Code
              </a>
            )}
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
