<template>
  <v-container>
    <v-container v-if="isNotPopularTab" class="d-flex width-50 align-center">
      <v-card-text>
        <v-text-field
          v-model="searchByForm.searchQuery"
          :loading="booksStore.dataStatus === DataStatus.PENDING"
          append-inner-icon="mdi-magnify"
          density="compact"
          label="Search Books"
          variant="solo-filled"
          hide-details
          single-line
          @click:append-inner="onSearch"
        />
      </v-card-text>
      <v-card-text>
        <v-select
          v-model="searchByForm.orderBy"
          item-title="title"
          density="comfortable"
          item-value="value"
          hide-details
          :items="orderByValues"
          label="Order By"
        />
      </v-card-text>
    </v-container>
    <v-row>
      <v-col v-for="(book, index) in booksStore.books" :key="index" cols="12" sm="6" md="4" lg="3">
        <v-card @click="router.replace(`/book/${book.id}`)">
          <v-img :src="book.previewLink" height="200" />

          <v-card-title class="text-h6">
            {{ book.name }}
          </v-card-title>
          <v-card-text>
            <div>Uploaded: {{ new Date(book.createdAt).toLocaleDateString() }}</div>
            <div>Views: {{ book.views }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-pagination
      class="pt-4"
      v-if="isNotPopularTab"
      v-model="searchByForm.currentPage"
      :length="booksStore.pageCount"
    />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { BooksTabsValue, DataStatus } from '@/common/enums';
import { OrderBy } from '@/common/enums/order-by.enum';
import { useBooksStore } from '@/stores/books.store';

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

const onSearch = (): void => {
  void booksStore.loadMany({
    type: route.params.type as BooksTabsValue,
    ...searchByForm,
  });
};

onMounted(() => {
  if (route.name === 'books') {
    const tabsValuesArr: string[] = [BooksTabsValue.ALL, BooksTabsValue.MY, BooksTabsValue.POPULAR];
    if (!tabsValuesArr.includes(route.path.substring(6))) {
      router.push(`${BooksTabsValue.ALL}`);
      booksStore.loadMany({ type: BooksTabsValue.ALL });
    }
  } else {
    booksStore.loadMany({ type: route.params.type as BooksTabsValue });
  }
});

watch(
  () => [searchByForm.orderBy, searchByForm.currentPage],
  (d) => {
    console.log(d);
    void booksStore.loadMany({
      type: route.params.type as BooksTabsValue,
      searchQuery: searchByForm.searchQuery,
      page: searchByForm.currentPage,
      order: searchByForm.orderBy,
    });
  },
);
</script>
