<script setup lang="ts">
import BentoGrid from '@/components/layout/BentoGrid.vue'
import HeroCell from '@/components/sections/HeroCell.vue'
import PhotoCell from '@/components/sections/PhotoCell.vue'
import ContactCell from '@/components/sections/ContactCell.vue'
import SkillsCell from '@/components/sections/SkillsCell.vue'
import FormationCell from '@/components/sections/FormationCell.vue'
import InterestsCell from '@/components/sections/InterestsCell.vue'
import ProjectsCell from '@/components/sections/ProjectsCell.vue'
</script>

<template>
  <main class="page">
    <BentoGrid>
      <HeroCell />
      <PhotoCell />
      <ContactCell />
      <SkillsCell />
      <FormationCell />
      <InterestsCell />
      <ProjectsCell />
    </BentoGrid>
  </main>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 88px var(--spacing-s4) var(--spacing-s10) var(--spacing-s4);
}
</style>
