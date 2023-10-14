import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/store/auth';

export async function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> {
  const authStore = useAuthStore();
  const isAuth = await isAuthenticated();

  if (to.meta.authRequired && !isAuth) {
    authStore.saveRedirectRoute(to);
    next({ name: 'Index' });
  } else if (to.name === 'Index' && isAuth) {
    next({ name: 'Home' });
  } else {
    next();
  }
}

const isAuthenticated = async (): Promise<boolean> => {
  const authStore = useAuthStore();
  const currentPromise = authStore.currentPromise || authStore.loadSession();
  await currentPromise;
  return authStore.isAuthenticated;
};
