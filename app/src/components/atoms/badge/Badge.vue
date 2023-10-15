<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import './Badge.scss';
import { computed } from 'vue';
import { IBadgeTypes } from './types';

interface Props {
  type?: IBadgeTypes;
}

const props = withDefaults(defineProps<Props>(), {});

const classes = computed(() => ({
  'app-badge': true,
  [`app-badge-${props.type}`]: !!props.type,
}));
</script>
