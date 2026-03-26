<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { Moon, Sun } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { theme, toggle } = useTheme()
const route = useRoute()

const navLinks = [
  { label: 'About', hash: '#about' },
  { label: 'Skills', hash: '#skills' },
  { label: 'Projects', hash: '#projects' },
  { label: 'Contact', hash: '#contact' },
]
</script>

<template>
  <nav class="navbar">
    <div class="nav-inner">
      <RouterLink to="/" class="nav-brand">
        <span class="brand-name">Sofian Bll</span>
        <span class="brand-dot">·</span>
        <span class="brand-tag">portfolio</span>
      </RouterLink>

      <div class="nav-menu">
        <a
          v-for="link in navLinks"
          :key="link.hash"
          :href="link.hash"
          class="nav-link"
        >
          {{ link.label }}
        </a>
      </div>

      <div class="nav-controls">
        <button
          class="icon-btn"
          aria-label="Toggle Dark Mode"
          @click="toggle"
        >
          <Moon v-if="theme === 'light'" :size="18" />
          <Sun v-else :size="18" />
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: var(--spacing-s3);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - var(--spacing-s6));
  max-width: 1120px;
  height: 56px;
  background: var(--nav-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  z-index: var(--z-nav);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-s5);
  box-shadow: var(--shadow-card-md);
}

.nav-inner {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-s2);
  text-decoration: none;
  color: var(--text);
}

.brand-name {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 17px;
  letter-spacing: var(--tracking-snug);
}

.brand-dot {
  color: var(--text-2);
  font-weight: 300;
}

.brand-tag {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-2);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}

.nav-menu {
  display: none;
  gap: var(--spacing-s7);
}

@media (min-width: 768px) {
  .nav-menu {
    display: flex;
  }
}

.nav-link {
  text-decoration: none;
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--text-2);
  transition: color var(--dur) var(--ease);
}

.nav-link:hover {
  color: var(--text);
}

.nav-controls {
  display: flex;
  gap: var(--spacing-s2);
}

.icon-btn {
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--text);
  cursor: pointer;
  transition: background var(--dur) var(--ease);
}

.icon-btn:hover {
  background: var(--bg-inset);
}
</style>
