# Design Spec — "Carlos Junior // Deep Space" Portfolio

**Date:** 2026-05-31
**Repo:** `my-portofolio` (branch `revamp/space-portfolio`)
**Status:** Approved (design direction signed off by Carlos on 2026-05-31)

---

## 1. Overview

Revamp Carlos Junior's portfolio from a barebones, placeholder Create React App
scaffold into a polished, space-themed personal site that showcases **who he is**,
the **projects he has built and is currently running**, and his **writing**.

The current repo is a near-empty CRA scaffold (React 18 + react-router-dom 6 +
Tailwind 3, all pages are Lorem-Ipsum / "coming soon"). We replace it with a fresh
Next.js application in the same repo, preserving git history.

## 2. Goals

- A distinctive **"Deep Space / Nebula"** aesthetic — animated starfield, nebula
  gradients, glassmorphic panels, glow accents, tasteful motion.
- A **"Mission Control"** projects view that distinguishes **live / building /
  archived** work and links to live demos + repos, auto-synced from GitHub.
- A **hybrid Posts** system: native MDX posts written in-repo **plus** auto-pulled
  external articles (dev.to now; Medium hook left in code for later).
- An **About** page with bio + an experience "Mission Log" timeline + skills.
- Fast, SEO-friendly, resilient (external API failures never break the page).
- Deployable on Vercel; mobile-first responsive; accessible.

## 3. Non-Goals (YAGNI for v1)

- No CMS / admin UI — content is config + MDX files in the repo.
- No per-project detail pages in v1 (cards link out to live demo + repo). The
  route is reserved but not built unless a project needs a long write-up.
- No comments, no auth, no newsletter signup.
- No 3D/three.js solar-system navigation (considered, not chosen).
- No automated Medium ingestion until Carlos confirms a handle (code hook only).

## 4. Tech Stack

| Concern | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, React 19, TypeScript) |
| Styling | **Tailwind CSS v4** + CSS custom properties for the space theme tokens |
| Animation | **Framer Motion** (scroll reveals, hover, orbital/pulse) + lightweight `<canvas>` starfield |
| Posts | **MDX** (`@next/mdx` or `next-mdx-remote`) for native posts |
| Icons | `lucide-react` |
| Data | GitHub REST API, dev.to API, Medium RSS (server-side, ISR cached) |
| Fonts | Space Grotesk (display), Inter (body), JetBrains Mono (telemetry) — `next/font` |
| Hosting | Vercel |
| Lint/format | ESLint (next) + Prettier |

### Migration approach
- Scaffold Next.js App Router structure (`app/`, `components/`, `lib/`, `content/`).
- Remove CRA-specific files (`react-scripts`, `src/App.tsx`, CRA `public/index.html`,
  `src/index.tsx`, old `tailwind.config.js` for v3).
- Salvage useful assets into `public/` (custom fonts if licensed for web; review the
  old background images — likely replaced by the new starfield).
- Keep repo name and git history. Work on `revamp/space-portfolio`, merge when ready.

## 5. Information Architecture

```
/                Home — cinematic single scroll:
                   Hero → About teaser → Featured Missions
                   → Latest Posts → Comms / contact CTA
/projects        "Mission Control" — all projects, status filter, GitHub-synced
/posts           Unified feed — native MDX + dev.to (+ Medium hook), source badges
/posts/[slug]    Native MDX article reader
/about           Bio + "Mission Log" experience timeline + skill constellation
(footer)         "Comms" — email + social links, present site-wide
```

Navigation: a persistent glass "HUD" navbar with active-section indicator; on the
home page it scroll-spies sections, elsewhere it links to routes.

## 6. Design System — Deep Space / Nebula

**Color tokens** (CSS variables, dark-only for v1):
- `--bg`: `#05060a` (deep space) / secondary `#0a0b14`
- `--surface`: `rgba(255,255,255,0.03)` with border `rgba(255,255,255,0.08)` (glass)
- Nebula gradient: violet `#7c3aed` → indigo `#3b82f6` → cyan `#22d3ee`
- Accents: cyan `#22d3ee`, magenta `#e879f9` (glow)
- Text: `#e6e8ef` primary, `#9aa0b4` muted
- Status: LIVE = emerald/cyan `#34d399`, BUILDING = amber `#fbbf24` (pulse),
  ARCHIVED = slate `#64748b`

**Typography:** Space Grotesk (headings, gradient fills), Inter (body),
JetBrains Mono (labels/telemetry: `// 01 — ABOUT`, coordinates, status read-outs).

**Motion & FX:**
- Multi-layer parallax **starfield** on `<canvas>` (twinkle + slow drift), fixed bg.
- Drifting **nebula blobs** (large blurred radial gradients, slow CSS animation).
- Occasional **shooting star**; subtle **cursor comet trail** (desktop only).
- Scroll-reveal on sections/cards; hover-glow on interactive surfaces.
- Respect `prefers-reduced-motion` — disable heavy motion, keep static gradients.

## 7. Components

| Component | Purpose / interface | Depends on |
|---|---|---|
| `Starfield` | Fixed canvas bg, parallax layers, reduced-motion aware | — |
| `NebulaBackdrop` | Drifting blurred gradient blobs | CSS tokens |
| `Navbar` (HUD) | Glass nav, active indicator, scroll-spy on home | next/link |
| `Hero` | Name, role, tagline, CTAs, social orbit, scroll cue | Starfield, motion |
| `SectionHeading` | Mono coordinate label + gradient title | — |
| `GlassPanel` | Reusable frosted "viewport" container | tokens |
| `ProjectCard` | Status badge, thumb, tech chips, ⭐, Live + Repo links | `Project` type |
| `MissionControlBoard` | Featured active missions w/ telemetry panel + grid | ProjectCard, lib/github |
| `StatusBadge` | LIVE / BUILDING / ARCHIVED pill w/ glow/pulse | tokens |
| `PostCard` | Source badge (NATIVE/dev.to/Medium), date, tags, reactions | `Post` type |
| `PostList` | Unified, sortable/filterable feed | lib/posts |
| `Timeline` | "Mission Log" experience entries | content/profile |
| `SkillConstellation` | Skills rendered as a constellation/orbit (progressive enhancement; falls back to chips) | content/profile |
| `Footer` / `Comms` | Email + social links | content/profile |
| `MDXComponents` | Styled MDX renderers (code, headings, callouts) | mdx |

Each component is self-contained with a typed props interface and can be rendered
in isolation. Data-fetching lives in `lib/` (server), not in components.

## 8. Data Layer

`lib/github.ts`
- `getRepos()` → GitHub REST `users/CarlosJunioor/repos` (ISR, revalidate daily).
- Maps repo → `Project { name, description, language, stars, repoUrl, liveUrl,
  topics, updatedAt }`. Optional `GITHUB_TOKEN` env for higher rate limit.

`content/projects.ts` (curation layer)
- Hand-authored overrides keyed by repo name: `featured`, `status`
  (live/building/archived), custom `thumbnail`, custom `tagline`, manual entries
  for non-GitHub projects (e.g. AIOS). Merge: curated config wins; GitHub fills the rest.
- This keeps Carlos in control of what's featured and how it's labeled.

`lib/posts.ts`
- `getNativePosts()` → read `content/posts/*.mdx` (frontmatter: title, date, tags,
  summary, cover).
- `getDevtoPosts()` → dev.to API `articles?username=carlosjuniordev`.
- `getMediumPosts()` → RSS parse (disabled/empty until a handle is set in config).
- `getAllPosts()` → merge, normalize to `Post { source, title, url, date, tags,
  summary, reactions?, cover? }`, sort by date desc.

`content/profile.ts`
- Identity, bio, roles, experience timeline, skills, social links. Seeded from
  `docs/research/profile.json` + the drafted bio below.

## 9. Error Handling & Resilience

- Every external fetch wrapped in try/catch with a typed fallback (empty array /
  cached). A failed or rate-limited GitHub/dev.to/Medium call **never** throws to
  the page — the section degrades (shows native/cached content or a quiet empty state).
- ISR caching (`revalidate`) so pages are static-fast and resilient to upstream flakiness.
- 404 / error boundaries styled to match the space theme.

## 10. Testing

Scope-appropriate for a portfolio:
- **Unit tests** for the pure data-transform functions: `getAllPosts` merge/sort,
  GitHub repo → `Project` mapping, curation-override merge. (Vitest)
- **Type safety** via TS across the data layer.
- **Build smoke**: `next build` must pass; optional Playwright smoke test for
  home/projects/posts rendering.
- Manual: verify on mobile + desktop, reduced-motion, Lighthouse pass.

## 11. Seed Content

### Drafted bio (DRAFT — Carlos to edit)
> Carlos Junior is a developer based in **Lisbon, Portugal**. After starting out in
> sales, he made the jump into software — first falling for **front-end**, then going
> deep on **OutSystems / low-code** as a consultant. Today he balances client work with
> building open-source developer tooling: **skillZs** (a catalog + CLI for installing
> AI-agent skills into Claude Code, Codex, and Cursor) and **AIOS**, an OutSystems
> agent. He likes shipping things people actually use, clean UI, and the occasional
> eSports site.

### Experience "Mission Log" (DRAFT — verify dates/roles)
- **Now** — OutSystems developer / low-code consultant · building OSS (skillZs, AIOS)
- **—** Front-end developer (React / TypeScript / Next.js)
- **—** Career shift into software development (from sales)

### Skills (from repos — refine)
OutSystems O11 · React · TypeScript · JavaScript · Next.js · Tailwind CSS ·
HTML/CSS · Node.js · Supabase · Vite · (learning: Java, C)

### Projects, Posts, Socials
See `docs/research/profile.json` for the structured, GitHub-verified data
(featured/live projects with URLs, the dev.to article, social links).

## 12. Implementation Plan (high level)

Detailed plan produced next via the writing-plans skill. Expected waves:
1. **Scaffold** — Next.js + Tailwind v4 + fonts + base layout; strip CRA.
2. **Theme & FX** — tokens, Starfield, NebulaBackdrop, GlassPanel, motion primitives.
3. **Shell** — Navbar (HUD), Footer/Comms, SectionHeading.
4. **Data layer** — lib/github, lib/posts, content/projects, content/profile (+ unit tests).
5. **Pages** — Home sections, /projects (Mission Control), /posts + reader, /about.
6. **Content** — seed real data (drafted bio, GitHub-synced projects, dev.to feed).
7. **Polish** — responsive, a11y, reduced-motion, SEO/metadata/OG, Lighthouse, deploy.

Execution will use the **frontend-design** skill for the visual components and
**workflow orchestration** to build independent sections/pages in parallel.

## 13. Open Items / To Confirm With Carlos (non-blocking)

- Verify AIOS repo URL + whether it should be public on the site.
- Confirm/replace the drafted bio + experience dates.
- Provide a Medium handle later if/when he wants that feed on.
- Decide whether to keep the old custom fonts (NeueMontreal, Virgil) or use the
  Space Grotesk / Inter / JetBrains Mono set proposed here.
