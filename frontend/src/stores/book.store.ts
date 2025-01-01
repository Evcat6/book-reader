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
    isAddedToFavoritesByUser: false,
    genres: []
  },
};

export const useBookStore = defineStore('book', {
  state: () => defaultState,
  actions: {
    async loadOnById(id: string) {
      this.dataStatus = DataStatus.PENDING;
      const response = await booksApiService.loadById(id);
      this.dataStatus = DataStatus.FULFILLED;
      this.book = response;
    },
    async addToFavorites() {
      const { isInFavorites } = await booksApiService.addToFavorites(this.book.id);
      this.book.isAddedToFavoritesByUser = isInFavorites;
      if(isInFavorites) {
        this.book.addedToFavorites++;
      } else {
        this.book.addedToFavorites--;
      }
    }
  },
});
