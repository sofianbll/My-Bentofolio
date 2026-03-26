<script setup lang="ts">
import Cell from '@/components/layout/Cell.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import { interests } from '@/data/portfolio'
</script>

<template>
  <Cell variant="interests" :glow="true">
    <SectionTitle title="Centres d'intérêts" />
    <div class="interests">
      <div v-for="i in interests" :key="i.title" class="interest-row">
        <span class="interest-emoji">{{ i.emoji }}</span>
        <div>
          <strong>{{ i.title }}</strong>
          <span class="interest-detail">{{ i.detail }}</span>
        </div>
      </div>
    </div>
  </Cell>
</template>

<style scoped>
.interests {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s3);
}

.interest-row {
  display: flex;
  gap: var(--spacing-s3);
  align-items: center;
}

.interest-emoji {
  font-size: 20px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: var(--bg-inset);
  border-radius: 50%;
  flex-shrink: 0;
}

.interest-row strong {
  font-size: var(--text-base);
  display: block;
}

.interest-detail {
  font-size: var(--text-sm);
  color: var(--text-2);
}
</style>
