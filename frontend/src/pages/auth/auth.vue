<template>
  <div
    class="d-flex align-center justify-center"
    style="height: 100vh"
  >
    <component :is="getScreen(route.fullPath)" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

import { AppRoute } from '../../common/enums';
import { Login, Register } from '../../components/components';

const route = reactive(useRoute());

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getScreen = (path: string) => {
  if (path.includes(AppRoute.LOGIN)) {
    return Login;
  }
  if (path.includes(AppRoute.REGISTER)) {
    return Register;
  }
  return null;
};
</script>
