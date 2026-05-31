import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import fs from "node:fs";
import path from "node:path";
import { getNativePost } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  const dir = path.join(process.cwd(), "content", "posts");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getNativePost(slug);
  return post ? { title: post.meta.title, description: post.meta.summary } : {};
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNativePost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl pt-28 pb-16">
      <Link
        href="/posts"
        className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-star"
      >
        <ArrowLeft size={14} /> All transmissions
      </Link>
      <p className="telemetry">{formatDate(post.meta.date)}</p>
      <h1 className="text-nebula font-display mt-3 text-4xl font-extrabold sm:text-5xl">
        {post.meta.title}
      </h1>
      <div className="prose-space mt-10">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
    </article>
  );
}
