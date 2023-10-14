<template>
  <Suspense>
    <router-view v-if="initialized && (isAuthenticated ? !!user : true)"></router-view>
    <div v-else class="w-[100vw] h-[100vh] flex items-center justify-center">
      <Spinner />
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import Spinner from '@/components/atoms/spinner/Spinner.vue';
import { supabase } from '@/plugins/supabase';
import { useAuthStore } from '@/store/auth';
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia';
import { RouteLocationRaw, RouterView, useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const { initialized, isAuthenticated } = storeToRefs(authStore);
const { user } = storeToRefs(userStore);

supabase.auth.onAuthStateChange(event => {
  if (event === 'SIGNED_IN') {
    authStore.loadSession();
    authStore.loadRedirectRoute();
    userStore.loadUser();
  } else if (event === 'SIGNED_OUT') {
    authStore.clearSession();
    userStore.clearUser();
  }
});

authStore.$onAction(({ name, store, after }) => {
  if (name === 'loadRedirectRoute') {
    after(async () => {
      const redirectRoute = store.redirectRoute;

      if (redirectRoute) {
        await router.isReady();
        await router.replace(redirectRoute as RouteLocationRaw);
        authStore.clearRedirectRoute();
      }
    });
  }
});
</script>
