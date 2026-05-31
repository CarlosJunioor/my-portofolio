import { describe, it, expect } from "vitest";
import { cn, formatDate, stripHtml, truncate } from "./utils";

describe("cn", () => {
  it("merges conflicting tailwind classes, last wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
  it("drops falsy values and keeps non-conflicting classes", () => {
    expect(cn("font-bold", false, undefined, null, "", "italic")).toBe("font-bold italic");
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
