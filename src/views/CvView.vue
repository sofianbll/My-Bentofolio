<script setup lang="ts">
import {personalInfo, contactInfos, socialLinks, skillGroups, formations, interests, projects} from '@/data/portfolio'
import {ArrowLeft} from 'lucide-vue-next'
import {RouterLink} from 'vue-router'
import PhotoCell from '@/components/sections/PhotoCell.vue'

</script>

<template>
  <div class="cv-wrapper">
    <!-- Screen-only back button -->
    <RouterLink to="/" class="back-link">
      <ArrowLeft :size="16"/>
      Retour au portfolio
    </RouterLink>

    <div class="a4-page">
      <!-- HEADER -->

      <header class="cv-header gap-4">
        <PhotoCell class="w-full max-w-2xs"></PhotoCell>
        <header class="cv-header flex-col">
          <div class="cv-header-left">
            <h1 class="cv-name">{{ personalInfo.firstName }} {{ personalInfo.lastName }}</h1>
            <p class="cv-role">{{ personalInfo.role }}</p>
            <p class="cv-bio">{{ personalInfo.bio }}</p>
          </div>
          <div class="cv-header-right">
            <div v-for="info in contactInfos" :key="info.key" class="cv-contact-row">
              <span class="cv-contact-key">{{ info.key }}</span>
              <span class="cv-contact-val">{{ info.value }}</span>
            </div>
            <div class="cv-social-row">
              <span v-for="s in socialLinks" :key="s.label" class="cv-social">{{ s.label }}</span>
            </div>
          </div>
        </header>
      </header>

      <hr class="cv-divider"/>

      <!-- ALTERNANCE INFO -->
      <div class="cv-alternance">
        <span class="cv-badge">Recherche Contrat Alternance</span>
        <span>Début <strong>{{ personalInfo.alternance.start }}</strong></span>
        <span>·</span>
        <span><strong>{{ personalInfo.alternance.duration }}</strong></span>
        <span>·</span>
        <span>Rythme <strong>{{ personalInfo.alternance.rythme }}</strong></span>
      </div>

      <hr class="cv-divider"/>

      <!-- SKILLS -->
      <section class="cv-section">
        <h2 class="cv-section-title">Compétences</h2>
        <div class="cv-skills-grid">
          <div v-for="group in skillGroups" :key="group.category" class="cv-skill-group">
            <h3 class="cv-skill-cat">{{ group.category }}</h3>
            <div class="cv-tags">
              <span v-for="s in group.skills" :key="s.label" class="cv-tag">{{ s.label }}</span>
            </div>
          </div>
        </div>
      </section>

      <hr class="cv-divider"/>

      <!-- FORMATION -->
      <section class="cv-section">
        <h2 class="cv-section-title">Formation</h2>
        <div v-for="f in formations" :key="f.title" class="cv-xp">
          <div class="cv-xp-top">
            <strong>{{ f.title }}</strong>
            <span class="cv-xp-badge">{{ f.badge }}</span>
          </div>
          <p class="cv-xp-where">{{ f.where }}</p>
          <p class="cv-xp-desc">{{ f.description }}</p>
        </div>
      </section>

      <hr class="cv-divider"/>

      <!-- PROJECTS -->
      <section class="cv-section">
        <h2 class="cv-section-title">Projets</h2>
        <div class="cv-project-grid">
          <div v-for="p in projects" :key="p.name" class="cv-project">
            <div class="cv-project-top">
              <strong>{{ p.name }}</strong>
              <span class="cv-project-tech">{{ p.techLabel }}</span>
            </div>
            <p class="cv-project-meta">{{ p.meta }}</p>
            <p class="cv-project-desc">{{ p.description }}</p>
          </div>
        </div>
      </section>

      <hr class="cv-divider"/>

      <!-- INTERESTS -->
      <section class="cv-section">
        <h2 class="cv-section-title">Centres d'intérêts</h2>
        <div class="cv-interests">
          <div v-for="i in interests" :key="i.title" class="cv-interest">
            <span class="cv-interest-emoji">{{ i.emoji }}</span>
            <div>
              <strong>{{ i.title }}</strong>
              <span class="cv-interest-detail">{{ i.detail }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.cv-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  min-height: 100vh;
  background: var(--color-zinc-200);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 24px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-zinc-500);
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--color-zinc-900);
}

/* ─── A4 PAGE ─── */
.a4-page {
  width: 210mm;
  min-height: 297mm;
  max-height: 297mm;
  overflow: hidden;
  background: #fff;
  color: var(--color-zinc-900);
  //padding: 28mm 22mm;
  padding: 32px;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.12);
  font-family: var(--font-body);
  font-size: 11px;
  line-height: 1.5;
}

/* ─── HEADER ─── */
.cv-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.cv-name {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin-bottom: 4px;
}

.cv-role {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-zinc-500);
  margin-bottom: 8px;
}

.cv-bio {
  font-size: 11px;
  color: var(--color-zinc-600);
  line-height: 1.55;
  max-width: 320px;
  text-wrap: balance;
}

.cv-header-right {
  text-align: right;
  flex-shrink: 0;
}

.cv-contact-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 3px;
}

.cv-contact-key {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-zinc-400);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.cv-contact-val {
  font-size: 11px;
  font-weight: 600;
}

.cv-social-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 6px;
}

.cv-social {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-zinc-500);
}

/* ─── DIVIDER ─── */
.cv-divider {
  border: none;
  border-top: 1px solid var(--color-zinc-200);
  margin: 14px 0;
}

/* ─── ALTERNANCE ─── */
.cv-alternance {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--color-zinc-500);
}

.cv-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  background: var(--color-zinc-900);
  color: #fff;
  border-radius: 999px;
  margin-right: 8px;
}

/* ─── SECTIONS ─── */
.cv-section-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ─── SKILLS ─── */
.cv-skills-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.cv-skill-cat {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-zinc-400);
  margin-bottom: 6px;
}

.cv-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.cv-tag {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 8px;
  background: var(--color-zinc-100);
  border-radius: 4px;
  color: var(--color-zinc-700);
}

/* ─── XP ─── */
.cv-xp {
  margin-bottom: 8px;
}

.cv-xp-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  font-size: 12px;
}

.cv-xp-badge {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 8px;
  background: var(--color-zinc-100);
  border-radius: 999px;
}

.cv-xp-where {
  font-size: 10px;
  color: var(--color-zinc-500);
  margin-bottom: 3px;
}

.cv-xp-desc {
  font-size: 10px;
  color: var(--color-zinc-600);
  line-height: 1.5;
}

/* ─── PROJECTS ─── */
.cv-project-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.cv-project {
  padding: 8px 10px;
  background: var(--color-zinc-50);
  border-radius: 6px;
}

.cv-project-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  font-size: 11px;
}

.cv-project-tech {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 8px;
  background: var(--color-zinc-900);
  color: #fff;
  border-radius: 4px;
}

.cv-project-meta {
  font-size: 9px;
  color: var(--color-zinc-400);
  margin-bottom: 3px;
}

.cv-project-desc {
  font-size: 10px;
  color: var(--color-zinc-600);
  line-height: 1.45;
}

/* ─── INTERESTS ─── */
.cv-interests {
  display: flex;
  gap: 16px;
}

.cv-interest {
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

.cv-interest-emoji {
  font-size: 14px;
}

.cv-interest strong {
  font-size: 11px;
  display: block;
}

.cv-interest-detail {
  font-size: 9px;
  color: var(--color-zinc-500);
}

/* ─── PRINT ─── */
@media print {
  .cv-wrapper {
    padding: 0;
    background: none;
  }

  .back-link {
    display: none;
  }

  .a4-page {
    box-shadow: none;
    margin: 0;
    width: 210mm;
    min-height: 297mm;
  }

  @page {
    size: A4;
    margin: 0;
  }
}
</style>
