import { defineStore } from 'pinia';

import type { LoginUserRequestDto, RegisterUserRequestDto } from '@/common/dto';
import { DataStatus } from '@/common/enums';
import { StorageKey } from '@/common/enums/storage-key.enum';
import type { HttpError } from '@/common/exceptions/http-error.exception';

import { authApiService, notificationService , storageService } from '../services';

type State = {
  dataStatus: DataStatus;
};

const defaultState: State = {
  dataStatus: DataStatus.IDLE,
};

export const useAuthStore = defineStore('auth', {
  state: () => defaultState,
  actions: {
    async register(payload: RegisterUserRequestDto) {
      try {
        this.dataStatus = DataStatus.PENDING;
        const { accessToken } = await authApiService.register(payload);

        this.dataStatus = DataStatus.FULFILLED;

        storageService.set(StorageKey.TOKEN, accessToken);
      } catch (error) {
        this.dataStatus = DataStatus.REJECTED;
        notificationService.error((error as HttpError).message);
      }
    },
    async login(payload: LoginUserRequestDto) {
      try {
        this.dataStatus = DataStatus.PENDING;
        const { accessToken } = await authApiService.login(payload);

        this.dataStatus = DataStatus.FULFILLED;

        storageService.set(StorageKey.TOKEN, accessToken);
      } catch (error) {
        this.dataStatus = DataStatus.REJECTED;
        notificationService.error((error as HttpError).message);
      }
    },
  },
});
