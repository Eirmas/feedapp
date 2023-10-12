<template>
  <Suspense>
    <Main v-if="initialized">
      <router-view></router-view>
    </Main>
    <div v-else class="w-[100vw] h-[100vh] flex items-center justify-center">
      <Spinner />
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import Spinner from '@/components/atoms/spinner/Spinner.vue';
import Main from '@/layout/Main.vue';
import { supabase } from '@/plugins/supabase';
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';
import { RouteLocationRaw, RouterView, useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const { initialized } = storeToRefs(authStore);

supabase.auth.onAuthStateChange(event => {
  if (event === 'SIGNED_IN') {
    authStore.loadSession();
    authStore.loadRedirectRoute();
  } else if (event === 'SIGNED_OUT') {
    authStore.clearSession();
    router.push({ name: 'Index' });
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
