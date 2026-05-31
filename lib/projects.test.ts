import { describe, it, expect } from "vitest";
import { mergeProjects } from "./projects";
import type { GitHubRepo } from "./github";
import type { Project } from "./types";

const repos: GitHubRepo[] = [
  {
    name: "skillzs-cli",
    description: "cli",
    language: "JavaScript",
    stargazers_count: 0,
    html_url: "https://github.com/CarlosJunioor/skillzs-cli",
    homepage: "",
    topics: [],
    fork: false,
    updated_at: "2026-05-14T00:00:00Z",
  },
  {
    name: "KeyPulse-Website",
    description: "",
    language: "TypeScript",
    stargazers_count: 3,
    html_url: "https://github.com/CarlosJunioor/KeyPulse-Website",
    homepage: "https://keypulse-esports.vercel.app",
    topics: [],
    fork: false,
    updated_at: "2024-02-25T00:00:00Z",
  },
  {
    name: "noise-repo",
    description: "",
    language: "HTML",
    stargazers_count: 1,
    html_url: "https://github.com/CarlosJunioor/noise-repo",
    homepage: "",
    topics: [],
    fork: false,
    updated_at: "2023-01-01T00:00:00Z",
  },
];

const curation = {
  "skillzs-cli": {
    status: "building" as const,
    featured: true,
    tagline: "Skill installer.",
    stack: ["Node"],
    order: 1,
  },
  "KeyPulse-Website": { status: "live" as const, featured: true, order: 2 },
};

const manual: Project[] = [
  {
    name: "AIOS",
    slug: "aios",
    description: "agent",
    status: "building",
    stack: ["AI"],
    stars: 0,
    topics: [],
    updatedAt: "2026-05-31T00:00:00Z",
    featured: true,
  },
];

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
    const { live, archived } = mergeProjects(
      repos,
      { "skillzs-cli": { status: "live" as const } },
      [],
      ["noise-repo", "KeyPulse-Website"],
    );
    expect(live.some((p) => p.slug === "skillzs-cli")).toBe(true);
    expect(archived.length).toBe(0);
  });

  it("sorts featured by curation order then manual", () => {
    const { featured } = mergeProjects(repos, curation, manual, ["noise-repo"]);
    expect(featured[0].slug).toBe("skillzs-cli"); // order 1
  });
});
