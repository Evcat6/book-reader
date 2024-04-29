import { defineStore } from 'pinia';
import { booksApiService } from '../services';
import { BooksTabsValue, DataStatus } from '@/common/enums';
import { LoadBooksResponseDto } from '@/common/dto';

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
    loadBooks: async function ({
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
      if (type === BooksTabsValue.ALL) {
        const {
          data,
          meta: { page: currentPage, pageCount },
        } = await booksApiService.loadMany({ userOwned: false, page, searchQuery, order });
        this.books = data;
        this.pageCount = pageCount;
        this.page = currentPage;
      } else if (type === BooksTabsValue.MY) {
        const {
          data,
          meta: { page: currentPage, pageCount },
        } = await booksApiService.loadMany({ userOwned: true, page, searchQuery, order });
        this.books = data;
        this.pageCount = pageCount;
        this.page = currentPage;
      } else if (type === BooksTabsValue.POPULAR) {
        this.books = await booksApiService.loadPopular();
      }
      this.dataStatus = DataStatus.FULFILLED;
    },
  },
});
