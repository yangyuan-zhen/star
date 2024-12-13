import { createSSRApp } from 'vue';
import App from './App.vue';
import { Icon } from '@iconify/vue';

export function createApp() {
  const app = createSSRApp(App);
  app.component('Icon', Icon);
  return {
    app,
  };
}
