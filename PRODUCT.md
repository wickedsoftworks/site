# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary audiences, both served by the same site:

1. **Developers discovering the collective's work.** Arriving from GitHub, a link,
   or word of mouth. They want to see what Wicked Softworks builds, judge whether
   it is any good, and get to the repository or release quickly.
2. **Members of the collective.** The site is their home base. The Members
   directory and the Tools page are functional surfaces for them, not marketing.

The site must serve both without making either feel like an afterthought.

## Product Purpose

Wicked Softworks is an open-source developer collective. The site is its public
face and its internal home base: it shows what the collective builds, who builds
it, and what the collective uses to build. Success is a visitor who understands
what the collective is within one screen and reaches a repository, a member, or a
tool without hunting.

## Positioning

An open-source collective rather than a company or an agency. The work is public,
the membership is named, and the toolchain is shared openly. There is no sales
motion, no client pitch, and no product to buy.

## Operating Context

- GitHub organization: <https://github.com/wickedsoftworks>, the center of gravity
  for the collective's actual work. The site points at it constantly.
- Four top-level surfaces: `/` (home), `/projects`, `/members`, `/tools`, plus one
  route per utility under `/tools/<slug>`.
- Members are individuals with names, roles, and their own GitHub profiles. The
  directory is an avatar grid; selecting a face opens a profile dialog.
- **Tools are utilities the site offers to visitors**: UUID, Base64, hashing,
  JWT decoding, QR codes and so on. They are a service, not a list of the
  collective's dependencies; that list was deliberately removed.
- **A server runtime is required at deploy.** `/tools/ip` reads the connecting
  address via `getClientAddress()`, so purely static hosting (GitHub Pages) will
  not serve the site correctly. Everything else runs in the browser.

## Capabilities and Constraints

- **Stack (existing, fixed):** SvelteKit 2 with Svelte 5 runes, TypeScript,
  Tailwind CSS v4, shadcn-svelte components (`bits-ui`), `@lucide/svelte` icons,
  `mode-watcher` for light/dark mode. Package manager is Bun. Lucide dropped brand
  marks in v1, so the GitHub mark is an authored SVG at
  `src/lib/components/site/GithubIcon.svelte`.
- Content lives in three files: `src/lib/data/site.ts` (projects),
  `src/lib/data/members.json` (people), `src/lib/data/tools.ts` (the utility
  registry, where adding an entry plus a route under `src/routes/tools/` is the
  whole job of adding a tool).
- **Avatars are built, not hot-linked.** `members.json` holds a remote image URL;
  `scripts/avatars.mjs` fetches it at build time (via `predev` / `prebuild`),
  normalizes it to a 256px square WebP with `sharp`, and writes
  `static/avatars/<id>.webp`. Visitors never request a third-party image. A
  failed fetch is non-fatal and falls back to an initials monogram. The generated
  files are committed so a network-less build still ships avatars.
- `qrcode` is the only third-party runtime dependency, dynamically imported by
  `/tools/qr` alone.
- Tailwind v4 CSS-first configuration lives in `src/routes/layout.css` via
  `@theme inline`; there is no `tailwind.config.js`.
- Light and dark mode are both first-class and already wired up. Every surface
  must be designed for both.
- `@sveltejs/adapter-auto` is in place; no deployment target has been chosen yet.
- **Undecided:** hosting/deploy target; whether Projects data is fetched from the
  GitHub API or authored as static content.

## Brand Commitments

- **Name:** Wicked Softworks.
- **Logo:** `static/logo.png`, a layered five-point star in cyan, banding from a
  mid cyan outer edge through bright aqua to a white core. It is the only existing
  brand asset and is binding.
- The existing navbar labels (Projects, Members, Tools) and the GitHub call to
  action are established navigation and should be preserved.
- **Visual direction (standing preference).** The user chose the conventional
  developer-site register deliberately, over an invented visual world: simple and
  professional, held to the craft level of Linear and Vercel, with the hero
  structure of vite.dev and squared content. Execute that convention at full
  fidelity, with no irony, no smuggled quirk, and no drift back toward a themed or
  metaphorical world. A prior skeuomorphic machine-shop identity was replaced for
  exactly this reason.
- **Typeface:** Geist Sans for the interface, Geist Mono for code, versions and
  paths.
- **Accent:** one colour only, the logo's cyan. See DESIGN.md for the four roles
  it is allowed to occupy.

## Evidence on Hand

- The logo, the GitHub organization URL, and the four route names are real.
- **No real content exists yet** for projects, members, or tools. The user will
  supply it after the build. Every project name, member, biography, statistic,
  date, and tool entry in the shipped code is placeholder content and must be
  obviously marked as such. Do not invent contributor names, repository names,
  star counts, download numbers, testimonials, or founding dates and present them
  as fact.

## Product Principles

1. **The work is the argument.** Projects and code speak for the collective; no
   marketing claims stand in for them.
2. **Two audiences, one surface.** Public discovery and internal utility coexist;
   neither is buried.
3. **Always a path to GitHub.** Every project, member, and tool leads outward to
   something real.
4. **Honest placeholders.** Absent content is visibly absent, never fabricated.
5. **Both modes are the design.** Light and dark are equally considered, never a
   filter applied over one canonical theme.

## Accessibility & Inclusion

No product-specific standard was established. Default to WCAG 2.2 AA: visible
focus states, keyboard-operable navigation, sufficient contrast in both modes, and
respect for `prefers-reduced-motion`.
