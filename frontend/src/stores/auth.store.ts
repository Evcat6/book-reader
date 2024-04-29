import { LoginUserReqDto, RegisterUserReqDto } from '@/common/dto';
import { defineStore } from 'pinia';
import { authApiService, notificationService } from '../services';
import { storageService } from '../services';
import { StorageKey } from '@/common/enums/storage-key.enum';
import { DataStatus } from '@/common/enums';
import { HttpError } from '@/common/exceptions/http-error.exception';

type State = {
  dataStatus: DataStatus;
};

const defaultState: State = {
  dataStatus: DataStatus.IDLE,
};

export const useAuthStore = defineStore('auth', {
  state: () => defaultState,
  actions: {
    async register(payload: RegisterUserReqDto) {
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
    async login(payload: LoginUserReqDto) {
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
