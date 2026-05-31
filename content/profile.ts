import type { Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Carlos Junior",
  location: "Lisbon, Portugal",
  shortBio: "OutSystems dev & front-end enjoyer",
  bio: "Carlos Junior is a Brazilian developer based in Lisbon, Portugal. After starting out in sales, he made the jump into software — first falling for front-end, then going deep on OutSystems / low-code as a consultant. Today he balances client work with building open-source developer tooling: skillZs, a catalog + CLI for installing AI-agent skills into Claude Code, Codex, and Cursor, and AIOS, an OutSystems agent. He likes shipping things people actually use, clean UI, and the occasional eSports site.",
  roles: ["OutSystems O11 / Low-code Consultant", "Front-end Developer"],
  skills: [
    "OutSystems O11",
    "React",
    "TypeScript",
    "JavaScript",
    "Next.js",
    "Tailwind CSS",
    "HTML/CSS",
    "Node.js",
    "Supabase",
    "Vite",
    "Git",
  ],
  experience: [
    {
      period: "Now",
      role: "OutSystems Consultant & OSS Builder",
      org: "Independent / Client work",
      detail:
        "Low-code delivery on OutSystems O11; building open-source dev tooling (skillZs, AIOS).",
    },
    {
      period: "Recent",
      role: "Front-end Developer",
      detail:
        "React / TypeScript / Next.js — client and freelance projects (incl. eSports sites).",
    },
    {
      period: "2022",
      role: "Career shift into software",
      detail: "Moved from sales into dev; attempted 42 Lisbon, kept building and writing.",
    },
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
