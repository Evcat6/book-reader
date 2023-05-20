<template>
  <v-sheet width="400" class="mx-auto">
    <v-form fast-fail @submit.prevent="">
      <v-text-field v-model="loginForm.userName" label="User Name"></v-text-field>

      <v-text-field v-model="loginForm.password" label="password"></v-text-field>

      <v-btn color="primary" block class="mt-2">Login</v-btn>
    </v-form>
    <div class="mt-2">
      <p class="text-body-2">Don't have an account? <RouterLink :to=AppRoutes.REGISTER >Register</RouterLink></p>
    </div>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue';
import { AppRoutes } from '../../common/enums/enums.js';

const loginForm = ref({
  userName: '',
  password: '',
});

</script>
