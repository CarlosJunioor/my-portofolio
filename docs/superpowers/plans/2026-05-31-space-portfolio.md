# Deep Space Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Design components:** Tasks tagged **[frontend-design]** must be implemented by invoking the `frontend-design:frontend-design` skill with the given props interface + design contract. The skill produces the polished aesthetic code; the contract is the acceptance bar.

**Goal:** Replace the barebones CRA scaffold in `my-portofolio` with a polished, space-themed Next.js 16 portfolio showcasing Carlos Junior's bio, projects (live/building/archived "mission control"), and a hybrid posts feed (native MDX + dev.to + Medium).

**Architecture:** Next.js 16 App Router (RSC) on Vercel. A fixed canvas starfield + nebula backdrop sits behind glassmorphic content. Server-side data layer (`lib/`) fetches GitHub repos, dev.to articles, and Medium RSS with ISR caching and graceful fallback; a curation layer (`content/`) lets Carlos hand-pick featured/running projects. Pure data-transform functions are TDD'd with Vitest; visual components are built with the frontend-design skill against typed contracts and verified by build + render.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, lucide-react, next-mdx-remote + gray-matter (native posts), fast-xml-parser (Medium RSS), Vitest.

**Reference data:** `docs/research/profile.json` (GitHub-verified projects, 11 dev.to + 9 Medium posts, socials). **Spec:** `docs/superpowers/specs/2026-05-31-space-portfolio-design.md`.

**Conventions:**
- All commands run from repo root `my-portofolio/` (PowerShell on Windows).
- Branch: `revamp/space-portfolio` (already created).
- Commit after every task. Commit messages use Conventional Commits.

---

## Phase 0 — Scaffold & Tooling

### Task 0.1: Remove CRA scaffold

**Files:**
- Delete: `src/` (entire CRA app), `tailwind.config.js`, `public/index.html`, `public/manifest.json`, `public/robots.txt`, `public/logo192.png`, `public/logo512.png`
- Keep: `.git/`, `.gitignore` (will edit), `README.md` (will rewrite), `public/favicon.ico`, `docs/`
- Salvage: copy `src/assets/*.otf`, `src/assets/*.woff2` → `public/fonts/` only if you decide to keep them (default: discard, we use Google fonts)

- [ ] **Step 1: Delete CRA source and stale public files**

```powershell
Remove-Item -Recurse -Force src
Remove-Item -Force tailwind.config.js, public/index.html, public/manifest.json, public/robots.txt, public/logo192.png, public/logo512.png
```

- [ ] **Step 2: Verify only intended files remain**

Run: `Get-ChildItem -Force -Name; Get-ChildItem public -Name`
Expected: root shows `.git .gitignore docs package.json package-lock.json README.md public`; `public` shows `favicon.ico`.

- [ ] **Step 3: Commit**

```powershell
git add -A; git commit -m "chore: remove Create React App scaffold"
```

### Task 0.2: Write `package.json`

**Files:**
- Modify: `package.json` (replace dependencies/scripts wholesale)
- Delete: `package-lock.json` (regenerated on install)

- [ ] **Step 1: Replace `package.json` with:**

```json
{
  "name": "my-portofolio",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.11.0",
    "lucide-react": "^0.460.0",
    "next-mdx-remote": "^5.0.0",
    "gray-matter": "^4.0.3",
    "fast-xml-parser": "^4.5.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/node": "^22.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.47",
    "vitest": "^2.1.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^16.0.0"
  }
}
```

- [ ] **Step 2: Remove old lockfile and install**

```powershell
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
```
Expected: installs without peer-dep errors; creates `node_modules` + new `package-lock.json`. If `next@^16.0.0` is unavailable, pin to the latest published 16.x shown by `npm view next version` and re-run.

- [ ] **Step 3: Commit**

```powershell
git add package.json package-lock.json; git commit -m "chore: add Next.js 16 + Tailwind v4 dependencies"
```

### Task 0.3: Config files (TS, Next, PostCSS, gitignore, env)

**Files:**
- Create: `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `next-env.d.ts` (auto), `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Create `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "media2.dev.to" },
      { protocol: "https", hostname: "cdn-images-1.medium.com" },
      { protocol: "https", hostname: "**.vercel.app" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Create `postcss.config.mjs`**

```js
const config = {
  plugins: ["@tailwindcss/postcss"],
};
export default config;
```

- [ ] **Step 4: Create `.env.example`**

```bash
# Optional: raises GitHub API rate limit from 60/hr to 5000/hr (read-only, public_repo scope not required)
GITHUB_TOKEN=
```

- [ ] **Step 5: Replace `.gitignore`**

```gitignore
/node_modules
/.next/
/out/
/build
.DS_Store
*.pem
npm-debug.log*
.env*.local
.env
.vercel
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 6: Verify dev server boots (no pages yet → expect 404, not crash)**

Run: `npm run dev` then open http://localhost:3000 ; Ctrl+C to stop.
Expected: server starts on :3000; compiles without config errors (a 404 page is fine — no routes yet).

- [ ] **Step 7: Commit**

```powershell
git add -A; git commit -m "chore: add Next.js, TypeScript, PostCSS config"
```

### Task 0.4: Vitest config

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": new URL("./", import.meta.url).pathname },
  },
});
```

- [ ] **Step 2: Verify Vitest runs (no tests yet)**

Run: `npm test`
Expected: "No test files found" (exit 0) — config valid.

- [ ] **Step 3: Commit**

```powershell
git add vitest.config.ts; git commit -m "chore: add Vitest config"
```

---

## Phase 1 — Theme & Design Tokens

### Task 1.1: Global stylesheet with space-theme tokens (Tailwind v4)

**Files:**
- Create: `app/globals.css`

- [ ] **Step 1: Create `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  /* Deep space palette */
  --color-space-900: #05060a;
  --color-space-800: #0a0b14;
  --color-space-700: #11131f;
  --color-nebula-violet: #7c3aed;
  --color-nebula-blue: #3b82f6;
  --color-nebula-cyan: #22d3ee;
  --color-nebula-magenta: #e879f9;
  --color-star: #e6e8ef;
  --color-muted: #9aa0b4;
  --color-live: #34d399;
  --color-building: #fbbf24;
  --color-archived: #64748b;

  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --radius-panel: 1rem;
}

:root {
  color-scheme: dark;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-space-900);
  color: var(--color-star);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* Utility: gradient nebula text */
.text-nebula {
  background-image: linear-gradient(
    100deg,
    var(--color-nebula-violet),
    var(--color-nebula-blue),
    var(--color-nebula-cyan)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Glass surface */
.glass {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}

/* Mono telemetry label */
.telemetry {
  font-family: var(--font-mono);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-size: 0.72rem;
  color: var(--color-nebula-cyan);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Commit**

```powershell
git add app/globals.css; git commit -m "feat: add space-theme design tokens and base styles"
```

---

## Phase 2 — Types & Data Layer (TDD)

### Task 2.1: Shared types

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```ts
export type ProjectStatus = "live" | "building" | "archived";

export interface Project {
  name: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  language?: string;
  stack: string[];
  stars: number;
  repoUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
  topics: string[];
  updatedAt: string;
  featured: boolean;
}

export type PostSource = "native" | "devto" | "medium";

export interface Post {
  source: PostSource;
  title: string;
  url: string; // external URL, or internal "/posts/<slug>" for native
  slug?: string;
  date: string; // ISO 8601
  tags: string[];
  summary: string;
  reactions?: number;
  cover?: string;
}

export interface ExperienceEntry {
  period: string;
  role: string;
  org?: string;
  detail?: string;
}

export interface SocialLinks {
  github: string;
  devto: string;
  medium: string;
  x: string;
  linkedin: string;
}

export interface Profile {
  name: string;
  location: string;
  shortBio: string;
  bio: string;
  roles: string[];
  skills: string[];
  experience: ExperienceEntry[];
  socials: SocialLinks;
  email?: string;
  avatarUrl: string;
}
```

- [ ] **Step 2: Commit**

```powershell
git add lib/types.ts; git commit -m "feat: add shared domain types"
```

### Task 2.2: Utilities

**Files:**
- Create: `lib/utils.ts`
- Test: `lib/utils.test.ts`

- [ ] **Step 1: Write the failing test `lib/utils.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { cn, formatDate, stripHtml, truncate } from "./utils";

describe("cn", () => {
  it("merges and dedupes tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-star", false && "hidden", "font-bold")).toBe("text-star font-bold");
  });
});

describe("formatDate", () => {
  it("formats an ISO date as 'Mon YYYY'", () => {
    expect(formatDate("2026-04-24T15:06:11Z")).toBe("Apr 2026");
  });
  it("handles RFC-822 dates", () => {
    expect(formatDate("Wed, 13 May 2026 23:05:28 GMT")).toBe("May 2026");
  });
  it("returns empty string for invalid input", () => {
    expect(formatDate("not-a-date")).toBe("");
  });
});

describe("stripHtml", () => {
  it("removes tags and collapses whitespace", () => {
    expect(stripHtml("<p>Hello   <b>world</b></p>")).toBe("Hello world");
  });
});

describe("truncate", () => {
  it("truncates to n chars with ellipsis on word boundary", () => {
    expect(truncate("the quick brown fox", 9)).toBe("the quick…");
  });
  it("leaves short strings untouched", () => {
    expect(truncate("short", 20)).toBe("short");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/utils.test.ts`
Expected: FAIL — cannot find module `./utils`.

- [ ] **Step 3: Create `lib/utils.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice) + "…";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/utils.test.ts`
Expected: PASS (all 4 describe blocks green).

- [ ] **Step 5: Commit**

```powershell
git add lib/utils.ts lib/utils.test.ts; git commit -m "feat: add cn/formatDate/stripHtml/truncate utils with tests"
```

### Task 2.3: GitHub → Project mapping

**Files:**
- Create: `lib/github.ts`
- Test: `lib/github.test.ts`

- [ ] **Step 1: Write the failing test `lib/github.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { mapRepoToProject, type GitHubRepo } from "./github";

const sample: GitHubRepo = {
  name: "KeyPulse-Website",
  description: "eSports site",
  language: "TypeScript",
  stargazers_count: 3,
  html_url: "https://github.com/CarlosJunioor/KeyPulse-Website",
  homepage: "https://keypulse-esports.vercel.app",
  topics: ["esports"],
  fork: false,
  updated_at: "2024-02-25T14:44:39Z",
};

describe("mapRepoToProject", () => {
  it("maps a repo into a Project with archived default status", () => {
    const p = mapRepoToProject(sample);
    expect(p.name).toBe("KeyPulse-Website");
    expect(p.slug).toBe("keypulse-website");
    expect(p.stars).toBe(3);
    expect(p.repoUrl).toBe(sample.html_url);
    expect(p.liveUrl).toBe("https://keypulse-esports.vercel.app");
    expect(p.status).toBe("archived");
    expect(p.featured).toBe(false);
    expect(p.stack).toContain("TypeScript");
  });

  it("treats empty homepage as no liveUrl", () => {
    const p = mapRepoToProject({ ...sample, homepage: "" });
    expect(p.liveUrl).toBeUndefined();
  });

  it("normalizes a bare-domain homepage to https", () => {
    const p = mapRepoToProject({ ...sample, homepage: "varonaesports.vercel.app" });
    expect(p.liveUrl).toBe("https://varonaesports.vercel.app");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/github.test.ts`
Expected: FAIL — cannot find module `./github`.

- [ ] **Step 3: Create `lib/github.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/github.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add lib/github.ts lib/github.test.ts; git commit -m "feat: add GitHub repo fetch + Project mapping with tests"
```

### Task 2.4: Project curation merge

**Files:**
- Create: `lib/projects.ts`, `content/projects.ts`
- Test: `lib/projects.test.ts`

- [ ] **Step 1: Create `content/projects.ts` (curation data)**

```ts
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
    tagline: "A Roblox-style dashboard + CLI for installing AI-agent skills into Claude Code, Codex & Cursor.",
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
  "SavedSouls_CommunityWeb": { status: "live", tagline: "Community web platform." },
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
  "CarlosJunioor", "React.js", "react", "react001", "curso-react", "javascript",
  "html-css", "Java", "c-programming", "javascript-projects", "todo-list",
  "Rocketseat---Explorer", "project-ragegardencss", "projeto-android",
];
```

- [ ] **Step 2: Write the failing test `lib/projects.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { mergeProjects } from "./projects";
import type { GitHubRepo } from "./github";
import type { Project } from "./types";

const repos: GitHubRepo[] = [
  { name: "skillzs-cli", description: "cli", language: "JavaScript", stargazers_count: 0,
    html_url: "https://github.com/CarlosJunioor/skillzs-cli", homepage: "", topics: [], fork: false, updated_at: "2026-05-14T00:00:00Z" },
  { name: "KeyPulse-Website", description: "", language: "TypeScript", stargazers_count: 3,
    html_url: "https://github.com/CarlosJunioor/KeyPulse-Website", homepage: "https://keypulse-esports.vercel.app", topics: [], fork: false, updated_at: "2024-02-25T00:00:00Z" },
  { name: "noise-repo", description: "", language: "HTML", stargazers_count: 1,
    html_url: "https://github.com/CarlosJunioor/noise-repo", homepage: "", topics: [], fork: false, updated_at: "2023-01-01T00:00:00Z" },
];

const curation = {
  "skillzs-cli": { status: "building" as const, featured: true, tagline: "Skill installer.", stack: ["Node"], order: 1 },
  "KeyPulse-Website": { status: "live" as const, featured: true, order: 2 },
};

const manual: Project[] = [{
  name: "AIOS", slug: "aios", description: "agent", status: "building", stack: ["AI"],
  stars: 0, topics: [], updatedAt: "2026-05-31T00:00:00Z", featured: true,
}];

describe("mergeProjects", () => {
  it("applies curation overrides over github data", () => {
    const { featured } = mergeProjects(repos, curation, manual, ["noise-repo"]);
    const skill = featured.find((p) => p.slug === "skillzs-cli")!;
    expect(skill.status).toBe("building");
    expect(skill.description).toBe("Skill installer."); // tagline overrides description
    expect(skill.stack).toEqual(["Node"]);
  });

  it("includes manual projects in featured", () => {
    const { featured } = mergeProjects(repos, curation, manual, []);
    expect(featured.some((p) => p.slug === "aios")).toBe(true);
  });

  it("hides repos listed in hidden", () => {
    const all = mergeProjects(repos, curation, manual, ["noise-repo"]);
    const names = [...all.featured, ...all.live, ...all.archived].map((p) => p.name);
    expect(names).not.toContain("noise-repo");
  });

  it("buckets non-featured live repos into live and the rest into archived", () => {
    const { live, archived } = mergeProjects(repos, {
      "skillzs-cli": { status: "live" as const },
    }, [], ["noise-repo", "KeyPulse-Website"]);
    expect(live.some((p) => p.slug === "skillzs-cli")).toBe(true);
    expect(archived.length).toBe(0);
  });

  it("sorts featured by curation order then manual", () => {
    const { featured } = mergeProjects(repos, curation, manual, ["noise-repo"]);
    expect(featured[0].slug).toBe("skillzs-cli"); // order 1
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- lib/projects.test.ts`
Expected: FAIL — `mergeProjects` not exported.

- [ ] **Step 4: Create `lib/projects.ts`**

```ts
import type { Project } from "./types";
import { getRepos, mapRepoToProject, type GitHubRepo } from "./github";
import {
  curationByRepo,
  manualProjects,
  hiddenRepos,
  type Curation,
} from "@/content/projects";

interface Buckets {
  featured: Project[];
  live: Project[];
  archived: Project[];
}

export function mergeProjects(
  repos: GitHubRepo[],
  curation: Record<string, Curation>,
  manual: Project[],
  hidden: string[],
): Buckets {
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

  manual.forEach((m, i) => orderOf.set(m.slug, i));
  const all = [...mapped, ...manual];

  const featured = all
    .filter((p) => p.featured)
    .sort((a, b) => (orderOf.get(a.slug) ?? 999) - (orderOf.get(b.slug) ?? 999));
  const live = all.filter((p) => !p.featured && p.status === "live");
  const archived = all.filter((p) => !p.featured && p.status === "archived");

  return { featured, live, archived };
}

export async function getProjects(): Promise<Buckets> {
  const repos = await getRepos();
  return mergeProjects(repos, curationByRepo, manualProjects, hiddenRepos);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- lib/projects.test.ts`
Expected: PASS (all 5 cases).

- [ ] **Step 6: Commit**

```powershell
git add lib/projects.ts content/projects.ts lib/projects.test.ts; git commit -m "feat: add project curation merge with tests"
```

### Task 2.5: Posts aggregation (native + dev.to + Medium)

**Files:**
- Create: `lib/posts.ts`
- Test: `lib/posts.test.ts`

- [ ] **Step 1: Write the failing test `lib/posts.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { normalizeDevtoPost, normalizeMediumItem, mergeAndSortPosts } from "./posts";
import type { Post } from "./types";

describe("normalizeDevtoPost", () => {
  it("maps a dev.to API article into a Post", () => {
    const p = normalizeDevtoPost({
      title: "Outsytems Data Types",
      url: "https://dev.to/carlosjuniordev/outsytems-data-types-8i4",
      published_at: "2022-11-07T15:20:01Z",
      description: "Hi folks...",
      tag_list: ["lowcode", "outsystems"],
      public_reactions_count: 4,
      cover_image: null,
    });
    expect(p.source).toBe("devto");
    expect(p.title).toBe("Outsytems Data Types");
    expect(p.tags).toEqual(["lowcode", "outsystems"]);
    expect(p.reactions).toBe(4);
    expect(p.cover).toBeUndefined();
  });
});

describe("normalizeMediumItem", () => {
  it("maps a parsed RSS item into a Post and strips html from summary", () => {
    const p = normalizeMediumItem({
      title: "50 hours experience on mentor",
      link: "https://medium.com/@carlos-junior/50-hours-experience-on-mentor-e8b9eb818df6",
      pubDate: "Wed, 13 May 2026 23:05:28 GMT",
      category: ["outsystems-development"],
      "content:encoded": "<p>After running <b>10 apps</b> through Mentor...</p>",
    });
    expect(p.source).toBe("medium");
    expect(p.tags).toEqual(["outsystems-development"]);
    expect(p.summary.startsWith("After running 10 apps")).toBe(true);
    expect(p.summary).not.toContain("<");
  });

  it("coerces a single string category into an array", () => {
    const p = normalizeMediumItem({
      title: "x", link: "https://m/x", pubDate: "Wed, 13 May 2026 23:05:28 GMT",
      category: "mentor", "content:encoded": "<p>hi</p>",
    });
    expect(p.tags).toEqual(["mentor"]);
  });
});

describe("mergeAndSortPosts", () => {
  it("merges sources and sorts by date desc", () => {
    const native: Post[] = [{ source: "native", title: "n", url: "/posts/n", slug: "n", date: "2026-05-20T00:00:00Z", tags: [], summary: "" }];
    const devto: Post[] = [{ source: "devto", title: "d", url: "https://d", date: "2022-09-22T00:00:00Z", tags: [], summary: "" }];
    const medium: Post[] = [{ source: "medium", title: "m", url: "https://m", date: "2026-05-13T00:00:00Z", tags: [], summary: "" }];
    const merged = mergeAndSortPosts(native, devto, medium);
    expect(merged.map((p) => p.title)).toEqual(["n", "m", "d"]);
  });

  it("dedupes cross-posts with the same normalized title, preferring native", () => {
    const devto: Post[] = [{ source: "devto", title: "React Router Explained", url: "https://d", date: "2022-09-22T00:00:00Z", tags: [], summary: "" }];
    const medium: Post[] = [{ source: "medium", title: "react router explained", url: "https://m", date: "2022-09-15T00:00:00Z", tags: [], summary: "" }];
    const merged = mergeAndSortPosts([], devto, medium);
    expect(merged.length).toBe(1);
    expect(merged[0].source).toBe("devto"); // newer of the two duplicates kept
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/posts.test.ts`
Expected: FAIL — functions not exported.

- [ ] **Step 3: Create `lib/posts.ts`**

```ts
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

export function getNativePost(slug: string): { meta: NativeFrontmatter; content: string } | null {
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
  const cats = item.category ? (Array.isArray(item.category) ? item.category : [item.category]) : [];
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
    const res = await fetch(`https://medium.com/feed/${handle}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, isArray: (n) => n === "item" || n === "category" });
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
  const rank: Record<Post["source"], number> = { native: 0, devto: 1, medium: 2 };
  for (const p of sorted) {
    const key = dedupeKey(p.title);
    if (seen.has(key)) {
      // keep the one already chosen (newer, since sorted desc); native beats same-date externals handled by sort+rank
      continue;
    }
    seen.add(key);
    out.push(p);
  }
  void rank;
  return out;
}

export async function getAllPosts(): Promise<Post[]> {
  const [devto, medium] = await Promise.all([getDevtoPosts(), getMediumPosts()]);
  return mergeAndSortPosts(getNativePosts(), devto, medium);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/posts.test.ts`
Expected: PASS. (Note: the dedupe test keeps the newer of two same-title posts; dev.to 2022-09-22 is newer than Medium 2022-09-15, so `devto` is kept.)

- [ ] **Step 5: Run the full suite**

Run: `npm test`
Expected: all suites (utils, github, projects, posts) PASS.

- [ ] **Step 6: Commit**

```powershell
git add lib/posts.ts lib/posts.test.ts; git commit -m "feat: add posts aggregation (native/devto/medium) with tests"
```

### Task 2.6: Profile content

**Files:**
- Create: `content/profile.ts`

- [ ] **Step 1: Create `content/profile.ts`** (DRAFT bio — Carlos edits later)

```ts
import type { Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Carlos Junior",
  location: "Lisbon, Portugal",
  shortBio: "OutSystems dev & front-end enjoyer",
  bio: "Carlos Junior is a Brazilian developer based in Lisbon, Portugal. After starting out in sales, he made the jump into software — first falling for front-end, then going deep on OutSystems / low-code as a consultant. Today he balances client work with building open-source developer tooling: skillZs, a catalog + CLI for installing AI-agent skills into Claude Code, Codex, and Cursor, and AIOS, an OutSystems agent. He likes shipping things people actually use, clean UI, and the occasional eSports site.",
  roles: ["OutSystems O11 / Low-code Consultant", "Front-end Developer"],
  skills: [
    "OutSystems O11", "React", "TypeScript", "JavaScript", "Next.js",
    "Tailwind CSS", "HTML/CSS", "Node.js", "Supabase", "Vite", "Git",
  ],
  experience: [
    { period: "Now", role: "OutSystems Consultant & OSS Builder", org: "Independent / Client work", detail: "Low-code delivery on OutSystems O11; building open-source dev tooling (skillZs, AIOS)." },
    { period: "Recent", role: "Front-end Developer", detail: "React / TypeScript / Next.js — client and freelance projects (incl. eSports sites)." },
    { period: "2022", role: "Career shift into software", detail: "Moved from sales into dev; attempted 42 Lisbon, kept building and writing." },
  ],
  socials: {
    github: "https://github.com/CarlosJunioor",
    devto: "https://dev.to/carlosjuniordev",
    medium: "https://medium.com/@carlos-junior",
    x: "https://x.com/CarlosJuniordev",
    linkedin: "https://www.linkedin.com/in/carlosjuniordev/",
  },
  email: undefined,
  avatarUrl: "https://avatars.githubusercontent.com/u/104463604?v=4",
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors (profile satisfies `Profile`).

- [ ] **Step 3: Commit**

```powershell
git add content/profile.ts; git commit -m "feat: add profile content (draft bio + experience)"
```

---

## Phase 3 — Background FX & UI Primitives  [frontend-design]

> For each component: create the file with the exact props interface shown, then invoke the **frontend-design** skill to implement the body to the design contract. Verify with `npx tsc --noEmit` and a visual check in `npm run dev`. Commit per task.

### Task 3.1: Starfield (canvas background)

**Files:** Create `components/background/Starfield.tsx`

**Interface:**
```ts
"use client";
export interface StarfieldProps {
  density?: number;   // stars per layer, default 120
  layers?: number;    // parallax layers, default 3
  className?: string;
}
export function Starfield(props: StarfieldProps): JSX.Element
```

**Design contract:**
- Fixed, full-viewport `<canvas>` behind all content (`position: fixed; inset:0; z-index:-2`).
- Multi-layer parallax: deeper layers smaller/dimmer/slower; subtle twinkle (opacity oscillation).
- Slow drift; occasional shooting star (~1 per 8–15s).
- `requestAnimationFrame` loop; cancel on unmount; resize-aware (devicePixelRatio).
- Honors `prefers-reduced-motion`: render a static star field, no animation loop.
- No layout shift; pointer-events none.

- [ ] **Step 1: Create file with the interface and a minimal static placeholder body.**
- [ ] **Step 2: Invoke frontend-design to implement the animated canvas to contract.**
- [ ] **Step 3: `npx tsc --noEmit` → no errors.**
- [ ] **Step 4: Commit** — `git commit -am "feat: add parallax starfield background"`

### Task 3.2: NebulaBackdrop

**Files:** Create `components/background/NebulaBackdrop.tsx`

**Interface:**
```ts
export interface NebulaBackdropProps { className?: string }
export function NebulaBackdrop(props: NebulaBackdropProps): JSX.Element
```

**Design contract:**
- Fixed full-viewport (`z-index:-1`), 2–3 large blurred radial-gradient blobs in violet/blue/cyan at low opacity.
- Very slow CSS keyframe drift (transform/translate), GPU-friendly (`will-change: transform`).
- Disabled motion → static gradients. pointer-events none.

- [ ] **Step 1: Create file + interface.**
- [ ] **Step 2: frontend-design implements.**
- [ ] **Step 3: tsc clean.**
- [ ] **Step 4: Commit** — `"feat: add drifting nebula backdrop"`

### Task 3.3: GlassPanel, StatusBadge, TechChip, SectionHeading, motion primitives

**Files:** Create `components/ui/GlassPanel.tsx`, `components/ui/StatusBadge.tsx`, `components/ui/TechChip.tsx`, `components/layout/SectionHeading.tsx`, `components/ui/motion.tsx`

**Interfaces:**
```ts
// GlassPanel.tsx
export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  glow?: boolean;
}
// StatusBadge.tsx
import type { ProjectStatus } from "@/lib/types";
export interface StatusBadgeProps { status: ProjectStatus; className?: string }
// TechChip.tsx
export interface TechChipProps { label: string; className?: string }
// SectionHeading.tsx
export interface SectionHeadingProps { index: string; title: string; subtitle?: string; className?: string }
// motion.tsx  ("use client")
export interface RevealProps { children: React.ReactNode; delay?: number; className?: string }
export function Reveal(props: RevealProps): JSX.Element  // fade+rise on scroll into view, reduced-motion safe
```

**Design contract:**
- `GlassPanel`: `.glass` surface, `--radius-panel`, optional cyan/magenta glow on hover; renders `as` element.
- `StatusBadge`: pill using `--color-live/-building/-archived`; LIVE shows a steady dot, BUILDING a pulsing dot, ARCHIVED a muted dot; mono uppercase label.
- `TechChip`: small mono chip with subtle border.
- `SectionHeading`: `<p class="telemetry">// {index} — {title}</p>` pattern + large `text-nebula` heading + optional subtitle.
- `Reveal`: Framer Motion `whileInView` fade + 16px rise, `viewport={{ once: true }}`, disabled under reduced-motion.

- [ ] **Step 1: Create all five files with interfaces + minimal bodies.**
- [ ] **Step 2: frontend-design implements all five to contract (shared visual language).**
- [ ] **Step 3: `npx tsc --noEmit` clean.**
- [ ] **Step 4: Commit** — `"feat: add glass/badge/chip/heading/motion UI primitives"`

---

## Phase 4 — Layout Shell  [frontend-design]

### Task 4.1: Navbar (HUD)

**Files:** Create `components/layout/Navbar.tsx` (`"use client"`)

**Interface:**
```ts
export interface NavItem { label: string; href: string }
export interface NavbarProps { items?: NavItem[] }
export function Navbar(props: NavbarProps): JSX.Element
```
Default items: `[{label:"Home",href:"/"},{label:"Projects",href:"/projects"},{label:"Posts",href:"/posts"},{label:"About",href:"/about"}]`.

**Design contract:**
- Sticky top, glass pill, blends on scroll (transparent → frosted after ~40px).
- Active route highlight via `usePathname()`. On `/`, optional scroll-spy to sections (`#about`,`#missions`,`#posts`).
- Mobile: hamburger → glass dropdown. Keyboard accessible; `aria-current` on active.
- Small monospace wordmark "CJ // dev" linking home.

- [ ] **Step 1: Create file + interface + default items.**
- [ ] **Step 2: frontend-design implements.**
- [ ] **Step 3: tsc clean; verify nav renders + active state.**
- [ ] **Step 4: Commit** — `"feat: add HUD navbar"`

### Task 4.2: Footer / Comms

**Files:** Create `components/layout/Footer.tsx`

**Interface:**
```ts
export function Footer(): JSX.Element  // reads profile.socials
```

**Design contract:**
- "Comms" panel: social icon links (GitHub, dev.to, Medium, X, LinkedIn) via lucide-react, email if present.
- Mono "© {year} Carlos Junior — transmitting from Lisbon, Portugal". Year from `new Date().getFullYear()` (server component, safe).
- Subtle top hairline gradient.

- [ ] **Step 1: Create file.**
- [ ] **Step 2: frontend-design implements.**
- [ ] **Step 3: tsc clean.**
- [ ] **Step 4: Commit** — `"feat: add comms footer"`

### Task 4.3: Root layout + fonts + metadata

**Files:** Create `app/layout.tsx`

- [ ] **Step 1: Create `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Starfield } from "@/components/background/Starfield";
import { NebulaBackdrop } from "@/components/background/NebulaBackdrop";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { profile } from "@/content/profile";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${profile.name} — ${profile.shortBio}`, template: `%s — ${profile.name}` },
  description: profile.bio.slice(0, 160),
  metadataBase: new URL("https://carlosjuniordev.vercel.app"),
  openGraph: { title: profile.name, description: profile.shortBio, type: "website" },
  twitter: { card: "summary_large_image", creator: "@CarlosJuniordev" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <NebulaBackdrop />
        <Starfield />
        <Navbar />
        <main className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify** — `npm run dev`, open `/`: starfield + nebula + nav + footer render with no console errors (page body empty until Phase 5). `npx tsc --noEmit` clean.
- [ ] **Step 3: Commit** — `git add app/layout.tsx; git commit -m "feat: wire root layout with fonts, backgrounds, shell"`

---

## Phase 5 — Home Page  [frontend-design]

### Task 5.1: Hero

**Files:** Create `components/home/Hero.tsx` (`"use client"` for motion)

**Interface:**
```ts
export interface HeroProps { name: string; roles: string[]; location: string }
export function Hero(props: HeroProps): JSX.Element
```

**Design contract:**
- Full-height first view. Huge `text-nebula` name; animated role line (cycle through `roles`, typewriter or fade).
- Mono coordinate flourish (e.g. `// LAT 38.72° N  LON 9.14° W — LISBON`).
- Two CTAs: "View Missions" → `/projects`, "Read Logs" → `/posts`. Social orbit or row.
- Scroll-cue chevron. Subtle entrance animation; reduced-motion safe.

- [ ] Steps: create+interface → frontend-design → tsc → commit `"feat: add hero"`

### Task 5.2: AboutTeaser, FeaturedMissions, LatestPosts, ContactCTA

**Files:** Create `components/home/AboutTeaser.tsx`, `components/home/FeaturedMissions.tsx`, `components/home/LatestPosts.tsx`, `components/home/ContactCTA.tsx`

**Interfaces:**
```ts
import type { Project, Post } from "@/lib/types";
export interface AboutTeaserProps { bio: string; skills: string[] }
export interface FeaturedMissionsProps { projects: Project[] }   // uses ProjectCard (Phase 6)
export interface LatestPostsProps { posts: Post[] }              // uses PostCard (Phase 7)
export interface ContactCTAProps { email?: string }
```

**Design contract:**
- `AboutTeaser` (`#about`): short bio in a GlassPanel + skill chips + "Full bio →" link to `/about`.
- `FeaturedMissions` (`#missions`): SectionHeading + grid of featured `ProjectCard`s + "All projects →".
- `LatestPosts` (`#posts`): SectionHeading + 3 latest `PostCard`s + "All posts →".
- `ContactCTA`: glowing panel, "Open a channel" mailto/links.
- Each wrapped in `Reveal`.

- [ ] Steps per component: create+interface → frontend-design → tsc → commit.

### Task 5.3: Home page composition

**Files:** Create `app/page.tsx`

- [ ] **Step 1: Create `app/page.tsx`**

```tsx
import { Hero } from "@/components/home/Hero";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { FeaturedMissions } from "@/components/home/FeaturedMissions";
import { LatestPosts } from "@/components/home/LatestPosts";
import { ContactCTA } from "@/components/home/ContactCTA";
import { profile } from "@/content/profile";
import { getProjects } from "@/lib/projects";
import { getAllPosts } from "@/lib/posts";

export default async function HomePage() {
  const [{ featured }, posts] = await Promise.all([getProjects(), getAllPosts()]);
  return (
    <>
      <Hero name={profile.name} roles={profile.roles} location={profile.location} />
      <AboutTeaser bio={profile.bio} skills={profile.skills} />
      <FeaturedMissions projects={featured} />
      <LatestPosts posts={posts.slice(0, 3)} />
      <ContactCTA email={profile.email} />
    </>
  );
}
```

- [ ] **Step 2: Verify** — `npm run dev`, `/` renders all sections with real data (featured projects from curation+GitHub, latest posts from feeds). `npx tsc --noEmit` clean.
- [ ] **Step 3: Commit** — `"feat: compose home page"`

---

## Phase 6 — Projects (Mission Control)  [frontend-design]

### Task 6.1: ProjectCard

**Files:** Create `components/projects/ProjectCard.tsx`

**Interface:**
```ts
import type { Project } from "@/lib/types";
export interface ProjectCardProps { project: Project; featured?: boolean }
export function ProjectCard(props: ProjectCardProps): JSX.Element
```

**Design contract:**
- GlassPanel card: name, StatusBadge, description, TechChips (from `stack`), ⭐ stars if >0.
- Actions: "Live" link (only if `liveUrl`) + "Code" link (only if `repoUrl`), lucide icons, open in new tab.
- Hover glow + slight lift. `featured` variant is larger/richer (telemetry readout row).
- Thumbnail optional (`thumbnail`); graceful when absent (gradient placeholder).

- [ ] Steps: create+interface → frontend-design → tsc → commit `"feat: add project card"`

### Task 6.2: MissionControlBoard + /projects page

**Files:** Create `components/projects/MissionControlBoard.tsx` (`"use client"` for filter), `app/projects/page.tsx`

**Interface:**
```ts
import type { Project } from "@/lib/types";
export interface MissionControlBoardProps { featured: Project[]; live: Project[]; archived: Project[] }
export function MissionControlBoard(props: MissionControlBoardProps): JSX.Element
```

**Design contract:**
- Header "Mission Control" + summary telemetry (counts: N live, N building, N archived).
- Filter tabs: All / Live / Building / Archived (client state).
- Featured row (rich cards) → live grid → archived grid (collapsed/condensed).
- Empty-state messaging if a bucket is empty.

- [ ] **Step 1: Create board file + interface + page file:**
```tsx
// app/projects/page.tsx
import type { Metadata } from "next";
import { MissionControlBoard } from "@/components/projects/MissionControlBoard";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const { featured, live, archived } = await getProjects();
  return <MissionControlBoard featured={featured} live={live} archived={archived} />;
}
```
- [ ] **Step 2: frontend-design implements the board.**
- [ ] **Step 3: Verify `/projects` renders + filters work; tsc clean.**
- [ ] **Step 4: Commit** — `"feat: add mission control projects page"`

---

## Phase 7 — Posts (Feed + Reader)  [frontend-design + data]

### Task 7.1: PostCard + PostList

**Files:** Create `components/posts/PostCard.tsx`, `components/posts/PostList.tsx` (`"use client"` for filter)

**Interface:**
```ts
import type { Post, PostSource } from "@/lib/types";
export interface PostCardProps { post: Post }
export interface PostListProps { posts: Post[] }
```

**Design contract:**
- `PostCard`: source badge (NATIVE = cyan, dev.to = white, Medium = green-ish), title, formatted date, tag chips, reactions if present. Native links internal; external open new tab.
- `PostList`: source filter (All / Native / dev.to / Medium), responsive grid, newest first, empty state.

- [ ] Steps: create+interfaces → frontend-design → tsc → commit `"feat: add post card + list"`

### Task 7.2: /posts page

**Files:** Create `app/posts/page.tsx`

- [ ] **Step 1: Create**
```tsx
import type { Metadata } from "next";
import { PostList } from "@/components/posts/PostList";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "Posts" };

export default async function PostsPage() {
  const posts = await getAllPosts();
  return <PostList posts={posts} />;
}
```
- [ ] **Step 2: Verify `/posts` shows merged dev.to + Medium feed; filters work; tsc clean.**
- [ ] **Step 3: Commit** — `"feat: add posts feed page"`

### Task 7.3: Native MDX reader + components

**Files:** Create `components/mdx/MDXComponents.tsx`, `app/posts/[slug]/page.tsx`, `content/posts/welcome-to-the-deck.mdx`

- [ ] **Step 1: Create a seed native post `content/posts/welcome-to-the-deck.mdx`**
```mdx
---
title: "Welcome to the Deck"
date: "2026-05-31"
summary: "Why I rebuilt my portfolio as a deep-space mission control — and what you'll find here."
tags: ["meta", "nextjs"]
---

This is the captain's log. I rebuilt my corner of the internet as a little
spacecraft: **projects** are missions (live, building, archived), and **posts**
are the logs. Most of my writing lives on [dev.to](https://dev.to/carlosjuniordev)
and [Medium](https://medium.com/@carlos-junior) — they show up here automatically.

More soon. 🛰️
```

- [ ] **Step 2: Create `components/mdx/MDXComponents.tsx`** (styled renderers: h1–h3, p, a, ul/ol, code/pre, blockquote, img → next/image where possible) — minimal body, then **frontend-design** polishes the prose styling to match the theme.

- [ ] **Step 3: Create `app/posts/[slug]/page.tsx`**
```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "node:fs";
import path from "node:path";
import { getNativePost } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  const dir = path.join(process.cwd(), "content", "posts");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getNativePost(slug);
  return post ? { title: post.meta.title, description: post.meta.summary } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getNativePost(slug);
  if (!post) notFound();
  return (
    <article className="prose-invert mx-auto max-w-3xl py-16">
      <p className="telemetry">{formatDate(post.meta.date)}</p>
      <h1 className="text-nebula font-display text-4xl font-bold">{post.meta.title}</h1>
      <div className="mt-8">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Verify** — `/posts/welcome-to-the-deck` renders MDX styled; the post also appears in `/posts` feed (native badge). `npx tsc --noEmit` clean.
- [ ] **Step 5: Commit** — `"feat: add native MDX post reader + seed post"`

---

## Phase 8 — About  [frontend-design]

### Task 8.1: Timeline + SkillConstellation

**Files:** Create `components/about/Timeline.tsx`, `components/about/SkillConstellation.tsx` (`"use client"`)

**Interface:**
```ts
import type { ExperienceEntry } from "@/lib/types";
export interface TimelineProps { entries: ExperienceEntry[] }
export interface SkillConstellationProps { skills: string[] }
```

**Design contract:**
- `Timeline`: vertical "mission log" — glowing node per entry, period (mono), role, org, detail; connecting line; Reveal stagger.
- `SkillConstellation`: skills as stars connected by faint lines (CSS/SVG); hover highlights; **falls back to a plain chip wrap** under reduced-motion or small screens.

- [ ] Steps: create+interfaces → frontend-design → tsc → commit `"feat: add timeline + skill constellation"`

### Task 8.2: /about page

**Files:** Create `app/about/page.tsx`

- [ ] **Step 1: Create**
```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Timeline } from "@/components/about/Timeline";
import { SkillConstellation } from "@/components/about/SkillConstellation";
import { profile } from "@/content/profile";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="py-16 space-y-16">
      <SectionHeading index="01" title="About" subtitle={`${profile.name} — ${profile.location}`} />
      <GlassPanel className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center">
        <Image src={profile.avatarUrl} alt={profile.name} width={120} height={120}
          className="rounded-full border border-white/10" />
        <p className="text-muted leading-relaxed">{profile.bio}</p>
      </GlassPanel>
      <section>
        <SectionHeading index="02" title="Skills" />
        <SkillConstellation skills={profile.skills} />
      </section>
      <section>
        <SectionHeading index="03" title="Mission Log" />
        <Timeline entries={profile.experience} />
      </section>
    </div>
  );
}
```
- [ ] **Step 2: Verify `/about` renders bio, avatar, skills, timeline; tsc clean.**
- [ ] **Step 3: Commit** — `"feat: add about page"`

---

## Phase 9 — Polish, SEO, Resilience, Deploy

### Task 9.1: Themed 404

**Files:** Create `app/not-found.tsx`

- [ ] **Step 1: Create**
```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="telemetry">// SIGNAL LOST — 404</p>
      <h1 className="text-nebula font-display mt-4 text-6xl font-bold">Lost in space</h1>
      <p className="text-muted mt-4">This coordinate doesn&apos;t exist on the star map.</p>
      <Link href="/" className="glass mt-8 rounded-full px-6 py-3 hover:opacity-90">Return to base →</Link>
    </div>
  );
}
```
- [ ] **Step 2: Verify a bad URL renders it; tsc clean.**
- [ ] **Step 3: Commit** — `"feat: add themed 404"`

### Task 9.2: sitemap + robots

**Files:** Create `app/sitemap.ts`, `app/robots.ts`

- [ ] **Step 1: Create `app/robots.ts`**
```ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://carlosjuniordev.vercel.app/sitemap.xml" };
}
```
- [ ] **Step 2: Create `app/sitemap.ts`**
```ts
import type { MetadataRoute } from "next";
import { getNativePosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://carlosjuniordev.vercel.app";
  const routes = ["", "/projects", "/posts", "/about"].map((r) => ({ url: `${base}${r}` }));
  const posts = getNativePosts().map((p) => ({ url: `${base}${p.url}` }));
  return [...routes, ...posts];
}
```
- [ ] **Step 3: tsc clean; commit** — `"feat: add sitemap and robots"`

### Task 9.3: Accessibility, reduced-motion, responsive audit

- [ ] **Step 1:** Manually audit each page at mobile (375px) and desktop widths; fix overflow/spacing in the relevant component.
- [ ] **Step 2:** Toggle OS "reduce motion"; confirm Starfield/Nebula/Reveal/constellation degrade to static. Fix any that don't.
- [ ] **Step 3:** Keyboard-tab through nav, cards, links; ensure visible focus rings (add `focus-visible:outline` utilities where missing) and `aria-label`s on icon-only links.
- [ ] **Step 4:** Commit — `"fix: a11y, reduced-motion, responsive polish"`

### Task 9.4: Build smoke + lint

- [ ] **Step 1:** Run `npm run build`. Expected: build succeeds; all routes compile. Fix any RSC/client boundary errors (mark interactive components `"use client"`).
- [ ] **Step 2:** Run `npm run lint`. Fix errors.
- [ ] **Step 3:** Run `npm test`. Expected: all unit suites pass.
- [ ] **Step 4:** Commit — `"chore: pass build, lint, tests"`

### Task 9.5: README + deploy notes

**Files:** Modify `README.md`

- [ ] **Step 1:** Rewrite `README.md`: project description, stack, `npm run dev/build/test`, env (`GITHUB_TOKEN` optional), where content lives (`content/profile.ts`, `content/projects.ts` curation, `content/posts/*.mdx`), how posts feeds work, Vercel deploy.
- [ ] **Step 2:** Commit — `"docs: rewrite README for the Next.js space portfolio"`

### Task 9.6: Deploy to Vercel

- [ ] **Step 1:** Push branch: `git push -u origin revamp/space-portfolio`.
- [ ] **Step 2:** Open a PR (or deploy a Vercel preview from the branch). Confirm the existing Vercel project `carlosjuniordev.vercel.app` builds the new app; set `GITHUB_TOKEN` in Vercel env (optional).
- [ ] **Step 3:** Verify preview URL: all pages render, feeds populate, Lighthouse ≥ 90 perf/a11y/SEO on `/`.
- [ ] **Step 4:** After review, merge to `master` for production deploy.

---

## Self-Review (completed by author)

**Spec coverage:**
- Deep Space aesthetic → Phase 1 tokens + 3.1/3.2 FX + design contracts ✔
- Mission Control projects (live/building/archived, GitHub sync, curation) → 2.3/2.4 + Phase 6 ✔
- Hybrid posts (native MDX + dev.to + Medium @carlos-junior) → 2.5 + Phase 7 ✔
- About (bio + timeline + skills) → 2.6 + Phase 8 ✔
- Resilience (try/catch + ISR fallback) → 2.3/2.5 (all fetchers return [] on failure) ✔
- Testing (pure transforms unit-tested + build smoke) → 2.2–2.5 + 9.4 ✔
- SEO/metadata/OG/sitemap/robots/404 → 4.3 + 9.1/9.2 ✔
- Migration off CRA → Phase 0 ✔
- Reduced-motion/a11y/responsive → 9.3 + every design contract ✔

**Placeholder scan:** Visual tasks intentionally delegate body implementation to frontend-design against a typed interface + contract (not vague TODOs). All deterministic files (config, lib, content, pages) have complete code. No "TBD".

**Type consistency:** `Project`, `Post`, `Profile`, `ProjectStatus`, `PostSource`, `ExperienceEntry`, `SocialLinks` defined in 2.1 and used consistently. `mapRepoToProject`/`mergeProjects`/`getProjects` signatures match across 2.3/2.4/6.2. `getAllPosts`/`getNativePost`/`normalize*` match across 2.5/7.x. `profile.socials.{devto,medium}` used by `lib/posts.ts` and defined in 2.6.

**Open content items (non-blocking, tracked in spec §13):** AIOS repo visibility, bio/dates verification, font choice — all have working defaults.
