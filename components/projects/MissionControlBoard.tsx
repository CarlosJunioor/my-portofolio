"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ProjectCard } from "./ProjectCard";

export interface MissionControlBoardProps {
  featured: Project[];
  live: Project[];
  archived: Project[];
}

type Filter = "all" | ProjectStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "building", label: "Building" },
  { key: "archived", label: "Archived" },
];

export function MissionControlBoard({ featured, live, archived }: MissionControlBoardProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const all = useMemo(() => [...featured, ...live, ...archived], [featured, live, archived]);
  const counts = useMemo(
    () => ({
      live: all.filter((p) => p.status === "live").length,
      building: all.filter((p) => p.status === "building").length,
      archived: all.filter((p) => p.status === "archived").length,
    }),
    [all],
  );

  const match = (p: Project) => filter === "all" || p.status === filter;
  const shownFeatured = featured.filter(match);
  const shownRest = [...live, ...archived].filter(match);
  const empty = shownFeatured.length === 0 && shownRest.length === 0;

  return (
    <div className="space-y-10">
      <SectionHeading
        index="00"
        title="Mission Control"
        subtitle="Things I've launched, things I'm building, and the archive behind them."
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="telemetry text-[0.65rem]">
          {counts.live} LIVE · {counts.building} BUILDING · {counts.archived} ARCHIVED
        </p>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all",
                filter === f.key
                  ? "glass text-star ring-1 ring-[var(--color-nebula-cyan)]/40"
                  : "text-muted hover:text-star",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {empty && (
        <p className="py-16 text-center font-mono text-sm text-muted">
          No missions in this sector.
        </p>
      )}

      {shownFeatured.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          {shownFeatured.map((p) => (
            <ProjectCard key={p.slug} project={p} featured />
          ))}
        </div>
      )}

      {shownRest.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shownRest.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
