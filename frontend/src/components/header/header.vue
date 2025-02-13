<template>
  <v-card
    class="pa-2 position-absolute"
    v-if="isNotificationPopupOpen"
    style="right: 20px; top: 67px; z-index: 1005"
    max-width="500"
  >
    <v-card-title>
      <span class="text-h6">Notifications</span>
    </v-card-title>
    <v-divider></v-divider>
    <!-- Scrollable Notification List -->
    <v-card-text style="max-height: 300px; overflow-y: auto">
      <v-list>
        <v-list-item v-for="(notification, index) in notifications" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ notification.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-divider></v-divider>
    <!-- Pagination -->
    <v-card-actions class="justify-center">
      <!-- <v-pagination v-model="currentPage" :length="3" @input="handlePageChange"></v-pagination> -->
    </v-card-actions>
  </v-card>
  <v-app-bar elevation="5" class="px-5">
    <div class="d-flex justify-space-between w-100 align-center">
      <RouterLink class="text-h4 font-weight-bold text-decoration-none text-primary" :to="AppRoute.BOOKS">
        BookReader
      </RouterLink>
      <v-tabs v-if="route.path.includes('books')" color="primary">
        <v-tab :to="BooksTabsValue.ALL" exact> All </v-tab>
        <v-tab :to="BooksTabsValue.MY" exact> My </v-tab>
        <v-tab :to="BooksTabsValue.POPULAR" exact> Popular </v-tab>
      </v-tabs>
      <div class="d-flex justify-space-between align-center position-relative gc-2" style="min-width: 15%">
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
        <v-icon size="30" @click="onClickNotificationButton" class="cursor-pointer" color="primary" icon="mdi-bell-circle-outline" />
      </div>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from "vue-router";

import { BooksTabsValue } from "@/common/enums";
import { useUserStore } from "@/stores/user.store";

import { AppRoute } from "@/common/enums/app-route.enum";
import { ref } from 'vue';
import { useWebsocket } from "@/hooks";

const websocket = useWebsocket();

const onClickNotificationButton = async () => {
  console.log(websocket.connected);
  websocket.emit("load-notifications", { limit: 10 }, console.log);
  websocket.emit("ping", console.log);
  isNotificationPopupOpen.value = !isNotificationPopupOpen.value;
}

const notifications = [
  { title: 'Notification 1', message: 'This is message 1' },
  { title: 'Notification 2', message: 'This is message 2' },
  { title: 'Notification 3', message: 'This is message 3' },
  { title: 'Notification 4', message: 'This is message 4' },
  { title: 'Notification 5', message: 'This is message 5' },
  { title: 'Notification 6', message: 'This is message 6' },
  { title: 'Notification 7', message: 'This is message 7' },
  { title: 'Notification 8', message: 'This is message 8' },
  { title: 'Notification 9', message: 'This is message 9' },
];

const router = useRouter();
const route = useRoute();

const isNotificationPopupOpen = ref(false);

const userStore = useUserStore();
</script>
