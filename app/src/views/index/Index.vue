<template>
  <div>
    <h1>Index2</h1>
    <button @click="login">Login</button>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/plugins/supabase';

const login = () => {
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
};
</script>
