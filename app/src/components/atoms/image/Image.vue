<template>
  <img
    :class="classes"
    :src="src"
    :onerror="() => emits('error')"
    :on-load="() => emits('load')"
    :on-loadstart="() => emits('loadstart')"
    :alt="alt"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import './Image.scss';
import { ImageFocus } from './types';

interface Props {
  src: string;
  alt?: string;
  aspectRatio?: string;
  cover?: boolean;
  inline?: boolean;
  height?: string | number;
  width?: string | number;
  maxHeight?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  minWidth?: string | number;
  focus?: ImageFocus;
}

onMounted(() => {
  if (!props.alt) {
    console.warn('No alt provided for image. src: ' + props.src);
  }
});

const props = withDefaults(defineProps<Props>(), {
  aspectRatio: 'unset',
});

const emits = defineEmits<{
  (event: 'error'): void;
  (event: 'load'): void;
  (event: 'loadstart'): void;
}>();

const toCssValue = (dim: string | number | undefined) => {
  if (!dim) {
    return 'unset';
  } else if (typeof dim === 'number') {
    return `${dim}px`;
  } else {
    return dim;
  }
};

const position = computed(() => {
  if (props.focus) {
    return `${props.focus.x * 100}% ${props.focus.y * 100}%`;
  }

  return 'center';
});

const classes = computed(() => ({
  'app-image': true,
  'app-image-cover': props.cover,
  'app-image-inline': props.inline,
}));
</script>

<style>
img {
  aspect-ratio: v-bind(aspectRatio);
  width: v-bind(toCssValue(width));
  height: v-bind(toCssValue(height));
  max-width: v-bind(toCssValue(maxWidth));
  max-height: v-bind(toCssValue(maxHeight));
  min-width: v-bind(toCssValue(minWidth));
  min-height: v-bind(toCssValue(minHeight));
  object-position: v-bind(position);
}
</style>
