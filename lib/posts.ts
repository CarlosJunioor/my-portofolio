import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { XMLParser } from "fast-xml-parser";
import type { Post } from "./types";
import { stripHtml, truncate } from "./utils";
import { profile } from "@/content/profile";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

// ---------- Native MDX ----------
export interface NativeFrontmatter {
  title: string;
  date: string;
  summary: string;
  tags?: string[];
  cover?: string;
}

export function getNativePosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
      const { data } = matter(raw);
      const fm = data as NativeFrontmatter;
      return {
        source: "native" as const,
        title: fm.title,
        url: `/posts/${slug}`,
        slug,
        date: new Date(fm.date).toISOString(),
        tags: fm.tags ?? [],
        summary: fm.summary,
        cover: fm.cover,
      };
    });
}

export function getNativePost(
  slug: string,
): { meta: NativeFrontmatter; content: string } | null {
  const file = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf-8"));
  return { meta: data as NativeFrontmatter, content };
}

// ---------- dev.to ----------
interface DevtoArticle {
  title: string;
  url: string;
  published_at: string;
  description: string;
  tag_list: string[];
  public_reactions_count: number;
  cover_image: string | null;
}

export function normalizeDevtoPost(a: DevtoArticle): Post {
  return {
    source: "devto",
    title: a.title,
    url: a.url,
    date: new Date(a.published_at).toISOString(),
    tags: a.tag_list ?? [],
    summary: truncate(stripHtml(a.description ?? ""), 160),
    reactions: a.public_reactions_count,
    cover: a.cover_image ?? undefined,
  };
}

export async function getDevtoPosts(): Promise<Post[]> {
  try {
    const handle = profile.socials.devto.split("/").pop();
    const res = await fetch(`https://dev.to/api/articles?username=${handle}&per_page=30`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as DevtoArticle[];
    return Array.isArray(data) ? data.map(normalizeDevtoPost) : [];
  } catch {
    return [];
  }
}

// ---------- Medium ----------
interface MediumItem {
  title: string;
  link: string;
  pubDate: string;
  category?: string | string[];
  "content:encoded"?: string;
  description?: string;
}

export function normalizeMediumItem(item: MediumItem): Post {
  const cats = item.category
    ? Array.isArray(item.category)
      ? item.category
      : [item.category]
    : [];
  const body = item["content:encoded"] ?? item.description ?? "";
  const text = stripHtml(body);
  const firstImg = /<img[^>]+src="([^"]+)"/i.exec(body)?.[1];
  return {
    source: "medium",
    title: item.title,
    url: item.link,
    date: new Date(item.pubDate).toISOString(),
    tags: cats,
    summary: truncate(text, 160),
    cover: firstImg,
  };
}

export async function getMediumPosts(): Promise<Post[]> {
  try {
    const handle = profile.socials.medium.split("/").pop(); // "@carlos-junior"
    const res = await fetch(`https://medium.com/feed/${handle}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      isArray: (n) => n === "item" || n === "category",
    });
    const parsed = parser.parse(xml);
    const items: MediumItem[] = parsed?.rss?.channel?.item ?? [];
    return items.map(normalizeMediumItem);
  } catch {
    return [];
  }
}

// ---------- Merge ----------
function dedupeKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function mergeAndSortPosts(native: Post[], devto: Post[], medium: Post[]): Post[] {
  const sorted = [...native, ...devto, ...medium].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const seen = new Set<string>();
  const out: Post[] = [];
  for (const p of sorted) {
    const key = dedupeKey(p.title);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

export async function getAllPosts(): Promise<Post[]> {
  const [devto, medium] = await Promise.all([getDevtoPosts(), getMediumPosts()]);
  return mergeAndSortPosts(getNativePosts(), devto, medium);
}
