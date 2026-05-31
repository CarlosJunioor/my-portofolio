import { cn } from "@/lib/utils";

export interface NebulaBackdropProps {
  className?: string;
}

/**
 * Fixed, full-viewport nebula atmosphere: large blurred radial-gradient blobs
 * drifting slowly behind all content. Pure CSS; honors reduced-motion (the
 * global media query freezes the drift animation).
 */
export function NebulaBackdrop({ className }: NebulaBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 overflow-hidden", className)}
      style={{ zIndex: -1 }}
    >
      {/* violet, top-left */}
      <div
        className="animate-nebula absolute"
        style={{
          top: "-15%",
          left: "-10%",
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(circle at center, rgba(124,58,237,0.30), rgba(124,58,237,0) 60%)",
          filter: "blur(60px)",
          willChange: "transform",
        }}
      />
      {/* blue, mid-right */}
      <div
        className="animate-nebula absolute"
        style={{
          top: "20%",
          right: "-15%",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(circle at center, rgba(59,130,246,0.24), rgba(59,130,246,0) 62%)",
          filter: "blur(70px)",
          animationDelay: "-8s",
          willChange: "transform",
        }}
      />
      {/* cyan, bottom-center */}
      <div
        className="animate-nebula absolute"
        style={{
          bottom: "-20%",
          left: "25%",
          width: "50vw",
          height: "50vw",
          background:
            "radial-gradient(circle at center, rgba(34,211,238,0.18), rgba(34,211,238,0) 60%)",
          filter: "blur(80px)",
          animationDelay: "-16s",
          willChange: "transform",
        }}
      />
      {/* subtle vignette to anchor content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(5,6,10,0.6) 100%)",
        }}
      />
    </div>
  );
}
