<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import './Card.scss';
import { computed } from 'vue';

interface Props {
  dense?: boolean;
  error?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dense: false,
  error: false,
});

const classes = computed(() => ({
  'app-card': true,
  'app-card-dense': !!props.dense,
  'app-card-error': !!props.error,
}));
</script>
