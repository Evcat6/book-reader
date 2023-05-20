<template>
  <v-sheet width="400" class="mx-auto">
    <v-form fast-fail @submit.prevent="">
      <v-text-field label="User Name"></v-text-field>

      <v-text-field label="Password"></v-text-field>

      <v-text-field label="Repeat password"></v-text-field>

      <v-btn type="submit" color="primary" block class="mt-2">Register</v-btn>
    </v-form>
    <div class="mt-2">
      <p class="text-body-2">
        Already have an account?
        <RouterLink :to="AppRoutes.LOGIN">Login</RouterLink>
      </p>
    </div>
  </v-sheet>
</template>

<script setup>
import { AppRoutes } from "../../common/enums/enums.js";
</script>
