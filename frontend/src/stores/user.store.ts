import { defineStore } from 'pinia';

import type { LoadUserResponseDto } from '@/common/dto';
import { DataStatus, StorageKey } from '@/common/enums';
import type { HttpError } from '@/common/exceptions';

import { notificationService, storageService, userApiService } from '../services';

type State = {
  user: Omit<LoadUserResponseDto, 'id'> & { id: string | null };
  dataStatus: DataStatus;
};

const defaultState: State = {
  user: {
    id: null,
    email: '',
    username: '',
    createdAt: '',
    updatedAt: '',
    avatarUrl: undefined
  },
  dataStatus: DataStatus.IDLE,
};

export const useUserStore = defineStore('user', {
  state: () => defaultState,
  actions: {
    async loadMe() {
      try {
        this.dataStatus = DataStatus.PENDING;

        const user = await userApiService.loadMe();

        this.dataStatus = DataStatus.FULFILLED;

        this.user = user;
      } catch (error) {
        this.dataStatus = DataStatus.REJECTED;
        storageService.drop(StorageKey.TOKEN);
        notificationService.error((error as HttpError).message);
      }
    },

    async updateMe(payload: FormData) {
      try {
        this.dataStatus = DataStatus.PENDING;
        await userApiService.updateAvatar(payload);
        this.dataStatus = DataStatus.FULFILLED;
        notificationService.success('Profile updated successfully');
      } catch (error) {
        this.dataStatus = DataStatus.REJECTED;
        notificationService.error((error as HttpError).message);
      }
    },

    async deleteMe() {
      try {
        await userApiService.deleteMe();
      } catch (error) {
        this.dataStatus = DataStatus.REJECTED;
        notificationService.error((error as HttpError).message);
      }
    }
  },
});
