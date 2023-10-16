<template>
  <div aria-live="assertive" class="z-20 pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
    <div class="flex w-full flex-col items-center sm:items-end">
      <TransitionGroup
        tag="ul"
        class="relative p-0 [&>*]:mb-2"
        moveClass="transition-all"
        enterActiveClass="transition-all"
        leaveActiveClass="transition-all absolute"
        enterFromClass="opacity-0 translate-x-12"
        leaveToClass="opacity-0 scale-50"
      >
        <Alert
          v-for="key in Object.keys(alerts)"
          :key="key"
          :title="alerts[key].alert.title"
          :description="alerts[key].alert.description"
          :type="alerts[key].alert.type"
          @dismiss="dismiss(key)"
        ></Alert>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { useNotifications } from '@/composables/useNotifications';
import { AlertProps } from '@/components/atoms/alert/types';
import Alert from '@/components/atoms/alert/Alert.vue';

const alerts = ref<Record<string, { alert: AlertProps; timeout?: NodeJS.Timeout }>>({});

const notifications = useNotifications();

const onAlert = (alert: AlertProps, duration: number | null) => {
  const id = crypto.randomUUID();
  const timeout = duration !== null ? setTimeout(() => dismiss(id), duration) : undefined;

  alerts.value[id] = {
    alert: alert,
    timeout: timeout,
  };
};

notifications.addListener(onAlert);

const dismiss = (id: string) => {
  clearTimeout(alerts.value[id].timeout);
  delete alerts.value[id];
};

onBeforeUnmount(() => {
  notifications.removeListener(onAlert);
});
</script>
