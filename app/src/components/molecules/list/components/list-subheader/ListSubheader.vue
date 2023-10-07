<template>
  <div :class="classes">
    <div class="app-list-subheader-title">
      <slot>{{ title }}</slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ComputedRef, computed, inject } from 'vue';
import { IListSubheader } from '../../types';
import './ListSubheader.scss';

defineProps<Omit<IListSubheader, 'type'>>();

const parentDense = inject<ComputedRef<boolean>>('dense');

const classes = computed(() => ({
  'app-list-subheader': true,
  'app-list-subheader--dense': parentDense?.value,
}));
</script>
