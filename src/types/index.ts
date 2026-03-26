/* =============================================
   BENTOFOLIO — TYPE DEFINITIONS
   ============================================= */

/** All available tech brand keys for skill tags */
export type TechKey =
  | 'laravel'
  | 'vue'
  | 'java'
  | 'tailwind'
  | 'shadcn'
  | 'mysql'
  | 'docker'
  | 'git'
  | 'linux'
  | 'nvim'
  | 'bash'
  | 'figma'
  | 'framer'
  | 'python'
  | 'rag'
  | 'n8n'
  | 'soft'

/** A single skill tag */
export interface Skill {
  label: string
  tech: TechKey
}

/** A group of skills under a category */
export interface SkillGroup {
  category: string
  skills: Skill[]
}

/** A contact info row */
export interface ContactInfo {
  key: string
  value: string
}

/** A social link */
export interface SocialLink {
  icon: string
  label: string
  href: string
}

/** An interest entry */
export interface Interest {
  emoji: string
  title: string
  detail: string
}

/** An education/experience entry */
export interface Formation {
  title: string
  badge: string
  where: string
  description: string
}

/** A project card */
export interface Project {
  name: string
  techLabel: string
  techColor: string
  meta: string
  description: string
}

/** Route meta for private/public distinction */
export interface RouteMeta {
  isPrivate?: boolean
  robots?: string
  title?: string
}

/** A single design token for the DS page */
export interface DesignToken {
  name: string
  value: string
  cssVar: string
}
