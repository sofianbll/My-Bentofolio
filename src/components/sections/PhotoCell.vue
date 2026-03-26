<script setup lang="ts">
</script>

<template>
  <div class="cell cell--photo bento-glow">
    <div class="glow-blob" />
    <img src="/photo.jpg" alt="Sofian Belloul" loading="lazy" />
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

.cell--photo {
  min-height: 400px;
  padding: 0;
}

.cell--photo img {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 60%;
  border-radius: calc(var(--radius-md) - 1px);
  transition: filter 0.6s var(--ease);
}

.cell--photo:hover img {
  filter: grayscale(1) contrast(1.15);
}

[data-theme='dark'] .cell--photo img {
  filter: brightness(0.88) contrast(1.08);
}

[data-theme='dark'] .cell--photo:hover img {
  filter: brightness(0.88) contrast(1.08) grayscale(1);
}
</style>
