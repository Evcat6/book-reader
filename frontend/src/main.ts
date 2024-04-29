import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import Notifications from '@kyvg/vue3-notification';

import { router } from './routers';
import { createPinia } from 'pinia';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(createPinia());

app.use(Notifications);

app.use(vuetify);

app.use(router);

app.mount('#app');
