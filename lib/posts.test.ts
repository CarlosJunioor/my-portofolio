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
      title: "x",
      link: "https://m/x",
      pubDate: "Wed, 13 May 2026 23:05:28 GMT",
      category: "mentor",
      "content:encoded": "<p>hi</p>",
    });
    expect(p.tags).toEqual(["mentor"]);
  });
});

describe("mergeAndSortPosts", () => {
  it("merges sources and sorts by date desc", () => {
    const native: Post[] = [
      { source: "native", title: "n", url: "/posts/n", slug: "n", date: "2026-05-20T00:00:00Z", tags: [], summary: "" },
    ];
    const devto: Post[] = [
      { source: "devto", title: "d", url: "https://d", date: "2022-09-22T00:00:00Z", tags: [], summary: "" },
    ];
    const medium: Post[] = [
      { source: "medium", title: "m", url: "https://m", date: "2026-05-13T00:00:00Z", tags: [], summary: "" },
    ];
    const merged = mergeAndSortPosts(native, devto, medium);
    expect(merged.map((p) => p.title)).toEqual(["n", "m", "d"]);
  });

  it("dedupes cross-posts with the same normalized title, preferring the newer", () => {
    const devto: Post[] = [
      { source: "devto", title: "React Router Explained", url: "https://d", date: "2022-09-22T00:00:00Z", tags: [], summary: "" },
    ];
    const medium: Post[] = [
      { source: "medium", title: "react router explained", url: "https://m", date: "2022-09-15T00:00:00Z", tags: [], summary: "" },
    ];
    const merged = mergeAndSortPosts([], devto, medium);
    expect(merged.length).toBe(1);
    expect(merged[0].source).toBe("devto"); // newer of the two duplicates kept
  });
});
