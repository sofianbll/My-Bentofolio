<script setup lang="ts">
import Cell from '@/components/layout/Cell.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import Badge from '@/components/ui/Badge.vue'
import { projects } from '@/data/portfolio'
import { ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <Cell variant="projects" :glow="true">
    <div class="section-header">
      <SectionTitle title="Projets" />
      <a href="#" class="link-arrow">
        Voir tout <ArrowRight :size="14" />
      </a>
    </div>
    <div class="project-grid">
      <div v-for="p in projects" :key="p.name" class="project-card">
        <div class="pc-top">
          <h4 class="pc-name">{{ p.name }}</h4>
          <Badge :label="p.techLabel" :color="p.techColor" />
        </div>
        <p class="pc-meta">{{ p.meta }}</p>
        <p class="pc-desc">{{ p.description }}</p>
      </div>
    </div>
  </Cell>
</template>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-s5);
}

.section-header :deep(.section-title) {
  margin-bottom: 0;
}

.link-arrow {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-s1);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-2);
  text-decoration: none;
  transition: color var(--dur) var(--ease);
}

.link-arrow:hover {
  color: var(--text);
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-s3);
}

.project-card {
  padding: var(--spacing-s4);
  background: var(--bg-inset);
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  transition:
    border-color var(--dur) var(--ease),
    transform 0.3s var(--ease);
}

.project-card:hover {
  border-color: var(--border);
  transform: translateY(-2px);
}

.pc-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-s2);
}

.pc-name {
  font-size: var(--text-md);
  font-weight: 700;
}

.pc-meta {
  font-size: var(--text-sm);
  color: var(--text-2);
  margin-bottom: var(--spacing-s2);
}

.pc-desc {
  font-size: var(--text-base);
  color: var(--text-2);
  line-height: var(--leading-normal);
}
</style>
