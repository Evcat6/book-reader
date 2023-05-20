<template>
    <div class="d-flex align-center justify-center" style="height: 100vh">
        <component :is="getScreen(route.fullPath)" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from "vue-router";
import { AppRoutes } from "../../common/enums/enums";
import { Login, Register } from '../../components/components';

const route = ref(useRoute());

const getScreen = (path) => {
  if (path.includes(AppRoutes.LOGIN)) {
    return Login;
  }
  if (path.includes(AppRoutes.REGISTER)) {
    return Register;
  }
  return null;
};
</script>
