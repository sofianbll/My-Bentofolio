# CV PDF Build Artifacts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate static CV PDFs during the GitHub Pages build, keeping the web experience identical between local/dev and prod.

**Architecture:** The site remains static. A Playwright script generates PDFs from the built CV page in 3 variants (`couleur`, `sombre`, `mono`). The CV download button serves real static files via GitHub Pages at `/cv/*.pdf`. No server, no runtime PDF generation.

**Tech Stack:** Bun, Vite, React, Playwright, GitHub Actions Pages.

---

## Mini-v1 Strategy

Test each piece independently before assembling. No big bang.

**Mini-v1 A** — Generate 1 PDF (`mono`) locally, no UI changes.  
**Mini-v1 B** — Optimize print CSS, verify size < 2MB and text selectable.  
**Mini-v1 C** — Generate all 3 variants.  
**Mini-v1 D** — Wire download links in the site UI.  
**Mini-v1 E** — Add GitHub Actions Pages workflow.

Each step is testable alone.

---

## Files

| File | Action | Responsibility |
|------|--------|----------------|
| `app/cv-pdf-files.js` | Create | Centralize variant names, file names, and static PDF URLs |
| `app/cv-pdf-files.test.js` | Create | Unit test variant definitions |
| `scripts/generate-cv-pdfs.mjs` | Create | Script that builds, previews, and exports the 3 PDFs |
| `package.json` | Modify | Add `cv:pdf` script + include new test in `test` |
| `app/pages.css` | Modify | Add print/export optimizations for PDF generation |
| `app/cv.jsx` | Modify | Replace `window.print()` download with static PDF links |
| `.github/workflows/pages.yml` | Create | GitHub Pages build + PDF generation + deploy `dist/` |

---

## Key Design Decisions

### PDF output path

PDFs are build artifacts, not committed source. Default target: `dist/cv/`.

Local dev flow:
```bash
bun run build
bun run cv:pdf
# dist/cv/cv-sofian-bll-mono.pdf
# dist/cv/cv-sofian-bll-couleur.pdf
# dist/cv/cv-sofian-bll-sombre.pdf
```

For local development preview (`bun run dev`), the button can fallback to the current `window.print()` behavior since `dist/cv/` won't exist during dev.

### How cv:pdf script works

1. `bun run build` produces `dist/`.
2. `bun run preview` starts on `127.0.0.1:4173`.
3. Playwright opens `http://127.0.0.1:4173/index.html#/cv` (no query needed — the script forces `data-cv-pills` attribute via `page.evaluate()`).
4. Wait for `.a4-page` to render.
5. Set `document.documentElement.setAttribute('data-cv-pills', variant)` before printing.
6. `page.emulateMedia({ media: 'print' })`.
7. `page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true, margin: 0 })` → `dist/cv/cv-sofian-bll-{variant}.pdf`.
8. Repeat for each variant.

### Print CSS optimizations (pages.css)

```css
@media print {
  /* existing @page + hide rules stay */

  /* Force background rendering in Chrome/Playwright PDF */
  .a4-page, .a4-page * {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }

  /* Avoid AppleColorEmoji embedding — hide emoji in print */
  .cv-int-emoji {
    display: none !important;
  }

  /* If still > 2MB after image/font optimization: switch to system fonts in print only */
  .a4-page {
    font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif !important;
  }
  .cv-name, .cv-sec-title {
    font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif !important;
  }
}
```

The system-font fallback is commented in the plan — we activate it only if the PDF stays > 2MB with Sora/SF Pro embedded.

### CV Download Button Behavior

During `bun dev` (no `dist/cv/`), the button shows the current print dialog as fallback. In production (GitHub Pages, `dist/cv/` exists), the button downloads the static PDF directly.

Implementation in `cv.jsx`:
- Primary button: `<a href="/cv/cv-sofian-bll-mono.pdf" download>` (static file, no JS).
- Secondary actions (small links): `Couleur` / `Sombre` / `Mono`.
- Keep `window.print()` as "Apercu impression" fallback, always available.

### cv-pdf-files.js module

Centralize so both `cv.jsx` and `generate-cv-pdfs.mjs` share the same definitions without importing each other:

```js
export const CV_PDF_VARIANTS = [
  { id: 'couleur', label: 'Couleur', file: 'cv-sofian-bll-couleur.pdf' },
  { id: 'sombre', label: 'Sombre', file: 'cv-sofian-bll-sombre.pdf' },
  { id: 'mono', label: 'Mono', file: 'cv-sofian-bll-mono.pdf' },
];

export const CV_PDF_DEFAULT = 'mono';

export function cvPdfUrl(id) {
  const v = CV_PDF_VARIANTS.find(v => v.id === id);
  return v ? `/cv/${v.file}` : `/cv/${CV_PDF_VARIANTS.find(v => v.id === CV_PDF_DEFAULT).file}`;
}
```

---

### Task 1: Mini-v1 A — Single PDF generation script

**Files:**
- Create: `scripts/generate-cv-pdfs.mjs`
- Modify: `package.json` (add `cv:pdf` script)

- [ ] **Step 1: Write the generation script**

```js
// scripts/generate-cv-pdfs.mjs
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const OUT_DIR = resolve('dist/cv');
const BASE = 'http://127.0.0.1:4173';

const VARIANTS = ['couleur', 'sombre', 'mono'];

function startPreview() {
  return new Promise((resolve, reject) => {
    const proc = spawn('bun', ['x', 'vite', 'preview', '--host', '127.0.0.1', '--port', '4173'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let started = false;
    proc.stdout.on('data', (data) => {
      const text = data.toString();
      process.stdout.write(text);
      if (!started && text.includes('localhost') || text.includes('4173')) {
        started = true;
        resolve(proc);
      }
    });
    proc.stderr.on('data', (data) => process.stderr.write(data));
    proc.on('error', reject);
    // Fallback timeout
    setTimeout(() => {
      if (!started) {
        started = true;
        resolve(proc);
      }
    }, 3000);
  });
}

async function main() {
  console.log('Starting preview server...');
  const server = await startPreview();

  let browser;
  try {
    browser = await chromium.launch();
    const context = await browser.newContext();

    for (const variant of VARIANTS) {
      const page = await context.newPage();
      console.log(`Generating ${variant}...`);

      await page.goto(`${BASE}/index.html#/cv`, { waitUntil: 'networkidle' });
      await page.waitForSelector('.a4-page', { timeout: 10000 });

      // Force variant before printing
      await page.evaluate((v) => {
        document.documentElement.setAttribute('data-cv-pills', v);
      }, variant);

      await page.emulateMedia({ media: 'print' });

      const outPath = resolve(OUT_DIR, `cv-sofian-bll-${variant}.pdf`);
      await page.pdf({
        path: outPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });

      console.log(`  -> ${outPath}`);
      await page.close();
    }
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add script to package.json**

Add to `scripts`:
```json
"cv:pdf": "bun scripts/generate-cv-pdfs.mjs"
```

- [ ] **Step 3: Run build then cv:pdf, verify output**

```bash
bun run build
bun run cv:pdf
ls -lh dist/cv/
pdfinfo dist/cv/cv-sofian-bll-mono.pdf
pdffonts dist/cv/cv-sofian-bll-mono.pdf
pdfimages -list dist/cv/cv-sofian-bll-mono.pdf
```

Expected:
- 3 PDFs created in `dist/cv/`.
- 1 page A4 each.
- Text selectable/searchable.
- Backgrounds visible.
- If > 2MB, note exact size for Task 2.

- [ ] **Step 4: Commit Task 1**

```bash
git add scripts/generate-cv-pdfs.mjs package.json
git commit -m "feat: add CV PDF generation script (single variant)"
```

---

### Task 2: Mini-v1 B — Print CSS optimization

**Files:**
- Modify: `app/pages.css:381-393`

- [ ] **Step 1: Add print-color-adjust and emoji hide**

In the `@media print` block at `app/pages.css:381`, add after the existing rules:

```css
@media print {
  @page { size: A4; margin: 0; }
  html, body { background: #fff !important; }
  .no-print, .navbar, .app-footer, .cv-panel, .page-head, .back-link, .toast { display: none !important; }
  .page-wrap { padding: 0 !important; max-width: none !important; }
  .cv-layout { display: block !important; }
  .cv-stage { display: block !important; }
  .a4-fit { height: auto !important; overflow: visible !important; }
  .a4-fit > .a4-scaler { transform: none !important; width: auto !important; }
  .a4-page { box-shadow: none !important; margin: 0 auto !important; }
  .mesh-bg { display: none !important; }

  /* ── NEW: PDF export optimizations ── */
  .a4-page, .a4-page * {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }

  /* Avoid embedding AppleColorEmoji */
  .cv-int-emoji {
    display: none !important;
  }
}
```

- [ ] **Step 2: Rebuild and regenerate, check size**

```bash
bun run build
bun run cv:pdf
pdfinfo dist/cv/cv-sofian-bll-mono.pdf
pdffonts dist/cv/cv-sofian-bll-mono.pdf
pdfimages -list dist/cv/cv-sofian-bll-mono.pdf
```

Expected:
- `AppleColorEmoji` no longer listed in `pdffonts`.
- Backgrounds still visible (check visually).
- Size smaller than before.

- [ ] **Step 3: If PDF > 2MB, add system font fallback**

Add inside the `@media print` block (commented out by default, activate only if needed):

```css
  /* Activate if PDF > 2MB: use system fonts in print only to avoid web font embedding */
  .a4-page {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  }
  .cv-name, .cv-sec-title {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  }
```

- [ ] **Step 4: Verify text remains selectable**

Open the generated PDF, copy some text, paste elsewhere. Search a word. Must work.

- [ ] **Step 5: Commit Task 2**

```bash
git add app/pages.css
git commit -m "feat: optimize CV print CSS for PDF size and text selectability"
```

---

### Task 3: Mini-v1 C — Centralize variant definitions + three variants

**Files:**
- Create: `app/cv-pdf-files.js`
- Create: `app/cv-pdf-files.test.js`
- Modify: `scripts/generate-cv-pdfs.mjs` (already handles 3 variants from Task 1)
- Modify: `package.json` (add test to list)

- [ ] **Step 1: Create cv-pdf-files.js**

```js
// app/cv-pdf-files.js
export const CV_PDF_VARIANTS = [
  { id: 'couleur', label: 'Couleur', file: 'cv-sofian-bll-couleur.pdf' },
  { id: 'sombre', label: 'Sombre', file: 'cv-sofian-bll-sombre.pdf' },
  { id: 'mono', label: 'Mono', file: 'cv-sofian-bll-mono.pdf' },
];

export const CV_PDF_DEFAULT = 'mono';

export function cvPdfUrl(id) {
  const v = CV_PDF_VARIANTS.find(v => v.id === id);
  return v
    ? `/cv/${v.file}`
    : `/cv/${CV_PDF_VARIANTS.find(v => v.id === CV_PDF_DEFAULT).file}`;
}
```

- [ ] **Step 2: Create cv-pdf-files.test.js**

```js
// app/cv-pdf-files.test.js
import { describe, expect, test } from 'bun:test';
import { CV_PDF_VARIANTS, CV_PDF_DEFAULT, cvPdfUrl } from './cv-pdf-files.js';

describe('cv-pdf-files', () => {
  test('has exactly 3 variants', () => {
    expect(CV_PDF_VARIANTS).toHaveLength(3);
  });

  test('each variant has id, label, file', () => {
    for (const v of CV_PDF_VARIANTS) {
      expect(v.id).toBeString();
      expect(v.label).toBeString();
      expect(v.file).toBeString();
      expect(v.file).toEndWith('.pdf');
    }
  });

  test('default is mono', () => {
    expect(CV_PDF_DEFAULT).toBe('mono');
  });

  test('cvPdfUrl returns correct path for known variant', () => {
    expect(cvPdfUrl('mono')).toBe('/cv/cv-sofian-bll-mono.pdf');
    expect(cvPdfUrl('couleur')).toBe('/cv/cv-sofian-bll-couleur.pdf');
    expect(cvPdfUrl('sombre')).toBe('/cv/cv-sofian-bll-sombre.pdf');
  });

  test('cvPdfUrl falls back to default for unknown variant', () => {
    expect(cvPdfUrl('nope')).toBe('/cv/cv-sofian-bll-mono.pdf');
    expect(cvPdfUrl(null)).toBe('/cv/cv-sofian-bll-mono.pdf');
    expect(cvPdfUrl(undefined)).toBe('/cv/cv-sofian-bll-mono.pdf');
  });

  test('all file names are unique', () => {
    const files = CV_PDF_VARIANTS.map(v => v.file);
    expect(new Set(files).size).toBe(files.length);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
bun test app/cv-pdf-files.test.js
```

Expected: all pass.

- [ ] **Step 4: Add test to package.json test list**

In `package.json`, append `app/cv-pdf-files.test.js` to the `test` script line.

- [ ] **Step 5: Commit Task 3**

```bash
git add app/cv-pdf-files.js app/cv-pdf-files.test.js package.json
git commit -m "feat: add cv-pdf-files module with variant definitions and tests"
```

---

### Task 4: Mini-v1 D — UI download links

**Files:**
- Modify: `app/cv.jsx`

- [ ] **Step 1: Add import**

At top of `app/cv.jsx`, after the existing imports, add:

```js
import { CV_PDF_VARIANTS, CV_PDF_DEFAULT, cvPdfUrl } from './cv-pdf-files.js';
```

- [ ] **Step 2: Replace download function and button**

Replace line 46:
```jsx
const download = () => {showToast('Boîte d\'impression — choisis « Enregistrer en PDF »');setTimeout(() => window.print(), 350);};
```

With:
```jsx
const pdfVariant = tweaks.cvPills || CV_PDF_DEFAULT;
const pdfHref = cvPdfUrl(pdfVariant);
```

Replace the CV panel actions block (lines 72-75):
```jsx
<div className="cv-panel-actions" style={{ marginTop: 'var(--s4)' }}>
  <button className="btn btn--brand" onClick={download}><Icon name="download" size={16} /> Télécharger le CV (PDF)</button>
  <button className="btn btn--ghost" onClick={() => window.print()}><Icon name="cv" size={16} /> Aperçu impression</button>
</div>
```

With:
```jsx
<div className="cv-panel-actions" style={{ marginTop: 'var(--s4)' }}>
  <a className="btn btn--brand" href={pdfHref} download style={{ textDecoration: 'none' }}>
    <Icon name="download" size={16} /> Télécharger le CV (PDF)
  </a>
  <div className="cv-pdf-variants" style={{ display: 'flex', gap: 'var(--s1)', flexWrap: 'wrap' }}>
    {CV_PDF_VARIANTS.map(v => (
      <a key={v.id}
         className={'cv-style-opt' + (pdfVariant === v.id ? ' on' : '')}
         href={cvPdfUrl(v.id)}
         download
         style={{ textDecoration: 'none', fontSize: '12px', padding: '6px 12px' }}>
        {v.label}
      </a>
    ))}
  </div>
  <button className="btn btn--ghost" onClick={() => window.print()}>
    <Icon name="cv" size={16} /> Aperçu impression
  </button>
</div>
```

- [ ] **Step 3: Verify UI in dev mode**

```bash
bun run dev
# Open http://localhost:5173/#/cv
# Check buttons render
# Check links point to /cv/cv-sofian-bll-*.pdf
```

- [ ] **Step 4: Run existing e2e tests**

```bash
bun run test:e2e
```

All existing e2e tests must still pass.

- [ ] **Step 5: Commit Task 4**

```bash
git add app/cv.jsx
git commit -m "feat: replace CV print download with static PDF links"
```

---

### Task 5: Mini-v1 E — GitHub Pages workflow

**Files:**
- Create: `.github/workflows/pages.yml`

- [ ] **Step 1: Create workflow file**

```yaml
# .github/workflows/pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Install Playwright browsers
        run: bun x playwright install chromium --with-deps

      - name: Build
        run: bun run build

      - name: Generate CV PDFs
        run: bun run cv:pdf

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit and push**

```bash
git add .github/workflows/pages.yml
git commit -m "ci: add GitHub Pages workflow with CV PDF generation"
```

- [ ] **Step 3: Observe first workflow run on GitHub**

After pushing to `main`, go to Actions tab. Wait for completion. Verify:
- Build succeeds.
- PDF generation step outputs the 3 files.
- Site is deployed.

- [ ] **Step 4: Validate on published site**

Open the GitHub Pages URL. Navigate to CV page. Click download links. Verify:
- PDFs download correctly.
- Each variant has the right style.
- Text is selectable in each PDF.
- All PDFs < 2MB.

---

## Execution Order

1. **Task 1** — Generate 1 PDF locally, measure size.
2. **Task 2** — Optimize print CSS, verify size + fonts.
3. **Task 3** — Centralize variant definitions, test.
4. **Task 4** — Wire UI download links.
5. **Task 5** — GitHub Actions workflow.

Do NOT skip ahead. Each task must work before moving to the next.

---

## Verification Checklist

After all tasks complete:

- [ ] `bun test` passes (all tests including `cv-pdf-files.test.js`).
- [ ] `bun test:e2e` passes.
- [ ] `bun run build` succeeds.
- [ ] `bun run cv:pdf` generates 3 PDFs in `dist/cv/`.
- [ ] Each PDF < 2MB.
- [ ] Text selectable/searchable in all PDFs.
- [ ] Backgrounds visible in all PDFs.
- [ ] `pdffonts` shows no `AppleColorEmoji`.
- [ ] CV page UI renders correctly in dev mode.
- [ ] GitHub Pages workflow deploys successfully with PDFs.
