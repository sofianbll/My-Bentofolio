# Bentofolio — Environment

## Architecture

- **Source entry (Open CoDesign)**: `App.jsx` — imports `app/app.jsx`
- **Dev/build entry**: `index.html` — Vite template with `<script type="module" src="/App.jsx">`
- **Production**: `bun run build` → `dist/` (static, deployable to GitHub Pages)
- **React**: 18.3.1 (bundled by Vite, vendored by Open CoDesign sandbox)
- **CSS**: Imported via ES modules in `app/app.jsx`

## Commands

```bash
bun install        # Install dependencies (Bun is the canonical package manager)
bun dev            # Dev server at http://localhost:5173
bun run build      # Production build to dist/
bun run preview    # Preview production build
bun test           # Unit tests (Bun test runner)
bun run test:e2e   # End-to-end tests (Playwright)
bun run cv:pdf     # Export printable CV variants to dist/cv/
```

## Routes to test

- `http://localhost:5173/#/` — Home
- `http://localhost:5173/#/projets` — Projects
- `http://localhost:5173/#/cv` — CV
- `http://localhost:5173/#/contact` — Contact
- `http://localhost:5173/#/admin` — Admin (password: `bento`)

## Open CoDesign Integration

- Open CoDesign renders `App.jsx` in its Electron sandbox
- Sandbox provides React 18 + Babel (no local `node_modules` needed for rendering)
- `DESIGN.md` is loaded as design system context by the agent
- `SKILL.md` teaches the agent bento/CV conventions
- `.codesign/` is gitignored (managed by the app)
