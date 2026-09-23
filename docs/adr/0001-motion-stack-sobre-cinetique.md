# ADR-0001: Stack motion « sobre mais cinétique » (View Transitions + scroll-driven CSS + Lenis)

Date: 2026-09-23
Statut: accepté

## Contexte

Refonte de l'expérience du portfolio vers un niveau « award-winning ». Contraintes : site statique React 18 + Vite 6, hash router, aucune lib d'animation à ce jour, dark/light, `prefers-reduced-motion` déjà géré, budget perf strict (LCP ≤ 2,5 s, INP ≤ 200 ms). Recherche (docs/superpowers/research/2026-06-22-award-winning-portfolio-digest.md) : les sites primés 2026 misent sur UN moment signature et la retenue ; les curseurs custom, preloaders et reveals systématiques sont considérés comme saturés.

## Décision

- **View Transitions API** (`document.startViewTransition`) pour les transitions morphing entre pages (baseline navigateurs depuis oct. 2025), avec repli = swap instantané.
- **Animations scroll-driven en CSS pur** (`animation-timeline: view()`) pour les révélations au scroll (~83 % de couverture, repli gracieux), pas d'IntersectionObserver maison.
- **Lenis** (≈ 3–4 KB) comme seule dépendance ajoutée, pour le smooth scroll natif (respecte sticky, ancres, `respectReducedMotion`).
- **Refusés** : GSAP (CSS suffit), curseur custom, preloader, scroll-jacking, Framer Motion/AOS.

## Conséquences

- Budget motion verrouillé à ~4 KB ; les effets restent compositor-friendly (transform/opacity uniquement).
- Les transitions morphing doivent être désactivées dans l'aperçu live de l'admin (iframe) et sous `prefers-reduced-motion`.
- `scroll-behavior: smooth` CSS est interdit (conflit Lenis).
- Alternatives écartées : GSAP (70 KB, orchestration inutile ici), route WebGL (coût perf incompatible avec un site statique instantané).
