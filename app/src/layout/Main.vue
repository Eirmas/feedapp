<template>
  <nav class="bg-primary-lighter">
    <div class="flex flex-wrap items-center justify-between mx-auto p-4">
      <RouterLink to="/" class="flex items-center">
        <img src="~@/assets/logo.svg" class="h-8 mr-3" alt="Flowbite Logo" />
      </RouterLink>
      <div class="hidden w-full md:block md:w-auto"></div>
    </div>
  </nav>
  <main class="app-main">
    <slot></slot>
  </main>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';
</script>

<style lang="scss" scoped>
.app-main {
  @apply block flex-1 max-w-full transition-[padding] duration-100 ease-in-out bg-neutral-white;
}
</style>
