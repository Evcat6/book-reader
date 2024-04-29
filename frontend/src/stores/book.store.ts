import { defineStore } from 'pinia';
import { booksApiService } from '../services';
import { DataStatus } from '@/common/enums';
import { LoadBookResponseDto } from '@/common/dto';

type State = {
  dataStatus: DataStatus;
  book: LoadBookResponseDto | null;
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
    views: NaN,
    isPrivate: false,
    accessLink: '',
    size: NaN,
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
