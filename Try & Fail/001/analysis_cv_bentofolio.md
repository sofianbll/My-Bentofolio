# 🔍 Analyse — CV Bento / Bentofolio

## Figma Design (source de vérité)

Le design Figma montre un CV bento-grid A4 avec **6 cellules** organisées en 2 colonnes × 3 rangées, `gap: 10px`, `padding: 10px`, `border-radius: 14px` sur la page.

### Structure de la grille

| Position | Cellule | Contenu |
|----------|---------|---------|
| R1-C1 | **Hero** | Pill "✨ Hello", nom, titre, pill "Recherche Contrat Alternance", infos alternance, description |
| R1-C2 | **Photo** | Photo de profil, object-cover |
| R2-C1 | **Contact** | Âge (22 ans), Localisation (Île-de-France), Téléphone, Email + liens LinkedIn/GitHub/Portfolio |
| R2-C2 | **Compétences** | Pill "Compétences", skills groupées par catégorie + Soft Skills |
| R3-C1 | **Formation** | Formation principale + section "Et aussi…" (DJ, Productivité, Science) |
| R3-C2 | **Projets & Expériences** | Connect'IN, My Cinema, Piscine Java SE, Webdesigner Freelance |

---

## Contenu extrait (pour CV + Portfolio)

### 👤 Identité
- **Nom** : Sofian BELLOUL
- **Titre** : Développeur Web
- **Alternance** : Recherche Contrat Alternance — Début sept. 2026, Durée 14 mois, Rythme 3 sem. entreprise / 1 sem. formation
- **Description** : Ex-webdesigner Framer reconverti dev — Laravel, Vue.js, Java. Grâce au TDAH, j'optimise tout. DJ à mes heures, dev le reste du temps. Accessoirement, je mixe devant 1 200 personnes.

### 📞 Contact
| Champ | Valeur |
|-------|--------|
| Âge | 22 ans |
| Localisation | Île-de-France |
| Téléphone | 07 67 54 62 09 |
| Email | sofian.belloul@epitech.eu |
| LinkedIn | in/sofianbll |
| GitHub | Sofian-bll |
| Portfolio | À venir ↗ |

### 🛠 Compétences

**Développement Web** : PHP/Laravel, Vue 3/Vite, Java SE, Tailwind CSS, shadcn-vue, MySQL

**DevOps & Environnement** : Docker/Sail, Git/GitHub, Linux (Arch), Neovim/tmux, Bash/Makefile

**Design & IA** : Figma, Framer, Python, RAG/LLMs, n8n

**Soft Skills** : Prise de parole, Vulgarisation, Leadership, Résolution de pb

### 🎓 Formation
- **Développeur-Intégrateur Web** — BAC+2 RNCP
  - Web@cademie by EPITECH — Paris | Depuis 2024
  - Apprentissage Java, PHP (Laravel), Vue 3. Pédagogie par projets. Module avancé prise de parole et présentations professionnelles.

### 🎯 Et aussi… (intérêts/passions)
- **🎧 DJ & Producteur (Techno/Tekno)** — Alias Koya / Koyatekno. +100k écoutes sur SoundCloud. Performance live à L'Entrepôt (Bordeaux) devant +1 200 personnes.
- **⌨️ Productivité & CLI** — Linux (Arch), Neovim, tmux. Système de productivité avancé (PKM) sur Obsidian.
- **🔬 Science & Curiosité** — Physique quantique (modèle standard, intrication) et enjeux de la cybersécurité.

### 💼 Projets & Expériences
1. **Connect'IN — Réseau Social Interne** `Laravel`
   - Projet Epitech • Binôme • 3 semaines • Vue 3, Docker, Tailwind
   - API REST backend (Laravel), auth Sanctum, relations SQL (Seeders/Factories). Tests unitaires.

2. **My Cinema — Back-Office** `PHP MVC`
   - Projet Epitech • Individuel • 2 semaines • Vue 3, shadcn-vue
   - Architecture MVC from scratch. Logiques métiers avancées (SoftDeletes, anti-chevauchement).

3. **Piscine Java SE** `Java SE`
   - Bootcamp Epitech • Individuel • 2 semaines • IntelliJ IDEA
   - Apprentissage intensif avec validation quotidienne. POO avancée : héritage, généricité, Design Patterns.

4. **Webdesigner & Intégrateur Freelance** `Framer`
   - Indépendant • 2 ans • Shopify, Webflow
   - Sites vitrines et e-commerce haut de gamme. Architectures Framer ↔ Shopify, bases multi-tenants.

---

## Écarts HTML actuel vs Figma

| Élément | Figma ✅ | HTML actuel ❌ |
|---------|---------|---------------|
| Pill "Recherche Contrat Alternance" | Présent (noir) | Absent |
| Infos alternance (dates, rythme) | Sous la pill | Absent |
| Description (mention TDAH, 1200 pers.) | Version longue | Version différente/courte |
| Contact → Âge, Localisation | Présents | Remplacés par Prénom/Nom |
| Contact → Liens sociaux (LinkedIn, GitHub, Portfolio) | Sous les infos | Absents |
| Compétences → Catégories (Dev Web, DevOps, Design&IA) | Avec labels de catégorie | Pas de catégories, liste plate |
| Compétences → Soft Skills | Section dédiée (pills grises) | Absentes |
| Compétences → RAG/LLMs | Présent | Absent |
| Compétences → Bash/**Makefile** | "Bash / Makefile" | Juste "Bash" |
| Formation → "Et aussi…" section | Présente avec 3 intérêts | Absente (remplacée par Bac) |
| Projets → Piscine Java SE | Présent | Absent |
| Projets → format détaillé (contexte, durée, type) | Sous-titre enrichi | Sous-titre basique |
| Colonne gauche R3 → "Et aussi…" | Sous la formation | Contient Bac à la place |

---

## Vision : dual CV / Bentofolio

Le concept est de créer des **composants réutilisables** (cards bento) qui fonctionnent dans deux contextes :

1. **CV A4** — Layout fixe `210mm × 297mm`, imprimable, grille 2×3
2. **Bentofolio web** — Layout responsive/flexible, avec plus d'espace, animations, possibilité d'ajouter des projets

> Les mêmes composants (Hero, Contact, Skills, WorkCard, etc.) seraient stylisés différemment selon le contexte mais partageraient la même structure HTML.
