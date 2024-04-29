import { LoadUserResponse } from '@/common/dto';
import { defineStore } from 'pinia';
import { notificationService, storageService, userApiService } from '../services';
import { DataStatus, StorageKey } from '@/common/enums';
import { HttpError } from '@/common/exceptions';

type State = {
  user: Omit<LoadUserResponse, 'id'> & { id: string | null };
  dataStatus: DataStatus;
};

const defaultState: State = {
  user: {
    id: null,
    email: '',
    username: '',
    createdAt: '',
    updatedAt: '',
  },
  dataStatus: DataStatus.IDLE,
};

export const useUserStore = defineStore('user', {
  state: () => defaultState,
  actions: {
    async load() {
      try {
        this.dataStatus = DataStatus.PENDING;

        const user = await userApiService.load();

        this.dataStatus = DataStatus.FULFILLED;

        this.user = user;
      } catch (error) {
        this.dataStatus = DataStatus.REJECTED;
        storageService.drop(StorageKey.TOKEN);
        notificationService.error((error as HttpError).message);
      }
    },
  },
});
