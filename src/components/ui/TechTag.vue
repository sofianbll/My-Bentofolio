<script setup lang="ts">
import type { TechKey } from '@/types'

defineProps<{
  label: string
  tech: TechKey
}>()

const techClasses: Record<TechKey, string> = {
  laravel: 't-laravel',
  vue: 't-vue',
  java: 't-java',
  tailwind: 't-tailwind',
  shadcn: 't-shadcn',
  mysql: 't-mysql',
  docker: 't-docker',
  git: 't-git',
  linux: 't-linux',
  nvim: 't-nvim',
  bash: 't-bash',
  figma: 't-figma',
  framer: 't-framer',
  python: 't-python',
  rag: 't-rag',
  n8n: 't-n8n',
  soft: 't-soft',
}
</script>

<template>
  <span class="tag" :class="techClasses[tech]">
    {{ label }}
  </span>
</template>

<style scoped>
.tag {
  padding: 5px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  color: #fff;
  transition: transform 0.3s var(--ease);
}
.tag:hover {
  transform: scale(1.06);
}

.t-laravel { background: var(--color-laravel); }
.t-vue { background: var(--color-vue); color: #0a2e1a; }
.t-java { background: var(--color-java); }
.t-tailwind { background: var(--color-tailwind); }
.t-shadcn { background: var(--color-shadcn); }
.t-mysql { background: var(--color-mysql); }
.t-docker { background: var(--color-docker); }
.t-git { background: var(--color-git); }
.t-linux { background: var(--color-linux); }
.t-nvim { background: var(--color-nvim); }
.t-bash { background: var(--color-bash); }
.t-figma { background: linear-gradient(135deg, var(--color-figma-1), var(--color-figma-2), var(--color-figma-3)); }
.t-framer { background: var(--color-framer); }
.t-python { background: var(--color-python); }
.t-rag { background: var(--color-rag); }
.t-n8n { background: var(--color-n8n); }
.t-soft {
  background: var(--bg-inset);
  color: var(--text);
  border: 1px solid var(--border-sub);
}
</style>
