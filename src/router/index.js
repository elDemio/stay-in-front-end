import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import ErrorPageView from '../views/ErrorPageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: HomeView,
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorPageView,
    },
    {
      path: '/detalles/:id/:name',
      name: 'detalles',
      component: () => import('../views/DetailView.vue')
    },
    {
      path: '/reservar/:id/:name',
      name: 'reservar',
      component: () => import('../views/BookingView.vue')
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('../views/guest/ProfileView.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/anfitrion',
      name: 'anfitrion',
      component: () => import('../views/host/PanelView.vue'),
      meta: {
        requiresAuth: true,
        requiresHost: true
      },
    },
    {
      path: '/anuncios',
      name: 'anuncios',
      component: () => import('../views/host/PublicationsView.vue'),
      meta: {
        requiresAuth: true,
        requiresHost: true
      },
    },
    {
      path: '/nueva',
      name: 'nueva',
      component: () => import('../views/host/NewPublicationView.vue'),
      meta: {
        requiresAuth: true,
        requiresHost: true
      },
    },
    {
      path: '/viajes',
      name: 'viajes',
      component: () => import('../views/guest/BookingsView.vue'),
      meta: {
        requiresAuth: true
      },
    }
  ]
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const userRole = auth.role;

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresHost = to.matched.some(record => record.meta.requiresHost);

  if (requiresAuth && !auth.user) {
    auth.returnUrl = to.fullPath;
    next('/');
  } else if (requiresHost && userRole !== 'isHost') {
    next('/error');
  } else {
    next();
  }
});

export default router
