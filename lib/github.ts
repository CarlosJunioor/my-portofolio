import type { Project } from "./types";

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
  updated_at: string;
}

const USER = "CarlosJunioor";
const API = `https://api.github.com/users/${USER}/repos?sort=updated&per_page=100&type=owner`;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeUrl(url: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function mapRepoToProject(repo: GitHubRepo): Project {
  return {
    name: repo.name,
    slug: slugify(repo.name),
    description: repo.description ?? "",
    status: "archived",
    language: repo.language ?? undefined,
    stack: repo.language ? [repo.language] : [],
    stars: repo.stargazers_count,
    repoUrl: repo.html_url,
    liveUrl: normalizeUrl(repo.homepage),
    topics: repo.topics ?? [],
    updatedAt: repo.updated_at,
    featured: false,
  };
}

export async function getRepos(): Promise<GitHubRepo[]> {
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(API, { headers, next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = (await res.json()) as GitHubRepo[];
    return Array.isArray(data) ? data.filter((r) => !r.fork) : [];
  } catch {
    return [];
  }
}
