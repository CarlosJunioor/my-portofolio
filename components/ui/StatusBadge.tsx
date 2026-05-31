import type { ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const CONFIG: Record<
  ProjectStatus,
  { label: string; dot: string; text: string; ring: string; pulse: boolean }
> = {
  live: {
    label: "Live",
    dot: "bg-[var(--color-live)] text-[var(--color-live)]",
    text: "text-[var(--color-live)]",
    ring: "border-[var(--color-live)]/30 bg-[var(--color-live)]/10",
    pulse: false,
  },
  building: {
    label: "Building",
    dot: "bg-[var(--color-building)] text-[var(--color-building)]",
    text: "text-[var(--color-building)]",
    ring: "border-[var(--color-building)]/30 bg-[var(--color-building)]/10",
    pulse: true,
  },
  archived: {
    label: "Archived",
    dot: "bg-[var(--color-archived)] text-[var(--color-archived)]",
    text: "text-[var(--color-archived)]",
    ring: "border-[var(--color-archived)]/30 bg-[var(--color-archived)]/5",
    pulse: false,
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const c = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        "font-mono text-[0.6rem] font-semibold uppercase tracking-[0.18em]",
        c.ring,
        c.text,
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", c.dot, c.pulse && "animate-status")}
      />
      {c.label}
    </span>
  );
}
