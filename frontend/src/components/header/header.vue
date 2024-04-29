<template>
  <v-app-bar
    elevation="5"
    class="px-5"
  >
    <div class="d-flex justify-space-between w-100 align-center">
      <h4
        class="text-h4 font-weight-bold"
        @click="router.push(AppRoute.BOOKS)"
      >
        BookReader
      </h4>
      <v-tabs
        v-show="route.name === 'books'"
        color="primary"
      >
        <v-tab
          :to="BooksTabsValue.ALL"
          exact
        >
          All
        </v-tab>
        <v-tab
          :to="BooksTabsValue.MY"
          exact
        >
          My
        </v-tab>
        <v-tab
          :to="BooksTabsValue.POPULAR"
          exact
        >
          Popular
        </v-tab>
      </v-tabs>
      <div
        class="d-flex justify-space-between align-center"
        style="width: 15%"
      >
        <v-btn
          class="text-subtitle-1"
          style="padding: 6px"
          variant="tonal"
          size="medium"
          @click="router.push(AppRoute.UPLOAD_BOOK)"
        >
          Upload
        </v-btn>
        <h6 class="text-h6">
          {{ userStore.user.username }}
        </h6>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user.store';
import { useRouter, useRoute } from 'vue-router';
import { AppRoute } from '../../common/enums/app-route.enum';
import { BooksTabsValue } from '@/common/enums';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
</script>
