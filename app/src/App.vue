<template>
  <Main>
    <Suspense>
      <router-view></router-view>
    </Suspense>
  </Main>
</template>

<script setup lang="ts">
import { RouteLocationRaw, RouterView, useRouter } from 'vue-router';
import Main from '@/layout/Main.vue';
import { supabase } from '@/plugins/supabase';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

supabase.auth.onAuthStateChange(event => {
  if (event === 'SIGNED_IN') {
    authStore.loadSession();
    authStore.loadRedirectRoute();
  } else if (event === 'SIGNED_OUT') {
    authStore.clearSession();
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
