<template>
  <div>
    <h1>Index</h1>
    <button @click="login">Login</button>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/plugins/supabase';

const login = () => {
  console.log(
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:8080',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  );
};
</script>
