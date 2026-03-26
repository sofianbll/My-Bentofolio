<script setup lang="ts">
import Cell from '@/components/layout/Cell.vue'
import Chip from '@/components/ui/Chip.vue'
import { personalInfo } from '@/data/portfolio'
</script>

<template>
  <Cell variant="hero" :glow="true">
    <div class="hero-pills">
      <Chip label="✨ Hello" variant="outline" />
      <Chip label="Recherche Contrat Alternance" variant="solid" />
    </div>
    <h1 class="hero-name">
      {{ personalInfo.firstName }}<br />{{ personalInfo.lastName }}
    </h1>
    <p class="hero-role">{{ personalInfo.role }}</p>
    <div class="hero-meta">
      <span>Début <strong>{{ personalInfo.alternance.start }}</strong></span>
      <span class="meta-sep">·</span>
      <span><strong>{{ personalInfo.alternance.duration }}</strong></span>
      <span class="meta-sep">·</span>
      <span><strong>{{ personalInfo.alternance.rythme }}</strong> sem.</span>
    </div>
    <p class="hero-bio">{{ personalInfo.bio }}</p>
  </Cell>
</template>

<style scoped>
.hero-pills {
  display: flex;
  gap: var(--spacing-s2);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-s5);
}

.hero-name {
  font-family: var(--font-display);
  font-size: clamp(36px, 5.5vw, 52px);
  font-weight: 800;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--spacing-s3);
}

.hero-role {
  font-size: var(--text-lg);
  font-weight: 500;
  color: var(--text-2);
  margin-bottom: var(--spacing-s5);
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-s2);
  font-size: var(--text-sm);
  color: var(--text-2);
  margin-bottom: var(--spacing-s6);
  padding: var(--spacing-s3) var(--spacing-s4);
  background: var(--bg-inset);
  border-radius: var(--radius-sm);
}

.hero-meta strong {
  color: var(--text);
}

.meta-sep {
  opacity: 0.3;
}

.hero-bio {
  font-size: var(--text-base);
  line-height: var(--leading-loose);
  color: var(--text);
  margin-top: auto;
}
</style>
