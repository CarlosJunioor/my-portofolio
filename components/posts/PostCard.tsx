import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import type { Post, PostSource } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TechChip } from "@/components/ui/TechChip";

export interface PostCardProps {
  post: Post;
}

const SOURCE_META: Record<PostSource, { label: string; cls: string }> = {
  native: {
    label: "Native",
    cls: "border-[var(--color-nebula-cyan)]/30 bg-[var(--color-nebula-cyan)]/10 text-[var(--color-nebula-cyan)]",
  },
  devto: {
    label: "dev.to",
    cls: "border-white/20 bg-white/10 text-star",
  },
  medium: {
    label: "Medium",
    cls: "border-[var(--color-live)]/30 bg-[var(--color-live)]/10 text-[var(--color-live)]",
  },
};

export function PostCard({ post }: PostCardProps) {
  const isNative = post.source === "native";
  const meta = SOURCE_META[post.source];

  return (
    <GlassPanel as="article" glow className="group relative flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.18em]",
            meta.cls,
          )}
        >
          {meta.label}
        </span>
        {!isNative && (
          <ArrowUpRight
            size={16}
            className="text-muted transition-colors group-hover:text-[var(--color-nebula-cyan)]"
          />
        )}
      </div>

      <h3 className="font-display text-lg font-bold leading-snug text-star line-clamp-2">
        {isNative ? (
          <Link href={post.url} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        ) : (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="after:absolute after:inset-0"
          >
            {post.title}
          </a>
        )}
      </h3>

      <p className="telemetry text-[0.6rem]">{formatDate(post.date)}</p>

      {post.summary && (
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{post.summary}</p>
      )}

      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((t) => (
            <TechChip key={t} label={t} />
          ))}
        </div>
        {typeof post.reactions === "number" && post.reactions > 0 && (
          <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-muted">
            <Heart size={12} className="text-[var(--color-nebula-magenta)]" />
            {post.reactions}
          </span>
        )}
      </div>
    </GlassPanel>
  );
}
