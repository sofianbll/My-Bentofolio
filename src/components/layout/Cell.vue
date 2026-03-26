<script setup lang="ts">
defineProps<{
  variant?: string
  glow?: boolean
}>()
</script>

<template>
  <div
    class="cell"
    :class="[variant ? `cell--${variant}` : '', { 'bento-glow': glow }]"
  >
    <div v-if="glow" class="glow-blob" />
    <div class="cell__inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cell {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition:
    border-color var(--dur) var(--ease),
    transform 0.5s var(--ease);
  opacity: 0;
  transform: translateY(16px);
  animation: cellIn var(--dur-slow) var(--ease) forwards;
}

.cell:hover {
  border-color: var(--text-2);
  transform: scale(1.003);
  z-index: var(--z-card);
}

.cell__inner {
  position: relative;
  z-index: 2;
  padding: var(--spacing-s6);
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Stagger delays */
.cell:nth-child(1) { animation-delay: 0.06s; }
.cell:nth-child(2) { animation-delay: 0.12s; }
.cell:nth-child(3) { animation-delay: 0.18s; }
.cell:nth-child(4) { animation-delay: 0.24s; }
.cell:nth-child(5) { animation-delay: 0.30s; }
.cell:nth-child(6) { animation-delay: 0.36s; }
.cell:nth-child(7) { animation-delay: 0.42s; }
.cell:nth-child(8) { animation-delay: 0.48s; }

/* Variant overrides */
.cell--hero,
.cell--skills {
  border-radius: var(--radius-lg);
}

.cell--photo {
  min-height: 280px;
  padding: 0;
}

.cell--photo .cell__inner {
  padding: 0;
}
</style>
