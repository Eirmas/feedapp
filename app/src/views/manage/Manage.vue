<template>
  <h1>{{ user_name }}</h1>
  <img :src="avatar_url" :alt="avatarAltText" />
  <RouterLink to="/">
    <p>Take me back home</p>
  </RouterLink>
  <button @click="signOut">Sign out</button>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';

import { Session } from '@supabase/supabase-js';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/plugins/supabase';

const authStore = useAuthStore();

const { user } = authStore.currentSession as Session;
const { avatar_url, user_name } = user.user_metadata;
const avatarAltText = `${user_name}'s avatar`;

const signOut = () => {
  supabase.auth.signOut();
};
</script>
