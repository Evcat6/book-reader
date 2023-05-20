import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/dist/vuetify.min.css';

import { router } from './router/router.js';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(vuetify);

app.use(router);


app.mount('#app');


