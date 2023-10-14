<template>
  <Main>
    <div class="grid grid-cols-12 gap-0 md:gap-12 h-[calc(100vh-160px)] my-4">
      <div class="mb-8 flex flex-col justify-center gap-y-6 col-span-12 md:col-span-7">
        <h1 class="hidden md:block bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-transparent pb-1">
          Get started today
        </h1>
        <h2 class="block md:hidden bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-transparent pb-1">
          Get started today
        </h2>
        <p class="text-body-la text-primary-dark">
          Empower your voice and make every vote count with our interactive polling app. Create, vote on, and explore polls with ease. Join
          the community of active participants today and be part of the conversation.
        </p>
        <div class="pt-2">
          <Button @click="login">Sign in with Google</Button>
        </div>
      </div>
      <div class="mb-8 hidden md:flex col-span-5 items-center justify-center mx-0">
        <img src="~@/assets/landingpage_illustration.svg" class="w-full" />
      </div>
    </div>
  </Main>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/button/Button.vue';
import Main from '@/layout/Main.vue';
import { login } from '@/services/auth';
</script>
