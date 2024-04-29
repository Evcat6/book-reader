<template>
  <v-layout>
    <Header />
    <router-view />
  </v-layout>
</template>

<script setup lang="ts">
import { Header } from '../components.ts';
</script>
