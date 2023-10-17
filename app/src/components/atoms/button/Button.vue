<template>
  <component
    v-bind="$attrs"
    :is="tag"
    :disabled="disabled"
    :data-size="size"
    :data-corners="corners"
    :data-theme="theme"
    :data-icon-mode="iconMode"
    role="button"
    class="btn"
    type="button"
    @click="emit('click', $event)"
  >
    <div :class="['flex items-center justify-center', iconMode === 'append' && 'flex-row-reverse']">
      <component :is="icon" v-if="icon" class="btn-icon" />
      <span v-if="iconMode === 'fab'" class="sr-only"><slot></slot></span>
      <div v-if="iconMode !== 'fab'" class="btn-content">
        <slot></slot>
      </div>
    </div>
  </component>
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
  tag?: 'button' | 'a';
}

withDefaults(defineProps<Props>(), {
  theme: 'primary',
  size: 'medium',
  corners: 'rounded',
  iconMode: 'append',
  tag: 'button',
});

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void;
}>();
</script>
