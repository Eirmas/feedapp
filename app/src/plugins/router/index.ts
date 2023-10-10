import { createRouter, createWebHistory } from 'vue-router';
import Index from '../../views/index/Index.vue';
import Manage from '../../views/manage/Manage.vue';
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
      path: '/manage',
      name: 'Manage',
      component: Manage,
      meta: { authRequired: true },
    },
  ],
});

router.beforeEach(authGuard);

export default router;
