import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import IndexView from '@/views/auth/IndexView.vue';
import DashboardView from '@/views/system/DashboardView.vue';
import FavoritesView from '@/views/system/FavoritesView.vue';
import ProfileView from '@/views/system/ProfileView.vue';
import { supabase } from '@/utils/supabase'; // Ensure Supabase is imported correctly

// Helper function to check if the user is authenticated
const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session !== null; // User is authenticated if session is not null
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
      beforeEnter: async (to, from, next) => {
        // Redirect to dashboard if user is logged in
        if (await isAuthenticated()) {
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
      beforeEnter: async (to, from, next) => {
        // Redirect to dashboard if user is logged in
        if (await isAuthenticated()) {
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
      beforeEnter: async (to, from, next) => {
        // Redirect to dashboard if user is logged in
        if (await isAuthenticated()) {
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
    },
    // Errors Pages
  // {
  //   path: '/forbidden',
  //   name: 'forbidden',
  //   component: ForbiddenView,
  //   meta: { isDefault: true }
  // },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: NotFoundView,
    meta: { isDefault: true }
  }
  ],
});

// Global navigation guard to enforce authentication
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If the route requires authentication and the user isn't logged in, redirect to login
    if (!(await isAuthenticated())) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
