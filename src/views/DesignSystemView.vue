<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import Chip from '@/components/ui/Chip.vue'
import Badge from '@/components/ui/Badge.vue'
import TechTag from '@/components/ui/TechTag.vue'
import type { TechKey } from '@/types'

// Color palette data
const zincScale = [
  { name: 'zinc-0', value: '#ffffff' },
  { name: 'zinc-50', value: '#f8f8fa' },
  { name: 'zinc-100', value: '#f0f0f3' },
  { name: 'zinc-150', value: '#e8e8ec' },
  { name: 'zinc-200', value: '#dcdce0' },
  { name: 'zinc-250', value: '#ececef' },
  { name: 'zinc-300', value: '#c4c4ca' },
  { name: 'zinc-400', value: '#8a8a96' },
  { name: 'zinc-500', value: '#6b6b76' },
  { name: 'zinc-600', value: '#4a4a54' },
  { name: 'zinc-700', value: '#2c2c34' },
  { name: 'zinc-800', value: '#1a1a1e' },
  { name: 'zinc-900', value: '#111113' },
  { name: 'zinc-950', value: '#0a0a0c' },
]

const brandColors = [
  { name: 'Laravel', value: '#ff2d20', cssVar: '--color-laravel' },
  { name: 'Vue', value: '#42b883', cssVar: '--color-vue' },
  { name: 'Java', value: '#e76f00', cssVar: '--color-java' },
  { name: 'Tailwind', value: '#06b6d4', cssVar: '--color-tailwind' },
  { name: 'Docker', value: '#2496ed', cssVar: '--color-docker' },
  { name: 'Git', value: '#f05032', cssVar: '--color-git' },
  { name: 'Linux', value: '#1793d1', cssVar: '--color-linux' },
  { name: 'Python', value: '#3776ab', cssVar: '--color-python' },
  { name: 'Figma', value: '#f24e1e', cssVar: '--color-figma-1' },
  { name: 'Framer', value: '#0055ff', cssVar: '--color-framer' },
  { name: 'RAG', value: '#6366f1', cssVar: '--color-rag' },
  { name: 'n8n', value: '#ea4b71', cssVar: '--color-n8n' },
]

const spacingScale = [
  { name: 's1', value: '4px' },
  { name: 's2', value: '8px' },
  { name: 's3', value: '12px' },
  { name: 's4', value: '16px' },
  { name: 's5', value: '20px' },
  { name: 's6', value: '24px' },
  { name: 's7', value: '32px' },
  { name: 's8', value: '40px' },
  { name: 's9', value: '48px' },
  { name: 's10', value: '64px' },
  { name: 's11', value: '80px' },
  { name: 's12', value: '96px' },
]

const radiusScale = [
  { name: 'xs', value: '4px' },
  { name: 'sm', value: '6px' },
  { name: 'md', value: '10px' },
  { name: 'lg', value: '14px' },
  { name: 'pill', value: '999px' },
]

const techKeys: TechKey[] = ['laravel', 'vue', 'java', 'tailwind', 'docker', 'git', 'figma', 'python', 'soft']

const semanticTokens = [
  { name: '--bg-page', light: 'zinc-100', dark: 'zinc-950' },
  { name: '--bg-card', light: 'zinc-0', dark: 'rgba(22,22,26,0.65)' },
  { name: '--bg-inset', light: '#f4f4f6', dark: 'zinc-800' },
  { name: '--text', light: 'zinc-900', dark: '#ededef' },
  { name: '--text-2', light: 'zinc-500', dark: 'zinc-400' },
  { name: '--border', light: 'zinc-200', dark: 'rgba(255,255,255,0.08)' },
  { name: '--accent', light: 'zinc-900', dark: 'zinc-0' },
]
</script>

<template>
  <div class="ds-page">
    <RouterLink to="/" class="back-link">
      <ArrowLeft :size="16" />
      Retour au portfolio
    </RouterLink>

    <header class="ds-header">
      <h1 class="ds-title">Design System</h1>
      <p class="ds-subtitle">Bentofolio — Tokens, couleurs, typographie et composants</p>
    </header>

    <!-- ═══ COLORS ═══ -->
    <section class="ds-section">
      <h2 class="ds-section-title">Palette Zinc</h2>
      <p class="ds-section-desc">Échelle de gris principale utilisée pour le fond, le texte et les bordures.</p>
      <div class="color-grid">
        <div
          v-for="color in zincScale"
          :key="color.name"
          class="color-swatch"
          :style="{ background: color.value }"
        >
          <span class="swatch-label" :class="{ 'swatch-label--light': !['zinc-0','zinc-50','zinc-100','zinc-150','zinc-200','zinc-250'].includes(color.name) }">
            {{ color.name }}
          </span>
          <span class="swatch-hex" :class="{ 'swatch-hex--light': !['zinc-0','zinc-50','zinc-100','zinc-150','zinc-200','zinc-250'].includes(color.name) }">
            {{ color.value }}
          </span>
        </div>
      </div>
    </section>

    <section class="ds-section">
      <h2 class="ds-section-title">Couleurs de marque (Tech)</h2>
      <p class="ds-section-desc">Couleurs associées à chaque technologie pour les tags et badges.</p>
      <div class="brand-grid">
        <div
          v-for="color in brandColors"
          :key="color.name"
          class="brand-swatch"
        >
          <div class="brand-dot" :style="{ background: color.value }" />
          <div class="brand-info">
            <span class="brand-name">{{ color.name }}</span>
            <code class="brand-var">{{ color.cssVar }}</code>
            <span class="brand-hex">{{ color.value }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="ds-section">
      <h2 class="ds-section-title">Tokens sémantiques</h2>
      <p class="ds-section-desc">Variables qui changent selon le thème (light/dark).</p>
      <div class="token-table-wrapper">
        <table class="token-table">
          <thead>
            <tr>
              <th>Variable CSS</th>
              <th>Light</th>
              <th>Dark</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in semanticTokens" :key="t.name">
              <td><code>{{ t.name }}</code></td>
              <td>{{ t.light }}</td>
              <td>{{ t.dark }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ═══ TYPOGRAPHY ═══ -->
    <section class="ds-section">
      <h2 class="ds-section-title">Typographie</h2>
      <div class="type-specimens">
        <div class="type-card">
          <h3 class="type-card-title">Syne — Display</h3>
          <p class="type-card-usage">Utilisé pour les titres, le nom, les en-têtes de section.</p>
          <div class="type-sample" style="font-family: var(--font-display);">
            <span style="font-weight: 600; font-size: 18px;">Syne Semi-Bold 600</span>
            <span style="font-weight: 700; font-size: 22px;">Syne Bold 700</span>
            <span style="font-weight: 800; font-size: 28px;">Syne Extra-Bold 800</span>
          </div>
        </div>
        <div class="type-card">
          <h3 class="type-card-title">SF Pro Display — Body</h3>
          <p class="type-card-usage">Utilisé pour le corps de texte, les descriptions, les métadonnées.</p>
          <div class="type-sample" style="font-family: var(--font-body);">
            <span style="font-weight: 400; font-size: 14px;">Regular 400 — Corps de texte</span>
            <span style="font-weight: 500; font-size: 14px;">Medium 500 — Labels</span>
            <span style="font-weight: 600; font-size: 14px;">Semi-Bold 600 — Emphasis</span>
            <span style="font-weight: 700; font-size: 14px;">Bold 700 — Titres inline</span>
          </div>
        </div>
      </div>

      <h3 class="ds-sub-title">Échelle typographique</h3>
      <div class="type-scale">
        <div v-for="size in [
          { name: 'text-xs', value: '11px' },
          { name: 'text-sm', value: '12px' },
          { name: 'text-base', value: '14px' },
          { name: 'text-md', value: '15px' },
          { name: 'text-lg', value: '16px' },
          { name: 'text-xl', value: '18px' },
          { name: 'text-2xl', value: '22px' },
        ]" :key="size.name" class="type-scale-row">
          <code class="type-scale-var">--{{ size.name }}</code>
          <span class="type-scale-value">{{ size.value }}</span>
          <span class="type-scale-sample" :style="{ fontSize: size.value }">Sofian Belloul</span>
        </div>
      </div>
    </section>

    <!-- ═══ SPACING ═══ -->
    <section class="ds-section">
      <h2 class="ds-section-title">Spacing</h2>
      <p class="ds-section-desc">Échelle de 4px. Utilise les variables <code>--spacing-s1</code> à <code>--spacing-s12</code>.</p>
      <div class="spacing-strip">
        <div v-for="s in spacingScale" :key="s.name" class="spacing-item">
          <div class="spacing-bar" :style="{ width: s.value }" />
          <div class="spacing-meta">
            <code>{{ s.name }}</code>
            <span>{{ s.value }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ RADIUS ═══ -->
    <section class="ds-section">
      <h2 class="ds-section-title">Border Radius</h2>
      <div class="radius-grid">
        <div v-for="r in radiusScale" :key="r.name" class="radius-item">
          <div class="radius-box" :style="{ borderRadius: r.value }" />
          <code>{{ r.name }}</code>
          <span>{{ r.value }}</span>
        </div>
      </div>
    </section>

    <!-- ═══ COMPONENTS ═══ -->
    <section class="ds-section">
      <h2 class="ds-section-title">Composants</h2>

      <h3 class="ds-sub-title">Chip</h3>
      <p class="ds-section-desc">Pastille de statut ou label inline.</p>
      <div class="ds-component-row">
        <Chip label="✨ Hello" variant="outline" />
        <Chip label="Recherche Contrat Alternance" variant="solid" />
      </div>

      <h3 class="ds-sub-title">Badge</h3>
      <p class="ds-section-desc">Indicateur compact de métadonnée.</p>
      <div class="ds-component-row">
        <Badge label="BAC+2 RNCP" />
        <Badge label="Laravel" color="var(--color-laravel)" />
        <Badge label="Java SE" color="var(--color-java)" />
        <Badge label="PHP MVC" color="var(--color-rag)" />
      </div>

      <h3 class="ds-sub-title">TechTag</h3>
      <p class="ds-section-desc">Pilule de stack technique avec couleur de marque.</p>
      <div class="ds-component-row">
        <TechTag v-for="t in techKeys" :key="t" :label="t" :tech="t" />
      </div>
    </section>

    <!-- ═══ SHADOWS ═══ -->
    <section class="ds-section">
      <h2 class="ds-section-title">Shadows</h2>
      <div class="shadow-grid">
        <div class="shadow-card" style="box-shadow: var(--shadow-sm);">
          <code>--shadow-sm</code>
        </div>
        <div class="shadow-card" style="box-shadow: var(--shadow-md);">
          <code>--shadow-md</code>
        </div>
        <div class="shadow-card" style="box-shadow: var(--shadow-lg);">
          <code>--shadow-lg</code>
        </div>
      </div>
    </section>

    <!-- ═══ MOTION ═══ -->
    <section class="ds-section">
      <h2 class="ds-section-title">Motion</h2>
      <div class="token-table-wrapper">
        <table class="token-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Valeur</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>--ease</code></td>
              <td>cubic-bezier(0.16, 1, 0.3, 1)</td>
              <td>Quart-out — mouvement par défaut</td>
            </tr>
            <tr>
              <td><code>--ease-in</code></td>
              <td>cubic-bezier(0.4, 0, 1, 1)</td>
              <td>Éléments qui quittent l'écran</td>
            </tr>
            <tr>
              <td><code>--ease-spring</code></td>
              <td>cubic-bezier(0.34, 1.56, 0.64, 1)</td>
              <td>Micro-interactions (hover, toggle)</td>
            </tr>
            <tr>
              <td><code>--dur-fast</code></td>
              <td>0.2s</td>
              <td>Transitions rapides</td>
            </tr>
            <tr>
              <td><code>--dur</code></td>
              <td>0.45s</td>
              <td>Durée par défaut</td>
            </tr>
            <tr>
              <td><code>--dur-slow</code></td>
              <td>0.65s</td>
              <td>Animations d'entrée</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ds-page {
  max-width: 960px;
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
.back-link:hover { color: var(--text); }

.ds-header {
  margin-bottom: 48px;
}

.ds-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 8px;
}

.ds-subtitle {
  font-size: var(--text-lg);
  color: var(--text-2);
}

.ds-section {
  margin-bottom: 56px;
}

.ds-section-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 8px;
}

.ds-section-desc {
  font-size: var(--text-base);
  color: var(--text-2);
  margin-bottom: 20px;
  line-height: var(--leading-normal);
}

.ds-section-desc code {
  font-size: 12px;
  background: var(--bg-inset);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--text);
}

.ds-sub-title {
  font-size: var(--text-lg);
  font-weight: 700;
  margin-top: 28px;
  margin-bottom: 8px;
}

/* ─── COLOR GRID ─── */
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
}

.color-swatch {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 8px;
  border: 1px solid var(--border);
}

.swatch-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-zinc-900);
}

.swatch-hex {
  font-size: 9px;
  font-family: monospace;
  color: var(--color-zinc-600);
}

.swatch-label--light { color: #fff; }
.swatch-hex--light { color: rgba(255,255,255,0.7); }

/* ─── BRAND COLORS ─── */
.brand-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}

.brand-swatch {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.brand-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-weight: 700;
  font-size: 13px;
}

.brand-var {
  font-size: 10px;
  color: var(--text-2);
}

.brand-hex {
  font-size: 10px;
  font-family: monospace;
  color: var(--text-2);
}

/* ─── TOKEN TABLE ─── */
.token-table-wrapper {
  overflow-x: auto;
}

.token-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.token-table th {
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-2);
  padding: 8px 12px;
  border-bottom: 2px solid var(--border);
}

.token-table td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-sub);
}

.token-table code {
  font-size: 12px;
  background: var(--bg-inset);
  padding: 2px 6px;
  border-radius: 4px;
}

/* ─── TYPE SPECIMENS ─── */
.type-specimens {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 768px) {
  .type-specimens {
    grid-template-columns: 1fr;
  }
}

.type-card {
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.type-card-title {
  font-size: var(--text-lg);
  font-weight: 700;
  margin-bottom: 4px;
}

.type-card-usage {
  font-size: var(--text-sm);
  color: var(--text-2);
  margin-bottom: 16px;
}

.type-sample {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.type-scale {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.type-scale-row {
  display: grid;
  grid-template-columns: 120px 60px 1fr;
  align-items: baseline;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid var(--border-sub);
}

.type-scale-var {
  font-size: 11px;
  background: var(--bg-inset);
  padding: 2px 6px;
  border-radius: 4px;
}

.type-scale-value {
  font-size: 11px;
  color: var(--text-2);
  font-family: monospace;
}

/* ─── SPACING ─── */
.spacing-strip {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spacing-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.spacing-bar {
  height: 20px;
  background: var(--accent);
  border-radius: 3px;
  min-width: 4px;
  opacity: 0.75;
}

.spacing-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.spacing-meta code {
  font-size: 11px;
  background: var(--bg-inset);
  padding: 2px 6px;
  border-radius: 4px;
}

.spacing-meta span {
  font-size: 11px;
  color: var(--text-2);
  font-family: monospace;
}

/* ─── RADIUS ─── */
.radius-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.radius-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.radius-box {
  width: 64px;
  height: 64px;
  background: var(--bg-inset);
  border: 2px solid var(--border);
}

.radius-item code {
  font-size: 11px;
  background: var(--bg-inset);
  padding: 2px 6px;
  border-radius: 4px;
}

.radius-item span {
  font-size: 10px;
  color: var(--text-2);
}

/* ─── COMPONENT ROW ─── */
.ds-component-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

/* ─── SHADOW GRID ─── */
.shadow-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.shadow-card {
  padding: 24px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

.shadow-card code {
  font-size: 12px;
  color: var(--text-2);
}
</style>
