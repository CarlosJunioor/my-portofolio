import type { ExperienceEntry } from "@/lib/types";
import { Reveal, Stagger } from "@/components/ui/motion";

export interface TimelineProps {
  entries: ExperienceEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  return (
    <Stagger className="relative ml-2">
      {/* vertical flight line */}
      <span
        aria-hidden="true"
        className="absolute left-[5px] top-2 bottom-2 w-px"
        style={{
          background:
            "linear-gradient(180deg, rgba(34,211,238,0.6), rgba(124,58,237,0.4), transparent)",
        }}
      />
      <ol className="space-y-8">
        {entries.map((e, i) => (
          <Reveal as="li" key={`${e.period}-${i}`} className="relative pl-8">
            <span
              aria-hidden="true"
              className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--color-nebula-cyan)] glow-cyan"
            />
            <p className="telemetry text-[0.6rem]">{e.period}</p>
            <h3 className="mt-1 font-display text-lg font-bold text-star">{e.role}</h3>
            {e.org && <p className="text-xs text-muted/80">{e.org}</p>}
            {e.detail && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.detail}</p>
            )}
          </Reveal>
        ))}
      </ol>
    </Stagger>
  );
}
