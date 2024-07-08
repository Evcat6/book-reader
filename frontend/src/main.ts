import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

// eslint-disable-next-line import/no-named-as-default
import Notifications from '@kyvg/vue3-notification';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './app.vue';
import { router } from './routers';

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
