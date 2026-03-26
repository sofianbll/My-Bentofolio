<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <h2 class="section-title">{{ title }}</h2>
</template>

<style scoped>
.section-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(18px, 2.4vw, var(--text-2xl));
  letter-spacing: var(--tracking-snug);
  margin-bottom: var(--spacing-s5);
}
</style>
