<template>
  <v-container v-if="booksStore.books.length" style="margin-top: 80px">
    <v-container class="d-flex width-50" v-if="isNotPopularTab">
      <v-card-text>
        <v-text-field
          :loading="booksStore.dataStatus === DataStatus.PENDING"
          v-model="searchByForm.searchQuery"
          append-inner-icon="mdi-magnify"
          density="compact"
          label="Search templates"
          variant="solo"
          hide-details
          single-line
          @click:append-inner="onSearch"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <v-select
          item-title="title"
          density="comfortable"
          item-value="value"
          v-model="searchByForm.orderBy"
          :items="orderByValues"
          label="Order By"
        ></v-select>
      </v-card-text>
    </v-container>
    <v-row>
      <v-col v-for="(book, index) in booksStore.books" :key="index" cols="12" sm="6" md="4" lg="3">
        <v-card @click="router.replace(`/book/${book.id}`)">
          <v-img :src="book.previewLink" height="200"></v-img>

          <v-card-title class="text-h6">{{ book.name }}</v-card-title>
          <v-card-text>
            <div>Uploaded: {{ new Date(book.createdAt).toLocaleDateString() }}</div>
            <div>Views: {{ book.views }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-pagination
      v-if="isNotPopularTab"
      v-model="searchByForm.currentPage"
      :length="booksStore.pageCount"
    ></v-pagination>
  </v-container>
  <v-sheet v-else class="d-flex w-100 h-screen align-center justify-center">
    <v-progress-circular color="primary" indeterminate size="82"></v-progress-circular>
  </v-sheet>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { BooksTabsValue, DataStatus } from '@/common/enums';
import { useBooksStore } from '@/stores/books.store';
import { computed, onMounted, reactive, watch } from 'vue';
import { OrderBy } from '@/common/enums/order-by.enum';

const router = useRouter();
const route = useRoute();

const isNotPopularTab = computed(
  () => route.params.type === BooksTabsValue.ALL || route.params.type === BooksTabsValue.MY,
);

const orderByValues = [
  { title: 'Ascending', value: OrderBy.ASC },
  { title: 'Descending', value: OrderBy.DESC },
];

const searchByForm = reactive({
  currentPage: 1,
  searchQuery: '',
  orderBy: orderByValues[0].value,
});

const booksStore = useBooksStore();

const onSearch = () => {
  booksStore.loadBooks({
    type: route.params.type as BooksTabsValue,
    ...searchByForm,
  });
};

onMounted(() => {
  booksStore.loadBooks({ type: route.params.type as BooksTabsValue });
});

watch(
  () => [searchByForm.orderBy, searchByForm.currentPage],
  () => {
    booksStore.loadBooks({
      type: route.params.type as BooksTabsValue,
      searchQuery: searchByForm.searchQuery,
      page: searchByForm.currentPage,
      order: searchByForm.orderBy,
    });
  },
);
</script>
