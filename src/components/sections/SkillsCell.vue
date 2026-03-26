<script setup lang="ts">
import Cell from '@/components/layout/Cell.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import TechTag from '@/components/ui/TechTag.vue'
import { skillGroups } from '@/data/portfolio'
</script>

<template>
  <Cell variant="skills" :glow="true">
    <SectionTitle title="Stack" />
    <div class="skills-columns">
      <div v-for="group in skillGroups" :key="group.category" class="skill-col">
        <h3 class="skill-label">{{ group.category }}</h3>
        <div class="tags">
          <TechTag
            v-for="skill in group.skills"
            :key="skill.label"
            :label="skill.label"
            :tech="skill.tech"
          />
        </div>
      </div>
    </div>
  </Cell>
</template>

<style scoped>
.skills-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--spacing-s6);
}

.skill-label {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--text-2);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  margin-bottom: var(--spacing-s3);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
