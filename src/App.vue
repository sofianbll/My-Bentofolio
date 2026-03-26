<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import { computed } from 'vue'

const route = useRoute()
const isPortfolio = computed(() => route.name === 'portfolio')
const isPrivatePage = computed(() => route.meta.isPrivate === true)
</script>

<template>
  <div class="app">
    <div class="mesh-bg" aria-hidden="true" />
    <Navbar v-if="isPortfolio" />

    <RouterView />

    <!-- Subtle footer link to internal pages -->
    <footer v-if="isPortfolio" class="app-footer">
      <div class="footer-inner">
        <div class="footer-links">
          <RouterLink to="/ds" class="footer-link">Design System</RouterLink>
          <span class="footer-sep">·</span>
          <RouterLink to="/docs" class="footer-link">TypeScript Guide</RouterLink>
          <span class="footer-sep">·</span>
          <RouterLink to="/cv" class="footer-link">CV A4</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-footer {
  margin-top: auto;
  padding: var(--spacing-s6) var(--spacing-s4);
}

.footer-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-s2);
}

.footer-link {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-2);
  text-decoration: none;
  opacity: 0.5;
  transition: opacity 0.3s var(--ease);
}

.footer-link:hover {
  opacity: 1;
}

.footer-sep {
  font-size: var(--text-xs);
  color: var(--text-2);
  opacity: 0.3;
}
</style>
