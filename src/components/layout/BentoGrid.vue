<script setup lang="ts">
import { ref } from 'vue'
import { useMouseGlow } from '@/composables/useMouseGlow'

const gridRef = ref<HTMLElement | null>(null)
useMouseGlow(gridRef)
</script>

<template>
  <div ref="gridRef" class="bento">
    <slot />
  </div>
</template>

<style scoped>
.bento {
  display: grid;
  gap: var(--spacing-s3);
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
}

@media (min-width: 700px) {
  .bento {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'hero photo'
      'contact skills'
      'form interests'
      'projects projects';
  }

  .bento :deep(.cell--hero) { grid-area: hero; }
  .bento :deep(.cell--photo) { grid-area: photo; }
  .bento :deep(.cell--contact) { grid-area: contact; }
  .bento :deep(.cell--skills) { grid-area: skills; }
  .bento :deep(.cell--formation) { grid-area: form; }
  .bento :deep(.cell--interests) { grid-area: interests; }
  .bento :deep(.cell--projects) { grid-area: projects; }
}

@media (min-width: 1024px) {
  .bento {
    grid-template-columns: 5fr 3fr 4fr;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      'hero photo contact'
      'skills skills skills'
      'form interests projects'
      'form interests projects';
  }
}
</style>
