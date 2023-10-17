<template>
  <div
    :class="[
      'flex flex-col transition-all',
      error && 'text-semantic-error-dark',
      disabled && 'text-neutral-medium',
      size === 'medium' && 'gap-y-1',
      size === 'small' && 'gap-y-0.5',
    ]"
  >
    <label>
      <div
        v-if="!hideLabel"
        data-testid="label"
        :class="['text-body-small-bold overflow-x-hidden text-ellipsis', size === 'medium' && 'pb-1', size === 'small' && 'pb-0.5']"
      >
        {{ !label?.trim() ? '&nbsp;' : label }}
      </div>
      <span v-if="hideLabel" class="sr-only" data-testid="label-sr">{{ label }}</span>
      <div
        :class="[
          iconMode === 'append' && 'flex-row-reverse',
          error && 'ring-semantic-error-dark text-semantic-error-dark',
          disabled && 'bg-neutral-background ring-neutral-light text-neutral-medium',
          'flex items-center rounded-xs bg-neutral-white ring-1 ring-inset text-neutral-dark ring-neutral-light transition-all',
          size === 'medium' && 'p-2',
          size === 'small' && 'p-1.5',
          inputFocused && !error && !readonly && !disabled && '!ring-neutral-dark',
          readonly && '!ring-neutral-background',
        ]"
        data-testid="wrapper"
      >
        <div v-if="icon" class="flex">
          <component :is="icon" v-if="icon" :class="[size === 'medium' && 'w-6 h-6', size === 'small' && 'w-5 h-5']" />
        </div>
        <input
          v-bind="$attrs"
          :readonly="readonly"
          :disabled="disabled"
          :placeholder="placeholder"
          :v-focus="$attrs.autofocus"
          :type="type"
          :value="modelValue"
          :class="[
            'border-none p-0 bg-transparent outline-none !ring-0 grow pl-1 text-neutral-dark placeholder:text-neutral-medium',
            (disabled || readonly) && 'cursor-default',
            readonly && 'placeholder:text-transparent',
            size === 'medium' && 'text-body',
            size === 'small' && 'text-body-small',
          ]"
          @input="onInput"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
        />
      </div>
    </label>
    <div v-if="!hideDetails" data-testid="details" class="text-caption mt-0.5 min-h-[18px] break-words relative">
      <template v-if="!readonly && !disabled">
        <Transition>
          <div v-if="!error && inputFocused" data-testid="hint">{{ hint }}</div>
        </Transition>
        <Transition>
          <div v-if="error" data-testid="error">{{ error }}</div>
        </Transition>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FunctionalIcon } from '../../../types';
import { ITextInputIconModes, ITextInputSizes } from './types';

interface Props {
  label?: string;
  hideLabel?: boolean;
  hideDetails?: boolean;
  hint?: string;
  error?: string;
  placeholder?: string;
  readonly?: boolean;
  type?: string;
  icon?: FunctionalIcon;
  iconMode?: ITextInputIconModes;
  size?: ITextInputSizes;
  disabled?: boolean;
  modelValue?: string;
}

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};

withDefaults(defineProps<Props>(), {
  size: 'medium',
  iconMode: 'prepend',
});

const inputFocused = ref(false);

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
}>();
</script>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  @apply transition-[transform,opacity];
}

.v-enter-from,
.v-leave-to {
  position: absolute;
  transform: translateY(-8px);
  opacity: 0;
}
</style>
