# CONTEXT.md — Bentofolio

Glossaire et conventions du domaine. Single-context : ce fichier couvre tout le dépôt.

## Glossaire

| Terme | Définition |
|-------|------------|
| **Bento / bento grid** | Grille d'accueil en tuiles (`Cell`) — hero, photo, skills, contact, formation, intérêts, projets. |
| **Cell** | Carte du bento. Variante (`variant`) + `glow` (halo au survol). |
| **config.json** | Source unique de vérité (profil, projets, expériences, apparence, CV, contact). L'admin écrit dedans en dev. |
| **Admin / dashboard** | Mini-CMS intégré (`/#/admin`), dev only (tree-shaken en production). Mot de passe `bento`. |
| **Preview (iframe)** | Le rendu live dans l'admin via iframe `?preview`, communication par `postMessage` (`config-runtime.js`). |
| **CV A4** | Vue `/#/cv` à taille fixe 210×297 mm, imprimable/exportable PDF. Densité et sélection de projets configurables. |
| **Case study** | `case-study.md` par projet, rendu en markdown dans la page détail. |
| **Tweaks** | Réglages visuels runtime (accent, densité, rayon, photo…) appliqués en variables CSS sur `<html>`. |
| **Catégories** | `dev`, `webdesign`, `3d`, `animation`, `logo`, `tools`, `devops`, `ai` — couleurs en `--cat-{id}`. |
| **Tech tags** | Pills colorées par techno (classes `.t-{tech}`), couleurs définies dans `styles.css`. |
| **Plugin Vite admin** | `vite-admin-plugin.ts` — endpoints dev (save, upload, CRUD projets, index). |
| **Featured (home/CV)** | Drapeaux `homeFeatured` / sélection CV : quels projets ressortent où. |

## Décisions structurantes (résumé)

- Données : `config.json` unique + `content/projects/<id>/` (métadonnées + markdown). Aucune autre source.
- Build statique (`dist/`) déployé sur GitHub Pages, base `/My-Bentofolio/`.
- Design system : CSS custom properties dans `app/styles.css` — zinc scale, accent `--brand`, Syne/SF Pro/JetBrains Mono.
- Tests : `bun test` (unitaires) + Playwright (e2e).

Les décisions durables sont enregistrées comme ADR dans `docs/adr/` (numérotation `NNNN-titre.md`).
