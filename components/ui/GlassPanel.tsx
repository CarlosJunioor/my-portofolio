import { cn } from "@/lib/utils";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLElement> {
  /** element to render, defaults to div */
  as?: React.ElementType;
  /** show HUD corner brackets */
  brackets?: boolean;
  /** cyan glow + lift on hover */
  glow?: boolean;
}

/**
 * Frosted "viewport" surface — the building block for cards and panels across
 * the site. Optional HUD corner brackets and hover glow.
 */
export function GlassPanel({
  as: Tag = "div",
  brackets = false,
  glow = false,
  className,
  children,
  ...rest
}: GlassPanelProps) {
  return (
    <Tag
      className={cn(
        "glass relative rounded-[var(--radius-panel)]",
        brackets && "brackets",
        glow &&
          "transition-all duration-300 hover:-translate-y-1 hover:glow-cyan hover:border-white/15",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
