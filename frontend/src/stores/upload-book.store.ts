import { defineStore } from 'pinia';

import { DataStatus } from '@/common/enums';
import type { HttpError } from '@/common/exceptions/http-error.exception';

import { booksApiService, notificationService } from '../services';

type State = {
  dataStatus: DataStatus;
};

const defaultState: State = {
  dataStatus: DataStatus.IDLE,
};

export const useUploadBookStore = defineStore('upload-book', {
  state: () => defaultState,
  actions: {
    async createOne(payload: FormData) {
      try {
        this.dataStatus = DataStatus.PENDING;
        await booksApiService.create(payload);
        this.dataStatus = DataStatus.FULFILLED;
        notificationService.success('Book uploaded successfully');
      } catch (error) {
        this.dataStatus = DataStatus.REJECTED;
        notificationService.error((error as HttpError).message);
      } finally {
        this.dataStatus = DataStatus.IDLE;
      }
    },
  },
});
