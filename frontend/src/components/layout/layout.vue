<template>
  <v-layout>
    <Header />
    <v-component style="margin-top: 80px; width: 100%">
      <router-view />
    </v-component>
  </v-layout>
</template>

<script setup lang="ts">
import { Header } from '../components.ts';
</script>
