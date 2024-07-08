import { defineStore } from 'pinia';

import type { LoadBookResponseDto } from '@/common/dto';
import { DataStatus } from '@/common/enums';

import { booksApiService } from '../services';

type State = {
  dataStatus: DataStatus;
  book: LoadBookResponseDto;
};

const defaultState: State = {
  dataStatus: DataStatus.IDLE,
  book: {
    id: '',
    name: '',
    previewLink: '',
    updatedAt: '',
    createdAt: '',
    uploadedBy: '',
    views: Number.NaN,
    isPrivate: false,
    accessLink: '',
    size: Number.NaN,
    addedToFavorites: Number.NaN,
  },
};

export const useBookStore = defineStore('book', {
  state: () => defaultState,
  actions: {
    async loadBook(id: string) {
      this.dataStatus = DataStatus.PENDING;
      const response = await booksApiService.loadById(id);
      this.dataStatus = DataStatus.FULFILLED;
      this.book = response;
    },
    async sendView(id: string) {
      await booksApiService.sendView(id);
    },
  },
});
