<template>
  <div v-if="bookStore.book && bookStore.dataStatus === DataStatus.FULFILLED" class="d-flex align-center">
    <img :src="bookStore.book.previewLink" alt="Book Cover" style="max-width: 600px; max-height: 600px" />
    <div>
      <h2>Title: {{ bookStore.book.name }}</h2>
      <p>Uploaded By: {{ bookStore.book.uploadedBy }}</p>
      <p>
        Publication Date:
        {{ new Date(bookStore.book.createdAt as string).toLocaleDateString() }}
      </p>
      <p v-if="bookStore.book.isPrivate">This book is private</p>
      <p>Views: {{ bookStore.book.views }}</p>
      <p>Views: {{ `${(bookStore.book.size / 1024 / 1024).toFixed(3)} MB` }}</p>
      <v-btn :href="bookStore.book.accessLink">Download Book</v-btn>
    </div>
  </div>
  <v-sheet v-else class="d-flex w-100 align-center justify-center" style="height: 100vh">
    <v-progress-circular color="primary" indeterminate model-value="20" :size="82"></v-progress-circular>
  </v-sheet>
</template>

<script setup lang="ts">
import { useBookStore } from '@/stores/book.store';
import { DataStatus } from '@/common/enums/data-status.enum';
import { useRoute, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import { storageService } from '@/services';
import { StorageKey } from '@/common/enums';

const route = useRoute();

const bookStore = useBookStore();

bookStore.loadBook(route.params.id as string);

if (storageService.get(StorageKey.IS_BOOK_VIEWED) === 'false') {
  bookStore.sendView(route.params.id as string);
  storageService.set(StorageKey.IS_BOOK_VIEWED, 'true');
}

onBeforeRouteLeave(() => storageService.set(StorageKey.IS_BOOK_VIEWED, 'false'));

onBeforeRouteUpdate(() => storageService.set(StorageKey.IS_BOOK_VIEWED, 'false'));
</script>
