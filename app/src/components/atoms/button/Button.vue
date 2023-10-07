<template>
  <button type="button" :class="classes" :disabled="disabled" @click="emit('click', $event)">
    <div class="app-button-content">
      <component :is="icon" v-if="icon && prependIcon" class="app-button-icon-wrapper" />
      <span v-if="!fab"><slot></slot></span>
      <component :is="icon" v-if="icon && !prependIcon" class="app-button-icon-wrapper" />
    </div>
  </button>
</template>

<script lang="ts" setup>
import './Button.scss';
import { computed } from 'vue';
import { FunctionalIcon } from '../../../types';
import { IButtonThemes, IButtonSizes, IButtonCorners } from './types';

interface Props {
  icon?: FunctionalIcon;
  prependIcon?: boolean;
  theme?: IButtonThemes;
  size?: IButtonSizes;
  disabled?: boolean;
  fab?: boolean;
  corners?: IButtonCorners;
}

const props = withDefaults(defineProps<Props>(), {
  prependIcon: false,
  theme: 'primary',
  size: 'medium',
  corners: 'rounded'
});

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void;
}>();

const classes = computed(() => ({
  'app-button': true,
  [`app-button-${props.theme}`]: true,
  [`app-button-${props.size}`]: true,
  [`app-button-icon`]: !!props.icon,
  [`app-button-icon-prepend`]: !!props.icon && props.prependIcon,
  [`app-button-icon-append`]: !!props.icon && !props.prependIcon,
  ['app-button-fab']: !!props.fab,
  [`rounded-full`]: props.corners === 'rounded',
  [`rounded-xs`]: props.corners === 'square',
}));
</script>
