<template>
  <Main>
    <div class="h-[calc(100vh-160px)] flex flex-col gap-y-8 items-center justify-center mx-0">
      <img src="~@/assets/server_error.svg" class="w-full max-w-md" />
      <div class="flex flex-col items-center gap-y-4 pb-8">
        <h3>Server error</h3>
        <p class="text-body-small text-center">
          Whoops! Something weird is going on<br />Don't worry, we have received a report of the issue
        </p>
        <RouterLink to="/">
          <Button>Back to safety</Button>
        </RouterLink>
      </div>
    </div>
  </Main>
</template>

<script setup lang="ts">
import Main from '@/layout/Main.vue';
import Button from '@/components/atoms/button/Button.vue';
import { RouterLink } from 'vue-router';
</script>
