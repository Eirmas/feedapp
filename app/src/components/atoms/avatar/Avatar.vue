<template>
  <div :class="classes">
    <Image :src="src" :alt="name && `Avatar for ${name}`" cover></Image>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Image from '../image/Image.vue';
import './Avatar.scss';
import { IAvatarSizes, IAvatarStates } from './types';

interface Props {
  src: string;
  state?: IAvatarStates;
  size?: IAvatarSizes;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
});

const classes = computed(() => ({
  'app-avatar': true,
  'app-avatar-stateful': !!props.state,
  [`app-avatar-${props.size}`]: true,
  [`app-avatar-${props.state}`]: !!props.state,
}));
</script>
