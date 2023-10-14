import { createRouter, createWebHistory } from 'vue-router';
import Index from '../../views/index/Index.vue';
import Home from '../../views/home/Home.vue';
import Signout from '../../views/signout/Signout.vue';
import Profile from '../../views/profile/Profile.vue';
import { authGuard } from './guards/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: { authRequired: false },
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: { authRequired: true },
    },
    {
      path: '/signout',
      name: 'Sign out',
      component: Signout,
      meta: { authRequired: false },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { authRequired: true },
    },
  ],
});

router.beforeEach(authGuard);

export default router;
