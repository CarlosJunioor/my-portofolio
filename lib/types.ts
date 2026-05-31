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
