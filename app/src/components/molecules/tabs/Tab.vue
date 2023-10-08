<template>
  <Button
    :tabindex="selected ? -1 : 0"
    :class="{ 'font-semibold': true, '!bg-primary-lighter !text-primary': selected }"
    :aria-selected="selected"
    :disabled="parentDisabled ?? disabled"
    :icon="icon"
    :prependIcon="prependIcon"
    :size="size"
    role="tab"
    theme="tertiary"
    @click="handleClick"
  >
    <slot></slot>
  </Button>
</template>

<script lang="ts" setup generic="T">
import { ComputedRef, FunctionalComponent, computed, inject } from 'vue';
import Button from '../../atoms/button/Button.vue';
import { TabSizes } from './types';

type Props = {
  value: T;
  disabled?: boolean;
  icon?: FunctionalComponent;
  prependIcon?: boolean;
};

const props = defineProps<Props>();

const onClick = inject<(value: T) => void>('onClick');
const size = inject<TabSizes>('size', TabSizes.MEDIUM);
const parentDisabled = inject<ComputedRef<boolean>>('disabled');
const modelValue = inject<ComputedRef<T>>('modelValue');
const selected = computed(() => modelValue?.value == props.value);
const handleClick = () => onClick?.(props.value);
</script>
