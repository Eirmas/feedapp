import { AlertProps } from '@/components/atoms/alert/types';
import { ref } from 'vue';

type Listener = (alert: AlertProps, duration: number) => void;

const listeners = ref<Listener[]>([]);

export const useNotifications = () => {
  const DEFAULT_DURATION = 5000;

  const addListener = (listener: Listener) => {
    listeners.value.push(listener);
  };

  const removeListener = (listener: Listener) => {
    const index = listeners.value.indexOf(listener);
    if (index > -1) {
      listeners.value.splice(index, 1);
    }
  };

  const success = (alert: Omit<AlertProps, 'type'>, duration = DEFAULT_DURATION) => {
    listeners.value.forEach(listener => listener({ ...alert, type: 'success' }, duration));
  };

  const info = (alert: Omit<AlertProps, 'type'>, duration = DEFAULT_DURATION) => {
    listeners.value.forEach(listener => listener({ ...alert, type: 'info' }, duration));
  };

  const warning = (alert: Omit<AlertProps, 'type'>, duration = DEFAULT_DURATION) => {
    listeners.value.forEach(listener => listener({ ...alert, type: 'warning' }, duration));
  };

  const error = (alert: Omit<AlertProps, 'type'>, duration = DEFAULT_DURATION) => {
    listeners.value.forEach(listener => listener({ ...alert, type: 'error' }, duration));
  };

  return {
    addListener,
    removeListener,
    success,
    info,
    warning,
    error,
  };
};
