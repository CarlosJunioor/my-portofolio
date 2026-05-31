import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  /** zero-padded index, e.g. "01" */
  index: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  index,
  title,
  subtitle,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <p className="telemetry flex items-center gap-2">
        <span className="inline-block h-px w-6 bg-[var(--color-nebula-cyan)]/50" />
        {index} — {title}
      </p>
      <h2 className="text-nebula font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="max-w-xl text-sm text-muted">{subtitle}</p>}
    </div>
  );
}
