<template>
  <component :is="props.tag" :class="classes">
    <slot>
      <ListTemplateBuilder :items="items"></ListTemplateBuilder>
    </slot>
  </component>
</template>

<script lang="ts" setup>
import { computed, provide, ref, watch } from 'vue';
import ListTemplateBuilder from './template/ListTemplateBuilder.vue';
import { IListItems } from './types';
import './List.scss';

interface Props {
  dense?: boolean;
  disabled?: boolean;
  tag?: string;
  items?: IListItems;
  selected?: unknown[];
  opened?: unknown[];
  multiple?: boolean;
  nav?: boolean;
}

console.log(import.meta.env.VITE_SUPABASE_URL)

const props = withDefaults(defineProps<Props>(), {
  tag: 'ul',
  nav: false,
  multiple: false,
  selected: () => [],
  opened: () => [],
  items: () => [],
});

const emit = defineEmits<{
  (event: 'update:selected', payload: unknown[]): void;
  (event: 'update:opened', payload: unknown[]): void;
  (event: 'click:open', payload: { value: unknown; open: boolean }): void;
  (event: 'click:select', payload: { value: unknown; selected: boolean }): void;
}>();

const _opened = ref(props.opened);
const _selected = ref(props.selected);

const onSelect = (value: unknown) => {
  const exists = _selected.value.includes(value);

  if (props.multiple) {
    updateSelected(exists ? _selected.value.filter(v => v !== value) : [..._selected.value, value]);
  } else {
    updateSelected(exists ? [] : [value]);
  }

  emit('click:select', { value, selected: !exists });
};

const onOpen = (value: unknown) => {
  const exists = _opened.value.includes(value);
  updateOpened(exists ? _opened.value.filter(v => v !== value) : [..._opened.value, value]);
  emit('click:open', { value, open: !exists });
};

provide(
  'disabled',
  computed(() => props.disabled),
);
provide(
  'dense',
  computed(() => props.dense),
);
provide(
  'selected',
  computed(() => _selected.value),
);
provide(
  'opened',
  computed(() => _opened.value),
);

provide('update:selected', onSelect);
provide('update:opened', onOpen);

const updateOpened = (value: unknown[]) => {
  _opened.value = value;
  emit('update:opened', value);
};

const updateSelected = (value: unknown[]) => {
  _selected.value = value;
  emit('update:selected', value);
};

watch(
  () => props.selected,
  v => {
    _selected.value = v;
  },
);

watch(
  () => props.opened,
  v => {
    _opened.value = v;
  },
);

const classes = computed(() => ({
  'app-list': true,
  'app-list--dense': props.dense,
  'app-list--disabled': props.disabled,
  'app-list--nav': props.nav,
}));
</script>
