"use client";

import { useMemo, useState } from "react";
import type { Post, PostSource } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { PostCard } from "./PostCard";

export interface PostListProps {
  posts: Post[];
}

type Filter = "all" | PostSource;

const LABELS: Record<Filter, string> = {
  all: "All",
  native: "Native",
  devto: "dev.to",
  medium: "Medium",
};

export function PostList({ posts }: PostListProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const available = useMemo(() => {
    const sources = new Set(posts.map((p) => p.source));
    return (["all", "native", "devto", "medium"] as Filter[]).filter(
      (f) => f === "all" || sources.has(f as PostSource),
    );
  }, [posts]);

  const shown = filter === "all" ? posts : posts.filter((p) => p.source === filter);

  return (
    <div className="space-y-10">
      <SectionHeading
        index="00"
        title="Transmissions"
        subtitle={`${posts.length} logs across native, dev.to & Medium — merged into one feed.`}
      />

      <div className="flex flex-wrap gap-2">
        {available.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all",
              filter === f
                ? "glass text-star ring-1 ring-[var(--color-nebula-cyan)]/40"
                : "text-muted hover:text-star",
            )}
          >
            {LABELS[f]}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="py-16 text-center font-mono text-sm text-muted">
          No transmissions on this channel yet.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <PostCard key={`${p.source}-${p.url}`} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
