import { cn } from "@/lib/utils";

export interface TechChipProps {
  label: string;
  className?: string;
}

export function TechChip({ label, className }: TechChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-white/10 bg-white/[0.03]",
        "px-2 py-0.5 font-mono text-[0.65rem] tracking-wide text-muted",
        "transition-colors hover:border-[var(--color-nebula-cyan)]/40 hover:text-star",
        className,
      )}
    >
      {label}
    </span>
  );
}
