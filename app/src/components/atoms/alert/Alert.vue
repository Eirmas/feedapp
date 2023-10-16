<template>
  <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-sm bg-neutral-white shadow-lg ring-1 ring-neutral-light">
    <div class="p-4 pt-3">
      <div class="flex items-start gap-x-2">
        <div class="flex-shrink-0 pt-1">
          <component :is="getIcon" :class="['h-6 w-6', getTextClass]" aria-hidden="true" />
        </div>
        <div class="grow pt-1.5">
          <p :class="['text-body-small-bold line-clamp-1', getTextClass]">{{ title }}</p>
          <p v-if="description" class="text-body-small text-neutral-medium line-clamp-3">{{ description }}</p>
        </div>
        <div class="flex flex-shrink-0">
          <Button srOnly="Dismiss" theme="tertiary" size="small" :icon="XMarkIcon" iconMode="fab" @click="emit('dismiss', $event)">
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '../../atoms/button/Button.vue';
import { XMarkIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline';
import { IAlertTypes, AlertProps } from './types';
import { FunctionalComponent, computed } from 'vue';

const props = withDefaults(defineProps<AlertProps>(), {
  type: 'success',
});

const metaIcons: Record<IAlertTypes, { icon: FunctionalComponent; textClass: string }> = {
  success: {
    icon: CheckCircleIcon,
    textClass: 'text-semantic-success-dark',
  },
  info: {
    icon: InformationCircleIcon,
    textClass: 'text-semantic-info-dark',
  },
  warning: {
    icon: ExclamationCircleIcon,
    textClass: 'text-semantic-warning-dark',
  },
  error: {
    icon: XCircleIcon,
    textClass: 'text-semantic-error-dark',
  },
};

const getIcon = computed(() => metaIcons[props.type].icon);
const getTextClass = computed(() => metaIcons[props.type].textClass);

const emit = defineEmits<{
  (event: 'dismiss', payload: MouseEvent): void;
}>();
</script>
