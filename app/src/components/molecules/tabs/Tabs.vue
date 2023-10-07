<template>
  <div class="ring-1 ring-inset rounded-full inline-flex p-1 ring-neutral-light bg-neutral-white gap-x-1 md:gap-x-2" role="tablist">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup generic="T">
import { computed, provide } from 'vue';
import { ITabSizes } from './types';

interface Props {
  modelValue: T;
  disabled?: boolean;
  size?: ITabSizes;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  disabled: false,
});

const emit = defineEmits<{
  (event: 'update:modelValue', payload: T): void;
}>();

const onClick = (value: T) => emit('update:modelValue', value);

provide('onClick', onClick);
provide('size', props.size);
provide(
  'disabled',
  computed(() => props.disabled),
);
provide(
  'modelValue',
  computed(() => props.modelValue),
);
</script>
