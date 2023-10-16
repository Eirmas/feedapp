import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { HttpClient } from './api/http-client';
import { useNotifications } from '@/composables/useNotifications';

const notifications = useNotifications();

export default class ApiHttpClient extends HttpClient {
  constructor() {
    super({ baseURL: `${import.meta.env.VITE_REST_API_URL}` });
    const instance = this.instance;
    instance.interceptors.request.use(
      async config => {
        const authStore = useAuthStore();

        if (!authStore.currentSession) {
          await authStore.loadSession();
        }

        config.headers.Authorization = `Bearer ${authStore.currentSession?.access_token}`;
        return config;
      },
      error => {
        Promise.reject(error);
      },
    );

    instance.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const originalRequest = error.config;
        if (error.response.status === 401) {
          if (!originalRequest._retry) {
            originalRequest._retry = true;

            const refresh = async (): Promise<boolean> => {
              const authStore = useAuthStore();
              try {
                await authStore.loadSession(false);
                return authStore.currentSession !== null;
              } catch {
                return false;
              }
            };

            if (!(await refresh())) {
              const router = useRouter();
              notifications.info(
                { title: 'Session expired', description: 'You have been signed out due to inactivity. Please sign back in to continue' },
                null,
              );
              await router.push({ name: 'Logout' });
              return Promise.reject(error);
            }

            return instance(originalRequest);
          }
        }

        if (error.response.status >= 500) {
          const router = useRouter();
          await router.push({ name: 'Server Error' });
        }

        return Promise.reject(error);
      },
    );
  }
}
