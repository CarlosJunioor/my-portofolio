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
