<template>
  <button
    :disabled="disabled"
    :data-size="size"
    :data-corners="corners"
    :data-theme="theme"
    :data-icon-mode="iconMode"
    class="btn"
    type="button"
    @click="emit('click', $event)"
  >
    <div :class="['flex items-center justify-center', iconMode === 'append' && 'flex-row-reverse']">
      <component :is="icon" v-if="icon" class="btn-icon" />
      <div v-if="iconMode !== 'fab'" class="btn-content">
        <slot></slot>
      </div>
    </div>
  </button>
</template>

<script lang="ts" setup>
import './Button.scss';
import { FunctionalIcon } from '../../../types';
import { IButtonThemes, IButtonSizes, IButtonCorners, IButtonIconModes } from './types';

interface Props {
  icon?: FunctionalIcon;
  iconMode?: IButtonIconModes;
  theme?: IButtonThemes;
  size?: IButtonSizes;
  disabled?: boolean;
  corners?: IButtonCorners;
}

withDefaults(defineProps<Props>(), {
  theme: 'primary',
  size: 'medium',
  corners: 'rounded',
  iconMode: 'append',
});

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void;
}>();
</script>
