import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebaseConfig'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('@/views/PostsView.vue')
    },
    {
      path: '/logbook',
      name: 'logbook',
      component: () => import('@/views/LogbookView.vue')
    },
    {
      path: '/proposal',
      name: 'proposal',
      component: () => import('@/views/ProposalView.vue')
    },
    {
      path: '/updates',
      name: 'updates',
      component: () => import('@/views/UpdatesView.vue')
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('@/views/DemoView.vue')
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('@/views/ReportView.vue')
    }
  ]
})

// Navigation guard for admin-only routes
router.beforeEach(async (to, from, next) => {
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  if (requiresAdmin) {
    const user = auth.currentUser
    if (user && user.email === 'osalirab@gmail.com') {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router 