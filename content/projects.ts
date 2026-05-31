import type { Project, ProjectStatus } from "@/lib/types";

/** Overrides applied on top of GitHub repos, keyed by exact repo name. */
export interface Curation {
  status?: ProjectStatus;
  featured?: boolean;
  tagline?: string;
  stack?: string[];
  thumbnail?: string;
  order?: number;
}

export const curationByRepo: Record<string, Curation> = {
  "skillzs-cli": {
    status: "building",
    featured: true,
    tagline:
      "A Roblox-style dashboard + CLI for installing AI-agent skills into Claude Code, Codex & Cursor.",
    stack: ["Next.js", "Tailwind", "Supabase", "Node"],
    order: 1,
  },
  "KeyPulse-Website": {
    status: "live",
    featured: true,
    tagline: "Informational platform for the KeyPulse eSports team — news, matches, rosters, sponsors.",
    stack: ["React", "Vite", "Tailwind", "TypeScript"],
    order: 3,
  },
  "varonaEsports-project": {
    status: "live",
    tagline: "Freelance site built for the Varona eSports organization.",
    stack: ["React", "JavaScript"],
  },
  "web3dev-website": { status: "live", tagline: "Next.js + TypeScript practice build." },
  "api-stuff": { status: "live", tagline: "API experiments incl. a Bitcoin price tracker." },
  SavedSouls_CommunityWeb: { status: "live", tagline: "Community web platform." },
};

/** Manually-authored projects that are not public GitHub repos. */
export const manualProjects: Project[] = [
  {
    name: "AIOS (OutSystems Agent)",
    slug: "aios",
    description: "Open-source OutSystems agent — an AI operating layer for low-code development.",
    status: "building",
    stack: ["OutSystems O11", "AI"],
    stars: 0,
    repoUrl: undefined,
    liveUrl: undefined,
    topics: ["outsystems", "ai", "agent"],
    updatedAt: "2026-05-31T00:00:00Z",
    featured: true,
  },
];

/** Repo names to hide from the site entirely (learning/boilerplate noise). */
export const hiddenRepos: string[] = [
  "CarlosJunioor",
  "React.js",
  "react",
  "react001",
  "curso-react",
  "javascript",
  "html-css",
  "Java",
  "c-programming",
  "javascript-projects",
  "todo-list",
  "Rocketseat---Explorer",
  "project-ragegardencss",
  "projeto-android",
];
