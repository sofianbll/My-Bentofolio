<script setup lang="ts">
import Cell from '@/components/layout/Cell.vue'
import { contactInfos, socialLinks } from '@/data/portfolio'
import { Linkedin, Github } from 'lucide-vue-next'

const iconMap: Record<string, any> = {
  linkedin: Linkedin,
  github: Github,
}
</script>

<template>
  <Cell variant="contact" :glow="true">
    <div class="contact-list">
      <div v-for="info in contactInfos" :key="info.key" class="contact-row">
        <span class="contact-key">{{ info.key }}</span>
        <span class="contact-val">{{ info.value }}</span>
      </div>
    </div>
    <div class="social-row">
      <a
        v-for="social in socialLinks"
        :key="social.label"
        :href="social.href"
        class="social-link"
        target="_blank"
        rel="noopener"
      >
        <component :is="iconMap[social.icon]" :size="16" class="social-icon" />
        <span>{{ social.label }}</span>
      </a>
    </div>
  </Cell>
</template>

<style scoped>
.contact-list {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.contact-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-s3) 0;
  border-bottom: 1px solid var(--border-sub);
}

.contact-row:last-child {
  border-bottom: none;
}

.contact-key {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-2);
  padding: 4px 10px;
  background: var(--bg-inset);
  border-radius: var(--radius-pill);
}

.contact-val {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text);
}

.social-row {
  display: flex;
  gap: var(--spacing-s2);
  margin-top: var(--spacing-s4);
}

.social-link {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-s2);
  padding: var(--spacing-s3) var(--spacing-s4);
  background: var(--bg-inset);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text);
  font-size: var(--text-base);
  font-weight: 600;
  border: 1px solid transparent;
  transition:
    border-color var(--dur) var(--ease),
    transform 0.3s var(--ease);
}

.social-link:hover {
  border-color: var(--border);
  transform: translateY(-1px);
}

.social-icon {
  color: var(--text-2);
}
</style>
