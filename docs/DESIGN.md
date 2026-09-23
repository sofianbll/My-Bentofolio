# Bentofolio — Design System

Page design system du portfolio : tokens, typographie, motion et règles de gating.
Pour les données et l'architecture, voir `README.md` et `docs/ARCHITECTURE.md`.
Le résumé canonique des décisions motion est l'[ADR-0001](adr/0001-motion-stack-sobre-cinetique.md).

## Principes

- **Sobre mais cinétique** : UN moment signature par page, jamais d'ornement générique.
- **CSS-first** : les animations de scroll vivent dans les feuilles de style
  (`animation-timeline: view()`), aucun IntersectionObserver maison.
- **Compositor-only** : `transform` et `opacity` uniquement (budget perf, LCP/INP).
- **Contenu d'abord** : l'état par défaut est toujours visible ; l'animation
  ne s'applique que si la plateforme la supporte (`@supports`), jamais l'inverse.

## Tokens (app/styles.css)

### Couleurs

Base zinc (`:root`) — clair par défaut, dark via `[data-theme='dark']` :

| Token | Clair | Rôle |
|-------|-------|------|
| `--bg-page` | zinc-100 `#f0f0f3` | fond de page |
| `--bg-card` | zinc-0 `#ffffff` | cartes / cellules |
| `--bg-inset` | `#f4f4f6` | surfaces enfoncées |
| `--text` / `--text-2` | zinc-900 / zinc-500 | texte / texte secondaire |
| `--border` / `--border-sub` | zinc-200 / zinc-250 | bordures |
| `--brand` | `--cat-dev` `#6366f1` | accent actif |

Accents catégories (`--cat-dev`, `--cat-webdesign`, `--cat-3d`, `--cat-animation`,
`--cat-logo`, `--cat-tooling`, `--cat-tools`, `--cat-devops`, `--cat-ai`) et
couleurs techniques (`--color-laravel`, …) — voir la table complète dans `styles.css`.

**Gradient signature** : `--gradient-brand: linear-gradient(115deg, var(--brand) 10%, color-mix(in oklab, var(--brand) 45%, #ec4899) 90%)` — réservé au nom du héro et à la pill de disponibilité.

Teintes dérivées systématiques via `color-mix(in oklab, …)` : jamais de couleur en dur
hors des tokens (ex. pills de catégorie, focus ring, bordures teintées T05).

### Rayons

`--radius-xs 4 · --radius-sm 6 · --radius-md 10 · --radius-lg 14 · --radius-xl 20 · --radius-pill 999`.
Presets tweakables via `[data-radius='net'|'rond']` sur `<html>`.

### Ombres & espacement

`--shadow-sm/md/lg` (très discrètes). Échelle d'espacement 4 px : `--s1 … --s12`
(4 → 96 px). Conteneur max commun : 1440 px (nav, pages, footer).

### Motion

| Token | Valeur | Usage |
|-------|--------|-------|
| `--ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | easing standard (expo out) |
| `--ease-out-expo` | idem | révélations d'entrée |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | sorties rares |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | micro-rebonds uniquement |
| `--dur` / `--dur-fast` / `--dur-slow` | 0.45 s / 0.2 s / 0.65 s | durées standard |

`scroll-behavior: smooth` est **interdit** (conflit Lenis).

## Typographie

- **Display** : Syne 800 — titres, noms, chiffres. Tracking serré
  (`--tracking-tight -0.04em`, `--tracking-snug -0.03em`).
- **Body** : SF Pro Display / système — contenus denses, CV, formulaires.
- **Mono** : JetBrains Mono — détails techniques, signatures, placeholders.
- Échelle compacte : `--text-xs 11` à `--text-2xl 22` ; interlignes
  `--leading-tight 1.1` à `--leading-loose 1.7`.

## Layout

- Grille **bento** responsive (1 col → 2 cols → 12 cols) pour l'accueil ;
  spans tweakables via `--hero-span` / `--photo-span` (`data-photo`).
- Pages CV/Contact : cartes pleine largeur empilées (`cv-layout`, `contact-bento`).
- **CV A4** : dimensions métriques sacrées (210 × 297 mm) ; tout effet d'écran
  (révélation incluse) est neutralisé en `@media print`.

## Classes utilitaires de révélation

| Classe | Portée | Mécanisme |
|--------|--------|-----------|
| `.cell` (bento accueil) | cellules de la grille | `view()`, entry 0 % → 45 % |
| `.story-inner` | sections Stories | `view()`, entry 0 % → 42 % |
| `.story-img` | médias Stories | parallax `view()` entry 0 % → exit 100 % |
| `.reveal` | blocs isolés (CV, Contact) | `view()`, entry 0 % → 42 %, opacity + translateY(18 px) |

`.reveal` (app/components.css) est la classe générique à poser sur une section ou
une carte pour lui donner la révélation sobre au scroll, même langage que le reste
du site. Toutes sont : sans JS, `transform/opacity` uniquement, fallback visible
sans support de `view()`, et **neutralisées au print**.

## Règles de gating (obligatoires)

Tout effet motion doit appliquer les trois gardes, en double quand le JS
déclenche l'effet (ex. View Transitions) :

1. **`prefers-reduced-motion: reduce`** → effet coupé, contenu statique et visible.
2. **`html.is-preview`** (aperçu admin / iframe, activé via `?preview`) → idem.
3. **`@media print`** → effet d'écran uniquement, jamais imprimé (le CV surtout).

Pattern CSS canonique : état par défaut visible → animation sous
`@supports (animation-timeline: view())` → gardes `!important` qui la coupent.
Exemple complet : bloc `.reveal` dans `app/components.css`.

## Composants clés

- **Cell / carte** : fond `--bg-card`, bordure `--border`, rayon `--radius-lg`,
  spotlight border au survol (anneau accent suivant la souris, masque CSS).
- **Pill de catégorie** (`--c` en local) : fond/bordure en `color-mix`, icône + label.
- **Boutons** : `--btn--primary/ghost/brand`, pill, lift au survol, échelle à l'appui.
- **Focus** : outline 2 px `color-mix(brand 70 %)` — toujours visible, jamais supprimé
  (`:focus-visible` uniquement).
- **Nav pill** : masquée au scroll vers le bas, réaffichée vers le haut ; burger
  ouvrant le menu plein écran numéroté (focus piégé, Échap pour fermer).

## Anti-patterns

Pas de lib d'animation lourde (GSAP, Framer Motion), pas de curseur custom,
pas de preloader, pas de scroll-jacking. Pas de couleur hors token, pas de
`animation` modifiant `width`/`height`/`top` (reflow), pas d'effet non gated.
