<template>
  <div class="grid grid-cols-3">
    <div v-for="header in ['Primary', 'Secondary', 'Semantic']" class="flex flex-col">
      <h3 class="ml-24">{{ header }}</h3>
    </div>
  </div>
  <hr class="text-primary-lighter my-2 mt-4" />
  <div class="grid grid-cols-3">
    <div v-for="(palette, i) in [primary, secondary, neutral]" class="flex flex-col">
      <Swatch v-for="swatch in palette" :color="swatch" :large="large.includes(swatch)"></Swatch>
    </div>
  </div>
  <hr class="text-primary-lighter my-2 mt-4" />
  <div class="grid grid-cols-3">
    <div v-for="(palette, i) in [semanticLight, semanticDark, semanticMisc]" class="flex flex-col">
      <Swatch v-for="swatch in palette" :color="swatch" :large="large.includes(swatch)"></Swatch>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swatch from './Swatch.vue';

const large = ['bg-primary', 'bg-secondary'];

const primary = ['bg-primary-lighter', 'bg-primary-light', 'bg-primary', 'bg-primary-dark'];

const secondary = ['bg-secondary-lighter', 'bg-secondary-light', 'bg-secondary', 'bg-secondary-dark'];

const neutral = ['bg-neutral-white', 'bg-neutral-background', 'bg-neutral-light', 'bg-neutral-medium', 'bg-neutral-dark'];

const semanticLight = [
  'bg-semantic-success-light',
  'bg-semantic-info-light',
  'bg-semantic-warning-light',
  'bg-semantic-error-light',
];

const semanticDark = [
  'bg-semantic-success-dark',
  'bg-semantic-info-dark',
  'bg-semantic-warning-dark',
  'bg-semantic-error-dark',
];

const semanticMisc = ['bg-semantic-focus', 'bg-semantic-link'];
</script>
