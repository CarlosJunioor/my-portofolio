# Carlos Junior — Portfolio 🛰️

A deep-space, mission-control themed personal site: projects as **missions**
(live / building / archived), writing as **transmissions** (native posts + an
auto-pulled dev.to and Medium feed, merged into one timeline), and an about
page with a flight-log timeline and skill constellation.

**Live:** https://carlosjuniordev.vercel.app

## Stack

- **Next.js 16** (App Router, React 19, RSC) + **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme` tokens) + a hand-built space design system
- **Framer Motion** for scroll reveals & micro-interactions, plus a `<canvas>` parallax starfield
- **next-mdx-remote** for native MDX posts
- Type system: **Syne** (display) · **Manrope** (body) · **Martian Mono** (telemetry)
- Deployed on **Vercel**

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm test           # unit tests (Vitest) for the data layer
```

### Environment

Copy `.env.example` → `.env.local`. All variables are optional:

| Var | Purpose |
|-----|---------|
| `GITHUB_TOKEN` | Raises the GitHub API rate limit (60→5000/hr). Read-only; no scopes needed for public data. |

## Where the content lives

Everything you'd want to edit is plain data — no CMS:

- **`content/profile.ts`** — name, bio, roles, skills, experience timeline, social links.
- **`content/projects.ts`** — project **curation**:
  - `curationByRepo` — override any GitHub repo's status (`live`/`building`/`archived`), mark it `featured`, set a custom `tagline`, `stack`, `thumbnail`, and display `order`.
  - `manualProjects` — projects that aren't public GitHub repos (e.g. AIOS).
  - `hiddenRepos` — repos to hide from the site entirely.
- **`content/posts/*.mdx`** — native posts (frontmatter: `title`, `date`, `summary`, `tags`, optional `cover`).

## How the feeds work

The data layer in `lib/` fetches at build time with ISR caching and **degrades
gracefully** — a failed/rate-limited upstream never breaks a page, it just shows
what it has:

- `lib/github.ts` — pulls repos from the GitHub REST API (revalidate daily).
- `lib/projects.ts` — merges GitHub repos with `content/projects.ts` curation into
  `featured` / `live` / `archived` buckets.
- `lib/posts.ts` — merges **native MDX + dev.to + Medium** into one feed, sorted
  newest-first and de-duplicated across cross-posts (revalidate hourly).
  - dev.to handle and Medium handle are derived from `content/profile.ts` socials.

The pure transform functions (date formatting, repo→project mapping, curation
merge, post normalization/merge) are unit-tested in `lib/*.test.ts`.

## Project structure

```
app/            routes: / · /projects · /posts · /posts/[slug] · /about · 404 · sitemap · robots
components/     background (Starfield, NebulaBackdrop), ui, layout, home, projects, posts, about, mdx
content/        profile, projects curation, native MDX posts
lib/            data layer + types + utils (+ tests)
docs/           design spec, implementation plan, gathered research
```

## Deploy

Push to the connected Vercel project, or:

```bash
vercel           # preview deploy
vercel --prod    # production
```
