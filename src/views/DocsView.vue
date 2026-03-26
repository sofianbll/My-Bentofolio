<script setup lang="ts">
import {RouterLink} from 'vue-router'
import {ArrowLeft} from 'lucide-vue-next'
</script>

<template>
  <div class="docs-page">
    <RouterLink to="/" class="back-link">
      <ArrowLeft :size="16"/>
      Retour au portfolio
    </RouterLink>

    <header class="docs-header">
      <h1 class="docs-title">TypeScript pour&nbsp;Vue</h1>
      <p class="docs-subtitle">Guide rapide pour démarrer avec TypeScript dans un projet Vue 3, pensé pour les étudiants
        Epitech en première année.</p>
    </header>

    <!-- ═══ C'EST QUOI ? ═══ -->
    <section class="docs-section">
      <h2>C'est quoi TypeScript ?</h2>
      <p>TypeScript c'est du <strong>JavaScript avec des types</strong>. Ça veut dire que tu peux dire au code "cette
        variable est un nombre" ou "cet objet doit avoir un champ <code>name</code> qui est un <code>string</code>".</p>
      <p>Pourquoi ? Parce que ça te dit quand tu fais une erreur <strong>avant</strong> d'exécuter le code. Moins de
        bugs, plus de productivité.</p>
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">TypeScript</span>
          <span class="code-filename">Avant : JavaScript</span>
        </div>
        <pre><code>// JavaScript — aucune vérification
let name = "Sofian"
name = 42 // ❌ Bug silencieux, personne te prévient</code></pre>
      </div>
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">TypeScript</span>
          <span class="code-filename">Après : TypeScript</span>
        </div>
        <pre><code>// TypeScript — le compilateur te dit "non"
let name: string = "Sofian"
name = 42 // 🔴 Erreur : Type 'number' is not assignable to type 'string'</code></pre>
      </div>
    </section>

    <!-- ═══ LES TYPES DE BASE ═══ -->
    <section class="docs-section">
      <h2>Les types de base</h2>
      <p>Les types qu'on utilise le plus souvent :</p>
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">TypeScript</span>
          <span class="code-filename">types-de-base.ts</span>
        </div>
        <pre><code>// Les classiques
let age: number = 22
let name: string = "Sofian"
let isDev: boolean = true

// Tableaux
let skills: string[] = ["Laravel", "Vue", "Java"]

// Un objet avec une forme définie
let contact: { key: string; value: string } = {
  key: "Email",
  value: "sofian@epitech.eu"
}</code></pre>
      </div>
      <div class="tip-box">
        <span class="tip-icon">💡</span>
        <p>TypeScript <strong>infère les types</strong> automatiquement. Si tu écris <code>let x = 5</code>, il sait
          déjà que c'est un <code>number</code>. Pas besoin de tout typer à la main.</p>
      </div>
    </section>

    <!-- ═══ INTERFACE ═══ -->
    <section class="docs-section">
      <h2>Interface — donner une forme à un objet</h2>
      <p>Une <code>interface</code> c'est un "contrat" qui décrit la forme d'un objet : quels champs il a, et de quel
        type.</p>
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">TypeScript</span>
          <span class="code-filename">types/index.ts</span>
        </div>
        <pre><code>// On définit la "forme" d'un projet
interface Project {
  name: string
  techLabel: string
  meta: string
  description: string
}

// Ensuite on l'utilise
const myProject: Project = {
  name: "Connect'IN",
  techLabel: "Laravel",
  meta: "Réseau social · 3 sem.",
  description: "API REST, auth Sanctum..."
}

// Si tu oublies un champ → erreur !
const bad: Project = {
  name: "Oops",
  // 🔴 Property 'techLabel' is missing
}</code></pre>
      </div>
    </section>

    <!-- ═══ TYPE VS INTERFACE ═══ -->
    <section class="docs-section">
      <h2>Type vs Interface</h2>
      <p>Les deux servent à décrire la forme des données. En pratique :</p>
      <div class="comparison-grid">
        <div class="comparison-card">
          <h3>interface</h3>
          <p>Pour les <strong>objets</strong>. Peut être étendue avec <code>extends</code>.</p>
          <pre><code>interface User {
  name: string
  age: number
}

interface Student extends User {
  school: string
}</code></pre>
        </div>
        <div class="comparison-card">
          <h3>type</h3>
          <p>Pour <strong>tout le reste</strong> : unions, tuples, alias simples.</p>
          <pre><code>// Union — "c'est soit l'un, soit l'autre"
type Theme = 'light' | 'dark'

// Alias simple
type TechList = string[]

// Tuple
type Coord = [number, number]</code></pre>
        </div>
      </div>
      <div class="tip-box">
        <span class="tip-icon">📌</span>
        <p>Règle simple : utilise <code>interface</code> pour les objets, <code>type</code> pour le reste. Tu ne te
          tromperas jamais.</p>
      </div>
    </section>

    <!-- ═══ VUE + TS ═══ -->
    <section class="docs-section">
      <h2>TypeScript dans Vue 3</h2>
      <p>En Vue 3 avec <code>&lt;script setup lang="ts"&gt;</code>, TypeScript est intégré directement.</p>

      <h3>Props typées</h3>
      <p>Les props sont typées grâce à <code>defineProps</code> avec un générique :</p>
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">Vue</span>
          <span class="code-filename">Chip.vue</span>
        </div>
        <pre v-pre><code>&lt;script setup lang="ts"&gt;
// On dit : ce composant attend `label` (obligatoire)
// et `variant` (optionnel, soit 'outline' soit 'solid')
defineProps&lt;{
  label: string
  variant?: 'outline' | 'solid'
}&gt;()
&lt;/script&gt;

&lt;template&gt;
  &lt;span class="chip"&gt;{{ label }}&lt;/span&gt;
&lt;/template&gt;</code></pre>
      </div>

      <h3>ref() et computed()</h3>
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">TypeScript</span>
          <span class="code-filename">composables/useTheme.ts</span>
        </div>
        <pre><code>import { ref, computed } from 'vue'

// ref&lt;T&gt; = une valeur réactive typée
const theme = ref&lt;'light' | 'dark'&gt;('light')

// computed = valeur calculée automatiquement
const isDark = computed(() =&gt; theme.value === 'dark')

// Fonction pour toggle
function toggle() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}</code></pre>
      </div>

      <h3>Composable = fonction réutilisable</h3>
      <p>Un composable c'est juste une fonction qui utilise les API de Vue (<code>ref</code>, <code>computed</code>,
        <code>watch</code>) et qu'on peut réutiliser dans n'importe quel composant :</p>
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">TypeScript</span>
          <span class="code-filename">composables/useTheme.ts</span>
        </div>
        <pre><code>// Ce composable gère le thème dark/light
export function useTheme() {
  const theme = ref&lt;'light' | 'dark'&gt;('light')

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggle }
}

// Dans un composant :
// const { theme, toggle } = useTheme()</code></pre>
      </div>
    </section>

    <!-- ═══ ENUM / UNION ═══ -->
    <section class="docs-section">
      <h2>Union Types — le pouvoir du "ou"</h2>
      <p>Un union type c'est un type qui peut être <strong>plusieurs choses</strong>. C'est le concept TS le plus utile.
        Dans ce projet, on l'utilise pour les clés de technologie :</p>
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">TypeScript</span>
          <span class="code-filename">types/index.ts</span>
        </div>
        <pre><code>// Union type = "c'est forcément l'un de ces mots"
type TechKey =
  | 'laravel'
  | 'vue'
  | 'java'
  | 'tailwind'
  | 'docker'
  | 'git'
  | 'soft'

// Maintenant TS te protège :
const tech: TechKey = 'laravel' // ✅
const bad: TechKey = 'angular'  // 🔴 Erreur !</code></pre>
      </div>
    </section>

    <!-- ═══ GENERICS ═══ -->
    <section class="docs-section">
      <h2>Génériques — le type en paramètre</h2>
      <p>Un générique c'est un "trou" dans le type qu'on remplit plus tard. C'est comme un paramètre, mais pour les
        types :</p>
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">TypeScript</span>
          <span class="code-filename">exemple-generiques.ts</span>
        </div>
        <pre><code>// Sans générique — on doit écrire une fonction par type
function firstString(arr: string[]): string { return arr[0] }
function firstNumber(arr: number[]): number { return arr[0] }

// Avec générique — une seule fonction, tous les types
function first&lt;T&gt;(arr: T[]): T {
  return arr[0]
}

first(['a', 'b', 'c'])  // → 'a' (type: string)
first([1, 2, 3])        // → 1 (type: number)

// Vue utilise beaucoup les génériques :
import { ref } from 'vue'
const count = ref&lt;number&gt;(0)     // Ref&lt;number&gt;
const name = ref&lt;string&gt;('')     // Ref&lt;string&gt;</code></pre>
      </div>
    </section>

    <!-- ═══ STRUCTURE PROJET ═══ -->
    <section class="docs-section">
      <h2>Structure du projet</h2>
      <p>Voici comment le code est organisé dans ce projet Vue :</p>
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">Texte</span>
          <span class="code-filename">src/</span>
        </div>
        <pre><code>src/
├── assets/          → CSS global (tokens, reset, effets)
│   └── main.css
├── components/
│   ├── layout/      → Composants de structure (Navbar, BentoGrid, Cell)
│   ├── sections/    → Cellules du portfolio (HeroCell, SkillsCell...)
│   └── ui/          → Atomes réutilisables (Chip, Badge, TechTag)
├── composables/     → Logique réutilisable (useTheme, useMouseGlow)
├── data/            → Données du portfolio (portfolio.ts)
├── router/          → Configuration des routes
├── types/           → Interfaces et types TypeScript
└── views/           → Pages (PortfolioView, CvView, DesignSystemView...)</code></pre>
      </div>
      <div class="tip-box">
        <span class="tip-icon">🏗️</span>
        <p><strong>Règle d'or</strong> : les <code>components/ui/</code> sont des briques réutilisables partout, les
          <code>sections/</code> sont spécifiques au portfolio, et les <code>views/</code> sont les pages. Un composant
          UI ne doit jamais importer de données directement.</p>
      </div>
    </section>

    <!-- ═══ CHEAT SHEET ═══ -->
    <section class="docs-section">
      <h2>Cheat Sheet — Aide-mémoire</h2>
      <div class="cheatsheet-grid">
        <div class="cheat-card">
          <h3>Typer une variable</h3>
          <code>let x: string = "hello"</code>
        </div>
        <div class="cheat-card">
          <h3>Typer un tableau</h3>
          <code>let arr: number[] = [1, 2, 3]</code>
        </div>
        <div class="cheat-card">
          <h3>Typer une fonction</h3>
          <code>function add(a: number, b: number): number</code>
        </div>
        <div class="cheat-card">
          <h3>Paramètre optionnel</h3>
          <code>function greet(name?: string)</code>
        </div>
        <div class="cheat-card">
          <h3>Union type</h3>
          <code>type Status = 'on' | 'off'</code>
        </div>
        <div class="cheat-card">
          <h3>Interface</h3>
          <code>interface User { name: string }</code>
        </div>
        <div class="cheat-card">
          <h3>Props Vue typées</h3>
          <code>defineProps&lt;{ label: string }&gt;()</code>
        </div>
        <div class="cheat-card">
          <h3>ref typé</h3>
          <code>const x = ref&lt;number&gt;(0)</code>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.docs-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 88px 24px 80px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 32px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--text);
}

.docs-header {
  margin-bottom: 48px;
}

.docs-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 12px;
}

.docs-subtitle {
  font-size: var(--text-lg);
  color: var(--text-2);
  line-height: var(--leading-normal);
}

.docs-section {
  margin-bottom: 48px;
}

.docs-section h2 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 12px;
}

.docs-section h3 {
  font-size: var(--text-lg);
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 8px;
}

.docs-section p {
  font-size: var(--text-md);
  color: var(--text);
  line-height: var(--leading-loose);
  margin-bottom: 12px;
}

.docs-section p code {
  font-size: 13px;
  background: var(--bg-inset);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--text);
  font-weight: 600;
}

/* ─── CODE BLOCKS ─── */
.code-block {
  margin-bottom: 16px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border);
}

.code-header {
  display: flex;
  justify-content: space-between;
  padding: 6px 12px;
  background: var(--bg-inset);
  border-bottom: 1px solid var(--border-sub);
}

.code-lang {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-2);
}

.code-filename {
  font-size: 10px;
  color: var(--text-2);
}

.code-block pre {
  padding: 16px;
  background: var(--bg-card);
  margin: 0;
  overflow-x: auto;
}

.code-block code {
  font-size: 13px;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  line-height: 1.65;
  color: var(--text);
}

/* ─── TIP BOX ─── */
.tip-box {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg-inset);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-sub);
  margin-bottom: 16px;
}

.tip-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.tip-box p {
  margin: 0;
  font-size: var(--text-base);
}

/* ─── COMPARISON ─── */
.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

@media (max-width: 600px) {
  .comparison-grid {
    grid-template-columns: 1fr;
  }
}

.comparison-card {
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.comparison-card h3 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 800;
  margin: 0 0 6px;
}

.comparison-card p {
  font-size: var(--text-sm);
  margin-bottom: 12px;
}

.comparison-card pre {
  background: var(--bg-inset);
  padding: 12px;
  border-radius: var(--radius-sm);
  overflow-x: auto;
}

.comparison-card code {
  font-size: 12px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  line-height: 1.6;
}

/* ─── CHEATSHEET ─── */
.cheatsheet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.cheat-card {
  padding: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.cheat-card h3 {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--text-2);
  margin: 0 0 6px;
}

.cheat-card code {
  font-size: 12px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: var(--text);
  word-break: break-all;
}
</style>
