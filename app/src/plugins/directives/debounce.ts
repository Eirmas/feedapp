import { App, DirectiveBinding, ref } from 'vue';

const registered = ref<Record<string, NodeJS.Timeout>>({});

const DebounceDirective = {
  install(app: App) {
    app.directive('debounce', {
      beforeMount(el: HTMLElement, binding: DirectiveBinding) {
        const id = crypto.randomUUID();
        el.style.opacity = '0';
        el.setAttribute('v-debounce-id', id);
        el.style.transition = `opacity 150ms ease-in`;
        registered.value[id] = setTimeout(() => {
          el.style.opacity = '1';
        }, parseInt(binding.value, 10) || 150);
      },
      unmounted(el: HTMLElement) {
        const id = el.getAttribute('v-debounce-id');
        if (id && registered.value[id]) {
          clearTimeout(registered.value[id]);
          delete registered.value[id];
        }
      },
    });
  },
};

export default DebounceDirective;
