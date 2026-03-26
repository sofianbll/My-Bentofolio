<script setup lang="ts">
import Cell from '@/components/layout/Cell.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import Badge from '@/components/ui/Badge.vue'
import { formations } from '@/data/portfolio'
</script>

<template>
  <Cell variant="formation" :glow="true">
    <SectionTitle title="Formation" />
    <div v-for="f in formations" :key="f.title" class="xp-card">
      <div class="xp-top">
        <h4 class="xp-name">{{ f.title }}</h4>
        <Badge :label="f.badge" />
      </div>
      <p class="xp-where">{{ f.where }}</p>
      <p class="xp-desc">{{ f.description }}</p>
    </div>
  </Cell>
</template>

<style scoped>
.xp-card {
  padding: var(--spacing-s4);
  background: var(--bg-inset);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-s5);
}

.xp-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-s2);
}

.xp-name {
  font-size: var(--text-md);
  font-weight: 700;
}

.xp-where {
  font-size: var(--text-sm);
  color: var(--text-2);
  margin-bottom: var(--spacing-s2);
}

.xp-desc {
  font-size: var(--text-base);
  color: var(--text-2);
  line-height: var(--leading-normal);
}
</style>
