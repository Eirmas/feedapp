import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('@/views/index/Index.vue'),
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/home/Home.vue'),
      meta: { authRequired: true },
    },
    {
      path: '/signout',
      name: 'Sign out',
      component: () => import('@/views/signout/Signout.vue'),
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/profile/Profile.vue'),
      meta: { authRequired: true },
    },
    {
      path: '/privacy-policy',
      name: 'Privacy Policy',
      component: () => import('@/views/privacy-policy/PrivacyPolicy.vue'),
    },
    {
      path: '/terms-of-service',
      name: 'Terms of Service',
      component: () => import('@/views/terms-of-service/TermsOfService.vue'),
    },
    {
      path: '/server-error',
      name: 'Server error',
      component: () => import('@/views/server-error/ServerError.vue'),
    },
    {
      path: '/poll/:pollId',
      name: 'Poll',
      component: () => import('@/views/poll/Poll.vue'),
      props: route => ({ pollId: String(route.params.pollId) }),
    },
    {
      path: '/poll/:pollId/edit',
      name: 'Edit Poll',
      component: () => import('@/views/poll/EditPoll.vue'),
      meta: { authRequired: true },
      props: route => ({ pollId: String(route.params.pollId) }),
    },
    {
      path: '/poll/create',
      name: 'Create Poll',
      meta: { authRequired: true },
      component: () => import('@/views/poll/CreatePoll.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Not Found',
      component: () => import('@/views/not-found/NotFound.vue'),
    },
  ],
});

router.beforeEach(authGuard);

export default router;
