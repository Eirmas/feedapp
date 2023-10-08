<template>
  <div :class="classes">
    <div ref="ink" :class="[`${color}`, 'app-swatch-ink', hex === '#FFFFFF' ? 'ring-1 ring-neutral-light' : '']"></div>
    <div class="app-swatch-meta min-w-0">
      <div class="truncate">{{ colorToLabel(color) }}</div>
      <div class="truncate">{{ hex ?? '#??????' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import './Swatch.scss';

const ink = ref<HTMLDivElement | null>(null);
const hex = ref('');

interface Props {
  color: string;
  large?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  large: false,
});

const colorToLabel = (input: string): string => {
  const words = input
    .split('-')
    .filter(word => !!word)
    .slice(1)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase());

  return words.join(' ');
};

const rgbToHex = (val: string) => {
  const match = val.match(/\d+/g);

  if (!match) {
    return '#000000';
  }

  const [r, g, b] = match.map(Number);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

onMounted(() => {
  if (!hex.value && ink.value) {
    hex.value = rgbToHex(getComputedStyle(ink.value).backgroundColor).toUpperCase();
  }
});

const classes = computed(() => ({
  'app-swatch': true,
  'app-swatch-large': props.large,
}));
</script>
