<template>
  <div class="wrapper">
    <div v-for="(clazz, i) in Object.keys(classes)" :key="i" :class="['box', clazz]">
      <code>{{ classes[clazz] }}</code>
    </div>
  </div>
</template>

<script setup lang="ts">
const classes = {
  'rounded-none': '.rounded-none (0px)',
  'rounded-xs': '.rounded-xs (4px / 0.25rem)',
  'rounded-sm': '.rounded-sm (8px / 0.5rem)',
  'rounded-md': '.rounded-md (16px / 1rem)',
  'rounded-lg': '.rounded-lg (24px / 1.5rem)',
  'rounded-full': '.rounded-full (9999px)',
};
</script>

<style lang="scss" scoped>
.wrapper {
  @apply flex flex-col gap-y-2 max-w-sm;

  .box {
    @apply border-primary border-2 p-4 bg-primary-lighter;
  }
}
</style>
