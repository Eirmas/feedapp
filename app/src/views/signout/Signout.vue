<template>
  <div class="w-[100vw] h-[100vh] flex items-center justify-center">
    <Spinner />
  </div>
</template>

<script lang="ts" setup>
import Spinner from '@/components/atoms/spinner/Spinner.vue';
import { supabase } from '@/plugins/supabase';
import { useAuthStore } from '@/store/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  authStore.clearSession();
  await supabase.auth.signOut();
  await router.push({ name: 'Index', query: { logout: 'true' } });
});
</script>
