import type {SkillGroup, ContactInfo, SocialLink, Interest, Formation, Project} from '@/types'

export const personalInfo = {
    firstName: 'Sofian',
    lastName: 'BELLOUL',
    role: 'Développeur Web Full Stack',
    bio: `Designer Framer reconverti dev — Laravel, Vue.js, Java. Mon TDAH me pousse à tout optimiser : workflows, archis complexes, et en ce moment ma transition vers un workflow full terminal. 
    Je suis aussi à l'aise à monter une API REST qu'à mixer devant 1200 personnes.`,
    alternance: {
        start: 'sept. 2026',
        duration: '14 mois',
        rythme: '6/2 sem.',
    },
}

export const contactInfos: ContactInfo[] = [
    {key: 'Âge', value: '22 ans'},
    {key: 'Localisation', value: 'Île-de-France'},
    {key: 'Téléphone', value: '07 67 54 62 09'},
    {key: 'Email', value: 'sofian.belloul@epitech.eu'},
]

export const socialLinks: SocialLink[] = [
    {icon: 'linkedin', label: 'in/sofianbll', href: '#'},
    {icon: 'github', label: 'Sofian-bll', href: 'https://github.com/Sofian-bll'},
]

export const skillGroups: SkillGroup[] = [
    {
        category: 'Dev Web',
        skills: [
            {label: 'PHP / Laravel', tech: 'laravel'},
            {label: 'Vue 3 / Vite', tech: 'vue'},
            {label: 'Java SE', tech: 'java'},
            {label: 'Tailwind', tech: 'tailwind'},
            {label: 'shadcn-vue', tech: 'shadcn'},
            {label: 'MySQL', tech: 'mysql'},
        ],
    },
    {
        category: 'DevOps',
        skills: [
            {label: 'Docker / Sail', tech: 'docker'},
            {label: 'Git / GitHub', tech: 'git'},
            {label: 'Linux (Arch)', tech: 'linux'},
            {label: 'Neovim / tmux', tech: 'nvim'},
            {label: 'Bash / Make', tech: 'bash'},
        ],
    },
    {
        category: 'Design & IA',
        skills: [
            {label: 'Figma', tech: 'figma'},
            {label: 'Framer', tech: 'framer'},
            {label: 'Python', tech: 'python'},
            {label: 'RAG / LLMs', tech: 'rag'},
            {label: 'n8n', tech: 'n8n'},
        ],
    },
    {
        category: 'Soft Skills',
        skills: [
            {label: 'Prise de parole', tech: 'soft'},
            {label: 'Vulgarisation', tech: 'soft'},
            {label: 'Leadership', tech: 'soft'},
        ],
    },
]

export const formations: Formation[] = [
    {
        title: 'Développeur-Intégrateur Web',
        badge: 'BAC+2 RNCP',
        where: 'Web@cademie by EPITECH — Paris · Depuis 2024',
        description: 'Java, PHP Laravel, Vue 3. Pédagogie par projets. Prise de parole et présentations professionnelles.',
    },
]

export const interests: Interest[] = [
    {
        emoji: '🎧',
        title: 'DJ & Producteur',
        detail: '+100k écoutes · Live devant +1 200 pers.',
    },
    {
        emoji: '⌨️',
        title: 'CLI & Productivité',
        detail: 'Arch, Neovim, tmux, PKM Obsidian',
    },
    {
        emoji: '🔬',
        title: 'Science',
        detail: 'Physique quantique, cybersécurité',
    },
]

export const projects: Project[] = [
    {
        name: "Connect'IN",
        techLabel: 'Laravel',
        techColor: 'var(--color-laravel)',
        meta: 'Réseau social · Binôme · 3 sem.',
        description: 'API REST, auth Sanctum, relations SQL, tests unitaires.',
    },
    {
        name: 'My Cinema',
        techLabel: 'PHP MVC',
        techColor: 'var(--color-rag)',
        meta: 'Back-Office · Solo · 2 sem.',
        description: 'Architecture MVC from scratch, SoftDeletes, anti-chevauchement.',
    },
    {
        name: 'Piscine Java',
        techLabel: 'Java SE',
        techColor: 'var(--color-java)',
        meta: 'Bootcamp · Solo · 2 sem.',
        description: 'Design Patterns, Génériques, Réflexion, Testeur custom.',
    },
    {
        name: 'Freelance Web',
        techLabel: 'Framer',
        techColor: 'var(--color-framer)',
        meta: 'Indépendant · 2 ans',
        description: 'Sites e-commerce et vitrines haut de gamme, Shopify × Framer.',
    },
]
