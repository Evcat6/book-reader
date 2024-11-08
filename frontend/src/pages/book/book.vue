<template>
  <div
    v-if="bookStore.book && bookStore.dataStatus === DataStatus.FULFILLED"
    class="d-flex align-center"
  >
    <img
      :src="bookStore.book.previewLink"
      alt="Book Cover"
      style="max-width: 600px; max-height: 600px"
    >
    <div>
      <h2>Title: {{ bookStore.book.name }}</h2>
      <p>Uploaded By: {{ bookStore.book.uploadedBy }}</p>
      <p>
        Publication Date:
        {{ new Date(bookStore.book.createdAt as string).toLocaleDateString() }}
      </p>
      <p v-if="bookStore.book.isPrivate">
        This book is private
      </p>
      <div class="d-flex justify-start">
        <p><v-icon icon="mdi-eye" /> {{ bookStore.book.views }}</p>
        <p>
          <v-icon
            class="cursor-pointer"
            icon="mdi-bookmark-outline"
          /> {{ bookStore.book.addedToFavorites }}
        </p>
        <p>{{ bookStore.book.genres.map(book => book.name).join(", ") }}</p>
      </div>
      <p>Size: {{ `${(bookStore.book.size / 1024 / 1024).toFixed(3)} MB` }}</p>
      <v-btn :href="bookStore.book.accessLink">
        Download Book
      </v-btn>
    </div>
  </div>
  <v-sheet
    v-else
    class="d-flex w-100 align-center justify-center"
    style="height: 100vh"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      model-value="20"
      :size="82"
    />
  </v-sheet>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

import { DataStatus } from '@/common/enums/data-status.enum';
import { useBookStore } from '@/stores/book.store';

const route = useRoute();

const bookStore = useBookStore();

void bookStore.loadOnById(route.params.id as string);

</script>
