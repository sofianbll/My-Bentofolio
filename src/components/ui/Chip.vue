<script setup lang="ts">
defineProps<{
  variant?: 'outline' | 'solid'
  label: string
}>()
</script>

<template>
  <span
    class="chip"
    :class="{
      'chip--outline': variant === 'outline' || !variant,
      'chip--solid': variant === 'solid',
    }"
  >
    {{ label }}
  </span>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-s1);
  padding: 5px 14px;
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
  font-weight: 600;
  white-space: nowrap;
}

.chip--outline {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
}

.chip--solid {
  background: var(--accent);
  color: var(--accent-fg);
  border: none;
}
</style>
