# Spec — Experience Redesign « Sobre pero Cinétique »

Date: 2026-09-23
Statut: proposé (en attente de validation des seams)
Référence: ADR-0001 (stack motion) · recherche: docs/superpowers/research/2026-06-22-award-winning-portfolio-digest.md

## Problem Statement

Le portfolio est fonctionnel et « propre » mais ne délivre pas d'expérience mémorable : navigation statique, hero passif, galerie projets interchangeable avec mille autres, aucun moment signature. Le propriétaire veut un site au niveau des portfolios primés (Awwwards), tout en restant un site statique rapide qu'il peut maintenir seul et dont n'importe qui peut hériter.

## Solution

Une refonte d'expérience en trois vagues, fondée sur la retenue primée 2026 : UN moment signature (typographie cinétique du hero + transitions morphing natives), une navigation qui se fait oublier, une galerie projets à deux modes d'affichage, et un système de motion complet en CSS + View Transitions + un seul smoothing Lenis (≈ 4 KB). Zéro WebGL, zéro preloader, zéro curseur custom.

## User Stories

1. As a visitor, I want the navigation bar to hide when I scroll down and reappear when I scroll up, so that it never blocks reading.
2. As a visitor, I want a fullscreen overlay menu with numbered links in large display type, so that navigation feels like a designed moment, not a utility.
3. As a visitor, I want the overlay menu to show the availability badge and social links, so that key info stays one gesture away.
4. As a visitor, I want to close the overlay menu with Escape, backdrop click, or a close button, so that I always have an exit.
5. As a visitor, I want the current page marked inside the overlay menu with the brand color, so that I know where I am.
6. As a visitor on mobile, I want the same overlay menu experience, so that mobile is not a degraded version.
7. As a first-time visitor, I want the hero to reveal itself with a kinetic type animation (name lines rising into place), so that the first impression has intent.
8. As a returning visitor, I want the hero animation to play only when meaningful (not on every tweak refresh), so that it never becomes an annoyance.
9. As a visitor, I want smooth scrolling with subtle inertia, so that the page feels crafted rather than browser-default.
10. As a visitor, I want sections to reveal as they enter the viewport, so that scrolling has rhythm without being scroll-jacked.
11. As a visitor, I want the projects page to open in "Stories" mode by default, so that I experience projects as a narrative first.
12. As a visitor, I want Stories mode to show one full-width project section at a time (giant number, huge name, cover image with subtle parallax), so that each project gets presence.
13. As a visitor, I want to switch to "Index" mode (the dense grid), so that I can scan everything efficiently.
14. As a visitor, I want my mode choice remembered across visits, so that the site adapts to me.
15. As a visitor, I want the mode toggle accessible and keyboard-operable, so that everyone can switch.
16. As a visitor, I want page changes to morph (e.g. home photo becomes the project detail hero), so that the site feels continuous rather than paginated.
17. As a visitor without View Transitions support, I want an instant, correct page swap, so that nothing breaks on older browsers.
18. As a visitor on the project detail page, I want the category color present in accents (hero edge, pills, next-project button), so that each project has its own identity without breaking the zinc base.
19. As a visitor, I want a "Next project" hand-off at the bottom of each detail page, so that browsing projects feels continuous.
20. As a visitor with reduced-motion enabled, I want all animations and transitions disabled, so that the site remains comfortable.
21. As the owner previewing in the admin dashboard, I want view transitions and smooth scroll disabled in the preview pane, so that the live preview stays stable.
22. As a recruiter, I want LCP under 2.5s and no jank, so that the wow never costs professionalism.
23. As a future adopter of this repo, I want the new experience driven by the same config.json, so that "anyone can use it" stays true.
24. As the owner, I want the existing admin dashboard to keep working untouched, so that content management is unaffected.
25. As a developer, I want the motion stack documented (one ADR, one runtime module), so that the constraints survive future contributions.

## Implementation Decisions

- **Motion runtime** (single new module): initialises Lenis once at app start (disabled in admin preview and under reduced-motion), exposes a `transition(routeChange)` helper wrapping `document.startViewTransition` with feature + reduced-motion gates, and a global `data-motion` attribute for CSS hooks. `scroll-behavior: smooth` CSS is removed (Lenis conflict, cf. ADR-0001).
- **Navigation**: nav hide/show driven by a tiny scroll-direction reducer (pure function of scrollY history, threshold-based); overlay menu as a dedicated component rendered from the app shell; focus trap + Escape handling while open.
- **Hero kinetic reveal**: CSS-only line reveals (overflow-hidden line wrappers, translateY 110%→0 with the existing `--ease` curve), triggered on mount, skipped under reduced-motion and in preview.
- **View modes**: a small store (mode: 'stories' | 'index', default 'stories', persisted in localStorage) rendered as a segmented toggle on the projects page; Stories implemented with the existing scroll-driven CSS (`animation-timeline: view()`) and compositor-only parallax; Index keeps the current grid plus the new stagger.
- **View Transitions**: `view-transition-name` assigned to the persistent elements (brand, hero photo/thumb); morphing scope limited to home ↔ projects ↔ project detail to keep snapshots light and protect INP.
- **Category tint**: a `--detail-accent` custom property set from the project's primary category, consumed by hero edge, pills, and next-project button only.
- **Design tokens**: the brand-gradient signature (already on the hero name) is promoted to a reusable `--gradient-brand` token; an ultra-subtle grain overlay is added as a fixed layer.
- **Admin compatibility**: the runtime disables itself when `is-preview` (existing flag) is set; no admin UI changes in this spec.

## Testing Decisions

- **Good test** = external behavior only: given input state, observable DOM/classes/behavior. No testing of CSS internals, no animation timing assertions.
- **Unit seams** (bun test): scroll-direction reducer (up/down/idle, thresholds), view-mode store (default, persist, corrupt-value fallback), transition gate (feature-detect + reduced-motion + preview).
- **E2E seams** (Playwright, extending e2e/tests.js conventions): nav hides on scroll down / reappears on scroll up; overlay menu opens/closes via button, Escape, link click; projects page defaults to Stories, toggle switches to Index, choice persists across reload; navigation still works with transitions (no console errors); reduced-motion emulation disables animation classes.
- **Visual seam** (extending e2e/visual-audit.js + css-metrics.js): no horizontal overflow on Stories mode, hero name size within token bounds, gallery stagger classes present.
- **Perf seam**: bundle-size budget enforced by review (motion additions ≤ ~4 KB gz) + manual Lighthouse check per vague (no CI Lighthouse).
- Prior art: existing tests in app/*.test.js (pure logic), e2e/tests.js (public UX + admin UX).

## Out of Scope

- WebGL / Three.js / shader backgrounds.
- Preloader or intro loading screen; custom cursor; scroll-jacking; horizontal scroll galleries.
- GSAP or any second animation dependency.
- Admin dashboard redesign; CV A4 layout metrics; content (texts, projects) changes.
- i18n, dark-theme variants beyond the existing two, blog/CMS.

## Further Notes

- Vague order is contractual: V1 (nav + hero + motion runtime) → V2 (projects modes + view transitions) → V3 (detail tint + CV polish + residuals). Each vague ships green (bun test + e2e + build) before the next starts.
- The branch `feat/production-ready-polish` carries the already-reviewed polish commits; the redesign commits stack on top, one commit-group per vague.
