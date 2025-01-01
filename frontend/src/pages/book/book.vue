<template>
  <div v-if="bookStore.book && bookStore.dataStatus === DataStatus.FULFILLED" class="d-flex px-16 gc-10">
    <img :src="bookStore.book.previewLink" alt="Book Cover" style="max-width: 600px; max-height: 600px" />
    <div class="d-flex flex-column gr-1" >
      <h1>Title: {{ bookStore.book.name }}</h1>
      <p><span class="font-weight-bold">Uploaded By:</span> {{ bookStore.book.uploadedBy }}</p>
      <p>
        <span class="font-weight-bold">Publication Date:</span>
        {{ new Date(bookStore.book.createdAt as string).toLocaleDateString() }}
      </p>
      <p v-if="bookStore.book.isPrivate" class="text-primary font-weight-bold">This book is private</p>
      <div class="d-flex justify-start">
        <p><v-icon icon="mdi-eye" /> {{ bookStore.book.views }}</p>
        <p>
          <v-icon
            @click="bookStore.addToFavorites"
            class="cursor-pointer"
            :icon="`mdi-bookmark${!bookStore.book.isAddedToFavoritesByUser ? '-outline' : ''}`"
          />
          {{ bookStore.book.addedToFavorites }}
        </p>
      </div>
      <p>{{ bookStore.book.genres.map((book) => book.name).join(', ') }}</p>
      <p><span class="font-weight-bold">Size:</span> {{ `${(bookStore.book.size / 1024 / 1024).toFixed(2)} MB` }}</p>
      <v-btn class="mt-6" color="primary" :href="bookStore.book.accessLink"> Download Book </v-btn>
    </div>
  </div>
  <v-sheet v-else class="d-flex w-100 align-center justify-center" style="height: 100vh">
    <v-progress-circular color="primary" indeterminate model-value="20" :size="82" />
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
