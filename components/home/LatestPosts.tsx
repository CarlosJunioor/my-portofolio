import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/types";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { PostCard } from "@/components/posts/PostCard";
import { Reveal, Stagger } from "@/components/ui/motion";

export interface LatestPostsProps {
  posts: Post[];
}

export function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <section id="posts" className="scroll-mt-24 py-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <SectionHeading
          index="03"
          title="Latest Transmissions"
          subtitle="Notes from dev.to, Medium, and here."
        />
        <Link
          href="/posts"
          className="group hidden shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-star sm:inline-flex"
        >
          All posts
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="py-12 text-center font-mono text-sm text-muted">
          No transmissions yet.
        </p>
      ) : (
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Reveal key={`${p.source}-${p.url}`}>
              <PostCard post={p} />
            </Reveal>
          ))}
        </Stagger>
      )}
    </section>
  );
}
