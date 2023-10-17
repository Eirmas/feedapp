import { App } from 'vue';

const FocusDirective = {
  install(app: App) {
    app.directive('focus', {
      mounted(el) {
        el.focus();
      },
    });
  },
};

export default FocusDirective;
