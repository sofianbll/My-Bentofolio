<script setup lang="ts">
defineProps<{
  label: string
  color?: string
}>()
</script>

<template>
  <span
    class="badge"
    :class="{ 'badge--color': color }"
    :style="color ? { '--badge-c': color } as any : undefined"
  >
    {{ label }}
  </span>
</template>

<style scoped>
.badge {
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: var(--bg-card);
  border: 1px solid var(--border);
  white-space: nowrap;
}

.badge--color {
  background: var(--badge-c, var(--accent));
  color: #fff;
  border: none;
}
</style>
