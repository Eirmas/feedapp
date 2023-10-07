<template>
  <main class="app-main">
    <slot></slot>
  </main>
</template>

<script lang="ts" setup>
import './Main.scss';
</script>

<style lang="scss" scoped>
.app-main {
  @apply block flex-1 max-w-full transition-[padding] duration-100 ease-in-out bg-neutral-white;
}
</style>
