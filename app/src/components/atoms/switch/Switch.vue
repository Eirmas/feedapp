<template>
  <button :aria-checked="value" :disabled="disabled" :class="classes" role="switch" type="button" @click="toggle">
    <span class="sr-only">{{ label }}</span>
    <span aria-hidden="true" class="app-switch-handle"></span>
  </button>
</template>

<script lang="ts" setup>
import './Switch.scss';
import { computed, ref, watch } from 'vue';
import { ISwitchSizes } from './types';

interface Props {
  modelValue?: boolean;
  label?: string;
  disabled?: boolean;
  size?: ISwitchSizes;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Use switch',
  size: 'small',
});

const value = ref(props.modelValue ?? false);

watch(
  () => props.modelValue,
  v => (value.value = v),
);

watch(value, v => emit('update:modelValue', v));

const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void;
}>();

const toggle = () => {
  if (props.disabled) return;
  value.value = !value.value;
  emit('update:modelValue', !value.value);
};

const classes = computed(() => ({
  'app-switch': true,
  [`app-switch-disabled`]: props.disabled,
  [`app-switch-${props.size}`]: true,
}));
</script>
