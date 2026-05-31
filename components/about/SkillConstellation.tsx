"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SkillConstellationProps {
  skills: string[];
}

interface Node {
  label: string;
  x: number; // 0..100 (%)
  y: number; // 0..100 (%)
}

/** Deterministic position from index — stable across SSR/CSR (no Math.random). */
function layout(skills: string[]): Node[] {
  const n = skills.length;
  return skills.map((label, i) => {
    const angle = (i / n) * Math.PI * 2;
    // two interleaved rings for depth
    const ring = i % 2 === 0 ? 0.32 : 0.46;
    const wobble = 0.06 * Math.sin(i * 1.7);
    const r = ring + wobble;
    return {
      label,
      x: 50 + Math.cos(angle) * r * 100,
      y: 50 + Math.sin(angle) * r * 62,
    };
  });
}

export function SkillConstellation({ skills }: SkillConstellationProps) {
  const reduced = useReducedMotion();
  const [narrow, setNarrow] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Fallback: plain chip wrap
  if (reduced || narrow) {
    return (
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s}
            className="glass rounded-full px-3 py-1.5 font-mono text-xs text-star"
          >
            {s}
          </span>
        ))}
      </div>
    );
  }

  const nodes = layout(skills);

  return (
    <div className="relative h-[360px] w-full">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {nodes.map((node, i) => {
          const next = nodes[(i + 1) % nodes.length];
          const active = hover === i || hover === (i + 1) % nodes.length;
          return (
            <line
              key={i}
              x1={node.x}
              y1={node.y}
              x2={next.x}
              y2={next.y}
              stroke={active ? "rgba(34,211,238,0.55)" : "rgba(255,255,255,0.10)"}
              strokeWidth={0.25}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {nodes.map((node, i) => (
        <button
          key={node.label}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(i)}
          onBlur={() => setHover(null)}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 font-mono text-[0.7rem] transition-all duration-300",
            hover === i
              ? "glow-cyan border-[var(--color-nebula-cyan)]/60 bg-[var(--color-nebula-cyan)]/15 text-star"
              : "border-white/10 bg-white/[0.03] text-muted hover:text-star",
          )}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {node.label}
        </button>
      ))}
    </div>
  );
}
