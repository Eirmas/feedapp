<template>
  <component
    :is="!!href ? 'a' : 'li'"
    :class="classes"
    :href="href"
    :target="targetBlank ? '_blank' : undefined"
    :tabindex="href || value || click ? 0 : -1"
    :aria-selected="isSelected"
    @click="onClick"
    @keyup.enter="onClick"
  >
    <div v-if="prependAvatar || prependIcon || $slots.prepend" class="app-list-item-prepend">
      <slot name="prepend">
        <template v-if="prependAvatar"></template>
        <template v-else>
          <component :is="prependIcon" />
        </template>
      </slot>
    </div>
    <div class="app-list-item-content">
      <slot>
        <div class="app-list-item-content-title">
          <slot name="title" :title="title">
            {{ title }}
          </slot>
        </div>
        <div v-if="subtitle" :class="['app-list-item-content-subtitle', `line-clamp-${props.lines}`]">
          <slot :subtitle="subtitle">
            {{ subtitle }}
          </slot>
        </div>
      </slot>
    </div>
    <div v-if="appendAvatar || appendIcon || $slots.append" class="app-list-item-append">
      <slot name="append">
        <template v-if="appendAvatar"></template>
        <template v-else>
          <component :is="appendIcon" />
        </template>
      </slot>
    </div>
  </component>
</template>

<script lang="ts" setup>
import { ComputedRef, computed, inject } from 'vue';
import { IListItem } from '../../types';
import './ListItem.scss';
import { useRouter } from 'vue-router';

const props = withDefaults(defineProps<IListItem>(), {
  dense: false,
  disabled: false,
  lines: 1,
  replace: false,
  selected: undefined,
});

const onClick = (event: MouseEvent | KeyboardEvent) => {
  emits('click', event);

  if (props.disabled || props.href) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (props.click) {
    props.click?.(event);
  }

  if (props.to) {
    useRouter()[props.replace ? 'replace' : 'push'](props.to);
  }

  select();
};

const selected = inject<ComputedRef<unknown[]>>('selected');
const onSelect = inject<(value: unknown) => void>('update:selected');
const isSelected = computed(() => props.selected ?? selected?.value?.includes(props.value));

const select = () => {
  if (props.value) {
    onSelect?.(props.value);
  }
};

const emits = defineEmits<{
  (event: 'click', payload: MouseEvent | KeyboardEvent): void;
}>();

const parentDisabled = inject<ComputedRef<boolean>>('disabled');
const parentDense = inject<ComputedRef<boolean>>('dense');

const classes = computed(() => ({
  'app-list-item': true,
  'app-list-item--selected': isSelected.value,
  'app-list-item--dense': parentDense?.value ?? props.dense,
  'app-list-item--disabled': parentDisabled?.value ?? props.disabled,
  'app-list-item--value': !!props.value || !!props.click || !!props.href || !!props.to,
}));
</script>
