import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import IndexView from '@/views/auth/IndexView.vue';
import DashboardView from '@/views/system/DashboardView.vue';
import FavoritesView from '@/views/system/FavoritesView.vue';
import ProfileView from '@/views/system/ProfileView.vue';

// Helper function to check if the user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem('loggedIn') === 'true';
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
      beforeEnter: (to, from, next) => {
        // Redirect to dashboard if user is logged in
        if (isAuthenticated()) {
          next({ name: 'dashboard' });
        } else {
          next();
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: (to, from, next) => {
        // Redirect to dashboard if user is logged in
        if (isAuthenticated()) {
          next({ name: 'dashboard' });
        } else {
          next();
        }
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      beforeEnter: (to, from, next) => {
        // Redirect to dashboard if user is logged in
        if (isAuthenticated()) {
          next({ name: 'dashboard' });
        } else {
          next();
        }
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    }
  ],
});

// Global navigation guard to enforce authentication
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If the route requires authentication and the user isn't logged in, redirect to login
    if (!isAuthenticated()) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
