import { createRouter, createWebHistory } from 'vue-router';
import Home from '../../views/home/Home.vue';
import Index from '../../views/index/Index.vue';
import NotFound from '../../views/not-found/NotFound.vue';
import Profile from '../../views/profile/Profile.vue';
import ServerError from '../../views/server-error/ServerError.vue';
import Signout from '../../views/signout/Signout.vue';
import TermsOfService from '../../views/terms-of-service/TermsOfService.vue';
import Poll from '../../views/poll/Poll.vue';
import PrivacyPolicy from '../../views/privacy-policy/PrivacyPolicy.vue';
import { authGuard } from './guards/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
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
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { authRequired: true },
    },
    {
      path: '/privacy-policy',
      name: 'Privacy Policy',
      component: PrivacyPolicy,
    },
    {
      path: '/terms-of-service',
      name: 'Terms of Service',
      component: TermsOfService,
    },
    {
      path: '/server-error',
      name: 'Server error',
      component: ServerError,
    },
    {
      path: '/poll/:pollId',
      name: 'Poll',
      component: Poll,
      props: route => ({ pollId: String(route.params.pollId) }),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Not Found',
      component: NotFound,
    },
  ],
});

router.beforeEach(authGuard);

export default router;
