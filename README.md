# A statically generated website using Next.js, Markdown, and TypeScript.

The source for [lachlanoc.com](https://lachlanoc.com). Posts are Markdown files in `_posts/`; the site is built to static HTML and deployed to GitHub Pages on every push to `master`.

## Running it

Needs Node 22 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Builds the static site into `out/` |
| `npm start` | Serves `out/` locally, the way GitHub Pages will |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, without emitting files |
| `npm test` | Unit tests (Node's built-in test runner) |

`dev` and `build` first run `scripts/optimize-images.mjs`, which resizes everything under `public/assets/` into `public/_img/` (not committed).

## Writing a post

1. Put the post's images in `public/assets/blog/<slug>/`. A 2:1 cover (for example 2000×1000) works best.
2. Create `_posts/<slug>.md`. The file name becomes the URL: `/posts/<slug>`.

```markdown
---
title: "How I Setup a New VPS"
excerpt: "One or two sentences shown in lists, search and link previews."
coverImage: "/assets/blog/vps-setup/cover.webp"
date: "2026-02-14"
tags: ["homelab", "cyber security"]
ogImage:
  url: "/assets/blog/vps-setup/cover.webp"
---

# First section

Body text...
```

| Field | Notes |
|---|---|
| `title`, `excerpt` | Shown on the post, in lists, search, the RSS feed and link previews |
| `coverImage` | Path under `public/` |
| `date` | `YYYY-MM-DD`; posts are ordered by it |
| `tags` | Each tag gets a page at `/tags/<tag>` (spaces become hyphens) |
| `ogImage.url` | Image for link previews on social sites; usually the cover |

Things the build does for you:

- **Headings:** start sections with `#`. They are moved down one level so the post title stays the page's only `<h1>`. Posts with three or more sections get an "On this page" list.
- **Code blocks:** name the language after the opening fence (` ```bash `) for highlighting. Add `title="/etc/caddy/Caddyfile"` after the language to label the block with a file name instead.
- **Images:** reference the original (`![alt](/assets/blog/<slug>/photo.webp)`); resized copies are served automatically.
- **Raw HTML** in Markdown is dropped, not rendered.

## Where things are

| Path | Contents |
|---|---|
| `_posts/` | The posts |
| `public/assets/` | Original images |
| `src/app/` | Pages and components |
| `src/lib/site.ts` | Site name, description, social links, contact email |
| `src/lib/` | Reading posts, Markdown rendering, search, feed, metadata |
| `src/app/globals.css` | Colours, fonts and post typography |
| `scripts/optimize-images.mjs` | Image resizing and link-preview images |
| `.github/workflows/nextjs.yml` | Lint, typecheck, test, build and deploy |
