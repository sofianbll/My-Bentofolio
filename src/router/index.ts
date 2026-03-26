import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'portfolio',
      component: () => import('@/views/PortfolioView.vue'),
      meta: { title: 'Sofian Belloul — Portfolio' },
    },
    {
      path: '/cv',
      name: 'cv',
      component: () => import('@/views/CvView.vue'),
      meta: { title: 'CV — Sofian Belloul', isPrivate: true, robots: 'noindex' },
    },
    {
      path: '/ds',
      name: 'design-system',
      component: () => import('@/views/DesignSystemView.vue'),
      meta: { title: 'Design System — Bentofolio', isPrivate: true, robots: 'noindex' },
    },
    {
      path: '/docs',
      name: 'docs',
      component: () => import('@/views/DocsView.vue'),
      meta: { title: 'TypeScript Guide — Bentofolio', isPrivate: true, robots: 'noindex' },
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  document.title = (to.meta.title as string) || 'Bentofolio'

  // Handle robots meta
  let robotsMeta = document.querySelector('meta[name="robots"]')
  if (to.meta.robots) {
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta')
      robotsMeta.setAttribute('name', 'robots')
      document.head.appendChild(robotsMeta)
    }
    robotsMeta.setAttribute('content', to.meta.robots as string)
  } else {
    robotsMeta?.remove()
  }
})

export default router
