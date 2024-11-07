import { defineStore } from 'pinia';

import type { LoadBooksResponseDto } from '@/common/dto';
import { BooksTabsValue, DataStatus } from '@/common/enums';

import { booksApiService } from '../services';

type State = {
  dataStatus: DataStatus;
  books: LoadBooksResponseDto[];
  page: number;
  pageCount: number;
};

const defaultState: State = {
  dataStatus: DataStatus.IDLE,
  books: [],
  page: 0,
  pageCount: 0,
};

export const useBooksStore = defineStore('books', {
  state: () => defaultState,
  actions: {
    loadMany: async function ({
      type,
      page = 1,
      searchQuery = '',
      order = 'ASC',
    }: {
      type: BooksTabsValue;
      page?: number;
      searchQuery?: string;
      order?: 'ASC' | 'DESC';
    }) {
      this.dataStatus = DataStatus.PENDING;
      switch (type) {
      case BooksTabsValue.ALL: {
        const {
          data,
          meta: { page: currentPage, pageCount },
        } = await booksApiService.loadMany({ page, searchQuery, order });
        this.books = data;
        this.pageCount = pageCount;
        this.page = currentPage;
      
      break;
      }
      case BooksTabsValue.MY: {
        const {
          data,
          meta: { page: currentPage, pageCount },
        } = await booksApiService.loadMany({ userOwned: true, page, searchQuery, order });
        this.books = data;
        this.pageCount = pageCount;
        this.page = currentPage;
      
      break;
      }
      case BooksTabsValue.POPULAR: {
        this.books = await booksApiService.loadPopular();
      
      break;
      }
      // No default
      }
      this.dataStatus = DataStatus.FULFILLED;
    },
  },
});
