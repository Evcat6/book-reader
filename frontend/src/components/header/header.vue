<template>
  <v-app-bar
    elevation="5"
    class="px-5"
  >
    <div class="d-flex justify-space-between w-100 align-center">
      <RouterLink
        class="text-h4 font-weight-bold text-decoration-none text-primary"
        :to="AppRoute.BOOKS"
      >
        BookReader
      </RouterLink>
      <v-tabs
        v-if="route.path.includes('books')"
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
          style="padding: 10px"
          variant="flat"
          color="primary"
          size="medium"
          @click="router.push(AppRoute.UPLOAD_BOOK)"
        >
          Upload
        </v-btn>
        <RouterLink :to="AppRoute.PROFILE" class="text-h6 text-decoration-none text-primary">
          {{ userStore.user.username }}
        </RouterLink>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { RouterLink, useRoute,useRouter } from 'vue-router';

import { BooksTabsValue } from '@/common/enums';
import { useUserStore } from '@/stores/user.store';

import { AppRoute } from '../../common/enums/app-route.enum';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
</script>
