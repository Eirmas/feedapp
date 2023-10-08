<template>
  <div :class="classes">
    <slot name="activator" :open="isOpen">
      <ListItem v-bind="props" :click="toggle" :value="undefined">
        <template #append>
          <Icon :class="appendClasses"></Icon>
        </template>
      </ListItem>
    </slot>
    <CollapseTransition>
      <div v-show="isOpen" class="app-list-group-items" role="group">
        <slot>
          <ListTemplateBuilder :items="items"></ListTemplateBuilder>
        </slot>
      </div>
    </CollapseTransition>
  </div>
</template>

<script lang="ts" setup>
import CollapseTransition from './CollapseTransition.vue';
import { ComputedRef, computed, inject } from 'vue';
import { IListGroup } from '../../types';
import ListItem from '../list-item/ListItem.vue';
import './ListGroup.scss';
import { ChevronDownIcon as Icon } from '@heroicons/vue/24/outline';
import ListTemplateBuilder from '../../template/ListTemplateBuilder.vue';

const props = withDefaults(defineProps<IListGroup>(), {
  dense: false,
  disabled: false,
  open: undefined,
  items: () => [],
});
const opened = inject<ComputedRef<unknown[]>>('opened');
const onOpen = inject<(value: unknown) => void>('update:opened');
const isOpen = computed(() => props.open ?? opened?.value?.includes(props.value));

const parentDisabled = inject<ComputedRef<boolean>>('disabled');
const parentDense = inject<ComputedRef<boolean>>('dense');

const toggle = () => {
  onOpen?.(props.value);
};

const classes = computed(() => ({
  'app-list-group': true,
  'app-list-group--dense': parentDense?.value ?? props.dense,
  'app-list-group--disabled': parentDisabled?.value ?? props.disabled,
}));

const appendClasses = computed(() => ({
  'rotate-180': isOpen.value,
  'transition-transform duration-100': true,
}));
</script>
