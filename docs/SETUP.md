# Bentofolio — Setup Guide

Quick start guide for running the portfolio locally and deploying to production.

## Prerequisites

- **[Bun](https://bun.sh)** (recommended runtime, test runner, and package manager)
- **Node.js 18+** (alternative if Bun is unavailable)
- **Git**

## Clone & Install

```bash
git clone https://github.com/Sofian-bll/My-Bentofolio.git
cd My-Bentofolio
bun install
```

## Development Server

```bash
bun dev
```

Opens Vite dev server at **http://localhost:5173**.

## Routes

| URL hash | Page | Description |
|----------|------|-------------|
| `/#/` | Accueil | Home page with bento grid |
| `/#/projets` | Projets | Project gallery with filtering |
| `/#/experiences` | Experiences | Professional experience page |
| `/#/cv` | CV | A4 printable CV |
| `/#/contact` | Contact | Contact form + info card |
| `/#/admin` | Admin | Dashboard CMS |

## Admin Access

Navigate to `http://localhost:5173/#/admin`. The admin password is **`bento`**.

The admin dashboard allows editing projects, appearance, CV settings, contact info, social links, profile details, experiences, and backup/import. Changes are persisted to disk during development via the Vite dev server plugin.

**Note:** The admin dashboard is only available in dev mode (`bun dev`). It is lazy-loaded and completely tree-shaken from production builds.

## Build

```bash
bun run build
```

Outputs a static site to the `dist/` directory. The admin panel is automatically excluded from the production bundle.

## Preview Production Build

```bash
bun run preview
```

Serves the `dist/` directory locally for testing before deployment.

## Make it yours

Follow these steps to turn this portfolio into your own:

1. **Clone and install**
   ```bash
   git clone https://github.com/Sofian-bll/My-Bentofolio.git
   cd My-Bentofolio
   bun install
   ```
2. **Edit your content** — everything lives in `config.json` (single source of truth, bundled into the build):
   - `profile` — name, bio, availability status, skills, education, interests
   - `socialLinks` — LinkedIn, GitHub, etc.
   - `appearance` — accent color, display font, density, radius, photo
   - `cv` — featured project IDs, pill style, photo size, max bullets, card density
   - `contact` — Formspree URL, phone/status visibility
   - `experiences` — professional timeline
   Alternatively, run `bun dev` and use the admin dashboard at `/#/admin` (password `bento`, configurable via `VITE_ADMIN_PASSWORD`) to edit everything through the UI.
3. **Replace images** — swap `public/photo.jpg` for your photo, and put your project screenshots in `public/media/projects/`. The photo path is also set via `appearance` in `config.json`.
4. **Add your projects** — each project lives in `content/projects/<id>/` with two files:
   - `project.json` — `{ id, name, categories[], techs[], role, period, duration, description, highlights[], demoUrl, repoUrl, image }`
   - `case-study.md` — the markdown case study rendered on the project detail page

   Control the display order via `content/projects/order.json`. The `content/projects/index.json` index is generated automatically by the Vite plugin — don't edit it by hand.
5. **Update the HTML meta/OG tags** in `index.html` — title, `description`, `og:title`, `og:description`, and the `og:image`/`twitter:image` social card URLs (point them at your own hosted image).
6. **Deploy** — for a GitHub Pages project site, build with the matching base and publish `dist/`:
   ```bash
   VITE_BASE_PATH=/YourRepoName/ bun run build
   ```
   For Netlify, Vercel, or a custom domain (root-mounted site), use the default base `/`:
   ```bash
   bun run build
   ```

## Deploy to GitHub Pages

### Option 1: GitHub Actions (recommended)

Push to the `main` branch. The workflow at `.github/workflows/pages.yml` will:

1. Checkout the repo
2. Install Bun dependencies
3. Run unit tests (`bun test`)
4. Build (`bun run build`)
5. Generate CV PDFs (`bun run cv:pdf`)
6. Deploy `dist/` to GitHub Pages

The Vite `base` is driven by the `VITE_BASE_PATH` environment variable (default `/`). For `https://<user>.github.io/My-Bentofolio/`, set `VITE_BASE_PATH=/My-Bentofolio/` before building (see [Environment Variables](#environment-variables)).

### Option 2: Manual `gh-pages` Branch

```bash
bun run build
npx gh-pages -d dist
```

### Required GitHub Settings

Ensure GitHub Pages is enabled in your repository settings, pointed at the `gh-pages` branch or GitHub Actions deployment source.

## Environment Variables

No variable is required — sensible defaults are built in. All site content lives in `config.json`, which is bundled into the production build.

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_BASE_PATH` | `/` | Vite `base` path. Set to `/YourRepoName/` when deploying to a GitHub Pages project site; keep `/` for Netlify, Vercel, or a custom domain. |
| `VITE_ADMIN_PASSWORD` | `bento` | Admin dashboard password. **Dev only** — the admin panel is tree-shaken from production builds, so this has no effect on the deployed site. |

## CV PDF Export

```bash
bun run cv:pdf
```

Runs `scripts/generate-cv-pdfs.mjs`, which starts a local preview server and uses Playwright to render printable CV variants (`couleur`, `sombre`, `mono`) into `dist/cv/`. This step is part of the GitHub Pages workflow.

## Troubleshooting

### Port 5173 already in use

Vite will auto-increment to the next available port (5174, 5175...). Check the terminal output for the actual URL, or explicitly set a port:

```bash
bun dev --port 3000
```

### `bun install` fails

Delete `node_modules` and `bun.lock`, then retry:

```bash
rm -rf node_modules bun.lock
bun install
```

### Blank page on GitHub Pages

The site uses hash-based routing (`/#/...`). Make sure `VITE_BASE_PATH` matches your repository name. For `https://<user>.github.io/My-Bentofolio/`, build with `VITE_BASE_PATH=/My-Bentofolio/`.

### Admin dashboard not visible

The admin panel is only available in dev mode (`bun dev`). It is intentionally excluded from production builds.

### Config not saving in dev

The admin saves data through Vite's dev server middleware (`POST /api/admin/save`). Make sure you're running `bun dev` (not `bun run preview`) for persistence to work.
