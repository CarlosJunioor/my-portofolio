import type { Project } from "./types";
import { getRepos, mapRepoToProject, type GitHubRepo } from "./github";
import {
  curationByRepo,
  manualProjects,
  hiddenRepos,
  type Curation,
} from "@/content/projects";

export interface ProjectBuckets {
  featured: Project[];
  live: Project[];
  archived: Project[];
}

export function mergeProjects(
  repos: GitHubRepo[],
  curation: Record<string, Curation>,
  manual: Project[],
  hidden: string[],
): ProjectBuckets {
  const hiddenSet = new Set(hidden);
  const orderOf = new Map<string, number>();

  const mapped: Project[] = repos
    .filter((r) => !hiddenSet.has(r.name))
    .map((r) => {
      const base = mapRepoToProject(r);
      const c = curation[r.name];
      if (!c) return base;
      orderOf.set(base.slug, c.order ?? 999);
      return {
        ...base,
        status: c.status ?? base.status,
        featured: c.featured ?? base.featured,
        description: c.tagline ?? base.description,
        stack: c.stack ?? base.stack,
        thumbnail: c.thumbnail ?? base.thumbnail,
      };
    });

  // Manual projects sort after curated repos (curated use order 1..999).
  manual.forEach((m, i) => orderOf.set(m.slug, 1000 + i));
  const all = [...mapped, ...manual];

  const featured = all
    .filter((p) => p.featured)
    .sort((a, b) => (orderOf.get(a.slug) ?? 999) - (orderOf.get(b.slug) ?? 999));
  const live = all.filter((p) => !p.featured && p.status === "live");
  const archived = all.filter((p) => !p.featured && p.status === "archived");

  return { featured, live, archived };
}

export async function getProjects(): Promise<ProjectBuckets> {
  const repos = await getRepos();
  return mergeProjects(repos, curationByRepo, manualProjects, hiddenRepos);
}
