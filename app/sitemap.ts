import type { MetadataRoute } from "next";
import { getNativePosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://carlosjuniordev.vercel.app";
  const routes = ["", "/projects", "/posts", "/about"].map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
  }));
  const posts = getNativePosts().map((p) => ({
    url: `${base}${p.url}`,
    lastModified: new Date(p.date),
  }));
  return [...routes, ...posts];
}
